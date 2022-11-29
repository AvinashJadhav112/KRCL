package com.vervetronics.cloudapp.protocol.error

@ExperimentalUnsignedTypes
class UnsupportedMessageType(messageType: UShort) :
    NonRecoverableProtocolError(
        Error.UNSUPPORTED_MESSAGE_TYPE,
        "Unsupported message type 0x%04X".format(messageType.toInt())
    )
