package com.vervetronics.cloudapp.protocol

import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneOffset.UTC
import java.time.ZonedDateTime

@ExperimentalUnsignedTypes
@SuppressWarnings("MagicNumber")
fun Instant.toBcd(): UByteArray {
    with(ZonedDateTime.ofInstant(this, UTC)) {
        val bcd = UByteArray(8)
        bcd[0] = (year / 100).toBcd()
        bcd[1] = year.toBcd()
        bcd[2] = monthValue.toBcd()
        bcd[3] = dayOfMonth.toBcd()
        bcd[4] = hour.toBcd()
        bcd[5] = minute.toBcd()
        bcd[6] = second.toBcd()
        bcd[7] = (nano / 10_000_000).toBcd()
        return bcd
    }
}

@ExperimentalUnsignedTypes
@SuppressWarnings("MagicNumber")
fun LocalTime.toBcd(): UByteArray {
    val bcd = UByteArray(4)
    bcd[0] = hour.toBcd()
    bcd[1] = minute.toBcd()
    bcd[2] = second.toBcd()
    bcd[3] = (nano / 10_000_000).toBcd()
    return bcd
}

@ExperimentalUnsignedTypes
@SuppressWarnings("MagicNumber")
fun LocalDate.toBcd(): UByteArray {
    val bcd = UByteArray(4)
    bcd[0] = (year / 100).toBcd()
    bcd[1] = year.toBcd()
    bcd[2] = monthValue.toBcd()
    bcd[3] = dayOfMonth.toBcd()
    return bcd
}

@ExperimentalUnsignedTypes
@SuppressWarnings("MagicNumber")
fun Int.toBcd(): UByte {
    return (this % 100 / 10 * 16 + this % 10).toUByte()
}

@ExperimentalUnsignedTypes
@SuppressWarnings("MagicNumber")
fun UInt.parseBcdTime(): LocalTime {
    val hour = ((toInt() shr 28) and 0xF) * 10 + ((toInt() shr 24) and 0xF)
    val minute = ((toInt() shr 20) and 0xF) * 10 + ((toInt() shr 16) and 0xF)
    val second = ((toInt() shr 12) and 0xF) * 10 + ((toInt() shr 8) and 0xF)
    val nanoOfSecond = ((toInt() shr 4) and 0xF) * 100_000_000 + ((toInt() shr 0) and 0xF) * 10_000_000
    return LocalTime.of(hour, minute, second, nanoOfSecond)
}

@ExperimentalUnsignedTypes
@SuppressWarnings("MagicNumber")
fun UByteArray.parseBcdTime(): LocalTime {
    val hour = this[0].bcd
    val minute = this[1].bcd
    val second = this[2].bcd
    val nanoOfSecond = this[3].bcd * 10_000_000
    return LocalTime.of(hour, minute, second, nanoOfSecond)
}

@ExperimentalUnsignedTypes
@SuppressWarnings("MagicNumber")
fun UByteArray.parseBcdDate(): LocalDate {
    val year = this[0].bcd * 100 + this[1].bcd
    val month = this[2].bcd
    val day = this[3].bcd
    return LocalDate.of(year, month, day)
}

@ExperimentalUnsignedTypes
@get:SuppressWarnings("MagicNumber")
val UByte.bcd
    get() = (toInt() shr 4 and 0xF) * 10 + (toInt() and 0xF)
