package com.vervetronics.cloudapp.dashboard

import com.nelkinda.rel.ExpressionCompiler
import com.nelkinda.rel.InvalidDataException
import com.nelkinda.rel.UnsupportedDataTypeException
import com.nelkinda.rel.getConverter
import com.vervetronics.cloudapp.error.DateParseException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.iot.device.IotDeviceRepository
import com.vervetronics.cloudapp.iot.model.sensor.Sensor
import com.vervetronics.cloudapp.storage.SensorReading
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.lang.String.format
import java.nio.BufferUnderflowException
import java.nio.file.NoSuchFileException
import java.time.Instant
import java.time.LocalDateTime
import java.time.format.DateTimeParseException
import java.util.UUID

@ExperimentalUnsignedTypes
@Service
class DashboardService(
    @Autowired private val iotDeviceRepository: IotDeviceRepository,
    @Autowired private val sensorReadingRepository: SensorReadingRepository,
    @Autowired private val expressionCompiler: ExpressionCompiler,
    @Autowired private val deviceIotService: DeviceIotService
) {
    fun getAllDevices(): List<DeviceListEntry> {
        return iotDeviceRepository.findAll().map {
            DeviceListEntry(it.id, it.serialNumber, it.deviceName)
        }
    }

    fun getSensorEntriesBetweenDays(
        deviceId: UUID,
        sensorId: String,
        start: LocalDateTime,
        end: LocalDateTime
    ): List<Calculated> {
        val iotDevice = iotDeviceRepository.getById(deviceId)
        val calculated = mutableListOf<Calculated>()
        try {
            sensorReadingRepository.getSensorReadingInBetweenDays(iotDevice.serialNumber, sensorId, start, end)
            iotDeviceRepository.getById(deviceId)
            iotDevice.iotModel!!
            val list =
                sensorReadingRepository.getSensorReadingInBetweenDays(iotDevice.serialNumber, sensorId, start, end)
            list.forEach {
                calculated.add(
                    Calculated(
                        it.factoryDeviceId,
                        it.timestamp,
                        it.value.toString(),
                        it.sensorId.toString()
                    )
                )
            }
            return calculated
        } catch (e: DateTimeParseException) {
            throw DateParseException("Invalid input date", e)
        } catch (e: NoSuchFileException) {
            throw NotFoundException("Sensor id id Invalid", e)
        }
    }

    fun getSensorReadingBetweenDays(
        deviceId: UUID,
        sensorId: String,
        start: LocalDateTime,
        end: LocalDateTime
    ): List<SensorReading> {
        val factoryDeviceId = iotDeviceRepository.getById(deviceId).serialNumber
        try {
            return sensorReadingRepository.getSensorReadingInBetweenDays(factoryDeviceId, sensorId, start, end)
        } catch (e: DateTimeParseException) {
            throw DateParseException("invalid input date", e)
        } catch (e: NoSuchFileException) {
            throw NotFoundException("invalid sensor id", e)
        }
    }

    fun getCalculatedSensorReadingBetween(
        deviceId: UUID,
        sensorId: String,
        start: LocalDateTime,
        end: LocalDateTime
    ): List<Calculated> {
        val iotDevice = iotDeviceRepository.getById(deviceId)
        val factoryDeviceId = iotDevice.serialNumber
        val iotModel = iotDevice.iotModel!!
        val iotModelSensor = iotModel.sensors.filter { sensor -> sensor.sensorId == sensorId }
        val calculated = mutableListOf<Calculated>()
        try {
            val sensorReadings = sensorReadingRepository.getSensorReadingInBetweenDays(
                factoryDeviceId,
                sensorId,
                start,
                end
            )
            iotModelSensor.map { sensor ->
                sensorReadings.map { sensorReading ->
                    val processedValue = calculateValue(sensor, sensorReading)
                    calculated.add(
                        Calculated(
                            sensorReading.factoryDeviceId,
                            sensorReading.timestamp,
                            processedValue,
                            sensorReading.sensorId.toString()
                        )
                    )
                }
            }
            return calculated
        } catch (e: DateTimeParseException) {
            throw DateParseException("invalid input date", e)
        } catch (e: NoSuchFileException) {
            throw NotFoundException("invalid sensor id", e)
        }
    }

    fun getLatestSensorReadings(id: UUID, showSensorsMissingInModel: Boolean? = false): LatestSensorReadings {
        val iotDevice = iotDeviceRepository.getById(id)
        val iotModel = iotDevice.iotModel!!
        val latestReadings = sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber)
        val sensorIds = sortedSetOf<String>()
        iotModel.sensors.forEach { sensorIds.add(it.sensorId) }
        if (showSensorsMissingInModel == true) {
            latestReadings.forEach { sensorIds.add(getSensorIdFromUShort(it.sensorId)) }
        }
        val iotSensorMap = iotModel.sensors.associateBy { it.sensorId }
        val sensorReadingMap = latestReadings.associateBy { getSensorIdFromUShort(it.sensorId) }

        val sensorEntries = sensorIds.map { sensorId ->
            val iotModelSensor = iotSensorMap[sensorId]
            val reading = sensorReadingMap[sensorId]
            SensorEntry(
                "R$sensorId",
                iotModelSensor?.name ?: "unknown",
                reading?.timestamp ?: Instant.MIN,
                reading?.value?.toString() ?: "unknown",
                "raw",
                false,
                iotModelSensor?.dashboardOrder ?: "unknown",
                "unknown",
                "unknown"
            )
        } + sensorIds.map { sensorId ->
            val iotModelSensor = iotSensorMap[sensorId]
            val reading = sensorReadingMap[sensorId]
            val processedValue = calculateValue(iotModelSensor, reading)
            SensorEntry(
                "C$sensorId",
                iotModelSensor?.name ?: "unknown",
                reading?.timestamp ?: Instant.MIN,
                processedValue,
                iotModelSensor?.unit ?: "unknown",
                false,
                iotModelSensor?.dashboardOrder ?: "unknown",
                iotModelSensor?.min ?: "unknown",
                iotModelSensor?.max ?: "unknown"
            )
        }
        return LatestSensorReadings(iotDevice.id, iotDevice.serialNumber, iotDevice.deviceName, sensorEntries)
    }

    fun getLatestCalculatedSensorReadings(id: UUID, showSensorsMissingInModel: Boolean? = false): LatestSensorReadings {
        val iotDevice = iotDeviceRepository.getById(id)
        val iotModel = iotDevice.iotModel!!
        val latestReadings = sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber)

        val sensorIds = sortedSetOf<String>()
        iotModel.sensors.forEach { sensorIds.add(it.sensorId) }
        if (showSensorsMissingInModel == true) {
            latestReadings.forEach { sensorIds.add(getSensorIdFromUShort(it.sensorId)) }
        }

        val iotSensorMap = iotModel.sensors.associateBy { it.sensorId }
        val sensorReadingMap = latestReadings.associateBy { getSensorIdFromUShort(it.sensorId) }

        val sensorEntries = sensorIds.map { sensorId ->
            val iotModelSensor = iotSensorMap[sensorId]
            val reading = sensorReadingMap[sensorId]
            val processedValue = calculateValue(iotModelSensor, reading)

            SensorEntry(
                "C$sensorId",
                iotModelSensor?.name ?: "unknown",
                reading?.timestamp ?: Instant.MIN,
                processedValue,
                iotModelSensor?.unit ?: "unknown",
                false,
                iotModelSensor?.dashboardOrder ?: "unknown",
                iotModelSensor?.min ?: "unknown",
                iotModelSensor?.max ?: "unknown"
            )
        }

        return LatestSensorReadings(iotDevice.id, iotDevice.serialNumber, iotDevice.deviceName, sensorEntries)
    }

    fun getLocationSensorsLatestValue(deviceId: UUID): LatestLocation {
        val device = deviceIotService.getIotDeviceById(deviceId).deviceName
        try {
            val latest = this.getLatestCalculatedSensorReadings(deviceId, showSensorsMissingInModel = false)
            val latitude = latest.latestSensorData.filter { it.name == "Latitude" }
            val longitude = latest.latestSensorData.filter { it.name == "Longitude" }
            return LatestLocation(device, latitude, longitude)
        } catch (e: NotFoundException) {
            throw NotFoundException("$device is not Found", e)
        }
    }

    private fun getSensorIdFromUShort(sensorId: UShort) = format("%04X", sensorId.toShort())
    private fun calculateValue(iotModelSensor: Sensor?, reading: SensorReading?): String =
        when {
            reading?.value == null -> "no reading"
            iotModelSensor == null -> "unspecified sensor"
            else -> try {
                val converter = getConverter(iotModelSensor.rawDataType)
                val convertedValue = converter.invoke(reading.value)
                val formula = iotModelSensor.compiledFormula
                val calculatedValue = formula.apply(convertedValue)
                calculatedValue.toString()
            } catch (e: UnsupportedDataTypeException) {
                e.message!!
            } catch (e: BufferUnderflowException) {
                throw BufferUnderflow(e, reading, iotModelSensor)
            } catch (e: InvalidDataException) {
                e.message!!
            }
        }

    private val Sensor.compiledFormula
        get() =
            expressionCompiler.compile<Any, Any>(formula, rawDataType, processedDataType)
}

@ExperimentalUnsignedTypes
class BufferUnderflow constructor(
    cause: Throwable,
    reading: SensorReading,
    iotModelSensor: Sensor
) : RuntimeException(
    """Buffer underflow while converting value
    device: ${reading.factoryDeviceId}
    sensor: ${reading.sensorId} / ${iotModelSensor.id}
    data: ${reading.value} (${reading.value.data.size} bytes length)
    raw data type: ${iotModelSensor.rawDataType}
    """.trimIndent(),
    cause
)
