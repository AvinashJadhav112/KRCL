package com.nelkinda.javax.swing

import java.awt.event.ActionEvent
import java.awt.event.KeyEvent
import java.util.ResourceBundle
import javax.swing.Action
import javax.swing.ActionMap
import javax.swing.KeyStroke

class ActionBuilder(
    private val resourceBundle: ResourceBundle,
    private val actionMap: ActionMap,
) {
    private val iconCache = IconCache()

    private val actionConverters: Map<String, (String) -> Any?> = mapOf(
        Action.ACCELERATOR_KEY to KeyStroke::getKeyStroke,
        Action.DISPLAYED_MNEMONIC_INDEX_KEY to Integer::parseInt,
        Action.LARGE_ICON_KEY to iconCache::get,
        Action.LONG_DESCRIPTION to { it },
        Action.MNEMONIC_KEY to { KeyEvent.getExtendedKeyCodeForChar(it.codePointAt(0)) },
        Action.NAME to { it },
        Action.SHORT_DESCRIPTION to { it },
        Action.SMALL_ICON to iconCache::get,
    )

    fun createAction(actionCommand: String): Action {
        return createAction(actionCommand, SimpleAction { })
    }

    fun createAction(actionCommand: String, action: (ActionEvent?) -> Unit): Action {
        return createAction(actionCommand, SimpleAction(action))
    }

    fun createAction(actionCommand: String, action: () -> Unit): Action {
        return createAction(actionCommand, SimpleAction() { action.invoke() })
    }

    fun createAction(actionCommand: String, action: Action): Action {
        return setupAction(actionCommand, action)
    }

    fun setupAction(actionCommand: String, action: Action): Action {
        initActionFromBundle(action, actionCommand)
        actionMap.put(actionCommand, action)
        return action
    }

    fun initActionFromBundle(action: Action, actionCommand: String) {
        action.putValue(Action.ACTION_COMMAND_KEY, actionCommand)
        initActionFromBundle(action)
    }

    fun initActionFromBundle(action: Action) {
        val actionCommand = action.getValue(Action.ACTION_COMMAND_KEY) as String
        for ((actionKey, converter) in actionConverters) {
            val valueKey = "$actionCommand.$actionKey"
            if (resourceBundle.containsKey(valueKey)) {
                action.putValue(actionKey, converter.invoke(resourceBundle.getString(valueKey)))
            }
        }
    }
}
