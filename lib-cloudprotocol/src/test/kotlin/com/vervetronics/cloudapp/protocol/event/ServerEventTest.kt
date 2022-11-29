package com.vervetronics.cloudapp.protocol.event

import com.nelkinda.java.io.write
import com.nelkinda.kotlin.ubyteArrayOf
import com.vervetronics.cloudapp.protocol.CloudAppServer
import com.vervetronics.cloudapp.protocol.MessageBuilder
import com.vervetronics.cloudapp.protocol.MessageType
import com.vervetronics.cloudapp.protocol.Tag
import com.vervetronics.cloudapp.protocol.TestFactoryDeviceIdentifiers
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.times
import org.mockito.Mockito.verify
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.timeout
import java.net.InetAddress
import java.net.Socket
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset

@ExperimentalUnsignedTypes
class ServerEventTest {
    private val clock = Clock.fixed(Instant.now(), ZoneOffset.UTC)
    private val server = CloudAppServer(clock = clock, sensorReadingRepository = mock(), firmwareProvider = mock())

    @BeforeEach
    fun startServer() {
        server.start()
    }

    @AfterEach
    fun stopServer() {
        server.stop()
    }

    @Test
    fun startEvent() {
        val serverListener = mock<ServerListener>()
        server.stop()
        server.addServerListener(serverListener)
        server.start()
        verify(serverListener, timeout(500).times(1)).serverStarted(any())
        server.start()
        verify(serverListener, times(1)).serverStarted(any())
    }

    @Test
    fun stopEvent() {
        val serverListener = mock<ServerListener>()
        server.addServerListener(serverListener)
        server.stop()
        verify(serverListener, timeout(500).times(1)).serverStopped(any())
        server.stop()
        verify(serverListener, times(1)).serverStopped(any())
    }

    @Test
    fun receiveConnectionEvent() {
        val serverListener = mock<ServerListener>()
        server.addServerListener(serverListener)
        Socket(InetAddress.getLocalHost(), server.port).use {}
        verify(serverListener, timeout(500).times(1)).connectionReceived(any())
    }

    @Test
    fun receiveMessageEvent() {
        val messageListener = mock<MessageListener>()
        server.addMessageListener(messageListener)
        Socket(InetAddress.getLocalHost(), server.port).use {
            val message = MessageBuilder()
                .withMessageType(MessageType.HANDSHAKE_REQUEST)
                .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, TestFactoryDeviceIdentifiers.id1)
                .withTag(Tag.GSM_SIGNAL_STRENGTH, ubyteArrayOf("80"))
                .build()
            it.outputStream.write(message)
            it.outputStream.flush()
            verify(messageListener, timeout(500).times(1)).messageReceived(any())
        }
    }
}
