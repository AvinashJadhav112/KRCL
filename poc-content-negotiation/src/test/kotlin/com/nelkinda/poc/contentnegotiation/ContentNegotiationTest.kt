package com.nelkinda.poc.contentnegotiation

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.exchange
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod.GET
import org.springframework.http.HttpStatus

@SpringBootTest(webEnvironment = RANDOM_PORT)
class ContentNegotiationTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
) {
    @Test
    fun deliversJson() {
        val headers = HttpHeaders()
        headers.add("Accept", "application/json")
        val response = testRestTemplate.exchange<String>("/listOfEntities", GET, HttpEntity<Any>(headers))
        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @ParameterizedTest(name = "XML as {0}")
    @ValueSource(
        strings = [
            "application/xml",
            "text/xml",
        ]
    )
    fun deliversXml(mediaType: String) {
        val headers = HttpHeaders()
        headers.add("Accept", mediaType)
        val response = testRestTemplate.exchange<String>("/listOfEntities", GET, HttpEntity<Any>(headers))
        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @Disabled("YAML mime types aren't official, and Spring doesn't support YAML Jackson")
    @ParameterizedTest(name = "YAML as {0}")
    @ValueSource(
        strings = [
            "application/yaml",
            "application/x-yaml",
            "text/yaml",
            "text/x-yaml",
        ]
    )
    fun deliversYaml(mediaType: String) {
        val headers = HttpHeaders()
        headers.add("Accept", mediaType)
        val response = testRestTemplate.exchange<String>("/listOfEntities", GET, HttpEntity<Any>(headers))
        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @Disabled("Spring doesn't support CSV Jackson")
    @ParameterizedTest(name = "CSV as {0}")
    @ValueSource(
        strings = [
            "text/csv",
        ]
    )
    fun deliversCsv(mediaType: String) {
        val headers = HttpHeaders()
        headers.add("Accept", mediaType)
        val response = testRestTemplate.exchange<String>("/listOfEntities", GET, HttpEntity<Any>(headers))
        assertEquals(HttpStatus.OK, response.statusCode)
    }
}
