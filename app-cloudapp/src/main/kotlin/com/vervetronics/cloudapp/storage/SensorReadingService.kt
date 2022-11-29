package com.vervetronics.cloudapp.storage

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.io.BufferedWriter
import java.io.OutputStream
import java.time.LocalDateTime

@ExperimentalUnsignedTypes
@Service
class SensorReadingService(
    @Autowired val sensorReadingRepository: SensorReadingRepository,
) {
    fun getAllDevices(): List<String> =
        sensorReadingRepository.findAllDevices()
    fun getAllSensors(factoryDeviceId: String) =
        sensorReadingRepository.findAllSensors(factoryDeviceId)
    fun getDays(factoryDeviceId: String, sensorId: String) =
        sensorReadingRepository.findAllDays(factoryDeviceId, sensorId)

    fun SensorReading.createView(): SensorReadingView =
        SensorReadingView(
            factoryDeviceId,
            sensorId,
            timestamp,
            value,
        )
    @Suppress("MaxLineLength")
    fun getSensorReadingInBetween(factoryDeviceId: String, sensorId: String, startTime: LocalDateTime, endTime: LocalDateTime): List<SensorReading> {
        return sensorReadingRepository.getSensorReadingInBetweenDays(factoryDeviceId, sensorId, startTime, endTime)
    }

    fun export(out: OutputStream) = sensorReadingRepository.export(out.bufferedWriter())

    @Suppress("NestedBlockDepth", "LongMethod")
    private fun SensorReadingRepository.export(out: BufferedWriter) {
        out.appendLine(SensorReadingController.csvHeader)
        findAllDevices().forEach { factoryDeviceId ->
            findAllSensors(factoryDeviceId).forEach { sensorId ->
                findAllDays(factoryDeviceId, sensorId).forEach { date ->
                    findAllSensorReadings(factoryDeviceId, sensorId, date).forEach { sensorReading ->
                        listOf(
                            sensorReading.factoryDeviceId.toString(),
                            sensorReading.sensorId.toString(),
                            sensorReading.timestamp.toString(),
                            sensorReading.value.toString(),
                        )
                            .joinToString(",")
                            .also { out.appendLine(it) }
                    }
                }
            }
        }
        out.flush()
    }
}
