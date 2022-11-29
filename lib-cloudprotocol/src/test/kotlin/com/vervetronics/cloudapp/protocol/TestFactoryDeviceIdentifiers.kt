package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.ubyteArrayOf

@ExperimentalUnsignedTypes
object TestFactoryDeviceIdentifiers {
    private val base = ubyteArrayOf("55AA55AA55AA55AA55AA55AA55AA")
    private fun createFactoryId(subId: UShort): UByteArray = base + subId.toUByteArray()
    private fun UShort.toUByteArray(): UByteArray {
        return ubyteArrayOf((toInt() shr UByte.SIZE_BITS).toUByte(), toUByte())
    }
    val id1 = createFactoryId(0x0000U)
    val id2 = createFactoryId(0x0001U)
    val id3 = createFactoryId(0x0002U)
    val id4 = createFactoryId(0x0003U)
}
