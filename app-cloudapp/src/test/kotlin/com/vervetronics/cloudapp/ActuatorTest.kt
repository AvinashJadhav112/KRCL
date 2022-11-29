package com.vervetronics.cloudapp

import org.junit.jupiter.api.Test
import org.skyscreamer.jsonassert.JSONAssert.assertEquals
import org.skyscreamer.jsonassert.JSONCompareMode.LENIENT
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT
import org.springframework.boot.web.server.LocalServerPort
import java.net.URI
import java.net.URL
import java.nio.charset.StandardCharsets.UTF_8

@SpringBootTest(webEnvironment = RANDOM_PORT)
class ActuatorTest(
    @LocalServerPort
    private val port: Int
) {
    @Test
    fun health() = assertJsonEqualsFromUrls("expected/health.json", "http://localhost:$port/actuator/health")

    @Test
    fun info() = assertJsonEqualsFromUrls("expected/info.json", "http://localhost:$port/actuator/info")

    private fun assertJsonEqualsFromUrls(asserted: String, actual: String) =
        assertEquals(read(asserted), read(actual), LENIENT)

    private fun read(url: String) = read(URI(url))
    private fun read(uri: URI) = read(if (uri.isAbsolute) uri.toURL() else javaClass.getResource("ActuatorTest/$uri")!!)
    private fun read(url: URL): String = url.openStream().use { String(it.readAllBytes(), UTF_8) }
}
