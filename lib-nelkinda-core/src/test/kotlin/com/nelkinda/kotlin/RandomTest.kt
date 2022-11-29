package com.nelkinda.kotlin

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

@ExperimentalUnsignedTypes
class RandomTest {
    @Test
    fun nextUBytes() {
        val randomBytes: UByteArray = nextUBytes(10)
        assertEquals(10, randomBytes.size)
    }
}
