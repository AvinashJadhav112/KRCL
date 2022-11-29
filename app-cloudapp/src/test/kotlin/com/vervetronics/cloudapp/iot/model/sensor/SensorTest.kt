package com.vervetronics.cloudapp.iot.model.sensor

import com.nelkinda.rel.UnsupportedDataTypeException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

@ExperimentalUnsignedTypes
class SensorTest {

    @Test
    fun `test sensor is within bound when value is int`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10")
        val processValue = "5"

        // when
        val isWithinBound = sensor.isWithinBounds(processValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor is outside bound when value is int`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10")
        val processValue = "100"

        // when
        val isWithinBound = sensor.isWithinBounds(processValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor is within bound when value is UInt`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "UInt")
        val processValue = "5"

        // when
        val isWithinBound = sensor.isWithinBounds(processValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor is outside bound when value is UInt`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "UInt")
        val processValue = "100"

        // when
        val isWithinBound = sensor.isWithinBounds(processValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor when processed value is outside bound when value is Long`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "Long")
        val processValue = "100"

        // when
        val isWithinBound = sensor.isWithinBounds(processValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is within bound when value is Long`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "Long")
        val processedValue = "5"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is outside bound when value is ULong`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "ULong")
        val processValue = "100"

        // when
        val isWithinBound = sensor.isWithinBounds(processValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is within bound when value is ULong`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "ULong")
        val processedValue = "5"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed data type is unknown`() {
        // when
        val sensor = sampleSensor.copy(processedDataType = "Unknown")

        // then
        assertThrows<UnsupportedDataTypeException> {
            sensor.isWithinBounds("100")
        }
    }

    @Test
    fun `test sensor limit when processed value is within bound when value is Short`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "Short")
        val processedValue = "5"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is out of bound when value is Short`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "Short")
        val processedValue = "100"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is out of bound when value is UShort`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "UShort")
        val processedValue = "100"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is within bound when value is UShort`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "100", processedDataType = "UShort")
        val processedValue = "10"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is out of bound when value is Byte`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "Byte")
        val processedValue = "100"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is within bound when value is Byte`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "100", processedDataType = "Byte")
        val processedValue = "10"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is out of bound when value is UByte`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "10", processedDataType = "UByte")
        val processedValue = "100"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is within bound when value is UByte`() {
        // given
        val sensor = sampleSensor.copy(min = "0", max = "100", processedDataType = "UByte")
        val processedValue = "10"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is out of bound when value is Float`() {
        // given
        val sensor = sampleSensor.copy(min = "0.00", max = "10.00", processedDataType = "Float")
        val processedValue = "100.00"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is within bound when value is Float`() {
        // given
        val sensor = sampleSensor.copy(min = "0.00", max = "100.00", processedDataType = "Float")
        val processedValue = "10.00"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(true, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is out of bound when value is Double`() {
        // given
        val sensor = sampleSensor.copy(min = "0.00", max = "10.00", processedDataType = "Double")
        val processedValue = "100.00"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(false, isWithinBound)
    }

    @Test
    fun `test sensor limit when processed value is within bound when value is Double`() {
        // given
        val sensor = sampleSensor.copy(min = "0.00", max = "100.00", processedDataType = "Double")
        val processedValue = "10.00"

        // when
        val isWithinBound = sensor.isWithinBounds(processedValue)

        // then
        assertEquals(true, isWithinBound)
    }
}

@ExperimentalUnsignedTypes
private val sampleSensor =
    Sensor(
        "13",
        "Button Up",
        "High",
        "1",
        "0",
        "1",
        "0ms",
        "value",
        "Int",
        "Int",
        "Count"
    )
