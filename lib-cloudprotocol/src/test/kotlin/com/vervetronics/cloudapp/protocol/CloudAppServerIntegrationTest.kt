package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.io.readAllUBytes
import com.nelkinda.java.io.write
import com.nelkinda.kotlin.toHexString
import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertHexEquals
import com.vervetronics.cloudapp.storage.file.FileSensorReadingRepository
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.springframework.util.FileSystemUtils
import java.net.InetAddress
import java.net.Socket
import java.nio.file.Files
import java.nio.file.Path
import java.time.Clock
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

@ExperimentalUnsignedTypes
class CloudAppServerIntegrationTest {
    private val tmpDir = Files.createTempDirectory(javaClass.name)
    private val storage = FileSensorReadingRepository(base = tmpDir)
    private val clock = Clock.fixed(Instant.parse("2021-02-18T00:04:30.21Z"), ZoneOffset.UTC)
    private val server = CloudAppServer(
        clock = clock,
        sensorReadingRepository = storage,
        firmwareProvider = mock()
    ).apply { start() }
    private val factoryDeviceId = TestFactoryDeviceIdentifiers.id1
    private val socket = Socket(InetAddress.getLocalHost(), server.port)
    private val outputStream = socket.outputStream
    private val inputStream = socket.inputStream
    private val messageBuilder = MessageBuilder()
    private val messageParser = MessageParser(inputStream)

    @AfterEach
    internal fun removeTmpDir() {
        FileSystemUtils.deleteRecursively(tmpDir)
    }

    @AfterEach
    fun closeConnectionAndStopServer() {
        socket.close()
        server.stop()
    }

    @Test
    fun repliesToSensorData() {
        messageBuilder
            .withMessageType(MessageType.HANDSHAKE_REQUEST)
            .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, factoryDeviceId)
            .withTag(Tag.GSM_SIGNAL_STRENGTH, 0x80)
            .withTag(Tag.FIRMWARE_VERSION, (0x0000).toByte())
            .send()

        val (handshakeResponse, handshakeResponseChecksum) = messageParser.readNextMessage()
        handshakeResponse.verify(handshakeResponseChecksum)
        messageBuilder.deviceId = handshakeResponse.deviceId

        messageBuilder
            .withMessageType(MessageType.MONITOR_DATA)
            .withTag(Tag.SENSOR_READING, ubyteArrayOf("010500043021CA"))
            .send()

        val (message, messageChecksum) = messageParser.readNextMessage()
        message.verify(messageChecksum)

        val expectedFile = getPathToRawData(factoryDeviceId, "0001", LocalDate.now(clock).toString())
        Files.newInputStream(expectedFile).use {
            val expected = ubyteArrayOf("0000003EE9C56480CA")
            val actual = it.readAllUBytes()
            assertHexEquals(expected, actual)
        }
    }

    @Test
    fun processesDateForSensorData() {
        messageBuilder
            .withMessageType(MessageType.HANDSHAKE_REQUEST)
            .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, factoryDeviceId)
            .withTag(Tag.GSM_SIGNAL_STRENGTH, 0x80)
            .withTag(Tag.FIRMWARE_VERSION, 0x05)
            .send()

        val (handshakeResponse, handshakeResponseChecksum) = messageParser.readNextMessage()
        handshakeResponse.verify(handshakeResponseChecksum)
        messageBuilder.deviceId = handshakeResponse.deviceId

        messageBuilder
            .withMessageType(MessageType.MONITOR_DATA)
            .withTag(Tag.CONTEXT_DATE, ubyteArrayOf("20210101"))
            .withTag(Tag.SENSOR_READING, ubyteArrayOf("010500043021CA"))
            .withTag(Tag.CONTEXT_DATE, ubyteArrayOf("20210102"))
            .withTag(Tag.SENSOR_READING, ubyteArrayOf("010500043021CB"))
            .send()

        val (message, messageChecksum) = messageParser.readNextMessage()
        message.verify(messageChecksum)

        val expectedFile1 = getPathToRawData(factoryDeviceId, "0001", "2021-01-01")
        Files.newInputStream(expectedFile1).use {
            val expected = ubyteArrayOf("0000003EE9C56480CA")
            val actual = it.readAllUBytes()
            assertHexEquals(expected, actual)
        }

        val expectedFile2 = getPathToRawData(factoryDeviceId, "0001", "2021-01-02")
        Files.newInputStream(expectedFile2).use {
            val expected = ubyteArrayOf("0000003EE9C56480CB")
            val actual = it.readAllUBytes()
            assertHexEquals(expected, actual)
        }
    }

    private fun getPathToRawData(factoryDeviceId: UByteArray, sensor: String, date: String): Path {
        return tmpDir.resolve(
            Path.of(factoryDeviceId.toHexString(), sensor, LocalDate.parse(date).toString(), "raw.dat")
        )
    }

    private fun MessageBuilder.send() {
        sendWithoutChecksum(build())
    }

    private fun sendWithoutChecksum(message: UByteArray) {
        outputStream.write(message)
        outputStream.flush()
    }
}
