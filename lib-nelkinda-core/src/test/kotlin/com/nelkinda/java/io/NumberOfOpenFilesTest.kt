package com.nelkinda.java.io

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.condition.DisabledOnOs
import org.junit.jupiter.api.condition.OS
import java.nio.file.Files

class NumberOfOpenFilesTest {
    @Test
    @DisabledOnOs(OS.WINDOWS)
    fun countsNumberOfOpenFiles() {
        val openFilesBefore = getOpenFileDescriptorCount()
        val tmpFile = Files.createTempFile(null, null)
        val inputStream = Files.newInputStream(tmpFile)
        val openFilesInBetween = getOpenFileDescriptorCount()
        inputStream.close()
        val openFilesAfter = getOpenFileDescriptorCount()
        assertEquals(openFilesBefore, openFilesAfter)
        assertEquals(openFilesBefore, openFilesInBetween - 1)
    }
}
