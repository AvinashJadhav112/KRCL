package com.nelkinda.org.junit.jupiter.api

import com.nelkinda.java.io.getOpenFileDescriptorCount
import com.nelkinda.kotlin.toHexString
import org.junit.jupiter.api.Assertions.assertArrayEquals
import org.junit.jupiter.api.Assertions.assertEquals

@ExperimentalUnsignedTypes
fun assertArrayEquals(expected: UByteArray, actual: UByteArray) {
    assertArrayEquals(expected.asByteArray(), actual.asByteArray())
}

@ExperimentalUnsignedTypes
fun assertHexEquals(expected: UByteArray, actual: UByteArray) {
    assertEquals(expected.toHexString(), actual.toHexString())
}

fun assertCloses(function: () -> Unit) {
    val openFilesBefore = getOpenFileDescriptorCount()
    function()
    val openFilesAfter = getOpenFileDescriptorCount()
    assertEquals(openFilesBefore, openFilesAfter, "mismatch in the number of open files")
}
