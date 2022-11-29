package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.Data
import com.nelkinda.kotlin.ubyteArrayOf

@ExperimentalUnsignedTypes
class TlvBuilder {
    private var data: Data = Data("")
    fun withTag(tag: UByte, value: UByte): TlvBuilder {
        data = Data(data.data + ubyteArrayOf(tag, 0x01u, value))
        return this
    }

    fun withTag(tag: UByte, value: Byte): TlvBuilder {
        data = Data(data.data + ubyteArrayOf(tag, 0x01u, value.toUByte()))
        return this
    }

    fun withTag(tag: UByte, value: String): TlvBuilder {
        return withTag(tag, ubyteArrayOf(value))
    }

    fun withTag(tag: UByte, value: UByteArray): TlvBuilder {
        data = Data(data.data + ubyteArrayOf(tag, value.size.toUByte()) + value)
        return this
    }

    fun build(): Data {
        return data
    }
}
