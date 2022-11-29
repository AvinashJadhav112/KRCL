package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.io.ByteArrayInputStream
import com.nelkinda.kotlin.ubyteArrayOf
import com.vervetronics.cloudapp.protocol.error.ChecksumError
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

@ExperimentalUnsignedTypes
class ChecksumInputStreamTest {
    @Test
    fun testEmpty() {
        val checksumInputStream = ChecksumInputStream(ByteArrayInputStream(ubyteArrayOf("")))
        assertEquals(0x0000u.toUShort(), checksumInputStream.checksum)
    }

    @Test
    fun testSingleByte() {
        val checksumInputStream = ChecksumInputStream(ByteArrayInputStream(ubyteArrayOf("FF")))
        assertEquals(0xFF, checksumInputStream.read())
        assertEquals(0x00FFu.toUShort(), checksumInputStream.checksum)
    }

    @Test
    fun testTwoBytes() {
        val checksumInputStream = ChecksumInputStream(ByteArrayInputStream(ubyteArrayOf("0101")))
        assertEquals(0x01, checksumInputStream.read())
        assertEquals(0x01, checksumInputStream.read())
        assertEquals(0x0003u.toUShort(), checksumInputStream.checksum)
    }

    @Test
    fun testSingleArray() {
        val checksumInputStream = ChecksumInputStream(ByteArrayInputStream(ubyteArrayOf("F00000000F")))
        val buffer = ByteArray(5)
        assertEquals(5, checksumInputStream.read(buffer))
        assertTrue(buffer.contentEquals(ubyteArrayOf("F00000000F").asByteArray()))
        assertEquals(0x0F0Fu.toUShort(), checksumInputStream.checksum)
    }

    @Test
    fun testVerifyChecksum() {
        val checksumInputStream = ChecksumInputStream(ByteArrayInputStream(ubyteArrayOf("0000")))
        assertEquals(0x0000u.toUShort(), checksumInputStream.verifyChecksum(0x0000u))
    }

    @Test
    fun wrongChecksumThrowsChecksumError() {
        val checksumInputStream = ChecksumInputStream(ByteArrayInputStream(ubyteArrayOf("0001")))
        val checksumError = assertThrows<ChecksumError> {
            checksumInputStream.verifyChecksum(0x0001u)
        }
        assertEquals(0x0001u.toUShort(), checksumError.stream)
        assertEquals(0x0000u.toUShort(), checksumError.calculated)
        assertEquals("Checksum mismatch, stream: 0001, calculated: 0000", checksumError.message)
    }
}
