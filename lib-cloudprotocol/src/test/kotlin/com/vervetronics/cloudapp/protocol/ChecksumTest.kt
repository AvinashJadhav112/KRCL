package com.vervetronics.cloudapp.protocol

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

@ExperimentalUnsignedTypes
class ChecksumTest {
    @Test
    fun testXorShift() {
        assertEquals(0u.toUShort(), xorShift(ubyteArrayOf()))
        assertEquals(1u.toUShort(), xorShift(ubyteArrayOf(0x01u)))
        assertEquals(3u.toUShort(), xorShift(ubyteArrayOf(0x01u, 0x01u)))
        assertEquals(0xF0Fu.toUShort(), xorShift(ubyteArrayOf(0xF0u, 0x00u, 0x00u, 0x00u, 0x0Fu)))
        assertEquals(0x0001u.toUShort(), xorShift(ubyteArrayOf(0x00u), initial = 0x8000u))
    }
}

@ExperimentalUnsignedTypes
fun UByteArray.withChecksum(): UByteArray {
    this[4] = 0u
    this[5] = 0u
    val checksum = xorShift(this)
    this[4] = (checksum.toInt() shr 8).toUByte()
    this[5] = checksum.toUByte()
    return this
}
