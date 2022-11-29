package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.ubyteArrayOf
import com.vervetronics.cloudapp.protocol.MessageType.HANDSHAKE_REQUEST
import com.vervetronics.cloudapp.protocol.MessageType.MONITOR_DATA
import java.io.OutputStream

@ExperimentalUnsignedTypes
class CloudAppClient constructor(
    outputStream: OutputStream,
    private val factoryDeviceId: UByteArray,
) : CloudAppPeer(outputStream) {
    @SuppressWarnings("MagicNumber")
    fun sendHandshakeRequest() {
        messageBuilder
            .withMessageType(HANDSHAKE_REQUEST)
            .withTag(Tag.GSM_SIGNAL_STRENGTH, ubyteArrayOf("80"))
            .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, factoryDeviceId)
        send()
    }

    fun sendSensorData(sensorData: Data = Data("")) {
        messageBuilder
            .withMessageType(MONITOR_DATA)
            .withTag(Tag.SENSOR_READING, sensorData)
        send()
    }
}
