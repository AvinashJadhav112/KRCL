package com.vervetronics.cloudapp.poc.flatfile

import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.io.ByteArrayOutputStream
import java.io.PrintStream
import java.lang.Thread.sleep
import java.net.InetAddress
import java.net.Socket

@ExperimentalUnsignedTypes
class ServerTest {
    private val server = Server()

    @AfterEach
    fun stopServer() = server.close()

    @Test
    fun connect() {
        Socket(InetAddress.getLocalHost(), server.port).use { }
    }

    @Test
    fun closeNoException() {
        val originalStderr = System.err
        try {
            val interceptedStderr = ByteArrayOutputStream()
            System.setErr(PrintStream(interceptedStderr))
            server.close()
            sleep(1)
            assertEquals("", interceptedStderr.toString())
        } finally {
            System.setErr(originalStderr)
        }
    }

    @Test
    fun specifyPort() {
        val port = server.port
        server.close()
        sleep(10)
        Server(port).use {
            assertEquals(port, it.port)
        }
    }
}
