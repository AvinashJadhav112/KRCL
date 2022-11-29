package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.Data
import com.vervetronics.cloudapp.protocol.error.ChecksumError
import com.vervetronics.cloudapp.protocol.error.MandatoryTagMissing
import com.vervetronics.cloudapp.protocol.error.WrongPreamble

@ExperimentalUnsignedTypes
data class Message(
    val preamble: UInt,
    val checksum: UShort,
    val deviceId: UShort,
    val sequenceNumber: UShort,
    var messageType: UShort,
    val dataLength: UShort,
    val data: Data,
) {
    constructor(
        preamble: UInt,
        checksum: UShort,
        deviceId: UShort,
        sequenceNumber: UShort,
        messageType: UShort,
        dataLength: UShort,
        data: UByteArray,
    ) : this(
        preamble,
        checksum,
        deviceId,
        sequenceNumber,
        messageType,
        dataLength,
        Data(data),
    )
    internal val tags: Map<UByte, List<Data>>
        get() = TlvParser().parse(data)

    operator fun get(tag: UByte) = tags[tag] ?: throw MandatoryTagMissing(tag)
    operator fun get(tag: Tag) = this[tag.tag]

    fun verify(checksum: UShort) {
        if (preamble != PREAMBLE)
            throw WrongPreamble(preamble)
        if (checksum != this.checksum)
            throw ChecksumError(this.checksum, checksum)
    }

    fun parse(listener: (UByte, Data) -> Unit) {
        TlvParser(listener).parse(data)
    }

    private fun UInt.toHex() = "%08X".format(this.toInt())
    private fun UShort.toHex() = "%04X".format(this.toInt())

    override fun toString(): String = "Message(" +
        "preamble = ${preamble.toHex()}, " +
        "checksum = ${checksum.toHex()}, " +
        "deviceId = ${deviceId.toHex()}, " +
        "sequenceNumber = ${sequenceNumber.toHex()}, " +
        "messageType = ${messageType.toHex()}, " +
        "dataLength = ${dataLength.toHex()}, " + "" +
        "data = $data" +
        ")"
}
