package com.nelkinda.org.junit.jupiter.api

import org.junit.jupiter.api.Assertions.assertArrayEquals

@ExperimentalUnsignedTypes
fun assertArrayEquals(expected: UByteArray, actual: UByteArray) {
    assertArrayEquals(expected.asByteArray(), actual.asByteArray())
}
