package com.nelkinda.rel

import com.nelkinda.kotlin.getJavaHome
import com.nelkinda.kotlin.getKotlinHome
import java.io.File
import java.nio.file.Path
import kotlin.reflect.KClass

class KotlinExpressionCompiler(
    outputDirectory: File,
) : ExpressionCompilerImpl(
    outputDirectory,
    ".kt",
) {

    override fun <In : Any, Out : Any> generateExpressionSourceCode(
        expression: String,
        className: String,
        inClass: KClass<In>,
        outClass: KClass<Out>,
    ): String {
        return """
            import com.nelkinda.rel.Function

            class $className : Function<${inClass.simpleName}, ${outClass.simpleName}> {
                override fun apply(value: ${inClass.simpleName}): ${outClass.simpleName} =
                    $expression
            }
        """.trimIndent()
    }

    @SuppressWarnings("MaxLineLength")
    override fun compile(input: Path) {
        val kotlinHome = getKotlinHome()
        val javaHome = getJavaHome()
        val proc = ProcessBuilder().command(
            Path.of(kotlinHome).resolve("bin").resolve("kotlinc").toString(),
            "-d",
            outputDirectory.absolutePath,
            "-cp",
            libraryClassPath,
            "-jdk-home",
            javaHome,
            "-kotlin-home",
            kotlinHome,
            input.toString()
        ).start()
        val errors = String(proc.errorStream.readAllBytes())
        val result = proc.waitFor()
        if (result != 0) {
            System.err.println("Compilation error:\n$errors")
            throw CompilationErrorException(errors)
        }
    }
}
