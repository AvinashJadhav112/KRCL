package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.event.fireEvent
import com.nelkinda.kotlin.event.list
import com.vervetronics.cloudapp.protocol.event.DeviceListener
import com.vervetronics.cloudapp.protocol.event.DownloadStatusListener
import com.vervetronics.cloudapp.protocol.event.MessageListener
import com.vervetronics.cloudapp.protocol.event.SensorReadingListener
import com.vervetronics.cloudapp.protocol.event.ServerEvent
import com.vervetronics.cloudapp.protocol.event.ServerListener
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.net.ServerSocket
import java.net.SocketException
import java.time.Clock
import java.time.Duration
import kotlin.concurrent.thread

@SuppressWarnings("TooManyFunctions")
@ExperimentalUnsignedTypes
@Component
class CloudAppServer(
    @Value("\${application.iot.port:0}") var requestedPort: Int = 0,
    private val sensorReadingRepository: SensorReadingRepository,
    private val clock: Clock,
    @SuppressWarnings("MagicNumber")
    @Value("\${application.iot.timeTolerance:PT10H}") val timeTolerance: Duration = Duration.ofHours(10),
    private val firmwareProvider: FirmwareProvider,
) {
    private val serverListeners = list<ServerListener>()
    private val messageListeners = list<MessageListener>()
    private val sensorReadingListeners = list<SensorReadingListener>()
    private val deviceListeners = list<DeviceListener>()
    private val downloadStatusListeners = list<DownloadStatusListener>()
    private val logger = LoggerFactory.getLogger(javaClass)

    @Volatile
    private var serverSocket: ServerSocket? = null
    val port: Int
        get() = serverSocket?.localPort ?: requestedPort

    fun start() {
        synchronized(this) {
            if (serverSocket != null)
                return
            val serverSocket = ServerSocket(requestedPort)
            this.serverSocket = serverSocket
            thread(name = "VTICP Server") {
                runServer(serverSocket)
            }
        }
    }

    private fun runServer(serverSocket: ServerSocket) {
        serverSocket.use {
            log("Server started.")
            logger.info("VTICP Server started on port: {}", serverSocket.localPort)
            fireServerStarted()
            try {
                while (true) {
                    val socket = serverSocket.accept()
                    log("Accepted connection from ${socket.remoteSocketAddress}")
                    fireConnectionReceived()
                    thread(name = "VTICP Handler ${socket.remoteSocketAddress}") {
                        CloudAppHandler(
                            messageListeners,
                            sensorReadingListeners,
                            deviceListeners, downloadStatusListeners,
                            socket,
                            clock,
                            timeTolerance,
                            sensorReadingRepository,
                            firmwareProvider
                        ).handle()
                    }
                }
            } catch (e: SocketException) {
                if (e.message != "Socket closed" && e.message != "Socket is closed")
                    throw e
            } finally {
                logger.info("VTICP Server stopped.")
                log("Server stopped.")
                fireServerStopped()
            }
        }
    }

    fun stop() {
        log("Stopping server…")
        serverSocket?.close()
        serverSocket = null
    }

    fun addServerListener(serverListener: ServerListener) {
        serverListeners.add(serverListener)
    }

    fun addMessageListener(messageListener: MessageListener) {
        messageListeners.add(messageListener)
    }

    fun addSensorReadingListener(sensorReadingListener: SensorReadingListener) {
        sensorReadingListeners.add(sensorReadingListener)
    }

    fun addDeviceListener(deviceListener: DeviceListener) {
        deviceListeners.add(deviceListener)
    }

    fun addDownloadStatusListener(downloadStatusListener: DownloadStatusListener) {
        downloadStatusListeners.add(downloadStatusListener)
    }
    private fun fireServerEvent(handler: ServerListener.(ServerEvent) -> Unit) {
        serverListeners.fireEvent(ServerEvent(this), handler)
    }

    private fun fireServerStarted() {
        fireServerEvent(ServerListener::serverStarted)
    }

    private fun fireServerStopped() {
        fireServerEvent(ServerListener::serverStopped)
    }

    private fun fireConnectionReceived() {
        fireServerEvent(ServerListener::connectionReceived)
    }
}
