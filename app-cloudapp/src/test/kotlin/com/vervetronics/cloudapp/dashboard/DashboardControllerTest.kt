package com.vervetronics.cloudapp.dashboard

import com.nelkinda.kotlin.Data
import com.vervetronics.cloudapp.CloudAppApplication
import com.vervetronics.cloudapp.assertStatus
import com.vervetronics.cloudapp.iot.device.IotDevice
import com.vervetronics.cloudapp.iot.device.IotDeviceRepository
import com.vervetronics.cloudapp.iot.model.IotModel
import com.vervetronics.cloudapp.iot.model.sensor.Sensor
import com.vervetronics.cloudapp.storage.SensorReading
import com.vervetronics.cloudapp.storage.SensorReadingRepository
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.mockito.kotlin.any
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.MockBeans
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.http.HttpStatus
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.UUID
import javax.persistence.EntityNotFoundException

@ExperimentalUnsignedTypes
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = [CloudAppApplication::class, DashboardController::class]
)
@MockBeans(
    MockBean(IotDeviceRepository::class),
    MockBean(SensorReadingRepository::class)
)
class DashboardControllerTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val iotDeviceRepository: IotDeviceRepository,
    @Autowired private val sensorReadingRepository: SensorReadingRepository
) {
    @Test
    @DisplayName("Given no devices, GET /api/1.0/dashboard/devices returns 200 Ok and an empty list")
    fun testEmptyDeviceList() {
        `when`(iotDeviceRepository.findAll()).thenReturn(emptyList())
        val path = "/api/1.0/dashboard/devices"
        val response = testRestTemplate.getForEntity<List<DeviceListEntry>>(path)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        assertTrue(body!!.isEmpty())
    }

    @Test
    @DisplayName("Given valid device id, GET /dashboard/devices/{deviceId}/sensors/latest returns 200")
    fun testLatestSensorWithValidDeviceId() {
        // given
        val deviceId = UUID.randomUUID()

        val iotDevice = sampleIotDevice
        iotDevice.apply {
            id = deviceId
            this.iotModel = IotModel("IoT Model").apply { this.sensors = listOf(sampleSensor) }
        }

        `when`(iotDeviceRepository.getById(deviceId)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber))
            .thenReturn(sampleLatestSensorReadings)

        // when
        val path = "/api/1.0/dashboard/devices/$deviceId/sensors/latest?showSensorsMissingInModel=true"
        val response = testRestTemplate.getForEntity(path, Object::class.java)

        // then
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    @DisplayName(
        "Given valid device id and do not show missing data," +
            " GET /dashboard/devices/{deviceId}/sensors/latest returns 200"
    )
    fun testLatestSensorWithValidDeviceIdAndDoNotShowMissingSensorDataInModel() {
        // given
        val deviceId = UUID.randomUUID()

        val iotDevice = sampleIotDevice
        iotDevice.apply {
            id = deviceId
            this.iotModel = IotModel("IoT Model").apply { this.sensors = listOf(sampleSensor) }
        }

        `when`(iotDeviceRepository.getById(deviceId)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber))
            .thenReturn(sampleLatestSensorReadings)

        // when
        val path = "/api/1.0/dashboard/devices/$deviceId/sensors/latest?showSensorsMissingInModel=false"
        val response = testRestTemplate.getForEntity(path, Object::class.java)

        // then
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    @DisplayName(
        "Given valid device id with show missing sensor data, " +
            "GET /dashboard/devices/{deviceId}/sensors/latest returns 200"
    )
    fun testLatestSensorWithValidDeviceIdAndShowAllSensorData() {
        // given
        val deviceId = UUID.randomUUID()

        val iotDevice = sampleIotDevice
        iotDevice.apply {
            id = deviceId
            this.iotModel = IotModel("IoT Model")
        }
        `when`(iotDeviceRepository.getById(deviceId)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber)).thenReturn(listOf())

        // when
        val path = "/api/1.0/dashboard/devices/$deviceId/sensors/latest"
        val response = testRestTemplate.getForEntity(path, Object::class.java)

        // then
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    @DisplayName("Given no devices, GET /dashboard/devices/{deviceId}/sensors/latest returns 404")
    fun testLatestSensorWithNoDevice() {
        `when`(iotDeviceRepository.getById(any())).thenThrow(EntityNotFoundException())
        val path = "/api/1.0/dashboard/devices/${UUID.randomUUID()}/sensors/latest"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.NOT_FOUND)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    @DisplayName("Given invalid device id, GET /dashboard/devices/{deviceId}/sensors/latest returns 400")
    fun testLatestSensorWithInvalidDeviceId() {
        `when`(iotDeviceRepository.findAll()).thenReturn(emptyList())
        val invalidDeviceId = "123"
        val path = "/api/1.0/dashboard/devices/$invalidDeviceId/sensors/latest"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.BAD_REQUEST)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    @DisplayName("Given invalid device id, GET /devices/{deviceId}/sensors/{sensorId}/readings returns 404")
    fun testGetDataForSelectedDatesWithInvalidDeviceId() {
        val sensorId = "0001"
        val start = LocalDateTime.now().minusDays(1).toString()
        val end = LocalDateTime.now().toString()
        val path = "/api/1.0/dashboard/devices/${UUID.randomUUID()}/sensors/$sensorId/readings?start=$start&end=$end"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.NOT_FOUND)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    @DisplayName("Given empty device id, GET /devices/{deviceId}/sensors/{sensorId}/readings returns 400")
    fun testGetDataForSelectedDatesWithEmptyDeviceId() {
        val deviceId = ""
        val sensorId = "0001"
        val start = LocalDate.now().minusDays(1).toString()
        val end = LocalDate.now().toString()
        val path = "/api/1.0/dashboard/devices/$deviceId/sensors/$sensorId/readings?start=$start&end=$end"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.BAD_REQUEST)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    @DisplayName("Given Valid Device ID, GET dashboard/{deviceId}/location returns 200")
    fun testLatestLocationDataWithValidDeviceId() {
        val deviceId = UUID.randomUUID()
        val iotDevice = sampleIotDevice
        iotDevice.apply {
            id = deviceId
            this.iotModel = IotModel("IoT Model").apply { this.sensors = listOf(sampleSensor1) }
        }
        `when`(iotDeviceRepository.getById(deviceId)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber))
            .thenReturn(sampleLatestSensorReadings)

        val path = "/api/1.0/dashboard/$deviceId/location"
        val response = testRestTemplate.getForEntity(path, Object::class.java)

        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        printThis(body)
    }

    @Test
    @DisplayName("Given Valid Device ID But without longitude,latitude sensors should give empty list")
    fun locationApiShouldGiveEmptyListWhenLongitudeLatitudeNotPresent() {
        val deviceId = UUID.randomUUID()
        val iotDevice = sampleIotDevice
        iotDevice.apply {
            id = deviceId
            this.iotModel = IotModel("IoT Model").apply { this.sensors = listOf(sampleSensor) }
        }
        `when`(iotDeviceRepository.getById(deviceId)).thenReturn(iotDevice)
        `when`(sensorReadingRepository.getLatestSensorReadings(iotDevice.serialNumber))
            .thenReturn(sampleLatestSensorReadings)

        val path = "/api/1.0/dashboard/$deviceId/location"
        val response = testRestTemplate.getForEntity(path, Object::class.java)

        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        printThis(body)
    }

    private val sampleIotDevice = IotDevice(
        "0102030405060708090A0B0C0D0E0F10",
        "Sample Device",
        "xyz",
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

    @Test
    @DisplayName("Given no devices, GET /dashboard/devices/{deviceId}/sensors/latest/calculated returns 404")
    fun testLatestCalculatedSensorWithNoDevice() {
        `when`(iotDeviceRepository.getById(any())).thenThrow(EntityNotFoundException())
        val path = "/api/1.0/dashboard/devices/${UUID.randomUUID()}/sensors/latest/calculated"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.NOT_FOUND)
        val body = response.body
        assertNotNull(body)
    }

    @ExperimentalUnsignedTypes
    private val sampleLatestSensorReadings = listOf(
        SensorReading(Data("0102030405060708090A0B0C0D0E0F12"), 0u, Instant.now(), Data("0000")),
        SensorReading(Data("0102030405060708090A0B0C0D0E0F12"), 1u, Instant.now(), Data("0000")),
        SensorReading(Data("0102030405060708090A0B0C0D0E0F12"), 2u, Instant.now(), Data("0000"))
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

    private val sampleSensor1 = Sensor(
        "14",
        "Latitude",
        "None",
        "2",
        "0",
        "1",
        "20ms",
        "value",
        "Int",
        "Int",
        "Count"

    )
    fun printThis(body: Any?) {
        System.err.println("++++++++++++++++++++++++++++++++++++++")
        System.err.println(body)
        System.err.println("++++++++++++++++++++++++++++++++++++++")
    }
}
