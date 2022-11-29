package com.nelkinda.kotlin

class KotlinDetectionStrategyTest : ToolDetectionStrategyTest("KOTLIN_HOME", "kotlin", "kotlin") {
    override fun getHome() = getKotlinHome()
}
