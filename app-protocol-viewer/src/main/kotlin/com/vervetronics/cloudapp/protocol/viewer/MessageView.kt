package com.vervetronics.cloudapp.protocol.viewer

import com.nelkinda.java.io.ByteArrayInputStream
import com.nelkinda.kotlin.hex
import com.vervetronics.cloudapp.protocol.Message
import com.vervetronics.cloudapp.protocol.MessageParser
import java.awt.Component
import java.awt.Container
import javax.swing.JComponent
import javax.swing.JFrame
import javax.swing.JLabel
import javax.swing.JLabel.TRAILING
import javax.swing.JScrollPane
import javax.swing.JTextArea
import javax.swing.JTextField
import javax.swing.Spring
import javax.swing.SpringLayout
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

@ExperimentalUnsignedTypes
fun main() {
    val bytes = com.nelkinda.kotlin.ubyteArrayOf("AA55AA5500000000000000000505")
    val (message) = MessageParser(ByteArrayInputStream(bytes)).readNextMessage()
    SwingUtilities.invokeLater {
        val frame = JFrame("Test")
        val messageView = MessageView()
        frame.add(messageView)
        frame.pack()
        frame.isVisible = true
        frame.defaultCloseOperation = WindowConstants.DISPOSE_ON_CLOSE
        messageView.message = message
    }
}

@ExperimentalUnsignedTypes
class MessageView : JComponent() {
    private val preamble: JTextField = JTextField("0xAA55AA55").apply { isEditable = false }
    private val deviceId: JTextField = JTextField("0x0000").apply { isEditable = false }
    private val sequenceNumber: JTextField = JTextField("0x0000").apply { isEditable = false }
    private val messageType: JTextField = JTextField("0x0000").apply { isEditable = false }
    private val dataLength: JTextField = JTextField("0x0000").apply { isEditable = false }
    private val data: JTextArea = JTextArea(
        """
        00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
        00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
        """.trimIndent()
    ).apply { isEditable = false }
    private val checksum: JTextField = JTextField("0x0000").apply { isEditable = false }

    var message: Message? = null
        set(message) {
            preamble.text = message?.preamble.hex()
            deviceId.text = message?.deviceId.hex()
            sequenceNumber.text = message?.sequenceNumber.hex()
            messageType.text = message?.messageType.hex()
            dataLength.text = message?.dataLength.hex()
            data.text = "${message?.data}"
            checksum.text = message?.checksum.hex()
            field = message
        }

    init {
        layout = SpringLayout()
        add(JLabel("Preamble", TRAILING))
        add(preamble)
        add(JLabel("Device ID", TRAILING))
        add(deviceId)
        add(JLabel("Sequence Number", TRAILING))
        add(sequenceNumber)
        add(JLabel("Message Type", TRAILING))
        add(messageType)
        add(JLabel("Data Length", TRAILING))
        add(dataLength)
        add(JLabel("Data", TRAILING))
        add(JScrollPane(data))
        add(JLabel("Checksum", TRAILING))
        add(checksum)
        @Suppress("MagicNumber")
        makeCompactGrid(this, 7, 2, 6, 6, 6, 6)
    }

    @Suppress("LongParameterList")
    fun makeCompactGrid(
        parent: Container,
        rows: Int,
        cols: Int,
        initialX: Int,
        initialY: Int,
        xPad: Int,
        yPad: Int
    ) {
        val layout: SpringLayout = parent.layout as SpringLayout

        // Align all cells in each column and make them the same width.
        var x = Spring.constant(initialX)
        for (c in 0 until cols) {
            var width = Spring.constant(0)
            for (r in 0 until rows) {
                width = Spring.max(
                    width,
                    getConstraintsForCell(r, c, parent, cols).width
                )
            }
            for (r in 0 until rows) {
                val constraints: SpringLayout.Constraints = getConstraintsForCell(r, c, parent, cols)
                constraints.x = x
                constraints.width = width
            }
            x = Spring.sum(x, Spring.sum(width, Spring.constant(xPad)))
        }

        // Align all cells in each row and make them the same height.
        var y = Spring.constant(initialY)
        for (r in 0 until rows) {
            var height = Spring.constant(0)
            for (c in 0 until cols) {
                height = Spring.max(
                    height,
                    getConstraintsForCell(r, c, parent, cols).height
                )
            }
            for (c in 0 until cols) {
                val constraints: SpringLayout.Constraints = getConstraintsForCell(r, c, parent, cols)
                constraints.y = y
                constraints.height = height
            }
            y = Spring.sum(y, Spring.sum(height, Spring.constant(yPad)))
        }

        // Set the parent's size.
        val pCons = layout.getConstraints(parent)
        pCons.setConstraint(SpringLayout.SOUTH, y)
        pCons.setConstraint(SpringLayout.EAST, x)
    }

    private fun getConstraintsForCell(
        row: Int,
        col: Int,
        parent: Container,
        cols: Int
    ): SpringLayout.Constraints {
        val layout = parent.layout as SpringLayout
        val c: Component = parent.getComponent(row * cols + col)
        return layout.getConstraints(c)
    }
}
