package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.ubyteArrayOf
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

@ExperimentalUnsignedTypes
class TlvBuilderTest {
    @Test
    fun buildEmpty() {
        val actual = TlvBuilder()
            .build()
        assertEquals("", actual)
    }

    @Test
    fun withUByte() {
        val actual = TlvBuilder()
            .withTag(0x02u, 0x03u)
            .build()
        assertEquals("020103", actual)
    }

    @Test
    fun withByte() {
        val actual = TlvBuilder()
            .withTag(0x02u, 0x03)
            .build()
        assertEquals("020103", actual)
    }

    @Test
    fun withHexString() {
        val actual = TlvBuilder()
            .withTag(0x03u, "0102030405")
            .build()
        assertEquals("03050102030405", actual)
    }

    @Test
    fun withUByteArray() {
        val actual = TlvBuilder()
            .withTag(0x03u, ubyteArrayOf("0102030405"))
            .build()
        assertEquals("03050102030405", actual)
    }

    private fun assertEquals(expected: String, actual: Data) {
        assertEquals(Data(expected), actual)
    }
}
