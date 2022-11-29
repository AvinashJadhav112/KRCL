package com.nelkinda.kotlin

import java.nio.file.Files.isExecutable
import java.nio.file.Files.isRegularFile
import java.nio.file.NoSuchFileException
import java.nio.file.Path
import kotlin.io.path.absolutePathString

open class ToolDetectionStrategy(
    val name: String,
    private val binaryName: String,
    private val homeEnv: String? = null,
    private val sdkmanPackageName: String? = null,
) {
    val strategies = buildStrategies()

    private fun buildStrategies(): List<() -> String?> {
        val list = mutableListOf<() -> String?>()
        if (homeEnv != null) list.add(::fromEnv)
        if (sdkmanPackageName != null) list.add(this::fromSdkman)
        if (sdkmanPackageName != null) list.add(::fromRootSdkman)
        list.add(::fromPath)
        return list.toList()
    }

    fun getHome(): String =
        strategies
            .map { it.invoke() }
            .firstOrNull { it != null }
            ?: throw NoSuchFileException("Could not detect $name")

    private fun fromEnv(): String? {
        val home = System.getenv(homeEnv)
        if (home != null) {
            val binary = Path.of(home).resolve("bin").resolve(binaryName)
            if (isExecutableFile(binary)) return home
        }
        return null
    }

    private fun fromSdkman() =
        fromSdkman(System.getenv("SDKMAN_DIR") ?: "${System.getProperty("user.home")}/.sdkman")

    private fun fromPath(): String? {
        val path = System.getenv("PATH")
        if (path != null) {
            val pathEntries = path.split(System.getProperty("path.separator"))
            for (pathEntry in pathEntries) {
                val binDir = Path.of(pathEntry)
                val candidate = binDir.resolve(binaryName)
                if (isExecutableFile(candidate))
                    return binDir.parent.toString()
            }
        }
        return null
    }

    private fun fromRootSdkman() =
        fromSdkman("/usr/local/sdkman")

    private fun fromSdkman(sdkmanDir: String): String? {
        val currentDir = Path.of(sdkmanDir).resolve("candidates/$sdkmanPackageName/current")
        val binary = currentDir.resolve("bin").resolve(binaryName)
        return if (isExecutableFile(binary)) currentDir.absolutePathString() else null
    }

    private fun isExecutableFile(path: Path) = isRegularFile(path) && isExecutable(path)

    fun getVersion(): String {
        val binary = Path.of(getHome()).resolve("bin").resolve(binaryName).toString()
        val proc = ProcessBuilder().command(binary, "-version").redirectErrorStream(true).start()
        val output = String(proc.inputStream.readAllBytes())
        proc.waitFor()
        return output
    }
}
