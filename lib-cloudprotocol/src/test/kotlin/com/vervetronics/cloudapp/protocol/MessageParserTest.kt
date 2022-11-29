package com.vervetronics.cloudapp.protocol

import com.nelkinda.java.io.ByteArrayInputStream
import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.toHexString
import com.nelkinda.kotlin.ubyteArrayOf
import com.vervetronics.cloudapp.protocol.TestFactoryDeviceIdentifiers.id1
import com.vervetronics.cloudapp.protocol.error.ChecksumError
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

@ExperimentalUnsignedTypes
class MessageParserTest {
    @Test
    fun parseEmptyMessage() {
        val bytes = ubyteArrayOf("AA55AA5500000000000000000000").withChecksum()
        val expected = Message(
            preamble = 0xAA55AA55u,
            checksum = 0x1414u,
            deviceId = 0x0000u,
            sequenceNumber = 0x0000u,
            messageType = 0x0000u,
            dataLength = 0x0000u,
            data = UByteArray(0),
        )
        val (actual, checksum) = MessageParser(ByteArrayInputStream(bytes)).readNextMessage()
        actual.verify(checksum)
        assertEquals(expected, actual)
    }

    @Test
    fun parseWrongChecksum() {
        val bytes = ubyteArrayOf("AA55AA5512340000000000000000")
        val (message, checksum) = MessageParser(ByteArrayInputStream(bytes)).readNextMessage()
        val checksumError = assertThrows<ChecksumError> {
            message.verify(checksum)
        }
        assertEquals(0x1234u.toUShort(), checksumError.stream, "Stream checksum")
        assertEquals(0x1414u.toUShort(), checksumError.calculated, "Calculated checksum")
    }

    @Test
    fun getRawMessageData() {
        val bytes = ubyteArrayOf("AA55AA5500000000000000010019050200010101800210" + id1.toHexString()).withChecksum()
        val expected = Message(
            preamble = 0xAA55AA55u,
            checksum = 0x1404u,
            deviceId = 0x0000u,
            sequenceNumber = 0x0000u,
            messageType = 0x0001u,
            dataLength = 0x0019u,
            data = ubyteArrayOf("050200010101800210" + id1.toHexString()),
        )
        val (actual, checksum) = MessageParser(ByteArrayInputStream(bytes)).readNextMessage()
        actual.verify(checksum)
        assertEquals(expected, actual)
    }

    @Test
    fun getTags() {
        val message = Message(
            preamble = 0xAA55AA55u,
            checksum = 0x1234u,
            deviceId = 0x0000u,
            sequenceNumber = 0x0000u,
            messageType = 0x0001u,
            dataLength = 0x0019u,
            data = ubyteArrayOf("050200010101800210" + id1.toHexString()),
        )
        val actualTags = message.tags
        val expectedTags = mapOf(
            0x05u.toUByte() to listOf(Data("0001")),
            0x01u.toUByte() to listOf(Data("80")),
            0x02u.toUByte() to listOf(Data(id1))
        )
        assertEquals(expectedTags, actualTags)
    }
}
