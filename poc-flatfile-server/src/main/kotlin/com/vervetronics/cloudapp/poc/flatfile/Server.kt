package com.vervetronics.cloudapp.poc.flatfile

import java.net.ServerSocket
import java.net.Socket
import java.net.SocketException
import kotlin.concurrent.thread

@ExperimentalUnsignedTypes
class Server(port: Int = 0) : AutoCloseable {
    private val serverSocket: ServerSocket = ServerSocket(port)
    val port: Int
        get() = serverSocket.localPort

    init {
        thread {
            acceptConnections()
        }
    }

    private fun acceptConnections() {
        while (true) {
            acceptConnection()
        }
    }

    private fun acceptConnection() {
        val client: Socket
        try {
            client = serverSocket.accept()
        } catch (ignore: SocketException) {
            return
        }
        thread {
            Handler(client).run()
        }
    }

    override fun close() {
        serverSocket.close()
    }
}
