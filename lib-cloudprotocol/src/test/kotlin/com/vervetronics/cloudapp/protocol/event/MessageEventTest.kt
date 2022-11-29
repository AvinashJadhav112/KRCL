package com.vervetronics.cloudapp.protocol.event

import com.vervetronics.cloudapp.protocol.Message
import org.junit.jupiter.api.Assertions.assertSame
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock

@ExperimentalUnsignedTypes
class MessageEventTest {
    @Test
    fun testMessage() {
        val message = mock<Message>()
        val messageEvent = MessageEvent(mock(), message)
        assertSame(message, messageEvent.message)
    }
}
