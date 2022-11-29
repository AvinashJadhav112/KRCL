package com.nelkinda.org.junit.jupiter.api

import java.time.Clock
import java.time.Clock.systemUTC
import java.time.Duration

private val defaultStopWatch = StopWatch()
fun time(count: Int, function: () -> Unit) = defaultStopWatch.time(count, function)

class StopWatch(val clock: Clock = systemUTC()) {
    fun time(count: Int, function: () -> Unit): Duration {
        val start = clock.instant()
        repeat(count) {
            function()
        }
        val end = clock.instant()
        return Duration.between(start, end)
    }
}
