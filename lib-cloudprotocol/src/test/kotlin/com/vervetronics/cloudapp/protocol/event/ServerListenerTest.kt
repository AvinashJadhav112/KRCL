package com.vervetronics.cloudapp.protocol.event

import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock

@ExperimentalUnsignedTypes
class ServerListenerTest {
    @Test
    fun defaultMethodsArePresent() {
        val serverListener = object : ServerListener {}
        val serverEvent = mock<ServerEvent>()
        serverListener.connectionReceived(serverEvent)
        serverListener.serverStarted(serverEvent)
        serverListener.serverStopped(serverEvent)
    }
}
