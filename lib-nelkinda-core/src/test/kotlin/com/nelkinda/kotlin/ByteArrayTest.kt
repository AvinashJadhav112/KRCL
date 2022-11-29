package com.nelkinda.kotlin

import com.nelkinda.org.junit.jupiter.api.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

@ExperimentalUnsignedTypes
class ByteArrayTest {
    @Test
    fun emptyByteArray() {
        assertArrayEquals(byteArrayOf(), byteArrayOf(""))
        assertArrayEquals(byteArrayOf(), byteArrayOf("0x"))
        assertArrayEquals(ubyteArrayOf(), ubyteArrayOf(""))
        assertArrayEquals(ubyteArrayOf(), ubyteArrayOf("0x"))
    }

    @Test
    fun wrongLength() {
        assertThrows<IllegalArgumentException> { byteArrayOf("A") }
        assertThrows<IllegalArgumentException> { byteArrayOf("0xA") }
        assertThrows<IllegalArgumentException> { ubyteArrayOf("a") }
        assertThrows<IllegalArgumentException> { ubyteArrayOf("0xa") }
        assertThrows<IllegalArgumentException> { byteArrayOf("ABC") }
        assertThrows<IllegalArgumentException> { byteArrayOf("0xABC") }
        assertThrows<IllegalArgumentException> { ubyteArrayOf("abc") }
        assertThrows<IllegalArgumentException> { ubyteArrayOf("0xabc") }
    }

    @Test
    fun twoCharacters() {
        assertArrayEquals(byteArrayOf(0x0A), byteArrayOf("0A"))
        assertArrayEquals(byteArrayOf(0x0A), byteArrayOf("0a"))
        assertArrayEquals(byteArrayOf(0x0A), byteArrayOf("0x0A"))
        assertArrayEquals(byteArrayOf(0x0A), byteArrayOf("0x0a"))
        assertArrayEquals(ubyteArrayOf(0x0Au), ubyteArrayOf("0A"))
        assertArrayEquals(ubyteArrayOf(0x0Au), ubyteArrayOf("0a"))
        assertArrayEquals(ubyteArrayOf(0x0Au), ubyteArrayOf("0x0A"))
        assertArrayEquals(ubyteArrayOf(0x0Au), ubyteArrayOf("0x0a"))
    }

    @Test
    fun threeCharacters() {
        assertArrayEquals(ubyteArrayOf(0xCAu, 0xFEu).asByteArray(), byteArrayOf("CAFE"))
        assertArrayEquals(ubyteArrayOf(0xCAu, 0xFEu).asByteArray(), byteArrayOf("cafe"))
        assertArrayEquals(ubyteArrayOf(0xCAu, 0xFEu).asByteArray(), byteArrayOf("0xCAFE"))
        assertArrayEquals(ubyteArrayOf(0xCAu, 0xFEu).asByteArray(), byteArrayOf("0xcafe"))
        assertArrayEquals(ubyteArrayOf(0xCAu, 0xFEu), ubyteArrayOf("CAFE"))
        assertArrayEquals(ubyteArrayOf(0xCAu, 0xFEu), ubyteArrayOf("cafe"))
        assertArrayEquals(ubyteArrayOf(0xCAu, 0xFEu), ubyteArrayOf("0xCAFE"))
        assertArrayEquals(ubyteArrayOf(0xCAu, 0xFEu), ubyteArrayOf("0xcafe"))
    }

    @Test
    fun byteArrayToHexString() {
        assertEquals("", byteArrayOf().toHexString())
        assertEquals("00", byteArrayOf(0x00).toHexString())
        assertEquals("CAFEBABE", byteArrayOf(0xCA.toByte(), 0xFE.toByte(), 0xBA.toByte(), 0xBE.toByte()).toHexString())
    }

    @Test
    fun ubyteArrayToHexString() {
        assertEquals("", ubyteArrayOf().toHexString())
        assertEquals("00", ubyteArrayOf(0x00u).toHexString())
        assertEquals("CAFEBABE", ubyteArrayOf(0xCAu, 0xFEu, 0xBAu, 0xBEu).toHexString())
    }

    @Test
    fun testToInt() {
        /* ktlint-disable */
        assertEquals(            0, toInt(ubyteArrayOf("00")))
        assertEquals(            1, toInt(ubyteArrayOf("01")))
        assertEquals(          127, toInt(ubyteArrayOf("7F")))
        assertEquals(          128, toInt(ubyteArrayOf("80")))
        assertEquals(          255, toInt(ubyteArrayOf("FF")))
        assertEquals(          256, toInt(ubyteArrayOf("0100")))
        assertEquals(        65535, toInt(ubyteArrayOf("FFFF")))
        assertEquals(        65536, toInt(ubyteArrayOf("010000")))
        assertEquals(     16777215, toInt(ubyteArrayOf("FFFFFF")))
        assertEquals(     16777216, toInt(ubyteArrayOf("01000000")))
        assertEquals(Int.MAX_VALUE, toInt(ubyteArrayOf("7FFFFFFF")))
        assertEquals(Int.MIN_VALUE, toInt(ubyteArrayOf("80000000")))
        assertEquals(           -1, toInt(ubyteArrayOf("FFFFFFFF")))
        /* ktlint-disable */
    }
}
