package com.vervetronics.cloudapp.protocol.handlers

import com.vervetronics.cloudapp.protocol.Message
import com.vervetronics.cloudapp.protocol.ProtocolMessageHandler
import com.vervetronics.cloudapp.protocol.error.UnsupportedMessageType

@ExperimentalUnsignedTypes
class UnsupportedMessageTypeHandler : ProtocolMessageHandler {
    override fun handle(message: Message): UByteArray {
        throw UnsupportedMessageType(message.messageType)
    }
}
