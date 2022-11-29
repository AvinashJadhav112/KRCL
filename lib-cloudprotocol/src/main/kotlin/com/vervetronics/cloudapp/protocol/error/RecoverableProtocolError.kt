package com.vervetronics.cloudapp.protocol.error

@ExperimentalUnsignedTypes
open class RecoverableProtocolError(val error: Error, message: String) : RuntimeException(message)
