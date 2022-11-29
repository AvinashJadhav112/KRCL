package com.nelkinda.kotlin

import com.github.stefanbirkner.systemlambda.SystemLambda
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.nio.file.Files
import java.nio.file.NoSuchFileException
import java.nio.file.Path
import java.nio.file.attribute.PosixFilePermissions

abstract class ToolDetectionStrategyTest(
    private val envName: String,
    private val binaryName: String,
    private val dirName: String,
) {
    private val tmpFilesToDelete = mutableSetOf<Path>()

    @AfterEach
    fun deleteTempFiles() = tmpFilesToDelete.forEach(this::deleteFile)

    private fun deleteFile(file: Path) =
        Files.walk(file).sorted(Comparator.reverseOrder()).forEach(Files::deleteIfExists)

    private fun createFile(path: Path, attrs: String): Path =
        Files.createFile(path, PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString(attrs)))
    private fun mkTmp(): Path = Files.createTempDirectory(javaClass.name).also { tmpFilesToDelete.add(it) }
    private fun Path.mkDir(dir: String): Path = resolve(dir).also {
        Files.createDirectory(it)
    }
    private fun Path.touch(file: String, attrs: String): Path = createFile(resolve(file), attrs)

    abstract fun getHome(): String?

    @Test
    fun determineHomeFromEnv() {
        SystemLambda.restoreSystemProperties {
            val (homeEnv, toolHome) = createSimulatedHome()
            System.setProperty("user.home", mkTmp().toString())
            SystemLambda.withEnvironmentVariable(envName, homeEnv)
                .and("PATH", null)
                .and("SDKMAN_DIR", null)
                .execute {
                    assertEquals(toolHome, getHome())
                }
        }
    }

    @Test
    fun determineHomeFromSdkManEnv() {
        SystemLambda.restoreSystemProperties {
            val (sdkmanDirEnv, toolHome) = createSimulatedSdkMan()
            System.setProperty("user.home", mkTmp().toString())
            SystemLambda.withEnvironmentVariable(envName, null)
                .and("PATH", null)
                .and("SDKMAN_DIR", sdkmanDirEnv)
                .execute {
                    assertEquals(toolHome, getHome())
                }
        }
    }

    @Test
    fun determineHomeFromSdkManDir() {
        SystemLambda.restoreSystemProperties {
            val (sdkmanDirEnv, toolHome) = createSimulatedSdkMan()
            System.setProperty("user.home", Path.of(sdkmanDirEnv).parent.toAbsolutePath().toString())
            SystemLambda.withEnvironmentVariable(envName, null)
                .and("PATH", null)
                .and("SDKMAN_DIR", null)
                .execute {
                    assertEquals(toolHome, getHome())
                }
        }
    }

    @Test
    fun determineHomeFromPath() {
        SystemLambda.restoreSystemProperties {
            val (pathEnv, toolHome) = createSimulatedPath()
            System.setProperty("user.home", mkTmp().toString())
            SystemLambda.withEnvironmentVariable(envName, null)
                .and("PATH", pathEnv)
                .and("SDKMAN_DIR", null)
                .execute {
                    assertEquals(toolHome, getHome())
                }
        }
    }

    @Test
    fun indeterminableHome() {
        SystemLambda.restoreSystemProperties {
            System.setProperty("user.home", mkTmp().toString())
            SystemLambda.withEnvironmentVariable(envName, null)
                .and("PATH", null)
                .and("SDKMAN_DIR", null)
                .execute {
                    assertThrows<NoSuchFileException> {
                        getHome()
                    }
                }
        }
    }

    private fun createSimulatedHome(): Pair<String, String> {
        val toolHome = mkTmp()
        toolHome.mkDir("bin").touch(binaryName, "r-x------")

        return toolHome.toString() to toolHome.toString()
    }

    private fun createSimulatedSdkMan(): Pair<String, String> {
        val userHome = mkTmp()
        val sdkmanDir = userHome.mkDir(".sdkman")
        val toolHome = sdkmanDir.mkDir("candidates").mkDir(dirName).mkDir("current")
        toolHome.mkDir("bin").touch(binaryName, "r-x------")

        return sdkmanDir.toString() to toolHome.toString()
    }

    private fun createSimulatedPath(): Pair<String, String> {
        val toolHome = mkTmp()
        val bin = toolHome.mkDir("bin")
        bin.touch(binaryName, "r-x------")

        return bin.toString() to toolHome.toString()
    }
}
