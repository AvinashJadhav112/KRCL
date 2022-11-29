package com.vervetronics.cloudapp

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.boot.SpringApplication

class CloudAppApplicationTest {
    @Test
    fun mainRuns() {
        main("--server.port=0")
        assertNotNull(appContext)
        assertEquals(0, SpringApplication.exit(appContext))
    }
}
