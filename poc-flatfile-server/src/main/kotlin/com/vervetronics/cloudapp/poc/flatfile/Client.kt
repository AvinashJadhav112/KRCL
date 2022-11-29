package com.vervetronics.cloudapp.poc.flatfile

import com.nelkinda.java.io.write
import java.net.Socket

const val SENSOR_DATA_RECORD_LENGTH = 10

@ExperimentalUnsignedTypes
class Client(
    internal val factoryDeviceId: UByteArray,
    private val socket: Socket,
) : AutoCloseable {
    constructor(factoryDeviceId: UByteArray, host: String, port: Int) : this(factoryDeviceId, Socket(host, port))

    init {
        socket.outputStream.write(factoryDeviceId)
        socket.outputStream.flush()
    }

    private val outputStream = socket.outputStream
    internal val sensorData = UByteArray(SENSOR_DATA_RECORD_LENGTH)

    override fun close() {
        socket.close()
    }

    fun sendSensorData() {
        outputStream.write(sensorData.asByteArray())
    }

    fun sendSensorRecords(count: Int) {
        repeat(count) {
            sendSensorData()
        }
    }
}
