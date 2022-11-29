package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.io.write
import java.io.OutputStream

@ExperimentalUnsignedTypes
internal const val PREAMBLE = 0xAA55AA55u
@ExperimentalUnsignedTypes
internal const val HEADER_SIZE: UShort = 14u

internal const val MAXIMUM_PACKET_SIZE = 256

@ExperimentalUnsignedTypes
open class CloudAppPeer constructor(
    private val outputStream: OutputStream,
) {
    protected val messageBuilder = MessageBuilder(deviceId = 0x0000u)

    fun sendGenericHeader() {
        send()
    }

    fun send() {
        outputStream.write(messageBuilder.build())
        outputStream.flush()
    }
}
