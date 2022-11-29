@file:SuppressWarnings("MatchingDeclarationName")
@file:JvmName("Files")

package com.nelkinda.java.nio.file

import java.io.IOException
import java.nio.file.FileVisitResult
import java.nio.file.FileVisitor
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.attribute.BasicFileAttributes

object DeleteFilesRecursivelyVisitor : FileVisitor<Path> {
    override fun preVisitDirectory(dir: Path, attrs: BasicFileAttributes): FileVisitResult {
        return FileVisitResult.CONTINUE
    }

    override fun visitFile(file: Path, attrs: BasicFileAttributes): FileVisitResult {
        Files.delete(file)
        return FileVisitResult.CONTINUE
    }

    override fun visitFileFailed(file: Path, exc: IOException): FileVisitResult {
        return FileVisitResult.CONTINUE
    }

    override fun postVisitDirectory(dir: Path, exc: IOException?): FileVisitResult {
        Files.delete(dir)
        return FileVisitResult.CONTINUE
    }
}

fun deleteRecursively(path: Path): Path =
    Files.walkFileTree(path, DeleteFilesRecursivelyVisitor)

fun deleteOnExitRecursively(path: Path): Path {
    Runtime.getRuntime().addShutdownHook(Thread { deleteRecursively(path) })
    return path
}
