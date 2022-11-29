package com.nelkinda.kotlin

object JavaDetectionStrategy : ToolDetectionStrategy("Java", "java", "JAVA_HOME", "java")

fun getJavaHome(): String = JavaDetectionStrategy.getHome()
