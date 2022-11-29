package com.vervetronics.cloudapp.iot.device

import com.vervetronics.cloudapp.assertStatus
import com.vervetronics.cloudapp.error.ApiError
import com.vervetronics.cloudapp.iot.model.IotModel
import com.vervetronics.cloudapp.iot.model.IotModelRepository
import com.vervetronics.cloudapp.iot.model.mustFindByIotModelName
import com.vervetronics.cloudapp.iot.model.sensor.Sensor
import com.vervetronics.cloudapp.iot.model.sensor.SensorService
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.exchange
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.boot.test.web.client.postForEntity
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod.PUT
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.CONFLICT
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.http.HttpStatus.OK
import org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.MediaType.TEXT_PLAIN
import java.time.LocalDate
import java.time.ZoneOffset
import java.util.UUID

@ExperimentalUnsignedTypes
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class DeviceIotControllerTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val deviceIotRepository: IotDeviceRepository,
    @Autowired private val deviceIotService: DeviceIotService,
    @Autowired private val iotModelRepository: IotModelRepository,
    @Autowired private val iotSensorService: SensorService
) {

    private val sampleIotDevice: IotDevice = IotDevice(
        "0xAABBCCDDEEFF55CC55CC55CC55CC55CC",
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
    )
    private val sampleIotDevice2: IotDevice = IotDevice(
        "0xAABBCCDDEEFF55CC55CC55CC55CC55BB",
        "Forklift",
        "Forklift",
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

    @BeforeEach
    fun setup() {
        deviceIotRepository.deleteAll()
        iotModelRepository.deleteAll()
        iotModelRepository.save(IotModel("Crane"))
        iotModelRepository.save(IotModel("Forklift"))
    }

    @AfterEach
    fun cleanUp() {
        deviceIotRepository.deleteAll()
        iotModelRepository.deleteAll()
    }

    @Test
    @DisplayName("POST /api/1.0/devices returns 201 Created")
    fun `POST iotDevices returns 201 Created`() {
        val path = "/api/1.0/devices"
        val response = testRestTemplate.postForEntity<Any>(path, sampleIotDevice)
        response.assertStatus(HttpStatus.CREATED)
    }

    @Test
    @DisplayName("POST /api/1.0/devices with wrong content type returns 415 Unsupported Media Type")
    fun `POST iotDevices with wrong content type returns 415 Unsupported Media Type`() {
        val entity = HttpEntity<String>(
            """$sampleIotDevice""",
            HttpHeaders().apply { contentType = TEXT_PLAIN }
        )
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTDEVICES, entity)
        response.assertStatus(UNSUPPORTED_MEDIA_TYPE)
    }

    @Test
    @DisplayName("POST /api/1.0/devices with syntax error in JSON returns 400 Bad Request")
    fun `POST iotDevices with syntax error in JSON returns 400 Bad Request`() {
        val entity = HttpEntity<String>(
            """{""",
            HttpHeaders().apply { contentType = APPLICATION_JSON }
        )
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTDEVICES, entity)
        response.assertStatus(BAD_REQUEST)
    }

    @Disabled
    @Test
    @DisplayName("POST /api/1.0/devices with duplicate IotDevice returns 409 ")
    fun `POST iotDevice with a duplicate model returns 409 Conflict`() {
        val iotDevice = sampleIotDevice
        deviceIotService.save(iotDevice)
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTDEVICES, iotDevice)
        response.assertStatus(CONFLICT)
    }

    @Test
    @DisplayName("POST /api/1.0/device with invalid iot model returns 404 NOT FOUND")
    fun `POST iot device with invalid iot model returns 404 NOT FOUND`() {
        val iotDevice = sampleIotDevice.copy(modelName = "Random Name")
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTDEVICES, iotDevice)
        response.assertStatus(NOT_FOUND)
    }

    @Test
    @DisplayName("GET /api/1.0/devices returns 200 OK and Iot Devices")
    fun `GET IotDevices returns 200 status and IotDevices`() {
        val iotDevice = sampleIotDevice
        deviceIotService.save(iotDevice)
        var path = "/api/1.0/devices"
        val response = testRestTemplate.getForEntity<Any>(path)
        response.assertStatus(OK)
        assertNotNull(response.body)
        path = "$API_10_IOTDEVICES/${iotDevice.deviceName}"
        testRestTemplate.delete(path)
    }

    @Test
    @DisplayName("GET /api/1.0/device/{id} with valid id returns 200 OK")
    fun `GET iotDevices with valid id returns 200 OK`() {
        val iotDevice = sampleIotDevice
        val iotDeviceId = deviceIotService.save(sampleIotDevice).id
        var path = "/api/1.0/device/$iotDeviceId"
        val response = testRestTemplate.getForEntity<Any>(path)
        response.assertStatus(OK)
        assertNotNull(response.body)
        path = "$API_10_IOTDEVICES/${iotDevice.deviceName}"
        testRestTemplate.delete(path)
    }

    @Test
    @DisplayName("GET /api/1.0/device/{id} with invalid id returns 404 NOT FOUND")
    fun `GET iotDevices with invalid id returns 404 NOT FOUND`() {
        val path = "/api/1.0/device/${UUID.randomUUID()}"
        val response = testRestTemplate.getForEntity<Any>(path)
        response.assertStatus(NOT_FOUND)
    }

    @Test
    @DisplayName("PUT /api/1.0/{deviceName} with IotDevice returns 200 OK")
    fun `PUT iotDevice with valid IotDevice returns OK`() {
        val savedIotDevice = deviceIotService.save(sampleIotDevice)
        val path = "$API_10_IOTDEVICES/${savedIotDevice.deviceName}"
        val updatedIotDevice = sampleIotDevice2
        val requestEntity: HttpEntity<IotDevice> = HttpEntity(updatedIotDevice)
        val response = testRestTemplate.exchange<String>(path, PUT, requestEntity)
        response.assertStatus(OK)
    }

    @Test
    @DisplayName("PUT /api/1.0/{deviceName} with IotDevice returns Response IotDevice")
    fun `PUT iotDevice with valid IotDevice returns IotDevice`() {
        val savedIotDevice = deviceIotService.save(sampleIotDevice)
        val path = "$API_10_IOTDEVICES/${savedIotDevice.deviceName}"
        val updatedIotDevice = sampleIotDevice2
        val requestEntity: HttpEntity<IotDevice> = HttpEntity(updatedIotDevice)
        val response = testRestTemplate.exchange<String>(path, PUT, requestEntity)
        response.assertStatus(OK)
        assertTrue(response.body!!.contains(sampleIotDevice2.deviceName))
    }

    @Test
    @DisplayName("PUT /api/1.0/{deviceName} with incorrect IotDevice name Return 404 NOT FOUND")
    fun `PUT iotDevice with incorrect name returns 404  NOT FOUND`() {
        val path = "$API_10_IOTDEVICES/IncorrectDeviceName"
        val updatedIotDevice = sampleIotDevice2
        val requestEntity: HttpEntity<IotDevice> = HttpEntity(updatedIotDevice)
        val response = testRestTemplate.exchange<ApiError>(path, PUT, requestEntity)
        response.assertStatus(NOT_FOUND)
        assertEquals(response.body!!.message, "IncorrectDeviceName not found")
    }

    @Test
    @DisplayName("DELETE /api/1.0/{deviceName} remove IotDevice from db returns 200 OK")
    fun `DELETE iotDevice with name returns 200 OK`() {
        val iotDevice = sampleIotDevice
        deviceIotService.save(iotDevice)
        val path = "$API_10_IOTDEVICES/${iotDevice.deviceName}"
        testRestTemplate.delete(path)
        assertEquals(0, deviceIotRepository.count())
    }

    @Test
    @DisplayName("DELETE /api/1.0/{deviceName} with non existing device name returns ")
    fun `DELETE iotDevice with non existing device name returns error`() {
        val iotDevice = sampleIotDevice
        deviceIotService.save(iotDevice)
        val path = "$API_10_IOTDEVICES/wrongDeviceName"
        testRestTemplate.delete(path)
        assertEquals(1, deviceIotRepository.count())
    }

    @Test
    fun testGetSensorByFactoryDeviceIdAndSensorId() {
        // given
        val iotModel = iotModelRepository.mustFindByIotModelName("Crane")
        val expectedSensor = iotSensorService.save(iotModel.id, sampleSensor)
        deviceIotService.save(sampleIotDevice)

        // when
        val actualSensor =
            deviceIotService.mustFindSensorBySerialNumberAndSensorId(
                sampleIotDevice.serialNumber,
                expectedSensor.sensorId
            )

        // then
        assertEquals(expectedSensor.sensorId, actualSensor.sensorId)
    }

    private val sampleSensor =
        Sensor(
            "13",
            "Button Up",
            "High",
            "1",
            "0",
            "1",
            "0ms", // Change to value != 0
            "value", // Change to UShort
            "Int", // Change to Boolean
            "Int",
            "Count"
        )

    companion object {
        const val API_10_IOTDEVICES = "/api/1.0/devices"
    }
}
