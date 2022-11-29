package com.nelkinda.rel

import com.nelkinda.java.nio.getByte
import com.nelkinda.java.nio.getU
import com.nelkinda.java.nio.getUInt
import com.nelkinda.java.nio.getULong
import com.nelkinda.java.nio.getUShort
import com.nelkinda.kotlin.Data
import java.nio.ByteBuffer

@ExperimentalUnsignedTypes
val Converters = mapOf<String, (Data) -> Any>(
    "Boolean" to { ByteBuffer.wrap(it.data.asByteArray()).short != 0.toShort() },
    "Byte" to { ByteBuffer.wrap(it.data.asByteArray()).getByte() },
    "UByte" to { ByteBuffer.wrap(it.data.asByteArray()).getU() },
    "Short" to { ByteBuffer.wrap(it.data.asByteArray()).short },
    "UShort" to { ByteBuffer.wrap(it.data.asByteArray()).getUShort() },
    "Int" to { ByteBuffer.wrap(it.data.asByteArray()).int },
    "UInt" to { ByteBuffer.wrap(it.data.asByteArray()).getUInt() },
    "Long" to { ByteBuffer.wrap(it.data.asByteArray()).long },
    "ULong" to { ByteBuffer.wrap(it.data.asByteArray()).getULong() },
    "Float" to { ByteBuffer.wrap(it.data.asByteArray()).float },
    "Double" to { ByteBuffer.wrap(it.data.asByteArray()).double },
    "String" to { String(it.data.asByteArray()) },
    "ByteArray" to { it.data.asByteArray() },
    "UByteArray" to { it.data },
)

@ExperimentalUnsignedTypes
fun convert(typeName: String, data: Data): Any =
    getConverter(typeName).invoke(data)

@ExperimentalUnsignedTypes
fun getConverter(
    typeName: String,
) = Converters.getOrElse(typeName) {
    throw UnsupportedDataTypeException(typeName)
}

class UnsupportedDataTypeException(val typeName: String) : RuntimeException("Unsupported data type: $typeName")
