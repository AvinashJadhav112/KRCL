package com.vervetronics.cloudapp.poc.flatfile

import com.nelkinda.java.io.readNUBytes
import com.nelkinda.kotlin.nextUBytes
import com.nelkinda.org.junit.jupiter.api.assertArrayEquals
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.io.InputStream
import java.net.ServerSocket
import kotlin.random.Random.Default.nextBytes

@ExperimentalUnsignedTypes
class ClientTest {
    private val factoryDeviceIdBin = nextUBytes(LENGTH_OF_FACTORY_DEVICE_ID)
    private val server = ServerSocket(0)
    private val client = Client(factoryDeviceIdBin, "localhost", server.localPort)
    private val socket = server.accept()

    @AfterEach
    fun stop() {
        client.close()
        server.close()
    }

    @Test
    fun clientConnects() {
        assertNotNull(socket)
    }

    @Test
    fun clientSendsFactoryDeviceId() {
        val readFactoryDeviceId = socket.inputStream.readFactoryDeviceId()
        assertArrayEquals(factoryDeviceIdBin, readFactoryDeviceId)
    }

    @Test
    fun clientSendsSensorData() {
        val readFactoryDeviceId = socket.inputStream.readFactoryDeviceId()
        assertArrayEquals(factoryDeviceIdBin, readFactoryDeviceId)

        nextBytes(client.sensorData.asByteArray())
        val expected = client.sensorData.copyOf()

        client.sendSensorData()

        val actual = socket.inputStream.readNUBytes(SENSOR_DATA_RECORD_LENGTH)
        assertArrayEquals(expected, actual)
    }

    @Test
    fun clientSendsMultipleSensorData() {
        val readFactoryDeviceId = socket.inputStream.readFactoryDeviceId()
        assertArrayEquals(factoryDeviceIdBin, readFactoryDeviceId)

        client.sendSensorRecords(2)

        socket.inputStream.readNUBytes(SENSOR_DATA_RECORD_LENGTH * 2)
    }

    @ExperimentalUnsignedTypes
    fun InputStream.readFactoryDeviceId() = readNUBytes(LENGTH_OF_FACTORY_DEVICE_ID)
}
