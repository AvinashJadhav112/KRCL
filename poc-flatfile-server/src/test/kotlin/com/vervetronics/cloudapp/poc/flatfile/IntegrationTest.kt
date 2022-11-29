package com.vervetronics.cloudapp.poc.flatfile

import com.nelkinda.kotlin.nextUBytes
import com.nelkinda.kotlin.toHexString
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import java.lang.Thread.sleep
import java.nio.file.Files
import java.nio.file.Path
import java.time.Duration
import java.time.Instant
import kotlin.concurrent.thread

@ExperimentalUnsignedTypes
class IntegrationTest {
    @Test
    fun integrationTest() {
        val server = Server()
        val port = server.port
        val client = Client(nextUBytes(LENGTH_OF_FACTORY_DEVICE_ID), "localhost", port)
        client.sendSensorRecords(2)
        sleep(500)
        val data = Files.readAllBytes(Path.of("data", client.factoryDeviceId.toHexString(), "sensors.bin"))
        assertEquals(SENSOR_DATA_RECORD_LENGTH * 2, data.size)
    }

    @Disabled("We don't run this except if explicitly requested")
    @Test
    fun fullIntegrationTest() {
        val start = Instant.now()
        val server = Server()
        val port = server.port
        val threads = mutableSetOf<Thread>()
        repeat(1000) {
            threads.add(
                thread {
                    val client = Client(nextUBytes(LENGTH_OF_FACTORY_DEVICE_ID), "localhost", port)
                    client.sendSensorRecords(1000)
                }
            )
        }
        threads.forEach { it.join() }
        val end = Instant.now()
        val duration = Duration.between(start, end)
        println(duration)
    }
}
