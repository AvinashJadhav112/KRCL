package com.nelkinda.java.io

import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertArrayEquals
import org.junit.jupiter.api.Test
import java.io.ByteArrayOutputStream
import java.io.OutputStream

@ExperimentalUnsignedTypes
class OutputStreamTest {
    @Test
    fun writeUByteArray() {
        val out = ByteArrayOutputStream()
        (out as OutputStream).write(ubyteArrayOf("01020304"))
        assertArrayEquals(ubyteArrayOf("01020304"), out.toUByteArray())
    }
}
