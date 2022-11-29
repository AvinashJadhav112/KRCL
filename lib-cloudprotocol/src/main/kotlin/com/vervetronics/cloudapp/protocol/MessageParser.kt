package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.io.readNUBytes
import com.nelkinda.java.io.readUInt
import com.nelkinda.java.io.readUShort
import java.io.DataInputStream
import java.io.InputStream

@ExperimentalUnsignedTypes
class MessageParser(input: InputStream) {
    private val checksumInputStream = ChecksumInputStream(input)
    private val input = DataInputStream(checksumInputStream)

    fun readNextMessage(): Pair<Message, UShort> {
        checksumInputStream.checksum = 0u
        val preamble = input.readUInt()
        checksumInputStream.isReadingChecksum = true
        val checksum = input.readUShort()
        checksumInputStream.isReadingChecksum = false
        val deviceId = input.readUShort()
        val sequenceNumber = input.readUShort()
        val messageType = input.readUShort()
        val dataLength = input.readUShort()
        val data = input.readNUBytes(dataLength.toInt())
        return Message(
            preamble,
            checksum,
            deviceId,
            sequenceNumber,
            messageType,
            dataLength,
            data
        ) to checksumInputStream.checksum
    }
}
