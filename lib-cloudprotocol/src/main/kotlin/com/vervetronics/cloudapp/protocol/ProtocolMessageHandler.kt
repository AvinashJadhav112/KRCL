package com.vervetronics.cloudapp.protocol

@ExperimentalUnsignedTypes
interface ProtocolMessageHandler {
    fun handle(message: Message): UByteArray
}
