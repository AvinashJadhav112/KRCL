package com.nelkinda.kotlin

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.fasterxml.jackson.databind.util.StdConverter
import java.util.Arrays.compare

/** A wrapper for UByteArray that supports JSON as hex string and [equals()]/[hashCode()] based on content equality.
 * @param data The data to wrap.
 */
@JsonSerialize(converter = DataToHexString::class)
@JsonDeserialize(converter = HexStringToData::class)
@ExperimentalUnsignedTypes
class Data(val data: UByteArray) : Comparable<Data> {
    constructor(data: String) : this(ubyteArrayOf(data))

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Data

        return data contentEquals other.data
    }

    override fun hashCode(): Int {
        return data.hashCode()
    }

    override fun toString(): String {
        return data.toHexString()
    }

    override fun compareTo(other: Data) = compare(data.asByteArray(), other.data.asByteArray())
}

@ExperimentalUnsignedTypes
class DataToHexString : StdConverter<Data, String>() {
    override fun convert(value: Data) = value.toString()
}

@ExperimentalUnsignedTypes
class HexStringToData : StdConverter<String, Data>() {
    override fun convert(value: String) = Data(value)
}
