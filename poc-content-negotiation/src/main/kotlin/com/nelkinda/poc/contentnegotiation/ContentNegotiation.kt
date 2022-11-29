package com.nelkinda.poc.contentnegotiation

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ContentNegotiation {
    @GetMapping(
        "/listOfEntities",
        produces = [
            "application/json",
            "application/xml",
            "application/x-yaml",
            "application/yaml",
            "text/csv",
            "text/xml",
            "text/x-yaml",
            "text/yaml",
        ]
    )
    fun listOfEntities(): List<Record> {
        return listOf(
            Record("Christian", "Hujer"),
            Record("Siddhesh", "Nikude"),
        )
    }

    @GetMapping(
        "/enum",
        produces = ["text/plain"],
    )
    fun endpointEnum(foobies: Foobies): String {
        return foobies.toString()
    }

    @GetMapping(
        "/enums",
        produces = ["text/plain"],
    )
    fun endpointEnumSet(vararg foobies: Foobies): String {
        return foobies.joinToString()
    }
}

enum class Foobies {
    FOO, BAR, BAZ, FOOBIE, BLETCH,
}
