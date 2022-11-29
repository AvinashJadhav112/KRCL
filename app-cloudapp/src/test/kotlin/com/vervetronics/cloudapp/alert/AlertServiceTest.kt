package com.vervetronics.cloudapp.alert

import com.nelkinda.kotlin.Data
import com.nelkinda.rel.ExpressionCompiler
import com.vervetronics.cloudapp.CloudAppApplication
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.iot.device.IotDevice
import com.vervetronics.cloudapp.iot.model.IotModel
import com.vervetronics.cloudapp.iot.model.sensor.Sensor
import com.vervetronics.cloudapp.protocol.CloudAppHandler
import com.vervetronics.cloudapp.protocol.CloudAppServer
import com.vervetronics.cloudapp.protocol.event.DeviceListener
import com.vervetronics.cloudapp.protocol.event.DownloadStatusListener
import com.vervetronics.cloudapp.protocol.event.MessageListener
import com.vervetronics.cloudapp.protocol.event.SensorReadingEvent
import com.vervetronics.cloudapp.protocol.event.SensorReadingListener
import com.vervetronics.cloudapp.storage.SensorReading
import com.vervetronics.cloudapp.storage.SensorReadingService
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.mockito.kotlin.mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.MockBeans
import java.net.InetAddress
import java.net.Socket
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.util.UUID

@ExperimentalUnsignedTypes
@MockBeans(
    MockBean(DeviceIotService::class)
)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = [CloudAppApplication::class, AlertService::class]
)
class AlertServiceTest(
    @Autowired private val expressionCompiler: ExpressionCompiler,
    @Autowired private val alertRepository: AlertRepository,
    @Autowired private val deviceIotService: DeviceIotService,
    @Autowired private val sensorReadingService: SensorReadingService
) {
    private val alertService = AlertService(
        expressionCompiler,
        alertRepository,
        deviceIotService,
        sensorReadingService
    )
    private val clock = Clock.fixed(Instant.now(), ZoneOffset.UTC)
    private val server = CloudAppServer(
        clock = clock,
        sensorReadingRepository = mock(),
        firmwareProvider = mock()
    ).apply {
        addSensorReadingListener(alertService)
        start()
    }
    private val socket = Socket(InetAddress.getLocalHost(), server.port)

    private val messageListeners = mutableListOf<MessageListener>()
    private val sensorReadingListeners = mutableListOf<SensorReadingListener>(alertService)
    private val deviceListeners = mutableListOf<DeviceListener>()
    private val downloadStatusListeners = mutableListOf<DownloadStatusListener>()
    private val duration = Duration.ZERO
    private val handler = CloudAppHandler(
        messageListeners,
        sensorReadingListeners,
        deviceListeners,
        downloadStatusListeners,
        socket,
        clock,
        duration,
        sensorReadingRepository = mock(),
        firmwareProvider = mock()
    )

    @BeforeEach
    fun cleanUpOldData() {
        alertRepository.deleteAll()
    }

    @AfterEach
    fun cleanUpAfter() {
        alertRepository.deleteAll()
        socket.close()
        server.stop()
    }

    @Disabled
    @Test
    fun `alert is generated when sensor reading is out of bounds and data types are Int`() {
        val sensorReading = sampleSensorReading.copy(value = Data("0000000A"), timestamp = Instant.now())
        `when`(deviceIotService.mustFindSensorBySerialNumberAndSensorId("55AA55AA55AA55AA55AA55AA55AA0000", "0000"))
            .thenReturn(sampleSensor.copy(min = "0", max = "1", processedDataType = "Int", rawDataType = "Int"))
        `when`(deviceIotService.findDeviceBySerialNumber("55AA55AA55AA55AA55AA55AA55AA0000"))
            .thenReturn(sampleIotDevice)

        // then
        alertService.sensorReadingReceived(SensorReadingEvent(handler, sensorReading))
        print(alertService.getAllAlertsInBetween(Instant.EPOCH, Instant.now()))
        assertEquals(0, alertRepository.count())
    }

    @Test
    fun `alert is not generated when sensor reading is within bounds and data types are Int`() {
        val sensorReading = sampleSensorReading.copy(value = Data("0000000A"))
        `when`(deviceIotService.mustFindSensorBySerialNumberAndSensorId("55AA55AA55AA55AA55AA55AA55AA0000", "0000"))
            .thenReturn(sampleSensor.copy(min = "0", max = "10", processedDataType = "Int", rawDataType = "Int"))
        `when`(deviceIotService.findDeviceBySerialNumber("55AA55AA55AA55AA55AA55AA55AA0000"))
            .thenReturn(sampleIotDevice)

        // then
        alertService.sensorReadingReceived(SensorReadingEvent(handler, sensorReading))
        assertEquals(0, alertRepository.count())
    }

    @Disabled
    @Test
    fun `alert is generated when sensor reading is out of bounds and data types are UInt`() {
        val sensorReading = sampleSensorReading.copy(value = Data("0000000A"))
        `when`(deviceIotService.mustFindSensorBySerialNumberAndSensorId("55AA55AA55AA55AA55AA55AA55AA0000", "0000"))
            .thenReturn(sampleSensor.copy(min = "0", max = "1", processedDataType = "UInt", rawDataType = "UInt"))
        `when`(deviceIotService.findDeviceBySerialNumber("55AA55AA55AA55AA55AA55AA55AA0000"))
            .thenReturn(sampleIotDevice)

        // then
        alertService.sensorReadingReceived(SensorReadingEvent(handler, sensorReading))
        assertEquals(1, alertRepository.count())
    }

    @Disabled
    @Test
    fun `alert is not generated when sensor reading is within bounds and data types are UInt`() {
        val sensorReading = sampleSensorReading.copy(value = Data("0000000A"))
        `when`(deviceIotService.mustFindSensorBySerialNumberAndSensorId("55AA55AA55AA55AA55AA55AA55AA0000", "0000"))
            .thenReturn(sampleSensor.copy(min = "0", max = "10", processedDataType = "UInt", rawDataType = "UInt"))
        `when`(deviceIotService.findDeviceBySerialNumber("55AA55AA55AA55AA55AA55AA55AA0000"))
            .thenReturn(sampleIotDevice)

        // then
        alertService.sensorReadingReceived(SensorReadingEvent(handler, sensorReading))
        assertEquals(0, alertRepository.count())
    }

    @Test
    fun `alert is not generated when sensor reading is within bounds and data types are Double`() {
        val sensorReading = sampleSensorReading.copy(value = Data("40286B851EB851EC"))
        `when`(deviceIotService.mustFindSensorBySerialNumberAndSensorId("55AA55AA55AA55AA55AA55AA55AA0000", "0000"))
            .thenReturn(
                sampleSensor.copy(
                    min = "12.20",
                    max = "12.22",
                    processedDataType = "Double",
                    rawDataType = "Double"
                )
            )
        `when`(deviceIotService.findDeviceBySerialNumber("55AA55AA55AA55AA55AA55AA55AA0000"))
            .thenReturn(sampleIotDevice)

        // then
        alertService.sensorReadingReceived(SensorReadingEvent(handler, sensorReading))
        assertEquals(0, alertRepository.count())
    }

    @Disabled
    @Test
    fun `alert is generated when sensor reading is within bounds and data types are Double`() {
        val sensorReading = sampleSensorReading.copy(value = Data("40286B851EB851EC"))
        `when`(deviceIotService.mustFindSensorBySerialNumberAndSensorId("55AA55AA55AA55AA55AA55AA55AA0000", "0000"))
            .thenReturn(
                sampleSensor.copy(
                    min = "0.0",
                    max = "10.0",
                    processedDataType = "Double",
                    rawDataType = "Double"
                )
            )
        `when`(deviceIotService.findDeviceBySerialNumber("55AA55AA55AA55AA55AA55AA55AA0000"))
            .thenReturn(sampleIotDevice)

        // then
        alertService.sensorReadingReceived(SensorReadingEvent(handler, sensorReading))
        assertEquals(1, alertRepository.count())
    }

    @Test
    fun `alert is ignored when the processed data type is boolean`() {
        val sensorReading = sampleSensorReading.copy(value = Data("00000005"))
        `when`(deviceIotService.mustFindSensorBySerialNumberAndSensorId("55AA55AA55AA55AA55AA55AA55AA0000", "0000"))
            .thenReturn(sampleSensor.copy(min = "0", max = "1", processedDataType = "Boolean", rawDataType = "UInt"))
        `when`(deviceIotService.findDeviceBySerialNumber("55AA55AA55AA55AA55AA55AA55AA0000"))
            .thenReturn(sampleIotDevice)

        // then
        alertService.sensorReadingReceived(SensorReadingEvent(handler, sensorReading))
        assertEquals(0, alertRepository.count())
    }

    private val sampleSensor =
        Sensor("0000", "Button Up", "High", "1", "0", "1", "30", "value", "Int", "Int", "Count")

    private val sampleIotModel = IotModel("Crane").apply { this.sensors = listOf(sampleSensor) }

    private val sampleIotDevice = IotDevice(
        "55AA55AA55AA55AA55AA55AA55AA0000",
        "Crane",
        "Crane",
        "Active",
        LocalDate.of(2020, 1, 1),
        "EDMB210415V02",
        "EDMB210415V01",
        ZoneOffset.of("+05:30"),
        null,
        UUID.fromString("3a10310c-3f57-4880-aa7e-9745d733ef9c"),
        UUID.randomUUID(),
        "VerveTronics"
    ).apply { this.iotModel = sampleIotModel }

    val sampleSensorReading = SensorReading(
        "55AA55AA55AA55AA55AA55AA55AA0000",
        0U,
        Instant.now(),
        "0000000A"
    )
}
