package com.nelkinda.org.junit.jupiter.api

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.inOrder
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoMoreInteractions
import java.time.Clock
import java.time.Clock.systemUTC
import java.time.Duration
import java.time.Instant

class StopWatchTest {
    private lateinit var timer: StopWatch

    @Test
    fun defaultsToSystemUTC() {
        timer = StopWatch()
        assertEquals(timer.clock, systemUTC())
    }

    @Test
    fun providesDefaultFunction() {
        val function = mock<() -> Unit> {}
        time(2, function)
        verify(function, times(2)).invoke()
        verifyNoMoreInteractions(function)
    }

    @Test
    fun timer() {
        val clock = mock<Clock> {
            on { instant() }
                .doReturn(Instant.ofEpochMilli(1000))
                .doReturn(Instant.ofEpochMilli(4000))
        }
        val function = mock<() -> Unit> {}
        timer = StopWatch(clock)

        val duration = timer.time(2, function)

        assertEquals(Duration.ofMillis(3000), duration)
        timer.verifyCallSequence(function, 2)
    }

    private fun StopWatch.verifyCallSequence(function: () -> Unit, times: Int) = inOrder(clock, function) {
        verify(clock, times(1)).instant()
        verify(function, times(times)).invoke()
        verify(clock, times(1)).instant()
        verifyNoMoreInteractions()
    }
}
