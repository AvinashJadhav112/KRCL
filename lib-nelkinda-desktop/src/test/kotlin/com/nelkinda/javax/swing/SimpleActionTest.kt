package com.nelkinda.javax.swing

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import java.awt.event.ActionEvent

class SimpleActionTest {
    @Test
    fun testDelegates() {
        val mockEvent = mock<ActionEvent>()
        var invoked = false
        val action = SimpleAction {
            invoked = true
            assertEquals(it, mockEvent)
        }
        action.actionPerformed(mockEvent)
        assertTrue(invoked)
    }
}
