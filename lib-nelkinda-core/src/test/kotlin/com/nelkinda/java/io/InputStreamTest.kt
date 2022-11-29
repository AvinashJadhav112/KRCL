package com.nelkinda.java.io

import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertArrayEquals
import org.junit.jupiter.api.Test
import java.io.InputStream

@ExperimentalUnsignedTypes
class InputStreamTest {
    @Test
    fun testReadAllUBytes() {
        @SuppressWarnings("UnusedPrivateMember") // False positive: https://github.com/detekt/detekt/issues/3825
        val `in` = ByteArrayInputStream(ubyteArrayOf("010203CAFEBABE")) as InputStream
        val expected = ubyteArrayOf("010203CAFEBABE")
        val actual = `in`.readAllUBytes()
        assertArrayEquals(expected, actual)
    }

    @Test
    fun testReadNUBytes() {
        @SuppressWarnings("UnusedPrivateMember") // False positive: https://github.com/detekt/detekt/issues/3825
        val `in` = ByteArrayInputStream(ubyteArrayOf("010203CAFEBABE")) as InputStream
        val expected1 = ubyteArrayOf("010203")
        val expected2 = ubyteArrayOf("CAFEBABE")
        val actual1 = `in`.readNUBytes(3)
        val actual2 = `in`.readNUBytes(4)
        assertArrayEquals(expected1, actual1)
        assertArrayEquals(expected2, actual2)
    }
}
