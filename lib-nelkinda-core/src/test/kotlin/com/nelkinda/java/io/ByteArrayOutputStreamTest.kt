package com.nelkinda.java.io

import com.nelkinda.org.junit.jupiter.api.assertArrayEquals
import org.junit.jupiter.api.Test
import java.io.ByteArrayOutputStream

@ExperimentalUnsignedTypes
class ByteArrayOutputStreamTest {
    @Test
    fun testToUByteArray() {
        ByteArrayOutputStream()
            .apply {
                write(0x00)
                write(0x01)
                write(0x80)
                write(0xFF)
            }
            .also {
                assertArrayEquals(ubyteArrayOf(0x00u, 0x01u, 0x80u, 0xFFu), it.toUByteArray())
            }
    }
}
