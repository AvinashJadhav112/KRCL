package com.nelkinda.javax.swing

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.OutputStream

class LogViewTest {
    @Test
    fun logViewOutputStream() {
        val logView = LogView()
        val out: OutputStream = logView.outputStream
        out.write("Hello, world!".toByteArray())
        assertEquals(logView.text, "Hello, world!")
    }
}
