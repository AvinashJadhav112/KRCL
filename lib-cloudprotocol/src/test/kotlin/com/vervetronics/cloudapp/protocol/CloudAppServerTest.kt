package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.io.write
import com.nelkinda.kotlin.toHexString
import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertHexEquals
import com.vervetronics.cloudapp.protocol.MessageType.HANDSHAKE_REQUEST
import com.vervetronics.cloudapp.protocol.MessageType.MONITOR_DATA
import com.vervetronics.cloudapp.protocol.MessageType.RECOVERABLE_ERROR
import com.vervetronics.cloudapp.protocol.TestFactoryDeviceIdentifiers.id1
import com.vervetronics.cloudapp.protocol.TestFactoryDeviceIdentifiers.id2
import com.vervetronics.cloudapp.protocol.TestFactoryDeviceIdentifiers.id3
import com.vervetronics.cloudapp.protocol.TestFactoryDeviceIdentifiers.id4
import com.vervetronics.cloudapp.protocol.event.SensorReadingListener
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.timeout
import java.net.InetAddress
import java.net.Socket
import java.net.URI
import java.net.URL
import java.nio.charset.StandardCharsets
import java.time.Clock
import java.time.Duration.ofDays
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime.ofInstant
import java.time.ZoneOffset.UTC

@ExperimentalUnsignedTypes
class CloudAppServerTest {
    private val clock = Clock.fixed(Instant.parse("2021-08-01T13:00:00Z"), UTC)
    private val firmwareProvider = mock<FirmwareProvider>()
    private val server = CloudAppServer(
        clock = clock,
        sensorReadingRepository = mock(),
        firmwareProvider = firmwareProvider
    ).apply { start() }
    private val factoryDeviceId = id1
    private val socket = Socket(InetAddress.getLocalHost(), server.port)
    private val outputStream = socket.outputStream
    private val inputStream = socket.inputStream
    private val messageBuilder = MessageBuilder()
    private val messageParser = MessageParser(inputStream)

    @AfterEach
    fun closeConnectionAndStopServer() {
        socket.close()
        server.stop()
    }

    @Test
    fun returnsRequestedPortWhenStopped() {
        val server = CloudAppServer(
            clock = clock,
            sensorReadingRepository = mock(),
            firmwareProvider = firmwareProvider,
        )
        server.requestedPort = 10
        assertEquals(10, server.port)
    }

    @SuppressWarnings("ImplicitDefaultLocale") // False positive: https://github.com/detekt/detekt/issues/3821
    @Test
    fun repliesToHandshakeRequest() {
        send(
            "AA55AA5500000000000000010019" +
                "05020001" +
                "010180" +
                "0210" + id1.toHexString()
        )
        expect(
            "AA55AA5500000001000100020026" +
                "0210" + id1.toHexString() +
                "0308${String.format("%016X", clock.millis())}" +
                "0808${clock.instant().toBcd().toHexString()}"
        )
    }

    @Disabled
    @SuppressWarnings("ImplicitDefaultLocale") // False positive: https://github.com/detekt/detekt/issues/3821
    @Test
    fun sendConfigureRequestOnDetectingFirmwareUpgrade() {
        handleHandshakeWithOldFirmware(id1)
        val configureResponse = "AA55AA550000000100020003002C"
        expect(
            configureResponse
        )
    }

    @SuppressWarnings("ImplicitDefaultLocale") // False positive: https://github.com/detekt/detekt/issues/3821
    @Test
    fun receivesEmptyFirmwareWhenFirmwareFileIsEmpty() {
        handleHandshakeWithOldFirmware(id1)
        handleConfigureRequestAndIgnoreResponse()
        val firmwareResponse = handleFirmwareUpgrade(0X55, 0x0000)

        assertTrue(firmwareResponse[Tag.FIRMWARE_BINARY_DATA][0].data.isEmpty())
    }

    @SuppressWarnings("ImplicitDefaultLocale") // False positive: https://github.com/detekt/detekt/issues/3821
    @Test
    fun givenFirmwareFileWithSingleByteAndZeroOffsetReturnsSingleByteAsFirmwareAnd55AsFrameType() {
        handleHandshakeWithOldFirmware(id2)
        handleConfigureRequestAndIgnoreResponse()
        val firmwareResponse = handleFirmwareUpgrade(0XAA, 0xE0D2)

        assertHexEquals(ubyteArrayOf("0x0100"), firmwareResponse[Tag.FIRMWARE_BINARY_DATA][0].data)
        assertHexEquals(ubyteArrayOf("0x55"), firmwareResponse[Tag.FIRMWARE_FRAME_TYPE][0].data)
    }

    @SuppressWarnings("ImplicitDefaultLocale") // False positive: https://github.com/detekt/detekt/issues/3821
    @Test
    fun givenFirmwareFileWithSingleByteAndOneOffsetReturnsEmptyFirmwareAnd55AsFrameType() {
        handleHandshakeWithOldFirmware(id2)
        handleConfigureRequestAndIgnoreResponse()
        val firmwareResponse = handleFirmwareUpgrade(0XAA, 0xE0D3)

        assertHexEquals(ubyteArrayOf("0x00"), firmwareResponse[Tag.FIRMWARE_BINARY_DATA][0].data)
        assertHexEquals(ubyteArrayOf("0x55"), firmwareResponse[Tag.FIRMWARE_FRAME_TYPE][0].data)
    }

    @SuppressWarnings("ImplicitDefaultLocale") // False positive: https://github.com/detekt/detekt/issues/3821
    @Test
    fun givenFirmwareFileWithFourBytesAndOneOffsetReturnsThreeBytesAsFirmwareAnd55AsFrameType() {
        handleHandshakeWithOldFirmware(id3)
        handleConfigureRequestAndIgnoreResponse()
        val firmwareResponse = handleFirmwareUpgrade(0XAA, 0xE0D0)

        assertHexEquals(ubyteArrayOf("0x00010100"), firmwareResponse[Tag.FIRMWARE_BINARY_DATA][0].data)
        assertHexEquals(ubyteArrayOf("0x55"), firmwareResponse[Tag.FIRMWARE_FRAME_TYPE][0].data)
    }

    @SuppressWarnings("ImplicitDefaultLocale", "MaxLineLength") // False positive: https://github.com/detekt/detekt/issues/3821
    @Test
    fun givenFirmwareFileWithMoreThan200BytesAndZeroOffsetReturns200BytesAndAAAsFrameTypeFollowedByXXXBytesAnd55AsFrameType() {
        handleHandshakeWithOldFirmware(id4)
        handleConfigureRequestAndIgnoreResponse()
        val firmwareResponse = handleFirmwareUpgrade(0XAA, 0xE030)

        assertHexEquals(
            ubyteArrayOf("0xA0C10208A6C10208ACC10208B4C10208BCC10208C8C102084AC2020856C2020862C202086EC202087CC202088AC2020898C20208ED080208C5080208FFFF0000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000010203040102030406070809006CDC02000000000000000001020304060708090201010601010101010101010101010100010100"),
            firmwareResponse[Tag.FIRMWARE_BINARY_DATA][0].data
        )
        assertHexEquals(ubyteArrayOf("0x55"), firmwareResponse[Tag.FIRMWARE_FRAME_TYPE][0].data)

        val firmwareResponse2 = handleFirmwareUpgrade(0XAA, 0x00C8)

        assertHexEquals(
            ubyteArrayOf("0x2378002B07D1054B002B02D0044800E000BF0123237010BD6801002000000000A8DF0208044B10B5002B03D00349044800E000BF10BDC046000000006C010020A8DF0208002243088B4274D303098B425FD3030A8B4244D3030B8B4228D3030C8B420DD3FF22090212BA030C8B4202D31212090265D0030B8B4219D300E0090AC30B8B4201D3CB03C01A5241830B8B4201D38B03C01A5241430B8B4201D34B03C01A5241030B8B4201D30B03C01A5241C30A8B4201D3CB02C01A5241830A8B4201D38B02C01A5241"),
            firmwareResponse2[Tag.FIRMWARE_BINARY_DATA][0].data
        )
        assertHexEquals(ubyteArrayOf("0xAA"), firmwareResponse2[Tag.FIRMWARE_FRAME_TYPE][0].data)
    }

    private fun handleHandshakeWithOldFirmware(id: UByteArray) {
        val oldFirmwareVersion = 0x0000
        `when`(firmwareProvider.getFirmwareVersion(any())).thenReturn("0001")
        messageBuilder
            .withMessageType(HANDSHAKE_REQUEST)
            .withTag(
                Tag.FACTORY_DEVICE_IDENTIFIER,
                ubyteArrayOf("0210" + id.toHexString())
            )
            .withTag(Tag.GSM_SIGNAL_STRENGTH, (0x80).toByte())
            .withTag(Tag.FIRMWARE_VERSION, oldFirmwareVersion.toByte())
            .send()

        val (handshakeResponse, handshakeResponseChecksum) = messageParser.readNextMessage()
        handshakeResponse.verify(handshakeResponseChecksum)
        messageBuilder.deviceId = handshakeResponse.deviceId
    }

    private fun handleFirmwareUpgrade(activeRegion: Int, offsetPointer: Int): Message {
        messageBuilder
            .withMessageType(MessageType.FIRMWARE_DOWNLOAD_REQUEST)
            .withTag(Tag.FIRMWARE_ACTIVE_REGION, activeRegion.toByte())
            .withTag(Tag.FIRMWARE_OFFSET_POINTER, offsetPointer)
            .send()

        val (firmwareResponse, firmwareResponseChecksum) = messageParser.readNextMessage()
        firmwareResponse.verify(firmwareResponseChecksum)
        messageBuilder.deviceId = firmwareResponse.deviceId
        return firmwareResponse
    }

    @Test
    fun checksumError() {
        sendWithoutChecksum(
            "AA55AA5500000000000000010019" +
                "05020001" +
                "010180" +
                "0210" + id1.toHexString()
        )
        expect(
            "AA55AA550000000000017FFF0012" +
                "7F100001436865636B73756D204572726F72"
        )
    }

    @Test
    fun wrongPreamble() {
        send(
            "AA55AA5400000000000000010019" +
                "05020001" +
                "010180" +
                "0210" + id1.toHexString()
        )
        expect(
            "AA55AA550000000000017FFF0012" +
                "7F10000257726F6E6720507265616D626C65"
        )
    }

    @Disabled
    @Test
    fun wrongMessageType() {
        connect()
        messageBuilder
            .withMessageType(0x0000u)
            .send()
        expect(
            "AA55AA550000000100027FFF001C"
        )
    }

    @Test
    fun missingHandshakeRequest() {
        messageBuilder
            .withMessageType(MONITOR_DATA)
            .send()

        expect(
            "AA55AA550000000000017FFF0015" +
                "7F13000648616E647368616B65204D697373696E67"
        )
    }

    @Test
    fun mandatoryTagMissing() {
        messageBuilder
            .withMessageType(HANDSHAKE_REQUEST)
            .send()

        expect(
            "AA55AA550000000000017FFF0019" +
                "7F1700054D616E6461746F727920546167204D697373696E67"
        )
    }

    @Test
    fun repliesToSensorData() {
        connect()

        messageBuilder
            .withMessageType(MONITOR_DATA)
            .withTag(Tag.SENSOR_READING, ubyteArrayOf("07052210158500"))
            .send()

        val (sensorDataResponse, sensorDataResponseChecksum) = messageParser.readNextMessage()
        sensorDataResponse.verify(sensorDataResponseChecksum)
        // TODO Verification missing
        println(sensorDataResponse)
    }

    @Test
    fun receiveSensorReadingEvent() {
        val sensorReadingListener = mock<SensorReadingListener>()
        server.addSensorReadingListener(sensorReadingListener)
        connect()

        messageBuilder
            .withMessageType(MONITOR_DATA)
            .withTag(Tag.SENSOR_READING, ubyteArrayOf("07052210158500"))
            .send()

        val (sensorDataResponse, sensorDataResponseChecksum) = messageParser.readNextMessage()
        sensorDataResponse.verify(sensorDataResponseChecksum)
        verify(sensorReadingListener, timeout(500).times(1)).sensorReadingReceived(any())
    }

    @Disabled("Currently no time checks upon request by VerveTronics")
    @Test
    fun `when sending sensor data with a future timestamp, then responds with a warning and doesn't store data`() {
        connect()

        // The difference has to be at least 10 milliseconds as that is the smallest resolution that can be transmitted
        // in the current protocol.
        val futureInstant = clock.instant().plus(server.timeTolerance.plusMillis(10))
        messageBuilder
            .withMessageType(MONITOR_DATA)
            .withTag(Tag.SENSOR_READING, ubyteArrayOf("0705${futureInstant.bcdTime()}00"))
            .send()

        val (sensorDataResponse, sensorDataResponseChecksum) = messageParser.readNextMessage()
        sensorDataResponse.verify(sensorDataResponseChecksum)
        sensorDataResponse.assertType(RECOVERABLE_ERROR)
        val futureTimeInCentiSeconds = futureInstant.truncatedTo(SpecialChronoUnit.CENTISECONDS)
        sensorDataResponse.assertTagString(0x7Fu, "Future Date or Time $futureTimeInCentiSeconds")
        println(sensorDataResponse)
    }

    @Disabled("Currently no time checks upon request by VerveTronics")
    @Test
    fun `when sending sensor data with a future context date, then responds with a warning and doesn't store data`() {
        connect()

        val futureInstant = clock.instant().plus(ofDays(1))
        messageBuilder
            .withMessageType(MONITOR_DATA)
            .withTag(Tag.CONTEXT_DATE, futureInstant.bcdDate())
            .send()

        val (sensorDataResponse, sensorDataResponseChecksum) = messageParser.readNextMessage()
        sensorDataResponse.verify(sensorDataResponseChecksum)
        sensorDataResponse.assertType(RECOVERABLE_ERROR)
        sensorDataResponse.assertTagString(0x7Fu, "Future Date or Time ${LocalDate.ofInstant(futureInstant, UTC)}")
        println(sensorDataResponse)
    }

    @Test
    fun `when sending sensor data with zero sensor value bytes, then responds with a warning and doesn't store data`() {
        connect()
        messageBuilder
            .withMessageType(MONITOR_DATA)
            .withTag(Tag.SENSOR_READING, ubyteArrayOf("010400000000"))
            .send()

        val (sensorDataResponse, sensorDataResponseChecksum) = messageParser.readNextMessage()
        sensorDataResponse.verify(sensorDataResponseChecksum)
        sensorDataResponse.assertType(RECOVERABLE_ERROR)
        sensorDataResponse.assertTagString(0x7Fu, "Zero sensor value length for sensor 1")
        println(sensorDataResponse)
    }

    @Test
    fun `bcdTime is 8 characters`() {
        assertEquals(8, clock.instant().bcdTime().length)
    }

    @Test
    fun `bcdDate is 8 bytes`() {
        assertEquals(4, clock.instant().bcdDate().size)
    }

    private fun connect() {
        messageBuilder
            .withMessageType(HANDSHAKE_REQUEST)
            .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, factoryDeviceId)
            .withTag(Tag.FIRMWARE_VERSION, (0x0000).toByte())
            .withTag(Tag.GSM_SIGNAL_STRENGTH, 0x80)
            .send()

        val (handshakeResponse, checksum) = messageParser.readNextMessage()
        handshakeResponse.verify(checksum)
        messageBuilder.deviceId = handshakeResponse.deviceId
    }

    private fun handleConfigureRequestAndIgnoreResponse() {
        val (configureRequest, configureRequestChecksum) = messageParser.readNextMessage()
        configureRequest.verify(configureRequestChecksum)
        messageBuilder.deviceId = configureRequest.deviceId
    }

    private fun Message.assertType(expectedMessageType: MessageType) {
        assertEquals(expectedMessageType.messageType, messageType)
    }

    private fun Message.assertTagString(expectedTag: UByte, expectedString: String) {
        assertEquals(expectedString, String(this[expectedTag][0].data.asByteArray()))
    }

    private fun MessageBuilder.send() = sendWithoutChecksum(build())

    private fun send(message: String) = send(ubyteArrayOf(message))

    private fun send(message: UByteArray) = sendWithoutChecksum(message.withChecksum())

    private fun sendWithoutChecksum(message: String) = sendWithoutChecksum(ubyteArrayOf(message))

    private fun sendWithoutChecksum(message: UByteArray) {
        outputStream.write(message)
        outputStream.flush()
    }

    private fun expect(expectedResponse: String) = expect(ubyteArrayOf(expectedResponse))

    private fun expect(expectedResponse: UByteArray) = expectWithoutChecksum(expectedResponse.withChecksum())

    private fun expectWithoutChecksum(expectedResponse: String) = expectWithoutChecksum(ubyteArrayOf(expectedResponse))

    private fun expectWithoutChecksum(expectedResponse: UByteArray) {
        val actualResponse = UByteArray(expectedResponse.size)
        val bytesRead = inputStream.read(actualResponse.asByteArray())
        assertEquals(expectedResponse.size, bytesRead)
        assertHexEquals(expectedResponse, actualResponse)
    }

    private fun Instant.bcdTime(): String = ofInstant(this, UTC).toBcd().toHexString()
    private fun Instant.bcdDate(): UByteArray = LocalDate.ofInstant(this, UTC).toBcd()

    private fun read(url: String) = read(URI(url))
    private fun read(uri: URI) =
        read(if (uri.isAbsolute) uri.toURL() else javaClass.getResource("CloudAppServerTest/$uri")!!)

    private fun read(url: URL): String = url.openStream().use { String(it.readAllBytes(), StandardCharsets.UTF_8) }
}
