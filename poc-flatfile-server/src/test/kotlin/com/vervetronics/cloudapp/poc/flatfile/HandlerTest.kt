package com.vervetronics.cloudapp.poc.flatfile

import com.nelkinda.java.io.ByteArrayInputStream
import com.nelkinda.kotlin.byteArrayOf
import com.nelkinda.kotlin.nextUBytes
import com.nelkinda.kotlin.toHexString
import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertArrayEquals
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.mockito.kotlin.mock
import java.io.InputStream
import java.net.Socket
import java.nio.file.Files
import java.nio.file.Path
import kotlin.random.Random.Default.nextBytes

@ExperimentalUnsignedTypes
class HandlerTest {
    private val factoryDeviceIdBin = nextUBytes(LENGTH_OF_FACTORY_DEVICE_ID)
    private val factoryDeviceIdStr = factoryDeviceIdBin.toHexString()

    @AfterEach
    fun cleanupTestData() {
        Path.of("data", factoryDeviceIdStr).toFile().deleteRecursively()
    }

    @Test
    fun createHandlerWithSocket() {
        val socket = mock<Socket>()
        `when`(socket.getInputStream()).thenReturn(mock())
        Handler(socket).use {}
    }

    @Test
    fun createHandlerWithStreams() {
        val inputStream = mock<InputStream>()
        Handler(inputStream).use {}
    }

    @Test
    fun readFactoryDeviceId() {
        val inputStream = ByteArrayInputStream(factoryDeviceIdBin)
        Handler(inputStream).use {
            assertArrayEquals(factoryDeviceIdBin, it.readFactoryDeviceId())
        }
    }

    @Test
    fun runHandler() {
        val sensor1 = nextBytes(10).toHexString()
        val sensor2 = nextBytes(10).toHexString()
        Handler(ByteArrayInputStream(ubyteArrayOf("$factoryDeviceIdStr$sensor1$sensor2"))).run()
        val data = Files.readAllBytes(Path.of("data", factoryDeviceIdStr, "sensors.bin"))
        assertArrayEquals(byteArrayOf("$sensor1$sensor2"), data)
    }

    @Test
    fun handlerAppends() {
        val sensor1 = nextBytes(10).toHexString()
        Handler(ByteArrayInputStream(ubyteArrayOf("$factoryDeviceIdStr$sensor1"))).run()

        val sensor2 = nextBytes(10).toHexString()
        Handler(ByteArrayInputStream(ubyteArrayOf("$factoryDeviceIdStr$sensor2"))).run()
        val data = Files.readAllBytes(Path.of("data", factoryDeviceIdStr, "sensors.bin"))
        assertArrayEquals(byteArrayOf("$sensor1$sensor2"), data)
    }
}
