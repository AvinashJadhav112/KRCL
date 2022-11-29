package com.nelkinda.rel

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class Sha256Test {
    // To create your own test sums, use the following command line:
    // echo -n 'sample text' | sha256sum | tr '[a-f]' '[A-F]'

    @Test
    fun emptyString() {
        val expected = "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855"
        println(expected)
        val actual = sha256Hex("")
        assertEquals(expected, actual)
    }

    @Test
    fun helloWorld() {
        val expected = "315F5BDB76D078C43B8AC0064E4A0164612B1FCE77C869345BFC94C75894EDD3"
        println(expected)
        val actual = sha256Hex("Hello, world!")
        assertEquals(expected, actual)
    }
}
