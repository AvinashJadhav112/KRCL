package com.vervetronics.cloudapp.protocol.viewer

import com.nelkinda.javax.swing.ActionBuilder
import com.nelkinda.javax.swing.GuiBuilder
import com.nelkinda.javax.swing.LogView
import com.nelkinda.javax.swing.defaultGuiBuilder
import com.nelkinda.kotlin.Data
import com.vervetronics.cloudapp.protocol.CloudAppServer
import com.vervetronics.cloudapp.protocol.FirmwareProvider
import com.vervetronics.cloudapp.protocol.event.MessageEvent
import com.vervetronics.cloudapp.protocol.event.MessageListener
import com.vervetronics.cloudapp.storage.file.FileSensorReadingRepository
import org.apache.commons.io.output.TeeOutputStream
import java.awt.BorderLayout
import java.io.PrintStream
import java.nio.file.Path
import java.time.Clock
import javax.swing.Action
import javax.swing.JFrame
import javax.swing.JLabel
import javax.swing.JScrollPane
import javax.swing.JSpinner
import javax.swing.JSplitPane
import javax.swing.JToolBar
import javax.swing.SpinnerNumberModel
import javax.swing.UIManager
import javax.swing.WindowConstants

@ExperimentalUnsignedTypes
@SuppressWarnings("PrintStackTrace")
fun main() {
    try {
//        UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName())
        UIManager.setLookAndFeel("javax.swing.plaf.nimbus.NimbusLookAndFeel")
    } catch (ignore: Exception) {
        ignore.printStackTrace()
    }
    Application()
}

private const val MAX_PORT = 0xFFFF

@ExperimentalUnsignedTypes
class Application {
    private val frame = JFrame("Protoocol Viewer")
    private val start: Action
    private val stop: Action
    private val server = CloudAppServer(
        clock = Clock.systemDefaultZone(),
        sensorReadingRepository = FileSensorReadingRepository(Path.of("data")),
        firmwareProvider = object : FirmwareProvider {
            override fun getFirmwareVersion(factoryDeviceId: Data): String? {
                TODO("Not yet implemented")
            }
        }
    )
    private val requestedPortModel = SpinnerNumberModel(0, 0, MAX_PORT, 1)
    private val actualPortModel = SpinnerNumberModel(0, 0, MAX_PORT, 1)
    private val requestedPortSpinner = JSpinner(requestedPortModel)

    init {
        val guiBuilder = defaultGuiBuilder<Application>()
        val actionBuilder = ActionBuilder(guiBuilder.resourceBundle, guiBuilder.actionMap)
        actionBuilder.createAction("program")
        actionBuilder.createAction("quit", ::quit)
        actionBuilder.createAction("server")
        start = actionBuilder.createAction("start", ::start)
        stop = actionBuilder.createAction("stop", ::stop)

        start.isEnabled = true
        stop.isEnabled = false

        val toolBar = createToolBar(guiBuilder)
        frame.add(toolBar, BorderLayout.NORTH)
        frame.jMenuBar = guiBuilder.createJMenuBarFromKey("menuBar")
        frame.defaultCloseOperation = WindowConstants.DISPOSE_ON_CLOSE
        val logView = LogView()
        System.setErr(PrintStream(TeeOutputStream(System.err, logView.outputStream)))
        val messageView = MessageView()
        frame.add(JSplitPane(JSplitPane.VERTICAL_SPLIT, true, messageView, JScrollPane(logView)))
        frame.pack()
        frame.setLocationRelativeTo(null)
        frame.isVisible = true
        MessageUpdater(messageView, server)
    }

    private fun createToolBar(guiBuilder: GuiBuilder): JToolBar {
        val toolBar = guiBuilder.createJToolBarFromKey("toolBar")
        toolBar.addSeparator()
        toolBar.add(JLabel("Requested Port:"))
        toolBar.add(requestedPortSpinner)
        toolBar.addSeparator()
        toolBar.add(JLabel("Actual Port:"))
        toolBar.add(JSpinner(actualPortModel).apply { isEnabled = false })
        toolBar.addSeparator()
        return toolBar
    }

    private fun quit() {
        frame.dispose()
    }

    private fun start() {
        start.isEnabled = false
        stop.isEnabled = true
        server.requestedPort = requestedPortModel.number.toInt()
        server.start()
        actualPortModel.value = server.port
        requestedPortSpinner.isEnabled = false
    }

    private fun stop() {
        server.stop()
        start.isEnabled = true
        stop.isEnabled = false
        actualPortModel.value = server.port
        requestedPortSpinner.isEnabled = true
    }
}

@ExperimentalUnsignedTypes
class MessageUpdater(private val messageView: MessageView, cloudAppServer: CloudAppServer) : MessageListener {
    init {
        cloudAppServer.addMessageListener(this)
    }

    override fun messageReceived(e: MessageEvent) {
        messageView.message = e.message
    }
}
