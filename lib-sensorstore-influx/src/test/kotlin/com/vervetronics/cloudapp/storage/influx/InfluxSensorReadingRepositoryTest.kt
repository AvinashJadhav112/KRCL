package com.vervetronics.cloudapp.storage.influx

import com.vervetronics.cloudapp.storage.SensorReading
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.Random

@Disabled("Not ready for prod yet")
@SuppressWarnings("ImplicitDefaultLocale") // False positive on String.format("%016x")
@ExperimentalUnsignedTypes
class InfluxSensorReadingRepositoryTest {
    private val repo = InfluxSensorReadingRepository(
        url = "http://localhost:8086/",
        token = "7p7SGfKrH8uwAUUZWevKDPGnk4k6_4Aco6UzpLy4Vm3UEVQgknWD2eJvlA5QDwuHBwI9m6U6x48rsLRbwTuIwg==",
        bucket = "bucket",
    )

    @Test
    fun test() {
        repo.save(
            SensorReading(
                "0102030405060708090A0B0C0D0E0F10",
                1.toUShort(),
                Instant.now(),
                String.format("%08x", Random().nextInt()),
            )
        )
        repo.save(
            SensorReading(
                "0102030405060708090A0B0C0D0E0F10",
                2.toUShort(),
                Instant.now(),
                String.format("%08x", Random().nextInt()),
            )
        )
        repo.save(
            SensorReading(
                "0102030405060708090A0B0C0D0E0F10",
                3.toUShort(),
                Instant.now(),
                String.format("%08x", Random().nextInt()),
            )
        )
    }

    @Test
    fun test2() {
        println(repo.findAllDevices())
    }

    @Test
    fun test3() {
        println(repo.findAllSensors("0102030405060708090A0B0C0D0E0F10"))
    }

    @Test
    fun test4() {
        println(repo.findAllDays("0102030405060708090A0B0C0D0E0F10", "0001"))
    }

    @Test
    fun test5() {
        println(repo.findAllSensorReadings("0102030405060708090A0B0C0D0E0F10", "0001", LocalDate.now().toString()))
    }

    @Test
    fun test6() {
        println(repo.getLatestSensorReadings("0102030405060708090A0B0C0D0E0F10"))
    }

    @Test
    fun test7() {
        println(
            repo.getSensorReadingInBetweenDays(
                "0102030405060708090A0B0C0D0E0F10",
                "0001",
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now()
            )
        )
    }
}
