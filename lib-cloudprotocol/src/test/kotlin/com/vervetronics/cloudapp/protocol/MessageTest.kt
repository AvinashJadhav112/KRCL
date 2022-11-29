package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.Data
import com.vervetronics.cloudapp.protocol.error.ChecksumError
import com.vervetronics.cloudapp.protocol.error.WrongPreamble
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

@ExperimentalUnsignedTypes
class MessageTest {
    @Test
    fun verifiesPreamble() {
        val messageWithWrongPreamble = Message(
            preamble = 0xAA55AA54u,
            checksum = 0x0000u,
            deviceId = 0x0001u,
            sequenceNumber = 0x0001u,
            messageType = 0x0001u,
            dataLength = 0x0000u,
            data = Data(""),
        )
        assertThrows<WrongPreamble> {
            messageWithWrongPreamble.verify(0x0000u)
        }
    }

    @Test
    fun verifiesChecksum() {
        val messageWithWrongChecksum = Message(
            preamble = 0xAA55AA55u,
            checksum = 0x1234u,
            deviceId = 0x0001u,
            sequenceNumber = 0x0001u,
            messageType = 0x0001u,
            dataLength = 0x0000u,
            data = Data(""),
        )
        assertThrows<ChecksumError> {
            messageWithWrongChecksum.verify(0x5678u)
        }
    }

    @Test
    fun testToString() {
        val message = Message(
            preamble = 0xAA55AA55u,
            checksum = 0x1234u,
            deviceId = 0x0001u,
            sequenceNumber = 0x0002u,
            messageType = 0x0003u,
            dataLength = 0x0004u,
            data = Data("01020304")
        )
        val expected = "Message(" +
            "preamble = AA55AA55, " +
            "checksum = 1234, " +
            "deviceId = 0001, " +
            "sequenceNumber = 0002, " +
            "messageType = 0003, " +
            "dataLength = 0004, " +
            "data = 01020304" +
            ")"
        assertEquals(expected, message.toString())
    }
}
