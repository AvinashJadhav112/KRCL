package com.nelkinda.poc.contentnegotiation

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.ApplicationContext

@SpringBootApplication
class Application

internal lateinit var appContext: ApplicationContext
    private set

fun main(vararg args: String) {
    appContext = runApplication<Application>(*args)
}
