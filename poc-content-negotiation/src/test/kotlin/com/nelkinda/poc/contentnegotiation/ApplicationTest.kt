package com.nelkinda.poc.contentnegotiation

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.boot.SpringApplication

class ApplicationTest {
    @Test
    fun mainRuns() {
        main("--server.port=0")
        assertNotNull(appContext)
        assertEquals(0, SpringApplication.exit(appContext))
    }
}
