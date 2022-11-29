package com.vervetronics.cloudapp.iot.model.sensor

import com.nelkinda.rel.ExpressionCompiler
import com.vervetronics.cloudapp.error.CompileFormulaException
import com.vervetronics.cloudapp.error.DuplicateEntityException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.iot.model.IotModelService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.UUID

@ExperimentalUnsignedTypes
@Service
class SensorService(
    @Autowired private val sensorRepository: SensorRepository,
    @Autowired private val iotModelService: IotModelService,
    @Autowired private val expressionCompiler: ExpressionCompiler,
) {
    fun save(iotModelId: UUID, sensor: Sensor): Sensor {
        val iotModel = iotModelService.getIotModelById(iotModelId)
        val existingSensor = iotModel.sensors.find {
            it.name == sensor.name
        }
        if (existingSensor != null) throw DuplicateEntityException("${existingSensor.id} ${sensor.name} already exist")

        sensor.iotModel = iotModel
        try {
            compileFormula(sensor)
        } catch (e: ClassNotFoundException) {
            throw CompileFormulaException("invalid data type for formula", e)
        }
        return sensorRepository.save(sensor)
    }

    fun getSensorByIotModelIdAndSensorId(iotModelId: UUID, sensorId: UUID): Sensor? {
        return sensorRepository.findSensorByIdAndIotModelId(sensorId, iotModelId)
            ?: throw NotFoundException("$sensorId not found")
    }

    fun deleteSensorByIotModelIdAndSensorId(iotModelId: UUID, sensorId: UUID) {
        sensorRepository.findSensorByIdAndIotModelId(sensorId, iotModelId)
            ?: throw NotFoundException("$sensorId with $iotModelId not found")
        val iotModel = iotModelService.getIotModelById(iotModelId)
        iotModel.sensors = iotModel
            .sensors
            .toMutableList()
            .filter { it.id != sensorId }
        sensorRepository.deleteById(sensorId)
    }

    @ExperimentalUnsignedTypes
    fun update(iotModelId: UUID, sensorId: UUID, sensor: Sensor): Sensor {
        val actualSensor = sensorRepository.findSensorByIdAndIotModelId(sensorId, iotModelId)
            ?: throw NotFoundException("$sensorId not found")

        actualSensor.apply {
            alertCriticality = sensor.alertCriticality
            dashboardOrder = sensor.dashboardOrder
            name = sensor.name
            min = sensor.min
            max = sensor.max
            alertTime = sensor.alertTime
            formula = sensor.formula
            rawDataType = sensor.rawDataType
            processedDataType = sensor.processedDataType
            unit = sensor.unit
            this.sensorId = sensor.sensorId
        }
        try {
            compileFormula(sensor)
        } catch (e: ClassNotFoundException) {
            throw CompileFormulaException("invalid data type for formula", e)
        }
        return sensorRepository.save(actualSensor)
    }

    @ExperimentalUnsignedTypes
    private fun compileFormula(sensor: Sensor) {
        expressionCompiler.compile<Any, Any>(sensor.formula, sensor.rawDataType, sensor.processedDataType)
    }
}
