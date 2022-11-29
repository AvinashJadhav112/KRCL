package com.vervetronics.cloudapp.storage.file

import com.nelkinda.java.io.readNUBytes
import com.vervetronics.cloudapp.storage.SensorReading
import java.io.BufferedInputStream
import java.io.DataInputStream
import java.nio.file.Files
import java.nio.file.Path
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneOffset

@ExperimentalUnsignedTypes
class SensorFileInputStream(
    private val base: Path,
    factoryDeviceId: String,
    sensor: String,
    date: String,
    private val rawPath: Path = resolveSensorDataPath(base, factoryDeviceId, sensor, date),
) : DataInputStream(
    BufferedInputStream(Files.newInputStream(rawPath))
) {
    private val payloadLength = getPayloadLength(factoryDeviceId, sensor)
    private val binaryFactoryDeviceId = com.nelkinda.kotlin.ubyteArrayOf(factoryDeviceId)
    private val sensorId = sensor.toUShort(FileSensorReadingRepository.HEX_BASE)
    private val localDate = LocalDate.parse(date)

    fun readAll(): List<SensorReading> {
        val sensorReadings = mutableListOf<SensorReading>()
        mark(1)
        while (read() != -1) {
            reset()
            sensorReadings.add(
                readOne()
            )
            mark(1)
        }
        return sensorReadings
    }

    fun readLast(): SensorReading {
        val bytesToSkip = Files.size(rawPath) - Long.SIZE_BYTES - payloadLength
        skipNBytes(bytesToSkip)
        return readOne()
    }

    private fun readOne() = SensorReading(
        binaryFactoryDeviceId,
        sensorId,
        localDate.atTime(LocalTime.ofNanoOfDay(readLong())).toInstant(ZoneOffset.UTC),
        readNUBytes(payloadLength),
    )

    private fun getPayloadLength(factoryDeviceId: String, sensor: String) = Files.readString(
        base.resolve(
            Path.of(
                factoryDeviceId,
                sensor,
                FileSensorReadingRepository.META_FILENAME,
            )
        )
    ).trim().toInt()

    companion object {
        private fun resolveSensorDataPath(
            base: Path,
            factoryDeviceId: String,
            sensor: String,
            date: String
        ) = base.resolve(
            Path.of(
                factoryDeviceId,
                sensor,
                date,
                FileSensorReadingRepository.RAW_FILENAME,
            )
        )
    }
}
