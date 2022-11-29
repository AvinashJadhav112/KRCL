package com.nelkinda.java.io

import java.io.DataInputStream

@ExperimentalUnsignedTypes
fun DataInputStream.readFully(uByteArray: UByteArray) = readFully(uByteArray.asByteArray())

@ExperimentalUnsignedTypes
fun DataInputStream.readUByte() = readByte().toUByte()

@ExperimentalUnsignedTypes
fun DataInputStream.readUShort() = readShort().toUShort()

@ExperimentalUnsignedTypes
fun DataInputStream.readUInt() = readInt().toUInt()

@ExperimentalUnsignedTypes
fun DataInputStream.readULong() = readLong().toULong()
