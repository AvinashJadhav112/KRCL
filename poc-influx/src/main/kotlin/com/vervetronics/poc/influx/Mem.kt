package com.vervetronics.poc.influx

import com.influxdb.annotations.Column
import com.influxdb.annotations.Measurement
import java.time.Instant

@Measurement(name = "mem")
data class Mem(
    @Column(tag = true) val host: String,
    @Column(name = "used_percent") val usedPercent: Double,
    @Column(timestamp = true) val time: Instant,
)
