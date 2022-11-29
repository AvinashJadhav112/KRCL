package com.vervetronics.cloudapp.protocol.error

import java.lang.String.format

@ExperimentalUnsignedTypes
class ChecksumError(
    val stream: UShort,
    val calculated: UShort,
) : NonRecoverableProtocolError(
    Error.CHECKSUM_ERROR,
    format(
        "Checksum mismatch, stream: %04x, calculated: %04x",
        stream.toShort(),
        calculated.toShort(),
    )
)
