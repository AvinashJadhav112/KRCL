package com.nelkinda.java.io

import java.io.InputStream

@ExperimentalUnsignedTypes
fun InputStream.readAllUBytes() = readAllBytes().asUByteArray()

@ExperimentalUnsignedTypes
fun InputStream.readNUBytes(len: Int) = readNBytes(len).asUByteArray()
