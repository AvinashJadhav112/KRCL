package com.nelkinda.java.io

import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.io.DataInputStream
import java.io.EOFException

@Suppress("RemoveRedundantCallsOfConversionMethods")
@ExperimentalUnsignedTypes
class DataInputStreamTest {
    @Test
    fun readFullyUBytes() {
        val inputData = ubyteArrayOf("010203")
        val buffer = UByteArray(3)
        val inputStream = DataInputStream(ByteArrayInputStream(inputData))
        inputStream.readFully(buffer)
        assertArrayEquals(inputData, buffer)
    }

    @Test
    fun readUByte() {
        val inputData = ubyteArrayOf("0001FF7F80")
        val inputStream = DataInputStream(ByteArrayInputStream(inputData))
        assertEquals(0x00u.toUByte(), inputStream.readUByte())
        assertEquals(0x01u.toUByte(), inputStream.readUByte())
        assertEquals(0xFFu.toUByte(), inputStream.readUByte())
        assertEquals(0x7Fu.toUByte(), inputStream.readUByte())
        assertEquals(0x80u.toUByte(), inputStream.readUByte())
        assertThrows<EOFException> { inputStream.readUByte() }
    }

    @Test
    fun readUShort() {
        val inputData = ubyteArrayOf("00000001FFFF7FFF8000")
        val inputStream = DataInputStream(ByteArrayInputStream(inputData))
        assertEquals(0x0000u.toUShort(), inputStream.readUShort())
        assertEquals(0x0001u.toUShort(), inputStream.readUShort())
        assertEquals(0xFFFFu.toUShort(), inputStream.readUShort())
        assertEquals(0x7FFFu.toUShort(), inputStream.readUShort())
        assertEquals(0x8000u.toUShort(), inputStream.readUShort())
        assertThrows<EOFException> { inputStream.readUShort() }
    }

    @Test
    fun readUInt() {
        val inputData = ubyteArrayOf("0000000000000001FFFFFFFF7FFFFFFF80000000")
        val inputStream = DataInputStream(ByteArrayInputStream(inputData))
        assertEquals(0x00000000u.toUInt(), inputStream.readUInt())
        assertEquals(0x00000001u.toUInt(), inputStream.readUInt())
        assertEquals(0xFFFFFFFFu.toUInt(), inputStream.readUInt())
        assertEquals(0x7FFFFFFFu.toUInt(), inputStream.readUInt())
        assertEquals(0x80000000u.toUInt(), inputStream.readUInt())
        assertThrows<EOFException> { inputStream.readUInt() }
    }

    @Test
    fun readULong() {
        val inputData = ubyteArrayOf("00000000000000000000000000000001FFFFFFFFFFFFFFFF7FFFFFFFFFFFFFFF8000000000000000")
        val inputStream = DataInputStream(ByteArrayInputStream(inputData))
        assertEquals(0x0000000000000000u.toULong(), inputStream.readULong())
        assertEquals(0x0000000000000001u.toULong(), inputStream.readULong())
        assertEquals(0xFFFFFFFFFFFFFFFFu.toULong(), inputStream.readULong())
        assertEquals(0x7FFFFFFFFFFFFFFFu.toULong(), inputStream.readULong())
        assertEquals(0x8000000000000000u.toULong(), inputStream.readULong())
        assertThrows<EOFException> { inputStream.readULong() }
    }
}
