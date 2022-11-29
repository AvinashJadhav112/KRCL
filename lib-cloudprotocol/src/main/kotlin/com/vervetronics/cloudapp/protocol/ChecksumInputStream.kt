package com.vervetronics.cloudapp.protocol

import com.vervetronics.cloudapp.protocol.error.ChecksumError
import java.io.FilterInputStream
import java.io.InputStream

@ExperimentalUnsignedTypes
class ChecksumInputStream(inputStream: InputStream) : FilterInputStream(inputStream) {
    var isReadingChecksum: Boolean = false
    var checksum: UShort = 0u

    override fun read(): Int {
        val byte = super.read()
        val byteForChecksum = if (isReadingChecksum) 0x00 else byte
        checksum = xorShift(ubyteArrayOf(byteForChecksum.toUByte()), initial = checksum)
        return byte
    }

    override fun read(b: ByteArray, off: Int, len: Int): Int {
        val actualLength = super.read(b, off, len)
        checksum = xorShift(b.asUByteArray(), off, actualLength, initial = checksum)
        return actualLength
    }

    fun verifyChecksum(checksumFromStream: UShort): UShort {
        if (!isChecksumCorrect(checksumFromStream))
            throw ChecksumError(checksumFromStream, checksum)
        return checksum
    }

    fun isChecksumCorrect(checksumFromStream: UShort) = checksum == checksumFromStream
}
