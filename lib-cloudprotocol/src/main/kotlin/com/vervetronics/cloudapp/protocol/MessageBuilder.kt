package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.nio.byteBufferOf
import com.nelkinda.java.nio.putByte
import com.nelkinda.java.nio.putUByte
import com.nelkinda.java.nio.putUInt
import com.nelkinda.java.nio.putUShort
import com.nelkinda.kotlin.Data

private const val CHECKSUM_OFFSET = 4

@ExperimentalUnsignedTypes
class MessageBuilder(
    var deviceId: UShort = 0x0000u,
    private var sequenceNumber: UShort = 0x0001u,
    private var messageType: UShort = 0x0000u,
) {
    private val byteArray = UByteArray(MAXIMUM_PACKET_SIZE)
    // Invariant: Except during marshalling, the position is always at the payload start.
    private val byteBuffer = byteBufferOf(byteArray).apply { position(HEADER_SIZE.toInt()) }

    fun build(): UByteArray {
        val dataLength = byteBuffer.position()
        byteBuffer.position(0)
        byteBuffer.putUInt(PREAMBLE)
        byteBuffer.putUShort(0x0000u)
        byteBuffer.putUShort(deviceId)
        byteBuffer.putUShort(sequenceNumber++)
        byteBuffer.putUShort(messageType)
        byteBuffer.putUShort((dataLength - HEADER_SIZE.toInt()).toUShort())
        val checksum = xorShift(byteArray, length = dataLength)
        byteBuffer.putUShort(CHECKSUM_OFFSET, checksum)
        byteBuffer.position(HEADER_SIZE.toInt())
        return byteArray.sliceArray(0 until dataLength)
    }

    fun withTag(tag: Tag, data: UByteArray): MessageBuilder {
        byteBuffer.putUByte(tag.tag)
        byteBuffer.putUByte(data.size.toUByte())
        byteBuffer.put(data.asByteArray())
        return this
    }

    fun withTag(tag: Tag, data: Data): MessageBuilder = withTag(tag, data.data)

    fun withTag(tag: Tag, data: Long): MessageBuilder {
        byteBuffer.putUByte(tag.tag)
        byteBuffer.putUByte(Long.SIZE_BYTES.toUByte())
        byteBuffer.putLong(data)
        return this
    }

    fun withTag(tag: Tag, data: Int): MessageBuilder {
        byteBuffer.putUByte(tag.tag)
        byteBuffer.putUByte(Int.SIZE_BYTES.toUByte())
        byteBuffer.putInt(data)
        return this
    }

    fun withTag(tag: Tag, data: Byte): MessageBuilder {
        byteBuffer.putUByte(tag.tag)
        byteBuffer.putUByte(Byte.SIZE_BYTES.toUByte())
        byteBuffer.putByte(data)
        return this
    }

    fun withMessageType(messageType: MessageType) = withMessageType(messageType.messageType)

    fun withMessageType(messageType: UShort): MessageBuilder {
        this.messageType = messageType
        return this
    }
}
