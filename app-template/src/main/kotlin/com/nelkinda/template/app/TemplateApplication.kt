package com.nelkinda.template.app

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.ApplicationContext

@SpringBootApplication
class TemplateApplication

internal lateinit var appContext: ApplicationContext
    private set

fun main(vararg args: String) {
    appContext = runApplication<TemplateApplication>(*args)
}
