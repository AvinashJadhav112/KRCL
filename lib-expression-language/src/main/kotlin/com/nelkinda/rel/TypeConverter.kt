package com.nelkinda.rel

@ExperimentalUnsignedTypes
val TypeConverter = mapOf<String, (String) -> Any>(
    "Int" to { it.toInt() },
    "Boolean" to { it.toBoolean() },
    "Byte" to { it.toByte() },
    "UByte" to { it.toUByte() },
    "Short" to { it.toShort() },
    "UShort" to { it.toUShort() },
    "UInt" to { it.toUInt() },
    "Long" to { it.toLong() },
    "ULong" to { it.toULong() },
    "Float" to { it.toFloat() },
    "Double" to { it.toDouble() },
    "String" to { it },
    "ByteArray" to { it.toByteArray() },
    "UByteArray" to { it.toByteArray().toUByteArray() }
)

@ExperimentalUnsignedTypes
fun convertValue(type: String, value: String): Any =
    try {
        getValueConverter(type).invoke(value)
    } catch (e: NumberFormatException) {
        throw InvalidDataException("cannot convert $value into $type")
    }

@ExperimentalUnsignedTypes
fun getValueConverter(type: String) =
    TypeConverter.getOrElse(type) {
        throw UnsupportedDataTypeException(type)
    }
class InvalidDataException(typeName: String) : RuntimeException("Invalid data: $typeName")
