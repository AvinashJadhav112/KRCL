package com.nelkinda.kotlin

class JavaDetectionStrategyTest : ToolDetectionStrategyTest("JAVA_HOME", "java", "java") {
    override fun getHome() = getJavaHome()
}
