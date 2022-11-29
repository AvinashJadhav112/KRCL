package com.nelkinda.rel

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

@ExperimentalUnsignedTypes
class TypeConverterTest {

    @Test
    fun convertInt() {
        val converter = TypeConverter["Int"]!!
        val convertedValue = converter.invoke("123")
        assertTrue(convertedValue is Int)
        assertEquals(123, convertedValue)
    }

    @Test
    fun convertBoolean() {
        val converter = TypeConverter["Boolean"]!!
        val convertedValue = converter.invoke("true")
        assertTrue(convertedValue is Boolean)
        assertEquals(true, convertedValue)
    }

    @Test
    fun convertByte() {
        val converter = TypeConverter["Byte"]!!
        val convertedValue = converter.invoke("80")
        assertTrue(convertedValue is Byte)
        assertEquals((80).toByte(), convertedValue)
    }

    @Test
    fun convertUByte() {
        val converter = TypeConverter["UByte"]!!
        val convertedValue = converter.invoke("20")
        assertTrue(convertedValue is UByte)
        assertEquals((20).toUByte(), convertedValue)
    }

    @Test
    fun convertShort() {
        val converter = TypeConverter["Short"]!!
        val convertedValue = converter.invoke("0015")
        assertTrue(convertedValue is Short)
        assertEquals((15).toShort(), convertedValue)
    }

    @Test
    fun convertUShort() {
        val converter = TypeConverter["UShort"]!!
        val convertedValue = converter.invoke("0015")
        assertTrue(convertedValue is UShort)
        assertEquals((15).toUShort(), convertedValue)
    }

    @Test
    fun convertUInt() {
        val converter = TypeConverter["UInt"]!!
        val convertedValue = converter.invoke("15")
        assertTrue(convertedValue is UInt)
        assertEquals((15).toUInt(), convertedValue)
    }

    @Test
    fun convertLong() {
        val converter = TypeConverter["Long"]!!
        val convertedValue = converter.invoke("123456789")
        assertTrue(convertedValue is Long)
        assertEquals((123456789).toLong(), convertedValue)
    }

    @Test
    fun convertULong() {
        val converter = TypeConverter["ULong"]!!
        val convertedValue = converter.invoke("123456789")
        assertTrue(convertedValue is ULong)
        assertEquals((123456789).toULong(), convertedValue)
    }

    @Test
    fun convertFloat() {
        val converter = TypeConverter["Float"]!!
        val convertedValue = converter.invoke("3.1234")
        assertTrue(convertedValue is Float)
        assertEquals((3.1234).toFloat(), convertedValue)
    }

    @Test
    fun convertDouble() {
        val converter = TypeConverter["Double"]!!
        val convertedValue = converter.invoke("1.12345")
        assertTrue(convertedValue is Double)
        assertEquals((1.12345).toDouble(), convertedValue)
    }

    @Test
    fun convertString() {
        val converter = TypeConverter["String"]!!
        val convertedValue = converter.invoke("ABCD")
        assertTrue(convertedValue is String)
        assertEquals("ABCD", convertedValue)
    }

    @Test
    fun convertByteArray() {
        val converter = TypeConverter["ByteArray"]!!
        val convertedValue = converter.invoke("1234")
        assertTrue(convertedValue is ByteArray)
    }

    @Test
    fun convertUByteArray() {
        val converter = TypeConverter["UByteArray"]!!
        val convertedValue = converter.invoke("1234")
        assertTrue(convertedValue is UByteArray)
    }

    @Test
    fun `when converting invalid data to known data type`() {
        assertThrows<InvalidDataException> { convertValue("Int", "ABC") }
    }
}
