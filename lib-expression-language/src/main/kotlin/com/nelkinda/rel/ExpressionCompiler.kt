package com.nelkinda.rel

import kotlin.reflect.KClass

interface ExpressionCompiler {
    fun <In : Any, Out : Any> compile(expression: String, inClass: KClass<In>, outClass: KClass<Out>): Function<In, Out>

    @ExperimentalUnsignedTypes
    fun <In : Any, Out : Any> compile(
        expression: String,
        inClassName: String,
        outClassName: String,
    ): Function<In, Out> = compile(expression, getKClass(inClassName), getKClass(outClassName)) as Function<In, Out>
}

@ExperimentalUnsignedTypes
private val typeNameToKClass = mapOf(
    "Boolean" to Boolean::class,
    "Byte" to Byte::class,
    "UByte" to UByte::class,
    "Short" to Short::class,
    "UShort" to UShort::class,
    "Int" to Int::class,
    "UInt" to UInt::class,
    "Long" to Long::class,
    "ULong" to ULong::class,
    "Float" to Float::class,
    "Double" to Double::class,
    "String" to String::class,
    "ByteArray" to ByteArray::class,
    "UByteArray" to UByteArray::class,
).withDefault { Class.forName(it).kotlin }

@ExperimentalUnsignedTypes
internal fun getKClass(typeName: String) = typeNameToKClass.getValue(typeName)
