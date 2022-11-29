package com.vervetronics.cloudapp.storage.multiplex

import com.vervetronics.cloudapp.storage.SensorReading
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import java.time.LocalDateTime

@SuppressWarnings("kotlin:S1192")
@ExperimentalUnsignedTypes
// @Repository
class MultiplexSensorReadingRepository(
    private val delegates: List<SensorReadingRepository>
) : SensorReadingRepository {

    private fun <T : Comparable<T>> delegate(transform: (SensorReadingRepository) -> List<T>) =
        delegates.flatMap(transform).toSortedSet().toList()

    override fun save(sensorReading: SensorReading) =
        delegates.forEach { it.save(sensorReading) }

    override fun findAllDevices() =
        delegate { it.findAllDevices() }

    override fun findAllSensors(factoryDeviceId: String) =
        delegate { it.findAllSensors(factoryDeviceId) }

    override fun findAllDays(factoryDeviceId: String, sensor: String) =
        delegate { it.findAllDays(factoryDeviceId, sensor) }

    override fun findAllSensorReadings(factoryDeviceId: String, sensor: String, date: String) =
        delegate { it.findAllSensorReadings(factoryDeviceId, sensor, date) }

    override fun getLatestSensorReadings(factoryDeviceId: String) =
        delegate { it.getLatestSensorReadings(factoryDeviceId) }

    override fun getSensorReadingInBetweenDays(
        factoryDeviceId: String,
        sensor: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ) = delegate { it.getSensorReadingInBetweenDays(factoryDeviceId, sensor, startDate, endDate) }
}
