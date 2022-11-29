package com.nelkinda.java.nio

import com.nelkinda.org.junit.jupiter.api.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

@ExperimentalUnsignedTypes
class ByteBufferExtensionsTest {

    private val uByteArray = ubyteArrayOf(
        0x01u, 0x02u, 0x03u, 0x04u, 0x05u, 0x06u, 0x07u, 0x08u,
        0xFFu, 0xFEu, 0xFDu, 0xFCu, 0xFBu, 0xFAu, 0xF9u, 0xF8u,
    )

    private val buffer = byteBufferOf(uByteArray)

    @Test
    fun testGetByte() {
        assertEquals(0x01.toByte(), buffer.getByte())
        assertEquals(0x02.toByte(), buffer.getByte())
        assertEquals(0xFA.toByte(), buffer.getByte(13))
        assertEquals(0xFB.toByte(), buffer.getByte(12))
    }

    @Test
    fun testPutByte() {
        buffer.putByte(0x10)
        buffer.putByte(0x11)
        assertEquals(0x10.toByte(), uByteArray[0].toByte())
        assertEquals(0x11.toByte(), uByteArray[1].toByte())
        buffer.putByte(8, 0x80.toByte())
        buffer.putByte(9, 0x81.toByte())
        assertEquals(0x80.toByte(), uByteArray[8].toByte())
        assertEquals(0x81.toByte(), uByteArray[9].toByte())
    }

    @Test
    fun testGetUByte() {
        assertEquals(0x01u.toUByte(), buffer.getU())
        assertEquals(0x02u.toUByte(), buffer.getU())
        assertEquals(0x03u.toUByte(), buffer.getUByte())
        assertEquals(0x04u.toUByte(), buffer.getUByte())
        assertEquals(0xF8u.toUByte(), buffer.getU(15))
        assertEquals(0xF9u.toUByte(), buffer.getU(14))
        assertEquals(0xFCu.toUByte(), buffer.getUByte(11))
        assertEquals(0xFDu.toUByte(), buffer.getUByte(10))
    }

    @Test
    fun testPutUByte() {
        buffer.putU(0x11u)
        buffer.putU(0x12u)
        buffer.putUByte(0x13u)
        buffer.putUByte(0x14u)
        buffer.putU(8, 0x80u)
        buffer.putU(9, 0x81u)
        buffer.putUByte(10, 0x82u)
        buffer.putUByte(11, 0x83u)
        assertArrayEquals(
            ubyteArrayOf(
                0x11u, 0x12u, 0x13u, 0x14u, 0x05u, 0x06u, 0x07u, 0x08u,
                0x80u, 0x81u, 0x82u, 0x83u, 0xFBu, 0xFAu, 0xF9u, 0xF8u,
            ),
            uByteArray
        )
    }

    @Test
    fun testGetUShort() {
        assertEquals(0x0102u.toUShort(), buffer.getUShort())
        assertEquals(0x0304u.toUShort(), buffer.getUShort())
        assertEquals(0xFFFEu.toUShort(), buffer.getUShort(8))
        assertEquals(0xFDFCu.toUShort(), buffer.getUShort(10))
    }

    @Test
    fun testPutUShort() {
        buffer.putUShort(0x1112u)
        buffer.putUShort(0x1314u)
        buffer.putUShort(8, 0x8081u)
        buffer.putUShort(10, 0x8283u)
        assertArrayEquals(
            ubyteArrayOf(
                0x11u, 0x12u, 0x13u, 0x14u, 0x05u, 0x06u, 0x07u, 0x08u,
                0x80u, 0x81u, 0x82u, 0x83u, 0xFBu, 0xFAu, 0xF9u, 0xF8u,
            ),
            uByteArray
        )
    }

    @Test
    fun testGetUInt() {
        assertEquals(0x01020304u, buffer.getUInt())
        assertEquals(0x05060708u, buffer.getUInt())
        assertEquals(0x0708FFFEu, buffer.getUInt(6))
        assertEquals(0xFFFEFDFCu, buffer.getUInt(8))
    }

    @Test
    fun testPutUInt() {
        buffer.putUInt(0x11121314u)
        buffer.putUInt(0x21222324u)
        buffer.putUInt(6, 0x91929394u)
        buffer.putUInt(8, 0xA1A2A3A4u)
        assertArrayEquals(
            ubyteArrayOf(
                0x11u, 0x12u, 0x13u, 0x14u, 0x21u, 0x22u, 0x91u, 0x92u,
                0xA1u, 0xA2u, 0xA3u, 0xA4u, 0xFBu, 0xFAu, 0xF9u, 0xF8u,
            ),
            uByteArray
        )
    }

    @Test
    fun testGetULong() {
        assertEquals(0x0102030405060708u, buffer.getULong())
        assertEquals(0xFFFEFDFCFBFAF9F8u, buffer.getULong())
        assertEquals(0x02030405060708FFu, buffer.getULong(1))
        assertEquals(0x05060708FFFEFDFCu, buffer.getULong(4))
    }

    @Test
    fun testPutULong() {
        buffer.putULong(0x1112131415161718u)
        buffer.putULong(0x2122232425262728u)
        buffer.putULong(2, 0x3132333435363738u)
        buffer.putULong(4, 0x9192939495969798u)
        assertArrayEquals(
            ubyteArrayOf(
                0x11u, 0x12u, 0x31u, 0x32u, 0x91u, 0x92u, 0x93u, 0x94u,
                0x95u, 0x96u, 0x97u, 0x98u, 0x25u, 0x26u, 0x27u, 0x28u,
            ),
            uByteArray
        )
    }
}
