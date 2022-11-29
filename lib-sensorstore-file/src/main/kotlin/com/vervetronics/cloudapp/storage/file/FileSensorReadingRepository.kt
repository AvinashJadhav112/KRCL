package com.vervetronics.cloudapp.storage.file

import com.nelkinda.java.io.write
import com.vervetronics.cloudapp.storage.InconsistentSensorValueLength
import com.vervetronics.cloudapp.storage.SensorReading
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import org.springframework.beans.factory.annotation.Value
import java.io.BufferedOutputStream
import java.io.DataOutputStream
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.StandardOpenOption
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneOffset.UTC
import java.time.temporal.ChronoField
import kotlin.streams.toList

// Do not implement the interface Repository because SensorReading are records but not entities (they have no ID).
@ExperimentalUnsignedTypes
// @Repository
class FileSensorReadingRepository(
    @Value("\${application.storage.path:data}")
    private val base: Path,
) : SensorReadingRepository {
    init {
        System.err.println(
            """Initialized FileSensorReadingRepository with path: $base (absolute: ${base.toAbsolutePath()})"""
        )
    }

    @Throws(InconsistentSensorValueLength::class)
    override fun save(sensorReading: SensorReading) {
        with(sensorReading) {
            val date = LocalDate.ofInstant(timestamp, UTC)
            val time = LocalTime.ofInstant(timestamp, UTC)

            @SuppressWarnings("ImplicitDefaultLocale") // False positive: https://github.com/detekt/detekt/issues/3821
            val rawPath = base.resolve(
                Path.of(
                    factoryDeviceId.toString(),
                    String.format("%04X", sensorId.toInt()),
                    date.toString(),
                    RAW_FILENAME
                )
            )
            handleSize()
            if (Files.notExists(rawPath.parent)) {
                Files.createDirectories(rawPath.parent)
            }
            DataOutputStream(
                BufferedOutputStream(
                    Files.newOutputStream(
                        rawPath,
                        StandardOpenOption.CREATE,
                        StandardOpenOption.APPEND
                    )
                )
            ).use {
                it.writeLong(ChronoField.NANO_OF_DAY.getFrom(time))
                it.write(value.data)
                it.flush()
            }
        }
    }

    private fun SensorReading.handleSize() {
        val size = value.data.size

        @SuppressWarnings("ImplicitDefaultLocale") // False positive: https://github.com/detekt/detekt/issues/3821
        val metaPath = base.resolve(
            Path.of(
                factoryDeviceId.toString(),
                String.format("%04X", sensorId.toInt()),
                META_FILENAME
            )
        )
        if (Files.notExists(metaPath)) {
            Files.createDirectories(metaPath.parent)
            Files.write(metaPath, listOf(size.toString()))
        } else {
            val readString = Files.readString(metaPath).trim()
            val expectedSensorDataLength = Integer.parseInt(readString)
            if (expectedSensorDataLength != size)
                throw InconsistentSensorValueLength(sensorId)
        }
    }

    override fun findAllDevices(): List<String> =
        Files.list(base).use { stream ->
            stream.map { it.fileName.toString() }
                .toList()
                .sorted()
        }

    override fun findAllSensors(factoryDeviceId: String): List<String> =
        Files.list(base.resolve(factoryDeviceId)).use { stream ->
            stream.map { it.fileName.toString() }
                .toList()
                .sorted()
        }

    override fun findAllDays(factoryDeviceId: String, sensor: String): List<String> =
        Files.list(base.resolve(factoryDeviceId).resolve(sensor)).use { stream ->
            stream.map { it.fileName.toString() }
                .filter { it != META_FILENAME }
                .toList()
                .sorted()
        }

    override fun findAllSensorReadings(factoryDeviceId: String, sensor: String, date: String): List<SensorReading> =
        SensorFileInputStream(base, factoryDeviceId, sensor, date).use {
            return it.readAll()
        }

    private fun findLatestSensorReading(factoryDeviceId: String, sensor: String, date: String): SensorReading =
        SensorFileInputStream(base, factoryDeviceId, sensor, date).use {
            return it.readLast()
        }

    override fun getLatestSensorReadings(factoryDeviceId: String) =
        findAllSensors(factoryDeviceId).map { sensorId ->
            findLatestSensorReading(factoryDeviceId, sensorId, findAllDays(factoryDeviceId, sensorId).last())
        }

    override fun getSensorReadingInBetweenDays(
        factoryDeviceId: String,
        sensor: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<SensorReading> {
        val start = startDate.minusDays(1)
        val end = endDate.plusDays(1)
        val result = mutableListOf<SensorReading>()
        findAllDays(factoryDeviceId, sensor)
            .filter {
                val date = LocalDate.parse(it)
                date.isAfter(start.toLocalDate()) && date.isBefore(end.toLocalDate())
            }
            .forEach {
                val currentDateData = findAllSensorReadings(factoryDeviceId, sensor, it)
                val filterData = currentDateData.filter {
                    it.timestamp.isAfter(startDate.toInstant(UTC)) && it.timestamp.isBefore(endDate.toInstant(UTC))
                }.sortedBy { it.timestamp }
                result.addAll(filterData)
            }
        return result
    }

    companion object {
        const val HEX_BASE = 16
        const val META_FILENAME = "meta.dat"
        const val RAW_FILENAME = "raw.dat"
    }
}
