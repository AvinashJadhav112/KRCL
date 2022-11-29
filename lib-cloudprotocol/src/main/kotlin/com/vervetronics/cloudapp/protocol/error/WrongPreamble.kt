package com.vervetronics.cloudapp.protocol.error

@ExperimentalUnsignedTypes
class WrongPreamble(
    wrongPreamble: UInt
) :
    NonRecoverableProtocolError(Error.WRONG_PREAMBLE, "Wrong preamble: 0x%4x".format(wrongPreamble.toInt()))
