package com.vervetronics.cloudapp.protocol

@ExperimentalUnsignedTypes
enum class MessageType(
    val messageType: UShort
) {
    HANDSHAKE_REQUEST(0x0001u),
    HANDSHAKE_RESPONSE(0x0002u),
    CONFIG_REQUEST(0x0003u),
    CONFIG_RESPONSE(0x0004u),
    DEVICE_INFO_REQUEST(0x0005u),
    DEVICE_INFO_RESPONSE(0x0006u),
    MONITOR_DATA(0x0007u),
    MONITOR_DATA_RESPONSE(0x0008u),
    FIRMWARE_DOWNLOAD_REQUEST(0x0009u),
    FIRMWARE_DOWNLOAD_RESPONSE(0x000Au),
    RECOVERABLE_ERROR(0x7FFEu),
    NON_RECOVERABLE_ERROR(0x7FFFu),
    ;

    fun toUShort(): UShort = messageType
}
