package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.io.write
import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.event.fireEvent
import com.nelkinda.kotlin.toInt
import com.vervetronics.cloudapp.protocol.MessageType.CONFIG_REQUEST
import com.vervetronics.cloudapp.protocol.MessageType.FIRMWARE_DOWNLOAD_REQUEST
import com.vervetronics.cloudapp.protocol.MessageType.FIRMWARE_DOWNLOAD_RESPONSE
import com.vervetronics.cloudapp.protocol.MessageType.HANDSHAKE_REQUEST
import com.vervetronics.cloudapp.protocol.MessageType.HANDSHAKE_RESPONSE
import com.vervetronics.cloudapp.protocol.MessageType.MONITOR_DATA
import com.vervetronics.cloudapp.protocol.MessageType.MONITOR_DATA_RESPONSE
import com.vervetronics.cloudapp.protocol.MessageType.NON_RECOVERABLE_ERROR
import com.vervetronics.cloudapp.protocol.MessageType.RECOVERABLE_ERROR
import com.vervetronics.cloudapp.protocol.error.FutureDateOrTime
import com.vervetronics.cloudapp.protocol.error.HandshakeMissing
import com.vervetronics.cloudapp.protocol.error.InconsistentSensorValueLength
import com.vervetronics.cloudapp.protocol.error.NonRecoverableProtocolError
import com.vervetronics.cloudapp.protocol.error.RecoverableProtocolError
import com.vervetronics.cloudapp.protocol.error.ZeroSensorValueLength
import com.vervetronics.cloudapp.protocol.event.DeviceEvent
import com.vervetronics.cloudapp.protocol.event.DeviceListener
import com.vervetronics.cloudapp.protocol.event.DownloadStatusEvent
import com.vervetronics.cloudapp.protocol.event.DownloadStatusListener
import com.vervetronics.cloudapp.protocol.event.MessageEvent
import com.vervetronics.cloudapp.protocol.event.MessageListener
import com.vervetronics.cloudapp.protocol.event.SensorReadingEvent
import com.vervetronics.cloudapp.protocol.event.SensorReadingListener
import com.vervetronics.cloudapp.protocol.handlers.UnsupportedMessageTypeHandler
import com.vervetronics.cloudapp.storage.SensorReading
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import java.io.EOFException
import java.io.File
import java.io.FilterOutputStream
import java.io.OutputStream
import java.io.RandomAccessFile
import java.lang.Integer.min
import java.net.Socket
import java.net.SocketException
import java.net.URI
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.Instant.now
import java.time.LocalDate
import java.time.ZoneOffset.UTC

@SuppressWarnings("MaxLineLength", "LongParameterList", "MagicNumber", "TooManyFunctions", "kotlin:S1135") // ToDo Remove Magic Number warning
@ExperimentalUnsignedTypes
class CloudAppHandler(
    private val messageListeners: MutableList<MessageListener>,
    private val sensorReadingListeners: MutableList<SensorReadingListener>,
    private val deviceListeners: MutableList<DeviceListener>,
    private val downloadStatusListener: MutableList<DownloadStatusListener>,
    private val socket: Socket,
    private val clock: Clock,
    private val timeTolerance: Duration,
    private val sensorReadingRepository: SensorReadingRepository,
    private val firmwareProvider: FirmwareProvider,
) {
    @Suppress("MoveSuspiciousCallableReferenceIntoParentheses")
    private val handlers = mapOf(
        HANDSHAKE_REQUEST.messageType to HandshakeRequestHandler(),
        MONITOR_DATA.messageType to MonitorDataHandler(),
        CONFIG_REQUEST.messageType to ConfigRequestHandler(),
        FIRMWARE_DOWNLOAD_REQUEST.messageType to FirmwareDownloadRequestHandler(),
    ).withDefault { UnsupportedMessageTypeHandler() }

    inner class HandshakeRequestHandler : ProtocolMessageHandler {
        override fun handle(message: Message): UByteArray {
            deviceFirmwareVersion = hexToAscii(message[Tag.FIRMWARE_VERSION][0].toString())
            factoryDeviceId = message[Tag.FACTORY_DEVICE_IDENTIFIER][0]
            serverFirmwareVersion = firmwareProvider.getFirmwareVersion(factoryDeviceId)
            if (deviceFirmwareVersion == serverFirmwareVersion) {
                fireDownloadStatusReceived("Completed", "$factoryDeviceId")
            }
            val serialNumber = message[Tag.FACTORY_DEVICE_IDENTIFIER][0]
            fireDeviceEventReceived(deviceFirmwareVersion, "$serialNumber")
            return buildHandshakeResponse(message)
        }

        private fun buildHandshakeResponse(message: Message): UByteArray {
            factoryDeviceId = message[Tag.FACTORY_DEVICE_IDENTIFIER][0]
            handshakeReceived = true
            builder.deviceId = 0x0001u
            Thread.currentThread().name += " $factoryDeviceId ${now(clock)}"
            return builder.withMessageType(HANDSHAKE_RESPONSE).withTag(Tag.FACTORY_DEVICE_IDENTIFIER, factoryDeviceId)
                .withTag(Tag.CURRENT_TIME_BINARY, clock.millis()).withTag(Tag.CURRENT_TIME_BCD, clock.instant().toBcd())
                .build()
        }
    }

    inner class MonitorDataHandler : ProtocolMessageHandler {
        override fun handle(message: Message): UByteArray {
            var date = LocalDate.now(clock)
            message.parse { tag, data ->
                when (tag) {
                    Tag.SENSOR_READING.tag -> handleMonitorDataSensorReadings(date, data)
                    Tag.CONTEXT_DATE.tag -> {
                        date = requireNotInFuture(data.data.parseBcdDate())
                    }
                    // TODO If we get any other tag, raise an error.
                }
            }
            return builder.withMessageType(MONITOR_DATA_RESPONSE).build()
        }

        private fun handleMonitorDataSensorReadings(date: LocalDate, data: Data) {
            TlvParser { sensorId, sensorBinary ->
                handleSingleSensorData(date, sensorId, sensorBinary)
            }.parse(data)
        }

        private fun handleSingleSensorData(
            date: LocalDate,
            sensorId: UByte,
            sensorBinary: Data,
        ) {
            val time = sensorBinary.data.sliceArray(0 until UInt.SIZE_BYTES).parseBcdTime()
            val timestamp = requireNotInFuture(date.atTime(time).toInstant(UTC))
            val sensorReading = SensorReading(
                factoryDeviceId,
                sensorId.toUShort(),
                timestamp,
                Data(sensorBinary.data.sliceArray(UInt.SIZE_BYTES until sensorBinary.data.size)),
            )
            if (sensorReading.value.data.isEmpty()) throw ZeroSensorValueLength(sensorId.toUShort())
            try {
                sensorReadingRepository.save(sensorReading)
            } catch (e: com.vervetronics.cloudapp.storage.InconsistentSensorValueLength) {
                throw InconsistentSensorValueLength(e.sensorId).apply { initCause(e) }
            }
            fireSensorReadingReceived(sensorReading)
        }
    }

    inner class ConfigRequestHandler : ProtocolMessageHandler {
        override fun handle(message: Message): UByteArray = buildConfigRequest(message)
    }

    inner class FirmwareDownloadRequestHandler : ProtocolMessageHandler {
        override fun handle(message: Message): UByteArray {
            val offset = message[Tag.FIRMWARE_OFFSET_POINTER]
            val activeBankRegion = message[Tag.FIRMWARE_ACTIVE_REGION][0].toString()
            val decimalOffset = toInt(offset[0].data)
            firmwareToBeUpdate = serverFirmwareVersion!!.toByteArray().toUByteArray()
            fireDownloadStatusReceived("Started", "$factoryDeviceId")
            val firmwareUrl = if (activeBankRegion == "AA") {
                URI("$serverFirmwareVersion/bank2.bin")
            } else {
                URI("$serverFirmwareVersion/bank1.bin")
            }
            val result = readBinary("firmwares/$firmwareUrl", decimalOffset, tempLengthToBeUpdatedLater)
            fireDownloadStatusReceived("Started", "$factoryDeviceId")
            return if (result.second > 0) {
                builder.withTag(Tag.FIRMWARE_FRAME_TYPE, (0xAA).toByte())
                    .withMessageType(FIRMWARE_DOWNLOAD_RESPONSE).withTag(Tag.FIRMWARE_BINARY_DATA, result.first)
                    .build()
            } else {
                builder.withTag(Tag.FIRMWARE_FRAME_TYPE, (0x55).toByte())
                    .withMessageType(FIRMWARE_DOWNLOAD_RESPONSE).withTag(Tag.FIRMWARE_BINARY_DATA, result.first)
                    .withTag(Tag.FIRMWARE_VERSION, firmwareToBeUpdate)
                    .build()
            }
        }
    }

    private val out = BinaryLogOutputStream(socket.outputStream)

    private val parser = MessageParser(socket.inputStream)

    private val builder = MessageBuilder(0x0000u)
    private lateinit var factoryDeviceId: Data
    private lateinit var deviceFirmwareVersion: String
    private var serverFirmwareVersion: String? = null
    private var handshakeReceived = false
    private var firmwareToBeUpdate: UByteArray = UByteArray(0x0001)
    private val isTimeSensitive = false

    private lateinit var tempIdForReadingFirmwareFilesToBeRemoved: Data

    @SuppressWarnings("MagicNumber") // To be removed
    private val tempLengthToBeUpdatedLater = 200

    inner class BinaryLogOutputStream(out: OutputStream) : FilterOutputStream(out) {
        override fun write(b: ByteArray, off: Int, len: Int) {
            out.write(b, off, len)
            System.err.format(
                "%s ⇒ %s %s%n",
                now(clock),
                socket.inetAddress,
                b.joinToString("", limit = len) { "%02X".format(it) }
            )
        }
    }

    @SuppressWarnings("SwallowedException")
    fun handle() {
        socket.use {
            try {
                handlerLoop()
            } catch (e: SocketException) {
                if (e.message == "Connection reset") log("Client ${socket.remoteSocketAddress} closed connection")
                else throw e
            } catch (e: EOFException) {
                log("Client ${socket.remoteSocketAddress} closed connection.")
            } catch (e: NonRecoverableProtocolError) {
                log("Caught non-recoverable protocol error from ${socket.remoteSocketAddress}: ${e.error}")
                e.printStackTrace()
                val response =
                    builder.withMessageType(NON_RECOVERABLE_ERROR).withTag(Tag.ERROR, e.error.toUByteArray()).build()
                out.write(response)
                out.flush()
            }
        }
    }

    @Suppress("kotlin:S1135", "MaxLineLength")
    private fun handlerLoop() {
        while (true) {
            // TODO Verify that the deviceId is that from the handshake.

            val (message, checksum) = parser.readNextMessage()
            log("Received message $message")
            fireMessageReceived(message)
            message.verify(checksum)
            if (!handshakeReceived && message.messageType != HANDSHAKE_REQUEST.messageType) throw HandshakeMissing()
            val response = try {
                handlers.getValue(message.messageType).handle(message)
            } catch (e: RecoverableProtocolError) {
                builder.withMessageType(RECOVERABLE_ERROR).withTag(Tag.ERROR, e.message!!.toByteArray().asUByteArray())
                    .build()
            }
            out.write(response)
            out.flush()

            if (message.messageType == HANDSHAKE_REQUEST.messageType && needsFirmwareUpdate()) {
                message.messageType = CONFIG_REQUEST.toUShort()
                val configResponse = buildConfigRequest(message)
                out.write(configResponse)
                out.flush()
            }
        }
    }

    private fun needsFirmwareUpdate() = serverFirmwareVersion != null && deviceFirmwareVersion != serverFirmwareVersion

    private fun requireNotInFuture(newDate: LocalDate): LocalDate {
        if (isTimeSensitive && newDate > LocalDate.now(clock)) throw FutureDateOrTime(newDate)
        return newDate
    }

    private fun requireNotInFuture(timestamp: Instant): Instant {
        if (isTimeSensitive && timestamp.minus(timeTolerance) > clock.instant()) throw FutureDateOrTime(timestamp)
        return timestamp
    }

    private fun buildConfigRequest(message: Message): UByteArray {
        factoryDeviceId = message[Tag.FACTORY_DEVICE_IDENTIFIER][0]
        fireDownloadStatusReceived("Starting", "$factoryDeviceId")
        tempIdForReadingFirmwareFilesToBeRemoved = factoryDeviceId
        return builder.withMessageType(CONFIG_REQUEST).withTag(Tag.FACTORY_DEVICE_IDENTIFIER, factoryDeviceId)
            .withTag(Tag.CONFIG_REQUEST_FIRMWARE_DOWNLOAD, 0x55)
            .build()
    }

    private fun fireMessageReceived(msg: Message) {
        messageListeners.fireEvent(MessageEvent(this, msg), MessageListener::messageReceived)
    }

    private fun fireSensorReadingReceived(s: SensorReading) {
        sensorReadingListeners.fireEvent(SensorReadingEvent(this, s), SensorReadingListener::sensorReadingReceived)
    }

    @SuppressWarnings("UnusedPrivateMember") // To be removed
    @Suppress("kotlin:S1144")
    private fun fireDeviceEventReceived(firmwareVersion: String, serialNumber: String) {
        deviceListeners.fireEvent(
            DeviceEvent(this, firmwareVersion, serialNumber), DeviceListener::updateFirmwareVersionOfDevice
        )
    }

    @Suppress("MaxLineLength")
    private fun fireDownloadStatusReceived(downloadStatus: String, serialNumber: String) {
        downloadStatusListener.fireEvent(
            DownloadStatusEvent(this, downloadStatus, serialNumber), DownloadStatusListener::updateDownloadStatusOfFirmware
        )
    }

    private fun readBinary(url: String, offset: Int, length: Int): Pair<UByteArray, Int> =
        RandomAccessFile(File(url), "r").use {
            it.seek(offset.toLong())
            val lengthToRead = min(length, it.length().toInt() - offset)
            val data = UByteArray(lengthToRead)
            it.readFully(data.asByteArray())
            val remainingForNextRead = it.length().toInt() - offset - lengthToRead
            return Pair(data, remainingForNextRead)
        }

    private fun hexToAscii(hexStr: String): String {
        val output = StringBuilder("")
        var i = 0
        while (i < hexStr.length) {
            val str = hexStr.substring(i, i + 2)
            output.append(str.toInt(16).toChar())
            i += 2
        }
        return output.toString()
    }
}
