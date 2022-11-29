package com.nelkinda.javax.swing

import java.awt.event.ActionEvent
import javax.swing.AbstractAction

class SimpleAction(
    private val action: (e: ActionEvent?) -> Unit
) : AbstractAction() {
    override fun actionPerformed(e: ActionEvent?) {
        action(e)
    }
}
