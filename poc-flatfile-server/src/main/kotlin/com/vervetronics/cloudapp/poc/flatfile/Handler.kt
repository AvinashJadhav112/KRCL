package com.vervetronics.cloudapp.poc.flatfile

import com.nelkinda.java.io.readFully
import com.nelkinda.java.io.write
import com.nelkinda.kotlin.toHexString
import java.io.DataInputStream
import java.io.EOFException
import java.io.InputStream
import java.net.Socket
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardOpenOption.APPEND
import java.nio.file.StandardOpenOption.CREATE

const val LENGTH_OF_FACTORY_DEVICE_ID = 16
const val LENGTH_OF_SENSOR_DATA = 10

@ExperimentalUnsignedTypes
class Handler private constructor(
    private val socket: Socket?,
    private val inputStream: DataInputStream,
) : AutoCloseable {
    constructor(socket: Socket) :
        this(socket, DataInputStream(socket.inputStream))

    constructor(inputStream: InputStream) :
        this(
            null,
            if (inputStream is DataInputStream) inputStream else DataInputStream(inputStream),
        )

    override fun close() {
        inputStream.close()
        socket?.close()
    }

    fun readFactoryDeviceId(): UByteArray {
        val factoryDeviceId = UByteArray(LENGTH_OF_FACTORY_DEVICE_ID)
        inputStream.readFully(factoryDeviceId.asByteArray())
        return factoryDeviceId
    }

    fun run() {
        val factoryDeviceId = readFactoryDeviceId()
        val filename = factoryDeviceId.toHexString()
        val filePath = Path.of("data", filename, "sensors.bin")
        Files.createDirectories(filePath.parent)
        Files.newOutputStream(filePath, CREATE, APPEND).use {
            val sensorData = UByteArray(LENGTH_OF_SENSOR_DATA)
            try {
                while (true) {
                    inputStream.readFully(sensorData)
                    it.write(sensorData)
                    it.flush()
                }
            } catch (ignore: EOFException) {
                /* ignore */
            }
        }
    }
}
