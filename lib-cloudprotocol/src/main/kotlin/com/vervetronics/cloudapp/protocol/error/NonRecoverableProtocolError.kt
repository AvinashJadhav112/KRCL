package com.vervetronics.cloudapp.protocol.error

@ExperimentalUnsignedTypes
open class NonRecoverableProtocolError(val error: Error, message: String) : RuntimeException(message)
