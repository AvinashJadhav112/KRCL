package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.Data

@ExperimentalUnsignedTypes
class TlvParser(
    private val listener: (UByte, Data) -> Unit = { _, _ -> },
) {
    fun parse(data: Data): Map<UByte, List<Data>> {
        val tags = mutableMapOf<UByte, MutableList<Data>>()
        val bin = data.data
        var i = 0
        while (i < bin.size) {
            val tag = bin[i++]
            val length = bin[i++].toInt()
            val tagData = Data(bin.sliceArray(i until i + length))
            tags
                .getOrPut(tag) { mutableListOf() }
                .add(tagData)
            i += length
            listener(tag, tagData)
        }
        return tags.toMap()
    }
}
