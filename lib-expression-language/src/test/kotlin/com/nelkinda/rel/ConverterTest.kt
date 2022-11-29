package com.nelkinda.rel

import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.byteArrayOf
import com.nelkinda.kotlin.ubyteArrayOf
import org.jetbrains.kotlin.utils.addToStdlib.safeAs
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

@ExperimentalUnsignedTypes
class ConverterTest {
    @Test
    fun convertBoolean() {
        val converter = Converters["Boolean"]!!
        val convertedValue = converter.invoke(Data("0000"))
        assertTrue(convertedValue is Boolean)
        assertEquals(false, convertedValue)
    }

    @Test
    fun convertByte() {
        val converter = Converters["Byte"]!!
        val convertedValue = converter.invoke(Data("80"))
        assertTrue(convertedValue is Byte)
        assertEquals((-128).toByte(), convertedValue)
    }

    @Test
    fun convertUByte() {
        val converter = Converters["UByte"]!!
        val convertedValue = converter.invoke(Data("20"))
        assertTrue(convertedValue is UByte)
        assertEquals((32).toUByte(), convertedValue)
    }

    @Test
    fun convertShort() {
        val converter = Converters["Short"]!!
        val convertedValue = converter.invoke(Data("0015"))
        assertTrue(convertedValue is Short)
        assertEquals((21).toShort(), convertedValue)
    }

    @Test
    fun convertUShort() {
        val converter = Converters["UShort"]!!
        val convertedValue = converter.invoke(Data("0015"))
        assertTrue(convertedValue is UShort)
        assertEquals((21).toUShort(), convertedValue)
    }

    @Test
    fun convertInt() {
        val converter = Converters["Int"]!!
        val convertedValue = converter.invoke(Data("FFFFFFF6"))
        assertTrue(convertedValue is Int)
        assertEquals(-10, convertedValue)
    }

    @Test
    fun convertUInt() {
        val converter = Converters["UInt"]!!
        val convertedValue = converter.invoke(Data("0000000A"))
        assertTrue(convertedValue is UInt)
        assertEquals((10).toUInt(), convertedValue)
    }

    @Test
    fun convertLong() {
        val converter = Converters["Long"]!!
        val convertedValue = converter.invoke(Data("FFFFFFFFFFFFFFF4"))
        assertTrue(convertedValue is Long)
        assertEquals((-12).toLong(), convertedValue)
    }

    @Test
    fun convertULong() {
        val converter = Converters["ULong"]!!
        val convertedValue = converter.invoke(Data("0000000000096747"))
        assertTrue(convertedValue is ULong)
        assertEquals((616263).toULong(), convertedValue)
    }

    @Test
    fun convertFloat() {
        val converter = Converters["Float"]!!
        val convertedValue = converter.invoke(Data("3F99999A"))
        assertTrue(convertedValue is Float)
        assertEquals((1.2).toFloat(), convertedValue)
    }

    @Test
    fun convertDouble() {
        val converter = Converters["Double"]!!
        val convertedValue = converter.invoke(Data("40286B851EB851EC"))
        assertTrue(convertedValue is Double)
        assertEquals((12.21).toDouble(), convertedValue)
    }

    @Test
    fun convertString() {
        val converter = Converters["String"]!!
        val convertedValue = converter.invoke(Data("41424344"))
        assertTrue(convertedValue is String)
        assertEquals("ABCD", convertedValue)
    }

    @Test
    fun convertByteArray() {
        val converter = Converters["ByteArray"]!!
        val convertedValue = converter.invoke(Data("1234"))
        assertTrue(convertedValue is ByteArray)
        assertTrue(byteArrayOf("1234").contentEquals(convertedValue.safeAs<ByteArray>()))
    }

    @Test
    fun convertUByteArray() {
        val converter = Converters["UByteArray"]!!
        val convertedValue = converter.invoke(Data("1234"))
        assertTrue(convertedValue is UByteArray)
        assertTrue(ubyteArrayOf("1234").contentEquals(convertedValue.safeAs<UByteArray>()))
    }

    @Test
    fun `convert Boolean`() {
        val value = convert("Boolean", Data("0000"))
        assertTrue(value is Boolean)
        assertEquals(false, value)
    }

    @Test
    fun `given an unsupported data type, throws an exception`() {
        val exception = assertThrows<UnsupportedDataTypeException> {
            convert("UnsupportedDataType", Data("1234"))
        }
        assertEquals("Unsupported data type: UnsupportedDataType", exception.message)
        assertEquals("UnsupportedDataType", exception.typeName)
    }
}
