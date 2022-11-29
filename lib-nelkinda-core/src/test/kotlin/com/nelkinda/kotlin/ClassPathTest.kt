package com.nelkinda.kotlin

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test

class ClassPathTest {

    @Test
    fun testClassPathForClassIsNotNUll() {
        val testClass = TestClass()
        assertNotNull(testClass.getClassPath())
    }

    @Test
    fun testClassPathWithAbsoluteLocation() {
        val testClass = TestClass()
        assertEquals(testClass.getClassPath(), testClass::class.java.protectionDomain.codeSource.location.path)
    }
}

class TestClass
