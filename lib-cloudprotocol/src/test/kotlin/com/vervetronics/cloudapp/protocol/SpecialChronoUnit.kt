package com.vervetronics.cloudapp.protocol

import java.time.Duration
import java.time.temporal.Temporal
import java.time.temporal.TemporalUnit

enum class SpecialChronoUnit(private val duration: Duration) : TemporalUnit {
    /**
     * Unit that represents the concept of a centisecond.
     * For the ISO calendar system, it is equal to the 100th part of the second unit.
     */
    CENTISECONDS(Duration.ofNanos(10_000_000)),
    ;

    override fun getDuration() = duration
    override fun isDurationEstimated() = false
    override fun isDateBased() = false
    override fun isTimeBased() = true
    override fun isSupportedBy(temporal: Temporal) = temporal.isSupported(this)
    @Suppress("UNCHECKED_CAST")
    override fun <R : Temporal?> addTo(temporal: R, amount: Long) = temporal!!.plus(amount, this) as R
    override fun between(temporal1Inclusive: Temporal, temporal2Exclusive: Temporal) =
        temporal1Inclusive.until(temporal2Exclusive, this)
}
