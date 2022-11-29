package com.nelkinda.kotlin

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.Arguments.arguments
import org.junit.jupiter.params.provider.MethodSource
import java.util.stream.Stream

class HexTest {
    @ParameterizedTest
    @MethodSource("conversions_lc")
    fun assertConvertsToHex(bits: Int, f: (Long) -> String) {
        val digits = bits / 4
        assertEquals("0x${"0" x digits}", f(0))
        assertEquals("0x${"f" x digits}", f(-1))
        assertEquals("0x8${"0" x (digits - 1)}", f(1L shl (bits - 1)))
        assertEquals("0x7${"f" x (digits - 1)}", f((1L shl (bits - 1)) - 1))
    }

    @ParameterizedTest
    @MethodSource("conversions_uc")
    fun assertConvertsToHeX(bits: Int, f: (Long) -> String) {
        val digits = bits / 4
        assertEquals("0x${"0" x digits}", f(0))
        assertEquals("0x${"F" x digits}", f(-1))
        assertEquals("0x8${"0" x (digits - 1)}", f(1L shl (bits - 1)))
        assertEquals("0x7${"F" x (digits - 1)}", f((1L shl (bits - 1)) - 1))
    }

    private infix fun String.x(n: Int) = repeat(n)

    @Suppress("unused")
    companion object {
        @JvmStatic
        fun conversions_lc(): Stream<Arguments> = Stream.of(
            /* ktlint-disable */
            arguments( 8, { x: Long -> x.toByte()  .hex() }),
            arguments( 8, { x: Long -> x.toUByte() .hex() }),
            arguments(16, { x: Long -> x.toShort() .hex() }),
            arguments(16, { x: Long -> x.toUShort().hex() }),
            arguments(32, { x: Long -> x.toInt() .  hex() }),
            arguments(32, { x: Long -> x.toUInt()  .hex() }),
            arguments(64, { x: Long -> x           .hex() }),
            arguments(64, { x: Long -> x.toULong() .hex() }),
            /* ktlint-enable */
        )

        @JvmStatic
        fun conversions_uc(): Stream<Arguments> = Stream.of(
            /* ktlint-disable */
            arguments( 8, { x: Long -> x.toByte()  .heX() }),
            arguments( 8, { x: Long -> x.toUByte() .heX() }),
            arguments(16, { x: Long -> x.toShort() .heX() }),
            arguments(16, { x: Long -> x.toUShort().heX() }),
            arguments(32, { x: Long -> x.toInt()   .heX() }),
            arguments(32, { x: Long -> x.toUInt()  .heX() }),
            arguments(64, { x: Long -> x           .heX() }),
            arguments(64, { x: Long -> x.toULong() .heX() }),
            /* ktlint-enable */
        )
    }
}
