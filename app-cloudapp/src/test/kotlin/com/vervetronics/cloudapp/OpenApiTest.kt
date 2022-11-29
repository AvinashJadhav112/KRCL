package com.vervetronics.cloudapp

import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.skyscreamer.jsonassert.JSONAssert.assertEquals
import org.skyscreamer.jsonassert.JSONCompareMode.LENIENT
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import java.net.URL

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OpenApiTest(
    @LocalServerPort
    private val port: Int,
    @Autowired
    private val objectMapper: ObjectMapper,
) {
    @Test
    fun openApiSpecIsPresent() {
        val json = objectMapper.readTree(URL("http://localhost:$port/v3/api-docs/"))
        val expected = """
            {
                "info": {
                    "title": "VerveTronics CloudApp API",
                    "version": "v1"
                },
                "openapi": "3.0.1",
                "paths": {
                    "/actuator": {},
                    "/actuator/health": {},
                    "/actuator/info": {}
                }
            }
        """.trimIndent()
        assertEquals(expected, objectMapper.writeValueAsString(json), LENIENT)
    }
}
