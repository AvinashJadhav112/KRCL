package com.nelkinda.java.nio.file

import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Test
import java.nio.file.Files.createDirectory
import java.nio.file.Files.createFile
import java.nio.file.Files.createTempDirectory
import java.nio.file.Files.exists

class FilesTest {
    @Test
    fun deletesFilesRecursively() {
        val tmpDir = createTempDirectory("FilesTest")
        val dir = tmpDir.resolve("dir")
        createDirectory(dir)
        val file = dir.resolve("file")
        createFile(file)
        deleteRecursively(tmpDir)
        assertFalse(exists(tmpDir))
    }
}
