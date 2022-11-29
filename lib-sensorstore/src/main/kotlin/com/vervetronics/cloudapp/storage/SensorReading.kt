package com.vervetronics.cloudapp.storage

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.Instant

@ExperimentalUnsignedTypes
data class SensorReading(
    val factoryDeviceId: com.nelkinda.kotlin.Data,
    @get:[JsonProperty("sensorId")]
    val sensorId: UShort,
    val timestamp: Instant,
    val value: com.nelkinda.kotlin.Data,
) : Comparable<SensorReading> {
    constructor(
        factoryDeviceId: UByteArray,
        sensorId: UShort,
        timestamp: Instant,
        value: UByteArray,
    ) : this(
        com.nelkinda.kotlin.Data(factoryDeviceId),
        sensorId,
        timestamp,
        com.nelkinda.kotlin.Data(value),
    )

    constructor(
        factoryDeviceId: String,
        sensorId: UShort,
        timestamp: Instant,
        value: String,
    ) : this(
        com.nelkinda.kotlin.Data(factoryDeviceId),
        sensorId,
        timestamp,
        com.nelkinda.kotlin.Data(value),
    )

    override fun compareTo(other: SensorReading): Int {
        return comparator.compare(this, other)
    }

    companion object {
        private val comparator = Comparator
            .comparing<SensorReading, com.nelkinda.kotlin.Data> { it.factoryDeviceId }
            .thenComparing<UShort> { it.sensorId }
            .thenComparing<Instant> { it.timestamp }
            .thenComparing<com.nelkinda.kotlin.Data> { it.value }
    }
}
