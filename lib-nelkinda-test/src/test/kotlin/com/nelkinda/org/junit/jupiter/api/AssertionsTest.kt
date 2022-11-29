package com.nelkinda.org.junit.jupiter.api

import com.nelkinda.kotlin.toHexString
import io.cucumber.java.After
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.condition.DisabledOnOs
import org.junit.jupiter.api.condition.OS
import org.opentest4j.AssertionFailedError
import java.io.InputStream
import java.nio.file.Files

@ExperimentalUnsignedTypes
class AssertionsTest {
    private var stream: InputStream? = null

    @After
    fun closeStreamIfSet() {
        stream?.close()
    }

    @Test
    fun testUByteArrayEquals() {
        val a1 = ubyteArrayOf(0x00u, 0x01u, 0x80u, 0xFFu)
        val a2 = byteArrayOf(0x00, 0x01, -0x80, -0x01).asUByteArray()
        assertArrayEquals(a1, a2)
    }

    @Test
    fun testUByteArrayNotEqual() {
        val a1 = ubyteArrayOf(0x00u)
        val a2 = ubyteArrayOf()
        assertThrows<AssertionError> { assertArrayEquals(a1, a2) }
    }

    @Test
    fun testHexEquals() {
        val a1 = ubyteArrayOf(0x00u, 0x01u, 0x80u, 0xFFu)
        val a2 = byteArrayOf(0x00, 0x01, -0x80, -0x01).asUByteArray()
        assertHexEquals(a1, a2)
    }

    @Test
    fun testHexNotEquals() {
        val a1 = ubyteArrayOf(0x00u)
        val a2 = ubyteArrayOf()
        val assertion = assertThrows<AssertionFailedError> { assertHexEquals(a1, a2) }
        assertEquals(a1.toHexString(), assertion.expected.value)
        assertEquals(a2.toHexString(), assertion.actual.value)
    }

    @Test
    @DisabledOnOs(OS.WINDOWS)
    fun assertsThatAFileIsOpen() {
        val createTempFile = Files.createTempFile(null, null)
        createTempFile.toFile().deleteOnExit()
        val exception = assertThrows<AssertionError> {
            assertCloses {
                stream = Files.newInputStream(createTempFile)
            }
        }
        println(exception.message)
    }
}
