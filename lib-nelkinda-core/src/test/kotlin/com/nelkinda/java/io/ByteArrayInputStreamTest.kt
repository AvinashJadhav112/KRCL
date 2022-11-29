package com.nelkinda.java.io

import com.nelkinda.kotlin.byteArrayOf
import com.nelkinda.kotlin.ubyteArrayOf
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Test

@ExperimentalUnsignedTypes
class ByteArrayInputStreamTest {
    @Test
    fun testFromUByteArray() {
        val inputStream = ByteArrayInputStream(ubyteArrayOf("010203A1FFC0"))
        assertArrayEquals(byteArrayOf("010203A1FFC0"), inputStream.readAllBytes())
    }
}
