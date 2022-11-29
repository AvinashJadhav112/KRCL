package com.nelkinda.kotlin

import kotlin.random.Random.Default.nextBytes

@ExperimentalUnsignedTypes
fun nextUBytes(size: Int): UByteArray = nextBytes(UByteArray(size).asByteArray()).asUByteArray()
