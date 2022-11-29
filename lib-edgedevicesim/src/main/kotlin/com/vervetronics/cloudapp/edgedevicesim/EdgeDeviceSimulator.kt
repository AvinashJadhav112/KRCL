package com.vervetronics.cloudapp.edgedevicesim

import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.ubyteArrayOf
import com.vervetronics.cloudapp.protocol.CloudAppClient
import java.net.InetAddress
import java.net.Socket

@ExperimentalUnsignedTypes
private val DEFAULT_FACTORY_DEVICE_ID = ubyteArrayOf("55AA55AA55AA55AA55AA55AA55AA0000")

@ExperimentalUnsignedTypes
class EdgeDeviceSimulator {
    private lateinit var socket: Socket
    private lateinit var cloudAppClient: CloudAppClient

    fun connect(inetAddress: InetAddress, port: Int) = connect(Socket(inetAddress, port))

    private fun connect(socket: Socket) {
        this.socket = socket
        cloudAppClient = CloudAppClient(socket.outputStream, DEFAULT_FACTORY_DEVICE_ID)
        cloudAppClient.sendHandshakeRequest()
    }

    fun sendSensorReading(data: Data) {
        cloudAppClient.sendSensorData(data)
    }
}
