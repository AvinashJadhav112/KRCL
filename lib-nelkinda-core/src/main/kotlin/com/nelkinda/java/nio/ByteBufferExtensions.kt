@file:Suppress("UsePropertyAccessSyntax", "TooManyFunctions")

package com.nelkinda.java.nio

import java.nio.ByteBuffer

@ExperimentalUnsignedTypes
fun byteBufferOf(uByteArray: UByteArray): ByteBuffer = byteBufferOf(uByteArray.asByteArray())

fun byteBufferOf(byteArray: ByteArray): ByteBuffer = ByteBuffer.wrap(byteArray)

@ExperimentalUnsignedTypes
fun ByteBuffer.getU() = get().toUByte()
@ExperimentalUnsignedTypes
fun ByteBuffer.putU(b: UByte): ByteBuffer = put(b.toByte())

@ExperimentalUnsignedTypes
fun ByteBuffer.getU(index: Int) = get(index).toUByte()
@ExperimentalUnsignedTypes
fun ByteBuffer.putU(index: Int, b: UByte): ByteBuffer = put(index, b.toByte())

fun ByteBuffer.getByte() = get()
fun ByteBuffer.getByte(index: Int) = get(index)
fun ByteBuffer.putByte(b: Byte): ByteBuffer = put(b)
fun ByteBuffer.putByte(index: Int, b: Byte): ByteBuffer = put(index, b)

@ExperimentalUnsignedTypes
fun ByteBuffer.getUByte() = get().toUByte()
@ExperimentalUnsignedTypes
fun ByteBuffer.getUByte(index: Int) = get(index).toUByte()
@ExperimentalUnsignedTypes
fun ByteBuffer.putUByte(b: UByte): ByteBuffer = put(b.toByte())
@ExperimentalUnsignedTypes
fun ByteBuffer.putUByte(index: Int, b: UByte): ByteBuffer = put(index, b.toByte())

@ExperimentalUnsignedTypes
fun ByteBuffer.getUShort() = getShort().toUShort()
@ExperimentalUnsignedTypes
fun ByteBuffer.getUShort(index: Int) = getShort(index).toUShort()
@ExperimentalUnsignedTypes
fun ByteBuffer.putUShort(value: UShort): ByteBuffer = putShort(value.toShort())
@ExperimentalUnsignedTypes
fun ByteBuffer.putUShort(index: Int, value: UShort): ByteBuffer = putShort(index, value.toShort())

@ExperimentalUnsignedTypes
fun ByteBuffer.getUInt() = getInt().toUInt()
@ExperimentalUnsignedTypes
fun ByteBuffer.getUInt(index: Int) = getInt(index).toUInt()
@ExperimentalUnsignedTypes
fun ByteBuffer.putUInt(value: UInt): ByteBuffer = putInt(value.toInt())
@ExperimentalUnsignedTypes
fun ByteBuffer.putUInt(index: Int, value: UInt): ByteBuffer = putInt(index, value.toInt())

@ExperimentalUnsignedTypes
fun ByteBuffer.getULong() = getLong().toULong()
@ExperimentalUnsignedTypes
fun ByteBuffer.getULong(index: Int) = getLong(index).toULong()
@ExperimentalUnsignedTypes
fun ByteBuffer.putULong(value: ULong): ByteBuffer = putLong(value.toLong())
@ExperimentalUnsignedTypes
fun ByteBuffer.putULong(index: Int, value: ULong): ByteBuffer = putLong(index, value.toLong())
