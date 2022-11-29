package com.vervetronics.cloudapp.storage.file

import com.nelkinda.java.io.readAllUBytes
import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertHexEquals
import com.vervetronics.cloudapp.storage.InconsistentSensorValueLength
import com.vervetronics.cloudapp.storage.SensorReading
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.util.FileSystemUtils
import java.nio.file.Files.createTempDirectory
import java.nio.file.Files.newInputStream
import java.nio.file.NoSuchFileException
import java.nio.file.Path
import java.time.Clock.fixed
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset.UTC

@ExperimentalUnsignedTypes
class FileSensorReadingRepositoryTest {
    private val tmpDir = createTempDirectory(javaClass.name)
    private val storage = FileSensorReadingRepository(base = tmpDir)

    @AfterEach
    internal fun removeTmpDir() {
        FileSystemUtils.deleteRecursively(tmpDir)
    }

    @Test
    fun storeSingleRecord() {
        storage.save(aSensorReading)
        pathOfASensor.assertFileContents("00002FEE4A94FD0001020304")
    }

    @Test
    fun twoSensorReadingsOfDifferentSensors() {
        val sensorReading2 = aSensorReading.copy(sensorId = 0x0002u, value = Data("CAFEBABE"))
        storage.save(aSensorReading)
        storage.save(sensorReading2)
        pathOfASensor.assertFileContents("00002FEE4A94FD0001020304")
        Path.of("0102030405060708090A0B0C0D0E0F10", "0002", "2020-12-12", "raw.dat")
            .assertFileContents("00002FEE4A94FD00CAFEBABE")
    }

    @Test
    fun twoSensorReadingsOfTheSameSensor() {
        val sensorReading2 = aSensorReading.copy(value = Data("CAFEBABE"))
        storage.save(aSensorReading)
        storage.save(sensorReading2)
        pathOfASensor.assertFileContents("00002FEE4A94FD000102030400002FEE4A94FD00CAFEBABE")
    }

    @Test
    fun findAllDevicesTest_afterStoringSensorData() {
        storage.save(aSensorReading)
        val expected = listOf("0102030405060708090A0B0C0D0E0F10")
        val actual = storage.findAllDevices()
        assertEquals(expected, actual)
    }

    @Test
    fun findAllSensors() {
        storage.save(aSensorReading)
        val expected = listOf("0001")
        val actual = storage.findAllSensors("0102030405060708090A0B0C0D0E0F10")
        assertEquals(expected, actual)
    }

    @Test
    fun findAllDays() {
        storage.save(aSensorReading)
        val expected = listOf("2020-12-12")
        val actual = storage.findAllDays("0102030405060708090A0B0C0D0E0F10", "0001")
        assertEquals(expected, actual)
    }

    @Test
    fun readAllReadingsSingle() {
        storage.save(aSensorReading)
        val expected = listOf(aSensorReading)
        val actual = storage.findAllSensorReadings("0102030405060708090A0B0C0D0E0F10", "0001", "2020-12-12")
        assertEquals(expected, actual)
    }

    @Test
    fun readAllReadingsMultiple() {
        val sensorReading2 = aSensorReading.copy(timestamp = aSensorReading.timestamp.plus(Duration.ofMinutes(1)))
        storage.save(aSensorReading)
        storage.save(sensorReading2)
        val expected = listOf(aSensorReading, sensorReading2)
        val actual = storage.findAllSensorReadings("0102030405060708090A0B0C0D0E0F10", "0001", "2020-12-12")
        assertEquals(expected, actual)
    }

    @Test
    fun storeSensorReadingsOfTwoDates() {
        val sensorReading2 = aSensorReading.copy(
            timestamp = aSensorReading.timestamp.plus(Duration.ofDays(1)),
            value = Data("89ABCDEF"),
        )
        storage.save(aSensorReading)
        storage.save(sensorReading2)
        pathOfASensor.assertFileContents("00002FEE4A94FD0001020304")
        Path.of("0102030405060708090A0B0C0D0E0F10", "0001", "2020-12-13", "raw.dat")
            .assertFileContents("00002FEE4A94FD0089ABCDEF")
    }

    @Test
    fun appendsSensorReadings() {
        val sensorReading2 = aSensorReading.copy(
            timestamp = aSensorReading.timestamp.plus(Duration.ofSeconds(1)),
            value = Data("89ABCDEF"),
        )
        storage.save(aSensorReading)
        storage.save(sensorReading2)
        pathOfASensor
            .assertFileContents("00002FEE4A94FD000102030400002FEE862FC70089ABCDEF")
    }

    @Test
    fun inconsistentSensorReadingLength() {
        val sensorReading2 = aSensorReading.copy(value = Data("01"))
        storage.save(aSensorReading)
        val exception = assertThrows<InconsistentSensorValueLength> {
            storage.save(sensorReading2)
        }
        assertEquals(1.toUShort(), exception.sensorId)
    }

    @Test
    fun getLatestSensorDataNoData() {
        val factoryDeviceId = "0102030405060708090A0B0C0D0E0F10"
        assertThrows<NoSuchFileException> {
            storage.getLatestSensorReadings(factoryDeviceId)
        }
    }

    @Test
    fun getLatestSensorData() {
        val factoryDeviceId = "0102030405060708090A0B0C0D0E0F10"
        val timestamp = clock.instant()
        val sensor1reading1 = SensorReading(factoryDeviceId, 0x0001u, timestamp.plusMillis(0), "0101")
        val sensor1reading2 = SensorReading(factoryDeviceId, 0x0001u, timestamp.plusMillis(1), "0202")
        val sensor1reading3 = SensorReading(factoryDeviceId, 0x0001u, timestamp.plusMillis(2), "0303")
        val sensor2reading1 = SensorReading(factoryDeviceId, 0x0002u, timestamp.plusMillis(0), "01010101")
        val sensor2reading2 = SensorReading(factoryDeviceId, 0x0002u, timestamp.plusMillis(1), "02020202")
        val allReadings = listOf(sensor1reading1, sensor1reading2, sensor1reading3, sensor2reading1, sensor2reading2)
        for (sensorReading in allReadings) {
            storage.save(sensorReading)
        }

        val latestSensorReadings = storage.getLatestSensorReadings(factoryDeviceId)
        assertEquals(listOf(sensor1reading3, sensor2reading2), latestSensorReadings)
    }

    private fun Path.assertFileContents(expectedHex: String) {
        assertFileContents(ubyteArrayOf(expectedHex))
    }

    private fun Path.assertFileContents(expected: UByteArray) {
        newInputStream(tmpDir.resolve(this)).use {
            val actual = it.readAllUBytes()
            assertHexEquals(expected, actual)
        }
    }

    companion object {
        private val clock = fixed(Instant.parse("2020-12-12T14:38:20.50Z"), UTC)

        private val aSensorReading = SensorReading(
            "0102030405060708090A0B0C0D0E0F10",
            0x0001u,
            clock.instant(),
            "01020304",
        )
        private val pathOfASensor = Path.of("0102030405060708090A0B0C0D0E0F10", "0001", "2020-12-12", "raw.dat")
    }
}
