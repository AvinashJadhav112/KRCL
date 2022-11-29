package com.vervetronics.cloudapp.protocol

import com.nelkinda.org.junit.jupiter.api.assertHexEquals
import org.junit.jupiter.api.Test
import java.io.ByteArrayOutputStream

@ExperimentalUnsignedTypes
class CloudAppPeerTest {
    private val interceptedOutput = ByteArrayOutputStream()
    private val cloudAppPeer = CloudAppPeer(interceptedOutput)

    @Test
    fun testSendsGenericHeader() {
        cloudAppPeer.sendGenericHeader()
        val actual = interceptedOutput.toByteArray().asUByteArray()
        val expectedGenericHeader = MessageBuilder()
            .withMessageType(0x0000u)
            .build()
        assertHexEquals(expectedGenericHeader, actual)
    }
}
