package com.nelkinda.kotlin

object KotlinDetectionStrategy : ToolDetectionStrategy("Kotlin", "kotlin", "KOTLIN_HOME", "kotlin")

fun getKotlinHome(): String = KotlinDetectionStrategy.getHome()
