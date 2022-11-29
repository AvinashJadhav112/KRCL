package com.vervetronics.cloudapp.dashboard

import java.time.Instant
import java.util.UUID

data class DeviceListEntry(
    val id: UUID,
    val serialNumber: String,
    val deviceName: String,
)

data class LatestSensorReadings(
    val id: UUID,
    val serialNumber: String,
    val deviceName: String,
    var latestSensorData: List<SensorEntry>,
)

data class LatestLocation(
    val device: String,
    val latitude: List<SensorEntry>,
    val longitude: List<SensorEntry>,
)

data class SensorEntry(
    val id: String,
    val name: String,
    val timestamp: Instant,
    val rawValue: String,
    val unit: String,
    val alert: Boolean,
    val dashboardOrder: String,
    val min: String,
    val max: String,
)

@ExperimentalUnsignedTypes
data class Calculated(
    val deviceId: com.nelkinda.kotlin.Data,
    val timestamp: Instant,
    val value: String,
    val sensorId: String,
)
