package com.nelkinda.javax.swing

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import javax.swing.AbstractButton
import javax.swing.JMenuBar
import javax.swing.JToolBar

class GuiBuilderTest {
    private val guiBuilder = defaultGuiBuilder<GuiBuilderTest>()
    private val actionBuilder = ActionBuilder(guiBuilder.resourceBundle, guiBuilder.actionMap)
    private val called = mutableListOf<String>()

    @BeforeEach
    fun createActions() {
        actionBuilder.createAction("file")
        actionBuilder.createAction("new", ::new)
    }

    @Test
    fun toolbar_isNotFocusable() {
        val toolBar: JToolBar = guiBuilder.createJToolBarFromKey("emptyToolBar")
        assertFalse(toolBar.isFocusable)
    }

    @Test
    fun createEmptyToolbar() {
        val toolBar: JToolBar = guiBuilder.createJToolBarFromKey("emptyToolBar")
        assertEquals(0, toolBar.componentCount)
    }

    @Test
    fun createToolBarWithSeparatorDash() {
        val toolBar: JToolBar = guiBuilder.createJToolBarFromKey("toolBarWithSeparatorDash")
        assertEquals(1, toolBar.componentCount)
        assertTrue(toolBar.getComponent(0) is JToolBar.Separator)
    }

    @Test
    fun createToolBarWithSeparatorPipe() {
        val toolBar: JToolBar = guiBuilder.createJToolBarFromKey("toolBarWithSeparatorPipe")
        assertEquals(1, toolBar.componentCount)
        assertTrue(toolBar.getComponent(0) is JToolBar.Separator)
    }

    @Test
    fun createToolbarWithNewButton() {
        val toolBar: JToolBar = guiBuilder.createJToolBarFromKey("toolBarNew")
        assertEquals(1, toolBar.componentCount)
        val button = toolBar.getComponent(0) as AbstractButton
        button.doClick()
        assertEquals(listOf("new"), called)
    }

    @Test
    fun createEmptyMenuBar() {
        val menuBar: JMenuBar = guiBuilder.createJMenuBarFromKey("emptyMenuBar")
        assertEquals(0, menuBar.componentCount)
    }

    @Test
    fun createMenuBarWithFileMenu() {
        val menuBar: JMenuBar = guiBuilder.createJMenuBarFromKey("menuBarNew")
        assertEquals(1, menuBar.componentCount)
    }

    fun new() {
        called.add("new")
    }
}
