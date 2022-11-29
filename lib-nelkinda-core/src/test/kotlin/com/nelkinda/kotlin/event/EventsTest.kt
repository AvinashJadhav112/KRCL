package com.nelkinda.kotlin.event

import org.junit.jupiter.api.Assertions.assertSame
import org.junit.jupiter.api.Test
import java.util.EventListener
import java.util.EventObject

interface TestListener : EventListener {
    fun notifyEvent(e: EventObject)
}

class EventsTest {
    private lateinit var testListener: TestListener

    @Test
    fun noConcurrentModificationException() {
        val event = EventObject("foo")
        val list = list<TestListener>()
        testListener = object : TestListener {
            override fun notifyEvent(e: EventObject) {
                assertSame(event, e)
                list.remove(testListener)
            }
        }
        list.add(testListener)
        list.fireEvent(event, TestListener::notifyEvent)
    }
}
