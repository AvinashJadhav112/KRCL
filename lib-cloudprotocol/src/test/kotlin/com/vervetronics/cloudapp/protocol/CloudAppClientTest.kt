package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.io.toUByteArray
import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertHexEquals
import com.vervetronics.cloudapp.protocol.MessageType.HANDSHAKE_REQUEST
import com.vervetronics.cloudapp.protocol.MessageType.MONITOR_DATA
import com.vervetronics.cloudapp.protocol.Tag.FACTORY_DEVICE_IDENTIFIER
import com.vervetronics.cloudapp.protocol.Tag.GSM_SIGNAL_STRENGTH
import org.junit.jupiter.api.Test
import java.io.ByteArrayOutputStream

@ExperimentalUnsignedTypes
class CloudAppClientTest {
    private val interceptedOutput = ByteArrayOutputStream()
    private var cloudAppClient = CloudAppClient(interceptedOutput, TestFactoryDeviceIdentifiers.id1)

    @Test
    fun testHandshake() {
        cloudAppClient.sendHandshakeRequest()
        val expectedInitializeHandshakeRequest = MessageBuilder()
            .withMessageType(HANDSHAKE_REQUEST)
            .withTag(GSM_SIGNAL_STRENGTH, ubyteArrayOf("80"))
            .withTag(FACTORY_DEVICE_IDENTIFIER, TestFactoryDeviceIdentifiers.id1)
            .build()
        val actual = interceptedOutput.toUByteArray()
        assertHexEquals(expectedInitializeHandshakeRequest, actual)
    }

    @Test
    fun handShakeWithDifferentFactoryDeviceId() {
        cloudAppClient = CloudAppClient(
            interceptedOutput,
            TestFactoryDeviceIdentifiers.id2
        )
        cloudAppClient.sendHandshakeRequest()
        val expectedInitializeHandshakeRequestWithDifferentFactoryDeviceId = MessageBuilder()
            .withMessageType(HANDSHAKE_REQUEST)
            .withTag(GSM_SIGNAL_STRENGTH, ubyteArrayOf("80"))
            .withTag(FACTORY_DEVICE_IDENTIFIER, TestFactoryDeviceIdentifiers.id2)
            .build()
        val actual = interceptedOutput.toUByteArray()
        assertHexEquals(expectedInitializeHandshakeRequestWithDifferentFactoryDeviceId, actual)
    }

    @Test
    fun sendEmptySensorData() {
        cloudAppClient.sendSensorData()
        val expectedSensorData = MessageBuilder()
            .withMessageType(MONITOR_DATA)
            .withTag(Tag.SENSOR_READING, Data(""))
            .build()
        val actual = interceptedOutput.toUByteArray()
        assertHexEquals(expectedSensorData, actual)
    }

    @Test
    fun sendSensorData() {
        cloudAppClient.sendSensorData(TlvBuilder().withTag(0x01u, 0x01u).build())
        val expectedSensorData = MessageBuilder()
            .withMessageType(MONITOR_DATA)
            .withTag(Tag.SENSOR_READING, TlvBuilder().withTag(0x01u, 0x01u).build())
            .build()
        val actual = interceptedOutput.toUByteArray()
        assertHexEquals(expectedSensorData, actual)
    }
}
