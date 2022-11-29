package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.ubyteArrayOf
import com.nelkinda.org.junit.jupiter.api.assertHexEquals
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.Month

@ExperimentalUnsignedTypes
class BcdTest {

    @Test
    fun testToBcdDigit() {
        assertEquals(0x00u.toUByte(), 0.toBcd())
        assertEquals(0x42u.toUByte(), 42.toBcd())
        assertEquals(0x99u.toUByte(), 99.toBcd())
        assertEquals(0x00u.toUByte(), 100.toBcd())
    }

    @Test
    fun testBcdProperty() {
        assertEquals(0, 0x00u.toUByte().bcd)
        assertEquals(1, 0x01u.toUByte().bcd)
        assertEquals(10, 0x10u.toUByte().bcd)
        assertEquals(90, 0x90u.toUByte().bcd)
        assertEquals(9, 0x09u.toUByte().bcd)
        assertEquals(99, 0x99u.toUByte().bcd)
    }

    @Test
    fun instantToBcd() {
        val instant = Instant.ofEpochMilli(0x00000175D4873B2A)
        val expectedBcd = ubyteArrayOf("2020111704471370")
        val actualBcd = instant.toBcd()
        assertHexEquals(expectedBcd, actualBcd)
    }

    @Test
    fun localTimeToBcd() {
        val localTime = LocalTime.parse("20:13:45.12")
        val expectedBcd = ubyteArrayOf("20134512")
        val actualBcd = localTime.toBcd()
        assertHexEquals(expectedBcd, actualBcd)
    }

    @Test
    fun localDateToBcd() {
        val localDate = LocalDate.parse("2020-12-31")
        val expectedBcd = ubyteArrayOf("20201231")
        val actualBcd = localDate.toBcd()
        assertHexEquals(expectedBcd, actualBcd)
    }

    @Test
    fun bcdTimeInt() {
        val timeAsBcd = 0x13452583u
        val expectedTime = LocalTime.of(13, 45, 25, 830000000)
        val actualTime = timeAsBcd.parseBcdTime()
        assertEquals(expectedTime, actualTime)
    }

    @Test
    fun bcdTimeArray() {
        val timeAsBcd = ubyteArrayOf("13452583")
        val expectedTime = LocalTime.of(13, 45, 25, 830000000)
        val actualTime = timeAsBcd.parseBcdTime()
        assertEquals(expectedTime, actualTime)
    }

    @Test
    fun bcdDateArray() {
        val dateAsBcd = ubyteArrayOf("20210203")
        val expectedDate = LocalDate.of(2021, Month.FEBRUARY, 3)
        val actualDate = dateAsBcd.parseBcdDate()
        assertEquals(expectedDate, actualDate)
    }
}
