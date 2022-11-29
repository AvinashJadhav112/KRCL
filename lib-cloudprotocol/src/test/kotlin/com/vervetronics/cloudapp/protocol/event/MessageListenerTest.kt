package com.vervetronics.cloudapp.protocol.event

import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock

@ExperimentalUnsignedTypes
class MessageListenerTest {
    @Test
    fun defaultImplementationsArePresent() {
        val messageListener = object : MessageListener {}
        val messageEvent = mock<MessageEvent>()
        messageListener.messageReceived(messageEvent)
    }
}
