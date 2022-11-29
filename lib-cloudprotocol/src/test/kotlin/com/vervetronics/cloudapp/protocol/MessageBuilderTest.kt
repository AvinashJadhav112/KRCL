package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.toHexString
import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertHexEquals
import com.vervetronics.cloudapp.protocol.TestFactoryDeviceIdentifiers.id1
import org.junit.jupiter.api.Test

@ExperimentalUnsignedTypes
class MessageBuilderTest {
    @Test
    fun buildEmptyMessage() {
        val actual = MessageBuilder(
            deviceId = 0x0000u,
            sequenceNumber = 0x0000u,
        )
            .build()
        val expected = ubyteArrayOf("AA55AA5500000000000000000000").withChecksum()
        assertHexEquals(expected, actual)
    }

    @Test
    fun incrementsSequenceNumber() {
        val messageBuilder = MessageBuilder(deviceId = 0x1234u)
        messageBuilder.build()
        val actual = messageBuilder.build()
        val expected = ubyteArrayOf("AA55AA5500001234000200000000").withChecksum()
        assertHexEquals(expected, actual)
    }

    @Test
    fun buildEmptyHandshakeMessage() {
        val actual = MessageBuilder(
            deviceId = 0x0000u,
            messageType = 0x0001u,
        )
            .build()
        val expected = ubyteArrayOf("AA55AA5500000000000100010000").withChecksum()
        assertHexEquals(expected, actual)
    }

    @SuppressWarnings("MaxLineLength")

    @Test
    fun buildHandshakeMessage() {
        val actual = MessageBuilder(
            deviceId = 0x0000u,
            messageType = 0x0001u,
        )
            .withTag(Tag.GSM_SIGNAL_STRENGTH, ubyteArrayOf("80"))
            .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, id1)
            .build()
        val expected = ubyteArrayOf("AA55AA55" + "0000" + "0000" + "0001" + "0001" + "0015" + "01" + "01" + "80" + "0210" + id1.toHexString()).withChecksum()
        assertHexEquals(expected, actual)
    }

    @SuppressWarnings("MaxLineLength")

    @Test
    fun buildHandshakeMessageWithTagTypeLong() {
        val actual = MessageBuilder(
            deviceId = 0x0000u,
            messageType = 0x0001u,
        )
            .withTag(Tag.GSM_SIGNAL_STRENGTH, 0x80)
            .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, id1)
            .build()
        val expected = ubyteArrayOf("AA55AA55" + "0000" + "0000" + "0001" + "0001" + "0018" + "01" + "04" + "00000080" + "0210" + id1.toHexString()).withChecksum()
        assertHexEquals(expected, actual)
    }

    @SuppressWarnings("MaxLineLength")
    @Test
    fun buildHandshakeMessageWithTagTypeInt() {
        val actual = MessageBuilder(
            deviceId = 0x0000u,
            messageType = 0x0001u,
        )
            .withTag(Tag.GSM_SIGNAL_STRENGTH, (0x80).toInt())
            .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, id1)
            .build()
        val expected = ubyteArrayOf("AA55AA55" + "0000" + "0000" + "0001" + "0001" + "0018" + "01" + "04" + "00000080" + "0210" + id1.toHexString()).withChecksum()
        assertHexEquals(expected, actual)
    }

    @SuppressWarnings("MaxLineLength")
    @Test
    fun buildHandshakeMessageWithTagTypeByte() {
        val actual = MessageBuilder(
            deviceId = 0x0000u,
            messageType = 0x0001u,
        )
            .withTag(Tag.GSM_SIGNAL_STRENGTH, (0x80).toByte())
            .withTag(Tag.FACTORY_DEVICE_IDENTIFIER, id1)
            .build()
        val expected = ubyteArrayOf("AA55AA55" + "0000" + "0000" + "0001" + "0001" + "0015" + "01" + "01" + "80" + "0210" + id1.toHexString()).withChecksum()
        assertHexEquals(expected, actual)
    }
}
