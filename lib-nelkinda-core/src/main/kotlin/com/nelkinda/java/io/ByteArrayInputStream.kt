package com.nelkinda.java.io

import java.io.ByteArrayInputStream

@Suppress("FunctionName", "kotlin:S100")
@ExperimentalUnsignedTypes
fun ByteArrayInputStream(uByteArray: UByteArray) = ByteArrayInputStream(uByteArray.asByteArray())
