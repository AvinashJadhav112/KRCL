@file:Suppress("TooManyFunctions")

package com.vervetronics.cloudapp.alert

import com.nelkinda.kotlin.Data
import com.nelkinda.rel.ExpressionCompiler
import com.nelkinda.rel.UnsupportedDataTypeException
import com.nelkinda.rel.convert
import com.vervetronics.cloudapp.error.DuplicateEntityException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.iot.model.sensor.Sensor
import com.vervetronics.cloudapp.protocol.event.SensorReadingEvent
import com.vervetronics.cloudapp.protocol.event.SensorReadingListener
import com.vervetronics.cloudapp.storage.SensorReadingService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit
import java.util.UUID

@ExperimentalUnsignedTypes
@Service
@Suppress("NestedBlockDepth")
class AlertService(
    @Autowired val expressionCompiler: ExpressionCompiler,
    @Autowired val alertRepository: AlertRepository,
    @Autowired val deviceIotService: DeviceIotService,
    @Autowired val sensorReadingService: SensorReadingService
) : SensorReadingListener {

    private val logger = LoggerFactory.getLogger(javaClass)

    val supportedDataTypes = listOf("Short", "UShort", "Int", "UInt", "Long", "ULong", "Float", "Double")

    override fun sensorReadingReceived(e: SensorReadingEvent) {
        try {
            val sensorId = getSensorIdFromUShort(e.sensorReading.sensorId)
            val factoryDeviceId = e.sensorReading.factoryDeviceId.toString()
            val sensor = deviceIotService.mustFindSensorBySerialNumberAndSensorId(factoryDeviceId, sensorId)
            val endTime = e.sensorReading.timestamp.plus(sensor.alertTime.toLong(), ChronoUnit.SECONDS)
            val startTime = e.sensorReading.timestamp.minus(sensor.alertTime.toLong(), ChronoUnit.SECONDS)
            val historyAlert = getAlertsBySensorIdAndInBetween(sensor.id, startTime, endTime)
            if (sensor.processedDataType !in supportedDataTypes) return
            val calculatedValue = sensor.calculateValue(e.sensorReading.value)
            if (!sensor.isWithinBounds(calculatedValue) && historyAlert.isEmpty()) {
                var alertToBeStored = true
                val startTimeSensorReading = LocalDateTime.ofInstant(startTime, ZoneOffset.UTC)
                val endTimeSensorReading = LocalDateTime.ofInstant(endTime, ZoneOffset.UTC)
                val sensorReadings = sensorReadingService.getSensorReadingInBetween(
                    factoryDeviceId,
                    sensorId,
                    startTimeSensorReading,
                    endTimeSensorReading
                )
                for (sensorReading in sensorReadings) {
                    val calculatedReading = sensor.calculateValue(sensorReading.value)
                    if (sensor.isWithinBounds(calculatedReading)) {
                        alertToBeStored = false
                        break
                    }
                }
                saveAndLogAlert(sensor, factoryDeviceId, e.sensorReading.timestamp, calculatedValue, alertToBeStored)
            }
        } catch (e: NotFoundException) {
            logger.error(e.message)
        } catch (e: UnsupportedDataTypeException) {
            logger.error("cannot process data", e.message)
        }
    }

    private fun getSensorIdFromUShort(sensorId: UShort) = java.lang.String.format("%04X", sensorId.toShort())

    private fun Sensor.calculateValue(reading: Data): String {
        val convertedValue = convert(this.rawDataType, reading)
        val calculatedValue = this.compiledFormula.apply(convertedValue)
        return calculatedValue.toString()
    }

    fun getAllAlertsInBetween(start: Instant?, end: Instant?) =
        alertRepository.findAlertsByTimestampBetween(start ?: Instant.EPOCH, end ?: Instant.now())

    fun getAlertByAlertId(id: UUID) = alertRepository.getById(id)

    fun getAlertsBySensorIdAndInBetween(sensorId: UUID, start: Instant?, end: Instant?) =
        alertRepository.findAlertsBySensorIdAndTimestampBetween(
            sensorId,
            start ?: Instant.EPOCH,
            end
                ?: Instant.now()
        )
            ?: throw NotFoundException("sensor id: $sensorId not found")

    @SuppressWarnings("MagicNumber")
    fun getAlertsByDeviceIdAndTimestampBetween(
        deviceId: UUID,
        start: Instant?,
        end: Instant?
    ) = alertRepository.findAlertsByDeviceIdAndTimestampBetween(
        deviceId,
        start ?: Instant.EPOCH,
        end ?: Instant.now().plus(5, ChronoUnit.HOURS).plus(30, ChronoUnit.MINUTES)
    ) ?: throw NotFoundException("device id: $deviceId not found")

    fun update(id: UUID, updatedAlert: Alert): Alert {
        val actualAlert = alertRepository.getById(id)
        actualAlert.alertDescription = updatedAlert.alertDescription
        actualAlert.employeeName = updatedAlert.employeeName
        actualAlert.alertStatus = updatedAlert.alertStatus
        return alertRepository.save(actualAlert)
    }

    fun save(alert: Alert): Alert {
        try {
            return alertRepository.save(alert)
        } catch (e: DataIntegrityViolationException) {
            throw DuplicateEntityException("${alert.id} already exist", e)
        }
    }

    fun saveAndLogAlert(
        sensor: Sensor,
        factoryDeviceId: String,
        timestamp: Instant,
        calculatedValue: String,
        alertToBeStored: Boolean
    ) {
        if (alertToBeStored) {
            val device = deviceIotService.findDeviceBySerialNumber(factoryDeviceId)
            val alert = Alert(
                sensor.id,
                sensor.name,
                device.id,
                timestamp,
                calculatedValue,
                sensor.alertCriticality
            )
            alertRepository.save(alert)
            with(logger) {
                info(
                    "Generated alert Alert(calculated value = $calculatedValue, min = ${sensor.min}," +
                        "  max = ${sensor.max}, sensorId = ${sensor.id}, deviceId = ${device.id}), " +
                        "timestamp = $timestamp"
                )
            }
        }
    }

    fun deleteAlertsByDeviceId(deviceId: UUID) {
        val alerts = alertRepository.findAlertByDeviceId(deviceId)
            ?: throw NotFoundException("$deviceId not found")
        alertRepository.deleteAll(alerts)
    }

    private val Sensor.compiledFormula
        get() = expressionCompiler.compile<Any, Any>(formula, rawDataType, processedDataType)
}

@ExperimentalUnsignedTypes
fun AlertService.deleteAlertsBySensorId(sensorId: UUID) {
    val alerts = alertRepository.findAlertBySensorId(sensorId)
        ?: throw NotFoundException("$sensorId not found")
    alertRepository.deleteAll(alerts)
}

@ExperimentalUnsignedTypes
fun AlertService.alertCount() = alertRepository.count()

@ExperimentalUnsignedTypes
fun AlertService.getAllAlerts(page: Pageable): Page<Alert> {
    return alertRepository.findAll(page)
}

@ExperimentalUnsignedTypes
fun AlertService.getUnresolvedAlertsByDeviceId(deviceId: UUID): HashMap<String, String> {
    val unresolvedAlerts: HashMap<String, String> = hashMapOf()
    unresolvedAlerts["DeviceName"] = deviceIotService.getIotDeviceById(deviceId).deviceName
    val alerts = this.getAlertsByDeviceIdAndTimestampBetween(deviceId, null, null)
    unresolvedAlerts["High"] =
        alerts.filter { it.alertStatus == "Unresolved" && it.alertCriticality == "High" }.count().toString()
    unresolvedAlerts["Medium"] =
        alerts.filter { it.alertStatus == "Unresolved" && it.alertCriticality == "Medium" }.count().toString()
    unresolvedAlerts["Low"] =
        alerts.filter { it.alertStatus == "Unresolved" && it.alertCriticality == "Low" }.count().toString()
    return unresolvedAlerts
}
