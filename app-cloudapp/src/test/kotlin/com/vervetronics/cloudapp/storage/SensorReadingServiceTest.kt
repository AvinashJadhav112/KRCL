package com.vervetronics.cloudapp.storage

import com.nelkinda.kotlin.Data
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import java.time.Instant

@ExperimentalUnsignedTypes
class SensorReadingServiceTest {
    private val sensorReadingRepository = mock<SensorReadingRepository>()
    private val sensorReadingService = SensorReadingService(sensorReadingRepository)

    @Test
    fun createView() {
        val timestamp = Instant.now()
        val sensorReading = SensorReading(
            "0102030405060708090A0B0C0D0E0F10",
            1U,
            timestamp,
            "1234",
        )
        val expectedView = SensorReadingView(
            Data("0102030405060708090A0B0C0D0E0F10"),
            1U,
            timestamp,
            Data("1234"),
        )
        with(sensorReadingService) {
            assertEquals(expectedView, sensorReading.createView())
        }
    }
}
