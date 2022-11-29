package com.vervetronics.cloudapp.protocol

@ExperimentalUnsignedTypes
fun xorShift(bytes: UByteArray, offset: Int = 0, length: Int = bytes.size, initial: UShort = 0u): UShort {
    var checksum: Int = initial.toInt()
    for (i in offset until offset + length) {
        @SuppressWarnings("MagicNumber")
        checksum = (checksum shl 1) or (((checksum and 0x8000) shr 15) and 0x7FFF)
        checksum = checksum xor bytes[i].toInt()
    }
    return checksum.toUShort()
}
