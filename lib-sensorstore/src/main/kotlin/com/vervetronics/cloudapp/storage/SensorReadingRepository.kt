package com.vervetronics.cloudapp.storage

import java.time.LocalDateTime

@ExperimentalUnsignedTypes
// @Component
interface SensorReadingRepository {
    @Throws(InconsistentSensorValueLength::class)
    fun save(sensorReading: SensorReading)
    fun findAllDevices(): List<String>
    fun findAllSensors(factoryDeviceId: String): List<String>
    fun findAllDays(factoryDeviceId: String, sensor: String): List<String>
    fun findAllSensorReadings(factoryDeviceId: String, sensor: String, date: String): List<SensorReading>
    fun getLatestSensorReadings(factoryDeviceId: String): List<SensorReading>
    fun getSensorReadingInBetweenDays(
        factoryDeviceId: String,
        sensor: String,
        startDate: LocalDateTime,
        endDate: LocalDateTime,
    ): List<SensorReading>
}
