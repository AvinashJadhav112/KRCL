package com.vervetronics.cloudapp

import org.junit.jupiter.api.Assertions.assertEquals
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

fun <T> ResponseEntity<T>.assertStatus(expectedStatus: HttpStatus) = assertEquals(expectedStatus, statusCode)
