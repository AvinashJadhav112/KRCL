package com.vervetronics.cloudapp.edgedevicesim

import com.vervetronics.cloudapp.protocol.TlvBuilder
import com.vervetronics.cloudapp.protocol.toBcd
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertTimeoutPreemptively
import java.net.InetAddress
import java.net.ServerSocket
import java.time.Duration.ofSeconds
import java.time.LocalTime

@ExperimentalUnsignedTypes
class EdgeDeviceSimulatorTest {
    private lateinit var server: ServerSocket
    private lateinit var inetAddress: InetAddress
    private var port: Int = 0
    private var deviceSimulator = EdgeDeviceSimulator()

    @BeforeEach
    fun startServer() {
        server = ServerSocket(0)
        inetAddress = server.inetAddress
        port = server.localPort
    }

    @AfterEach
    fun stopServer() {
        server.close()
    }

    @Test
    fun testOpensTCPConnection() {
        assertTimeoutPreemptively(ofSeconds(1)) {
            deviceSimulator.connect(inetAddress, port)
            server.accept()
        }
    }

    @Disabled("Only for deployed testing")
    @Test
    fun sendEmptySensorReading() {
        deviceSimulator.connect(InetAddress.getByName("vtiot-cloudapp.nelkinda.com"), 12000)
        deviceSimulator.sendSensorReading(TlvBuilder().withTag(0x01u, LocalTime.now().toBcd() + 0x01u).build())
    }
}
