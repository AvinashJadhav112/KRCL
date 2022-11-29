package com.vervetronics.cloudapp.storage

import com.nelkinda.kotlin.ubyteArrayOf

@ExperimentalUnsignedTypes
object TestFactoryDeviceIdentifierFactory {
    private fun createFactoryId(subId: UShort): UByteArray = base + subId.toUByteArray()
    private fun UShort.toUByteArray(): UByteArray {
        return ubyteArrayOf((toInt() shr UByte.SIZE_BITS).toUByte(), toUByte())
    }
    private val base = ubyteArrayOf("55AA55AA55AA55AA55AA55AA55AA")
    val id1 = createFactoryId(0x0000U)
    val id2 = createFactoryId(0x0001U)
}
