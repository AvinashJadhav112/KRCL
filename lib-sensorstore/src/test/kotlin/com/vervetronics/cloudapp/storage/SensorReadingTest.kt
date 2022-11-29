package com.vervetronics.cloudapp.storage

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.skyscreamer.jsonassert.JSONAssert
import org.skyscreamer.jsonassert.JSONCompareMode
import java.time.Instant

@ExperimentalUnsignedTypes
class SensorReadingTest {
    @Test
    fun serializes() {
        val mapper = ObjectMapper()
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
        mapper.findAndRegisterModules()
//        mapper.addHandler(com.fasterxml.jackson.datatype.jsr310.JavaTimeModule())
        val sensorReading = SensorReading(
            com.nelkinda.kotlin.Data(TestFactoryDeviceIdentifierFactory.id1),
            0x0001u,
            Instant.parse("2020-12-24T23:15:45.50Z"),
            com.nelkinda.kotlin.Data("0102030405060708"),
        )
        val expected = """
            {
                "factoryDeviceId" : "55AA55AA55AA55AA55AA55AA55AA0000",
                "sensorId": 1,
                "timestamp" : "2020-12-24T23:15:45.500Z",
                "value": "0102030405060708"
            }
        """.trimIndent()
        val actual = mapper.writeValueAsString(sensorReading)
        JSONAssert.assertEquals(expected, actual, JSONCompareMode.LENIENT)
    }

    @Test
    fun compareSensorReadings() {
        val sensorReading1 = SensorReading(
            com.nelkinda.kotlin.Data(TestFactoryDeviceIdentifierFactory.id1),
            0x0001u,
            Instant.parse("2020-12-24T23:15:45.50Z"),
            com.nelkinda.kotlin.Data("0102030405060708"),
        )
        val sensorReading2 = SensorReading(
            com.nelkinda.kotlin.Data(TestFactoryDeviceIdentifierFactory.id1),
            0x0001u,
            Instant.parse("2020-12-24T23:15:45.50Z"),
            com.nelkinda.kotlin.Data("0102030405060708"),
        )
        Assertions.assertEquals(0, sensorReading1.compareTo(sensorReading2))
    }
}
