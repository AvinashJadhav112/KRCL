package com.vervetronics.cloudapp.storage

import com.fasterxml.jackson.annotation.JsonProperty
import com.nelkinda.kotlin.Data
import java.time.Instant

@ExperimentalUnsignedTypes
data class SensorReadingView constructor(
    val factoryDeviceId: Data,
    @get:[JsonProperty("sensorId")]
    val sensorId: UShort,
    val timestamp: Instant,
    val value: Data,
)
