package com.nelkinda.kotlin

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Test

@ExperimentalUnsignedTypes
class DataTest {
    @Test
    fun testEqualsAndHashCode() {
        val d1 = Data("ABCD")
        val d2 = Data("ABCD")
        val d3 = Data("0123")
        assertEquals(d1, d1)
        assertEquals(d1, d2)
        assertNotEquals(d1, d3)
        assertEquals(d1.hashCode(), d2.hashCode())
        assertNotEquals(d1.hashCode(), d3.hashCode())
    }

    @Test
    fun testToString() {
        assertEquals("ABCD", Data("ABCD").toString())
        assertEquals("ABCD", Data(ubyteArrayOf(0xABU, 0xCDU)).toString())
    }

    @Test
    fun serializes() {
        val pojo = DataTestPojo(Data("ABCD"))
        val objectMapper = jacksonObjectMapper()
        val actual = objectMapper.writeValueAsString(pojo)
        val expected = """{"data":"ABCD"}"""
        assertEquals(expected, actual)
    }

    @Test
    fun deserializes() {
        val json = """{"data":"ABCD"}"""
        val objectMapper = jacksonObjectMapper()
        val actual = objectMapper.readValue<DataTestPojo>(json)
        val expected = DataTestPojo(Data("ABCD"))
        assertEquals(expected, actual)
    }

    @Test
    fun compare() {
        assertEquals(0, Data("").compareTo(Data("")))
        assertEquals(1, Data("00").compareTo(Data("")))
        assertEquals(0, Data("00").compareTo(Data("00")))
        assertEquals(-1, Data("").compareTo(Data("00")))
        assertEquals(-1, Data("00").compareTo(Data("01")))
        assertEquals(1, Data("01").compareTo(Data("00")))
    }
}

@ExperimentalUnsignedTypes
data class DataTestPojo(
    val data: Data
)
