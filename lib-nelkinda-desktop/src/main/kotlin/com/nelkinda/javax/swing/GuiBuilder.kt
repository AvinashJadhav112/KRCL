package com.nelkinda.javax.swing

import java.util.ResourceBundle
import javax.swing.ActionMap
import javax.swing.JMenu
import javax.swing.JMenuBar
import javax.swing.JToolBar

class GuiBuilder(
    val resourceBundle: ResourceBundle,
    val actionMap: ActionMap,
) {

    fun createJToolBarFromKey(key: String): JToolBar {
        val toolBar = JToolBar()
        toolBar.isFocusable = false
        processItemList(key, toolBar::addSeparator) {
            toolBar.add(actionMap.get(it))
        }
        return toolBar
    }

    fun createJMenuBarFromKey(key: String): JMenuBar {
        val menuBar = JMenuBar()
        for (menuKey in getList(key))
            menuBar.add(createJMenu(menuKey))
        return menuBar
    }

    fun createJMenu(base: String): JMenu {
        val menu = JMenu(actionMap.get(base))
        processItemList("$base.menu", menu::addSeparator) {
            if (resourceBundle.containsKey("$it.menu"))
                menu.add(createJMenu(it))
            else
                menu.add(actionMap.get(it))
        }
        return menu
    }

    fun processItemList(listKey: String, separator: () -> Unit, adder: (String) -> Unit) {
        for (itemKey in getList(listKey))
            processItem(itemKey, separator, adder)
    }

    fun getList(listKey: String): List<String> {
        return resourceBundle.getString(listKey).split(Regex("\\s+")).filterNot { it == "" }
    }

    fun processItem(itemKey: String, separator: () -> Unit, adder: (String) -> Unit) {
        when (itemKey) {
            "" -> {
                // Ignore empty keys
            }
            "-" -> separator.invoke()
            "|" -> separator.invoke()
            else -> adder.invoke(itemKey)
        }
    }
}

inline fun <reified T : Any> defaultGuiBuilder(actionMap: ActionMap = ActionMap()) =
    GuiBuilder(ResourceBundle.getBundle(T::class.java.name), actionMap)
