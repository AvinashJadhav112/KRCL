package com.nelkinda.kotlin.event

import org.junit.jupiter.api.Assertions.assertSame
import org.junit.jupiter.api.Test

class EventObjectTest {
    @Test
    fun testSource() {
        val originalSource = "foo"
        val eventObject = EventObject("foo")
        val actualSource: String = eventObject.source
        assertSame(originalSource, actualSource)
    }
}
