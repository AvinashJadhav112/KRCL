package com.vervetronics.cloudapp.protocol.error

@ExperimentalUnsignedTypes
enum class Error(code: UShort, message: String) {
    CHECKSUM_ERROR(0x0001u, "Checksum Error"),
    WRONG_PREAMBLE(0x0002u, "Wrong Preamble"),
    UNSUPPORTED_MESSAGE_TYPE(0x0003u, "Unsupported Message Type"),
    MANDATORY_TAG_MISSING(0x0005u, "Mandatory Tag Missing"),
    HANDSHAKE_MISSING(0x0006u, "Handshake Missing"),
    INCONSISTENT_SENSOR_VALUE_LENGTH(0x009u, "Inconsistent sensor value length"),
    FUTURE_DATE_OR_TIME(0x000Au, "Future Date or Time"),
    ZERO_SENSOR_VALUE_LENGTH(0x000Bu, "Zero sensor value length"),
    ;

    private val binary = ubyteArrayOf(
        (code.toInt() shr UByte.SIZE_BITS).toUByte(), code.toUByte()
    ) + message.toByteArray().asUByteArray()

    fun toUByteArray() = binary
}
