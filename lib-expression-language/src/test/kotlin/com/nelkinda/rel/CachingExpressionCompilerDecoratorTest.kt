package com.nelkinda.rel

import com.nelkinda.org.junit.jupiter.api.time
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.nio.file.Path
import java.time.Duration

class CachingExpressionCompilerDecoratorTest {
    private fun createOutputDirectory() = Path.of("/tmp").toFile()

    @Test
    fun testCachingExpressionCompilerDecoratorTest() {
        val decorator = CachingExpressionCompilerDecorator(KotlinExpressionCompiler(createOutputDirectory()))
        val instance = decorator.compile("7 * value", Int::class, Int::class)
        // We expect 10M calls to take less than 1 second.
        val duration = time(10_000_000) {
            assertEquals(42, instance.apply(6))
        }
        assertTrue(duration < Duration.ofSeconds(2))
    }

    @Test
    fun `when same expression with different data type should give expected results`() {
        val decorator = CachingExpressionCompilerDecorator(KotlinExpressionCompiler(createOutputDirectory()))
        val instance = decorator.compile("value", Int::class, Int::class)
        assertNotNull(instance)
        assertEquals(7, instance.apply(7))
        val instance2 = decorator.compile("value", Double::class, Double::class)
        assertNotNull(instance2)
        assertEquals(5.5, instance2.apply(5.5), 0.01)
    }

    @Test
    fun testCreateCachingExpressionCompilerDecorator() {
        val decorator = CachingExpressionCompilerDecorator(KotlinExpressionCompiler(createOutputDirectory()))
        assertNotNull(decorator)
    }

    @Test
    fun testInstanceFromDecoratorCompiler() {
        val decorator = CachingExpressionCompilerDecorator(KotlinExpressionCompiler(createOutputDirectory()))
        val instance = decorator.compile("7 * value", Int::class, Int::class)
        assertNotNull(instance)
        assertEquals(49, instance.apply(7))
    }
}
