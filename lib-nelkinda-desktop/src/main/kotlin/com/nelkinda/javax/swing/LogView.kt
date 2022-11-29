package com.nelkinda.javax.swing

import java.io.ByteArrayOutputStream
import java.io.FilterOutputStream
import java.io.OutputStream
import javax.swing.JTextArea
import javax.swing.SwingUtilities

class LogView : JTextArea(DEFAULT_ROWS, DEFAULT_COLUMNS) {
    init {
        isEditable = false
    }

    val outputStream: OutputStream = object : FilterOutputStream(ByteArrayOutputStream()) {
        override fun write(b: Int) {
            super.write(b)
            if (SwingUtilities.isEventDispatchThread()) {
                text = out.toString()
            } else {
                SwingUtilities.invokeAndWait {
                    text = out.toString()
                }
            }
        }
    }

    companion object {
        private const val DEFAULT_ROWS = 25
        private const val DEFAULT_COLUMNS = 80
    }
}
