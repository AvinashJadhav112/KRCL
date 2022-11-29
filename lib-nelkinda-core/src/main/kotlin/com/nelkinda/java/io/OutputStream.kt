package com.nelkinda.java.io

import java.io.OutputStream

@ExperimentalUnsignedTypes
fun OutputStream.write(uByteArray: UByteArray) = write(uByteArray.asByteArray())
