package com.vervetronics.cloudapp.dashboard

import com.nelkinda.kotlin.Data
import com.nelkinda.rel.ExpressionCompiler
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.iot.device.IotDevice
import com.vervetronics.cloudapp.iot.device.IotDeviceRepository
import com.vervetronics.cloudapp.iot.model.IotModel
import com.vervetronics.cloudapp.iot.model.IotModelRepository
import com.vervetronics.cloudapp.iot.model.sensor.Sensor
import com.vervetronics.cloudapp.storage.SensorReading
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.any
import org.mockito.Mockito.reset
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.MockBeans
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.UUID
import javax.persistence.EntityNotFoundException
import kotlin.test.assertIs

@ExperimentalUnsignedTypes
@MockBeans(
    MockBean(SensorReadingRepository::class),
    MockBean(IotDeviceRepository::class),
    MockBean(IotModelRepository::class),
    MockBean(ExpressionCompiler::class),
    MockBean(DeviceIotService::class)
)
@SpringBootTest(
    classes = [
        DashboardService::class
    ]
)
class DashboardServiceTest(
    @Autowired private val sensorReadingRepository: SensorReadingRepository,
    @Autowired private val iotDeviceRepository: IotDeviceRepository,
    @Autowired private val dashboardService: DashboardService
) {
    @BeforeEach
    fun prepareMocks() {
        // given
        `when`(iotDeviceRepository.getById(any())).thenThrow(EntityNotFoundException())
    }

    @Test
    fun givenNoDevices_thenDeviceListIsEmpty() {
        // Given
        `when`(sensorReadingRepository.findAllDevices()).thenReturn(listOf())
        `when`(iotDeviceRepository.findAll()).thenReturn(listOf())

        // When
        val deviceList = dashboardService.getAllDevices()

        // Then
        assertTrue(deviceList.isEmpty())
    }

    @Test
    fun givenUnregisteredDevice_thenDeviceListIsEmpty() {
        // Given
        `when`(sensorReadingRepository.findAllDevices()).thenReturn(listOf("0102030405060708090A0B0C0D0E0F10"))
        `when`(iotDeviceRepository.findAll()).thenReturn(listOf())

        // When
        val deviceList = dashboardService.getAllDevices()

        // Then
        assertTrue(deviceList.isEmpty())
    }

    @Test
    fun givenUnusedDevice_thenDeviceListContainsDevice() {
        // Given
        val uuidOfDevice = UUID.randomUUID()
        val iotDevice = sampleIotDevice1.apply { id = uuidOfDevice }
        `when`(sensorReadingRepository.findAllDevices()).thenReturn(listOf())
        `when`(iotDeviceRepository.findAll()).thenReturn(listOf(iotDevice))

        // When
        val deviceList = dashboardService.getAllDevices()

        // Then
        val expectedDeviceListEntry = DeviceListEntry(
            uuidOfDevice,
            "0102030405060708090A0B0C0D0E0F10",
            "Sample Device"
        )
        assertEquals(listOf(expectedDeviceListEntry), deviceList)
    }

    @Test
    fun givenValidSensorId_thenReturnsLatestSensorReadings() {
        // Given
        val iotModel = IotModel("IoT Model").apply { this.sensors = listOf(sampleSensor) }
        val latestSensorReadings = sampleLatestSensorReadings

        val iotDevice = sampleIotDevice1.apply {
            id = UUID.randomUUID()
            this.iotModel = iotModel
        }

        reset(iotDeviceRepository)
        `when`(iotDeviceRepository.getById(iotDevice.id)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber)).thenReturn(latestSensorReadings)

        // when
        val latestSensorData = dashboardService.getLatestSensorReadings(iotDevice.id).latestSensorData

        // then
        assertNotNull(latestSensorData)
        assertTrue(latestSensorReadings.isNotEmpty())
    }

    @Test
    fun givenValidSensorIdWithSensorDataMissingInModel_thenReturnsLatestSensorReadings() {
        // Given
        val iotModel = IotModel("IoT Model").apply { this.sensors = listOf(sampleSensor) }
        val iotDevice = sampleIotDevice1.apply {
            id = UUID.randomUUID()
            this.iotModel = iotModel
        }

        reset(iotDeviceRepository)
        `when`(iotDeviceRepository.getById(iotDevice.id)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber))
            .thenReturn(sampleLatestSensorReadings)

        // when
        val latestSensorData = dashboardService.getLatestSensorReadings(iotDevice.id, false).latestSensorData

        // then
        assertNotNull(latestSensorData)
        assertEquals(2, latestSensorData.size)
    }

    @Test
    fun givenValidSensorIdWithAllSensorData_thenReturnsLatestSensorReadings() {
        // Given
        val iotModel = IotModel("IoT Model").apply { this.sensors = listOf(sampleSensor) }
        val iotDevice = sampleIotDevice1.apply {
            id = UUID.randomUUID()
            this.iotModel = iotModel
        }

        reset(iotDeviceRepository)
        `when`(iotDeviceRepository.getById(iotDevice.id)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber))
            .thenReturn(sampleLatestSensorReadings)

        // when
        val latestSensorData = dashboardService.getLatestSensorReadings(iotDevice.id, true).latestSensorData
        println(latestSensorData)

        // then
        assertNotNull(latestSensorData)
        assertEquals(8, latestSensorData.size)
    }

    @Test
    fun givenValidSensorIdWithNull_thenReturnsLatestSensorReadings() {
        // Given
        val iotModel = IotModel("IoT Model").apply { this.sensors = listOf(sampleSensor) }
        val iotDevice = sampleIotDevice1.apply {
            id = UUID.randomUUID()
            this.iotModel = iotModel
        }

        reset(iotDeviceRepository)
        `when`(iotDeviceRepository.getById(iotDevice.id)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber))
            .thenReturn(sampleLatestSensorReadings)

        // when
        val latestSensorData = dashboardService.getLatestSensorReadings(iotDevice.id, null).latestSensorData
        println(latestSensorData)

        // then
        assertNotNull(latestSensorData)
        assertEquals(2, latestSensorData.size)
    }

    @Test
    fun givenInValidSensorId_thenReturnsLatestSensorReadings() {
        // when
        val occurredException: Exception = assertThrows {
            dashboardService.getLatestSensorReadings(UUID.randomUUID())
        }
        // then
        assertIs<EntityNotFoundException>(occurredException)
    }

    @Test
    fun givenIncorrectSensorId_thenReturnsLatestSensorReadings() {
        // when
        val occurredException: Exception = assertThrows {
            dashboardService.getLatestSensorReadings(UUID.fromString("123"))
        }
        // then
        assertIs<IllegalArgumentException>(occurredException)
    }

    @Test
    fun givenAllCorrectFields_thenReturnsSensorDataForInBetweenDays() {
        // given
        val deviceId = UUID.randomUUID()
        val iotDevice = sampleIotDevice.apply { id = deviceId }
        val sensorId = "0001"
        val start = LocalDateTime.now().minusDays(1)
        val end = LocalDateTime.now()
        val sensorReadings = sampleSensorReadings
        reset(iotDeviceRepository)
        `when`(iotDeviceRepository.getById(deviceId)).thenReturn(iotDevice)
        `when`(
            sensorReadingRepository.getSensorReadingInBetweenDays(
                "0102030405060708090A0B0C0D0E0F12",
                sensorId,
                start,
                end
            )
        ).thenReturn(sensorReadings)

        // when
        val actualReadings = dashboardService.getSensorReadingBetweenDays(deviceId, sensorId, start, end)

        // then
        assertNotNull(actualReadings)
        assertEquals(sensorReadings, actualReadings)
    }

    private val sampleIotDevice = IotDevice(
        "0102030405060708090A0B0C0D0E0F12",
        "Sample Device",
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
    )
    private val sampleIotDevice1 = IotDevice(
        serialNumber = "0102030405060708090A0B0C0D0E0F10",
        deviceName = "Sample Device",
        modelName = "",
        status = "",
        manufacturingDate = LocalDate.of(2020, 1, 1),
        serverFirmwareVersion = "",
        deviceFirmwareVersion = "",
        downloadStatus = "",
        firmwareId = UUID.fromString("3a10310c-3f57-4880-aa7e-9745d733ef9c"),
        companyId = UUID.randomUUID(),
        companyName = "VerveTronics"
    )

    private val sampleSensor = Sensor(
        "13",
        "Button Up",
        "High",
        "1",
        "0",
        "1",
        "0ms",
        "value",
        "Int",
        "Int",
        "Count"
    )
    private val sampleSensorReadings = listOf(
        SensorReading(
            Data("0102030405060708090A0B0C0D0E0F12"),
            1u,
            Instant.now(),
            Data("0000")
        )
    )

    private val sampleLatestSensorReadings = listOf(
        SensorReading(Data("0102030405060708090A0B0C0D0E0F12"), 0u, Instant.now(), Data("0000")),
        SensorReading(Data("0102030405060708090A0B0C0D0E0F12"), 1u, Instant.now(), Data("0000")),
        SensorReading(Data("0102030405060708090A0B0C0D0E0F12"), 2u, Instant.now(), Data("0000"))
    )
}
