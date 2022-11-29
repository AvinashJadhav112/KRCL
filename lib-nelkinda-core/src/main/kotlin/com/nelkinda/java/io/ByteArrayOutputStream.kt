package com.nelkinda.java.io

import java.io.ByteArrayOutputStream

@ExperimentalUnsignedTypes
fun ByteArrayOutputStream.toUByteArray(): UByteArray = toByteArray().asUByteArray()
