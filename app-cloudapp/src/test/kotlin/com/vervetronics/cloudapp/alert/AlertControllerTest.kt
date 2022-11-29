package com.vervetronics.cloudapp.alert

import com.vervetronics.cloudapp.CloudAppApplication
import com.vervetronics.cloudapp.assertStatus
import com.vervetronics.cloudapp.error.ApiError
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.iot.device.IotDevice
import com.vervetronics.cloudapp.iot.model.IotModel
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.MockBeans
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit
import java.util.UUID

@ExperimentalUnsignedTypes
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = [CloudAppApplication::class, AlertController::class]
)
@MockBeans(
    MockBean(DeviceIotService::class)
)
class AlertControllerTest(
    @Autowired private val alertRepository: AlertRepository,
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val alertService: AlertService,
    @Autowired private val deviceIotService: DeviceIotService
) {
    private val sampleAlert1 =
        Alert(UUID.randomUUID(), "Button Up", UUID.randomUUID(), Instant.now(), "1", "High", "xyz", "Bob", "Unresolved")
    private val sampleAlert2 =
        Alert(UUID.randomUUID(), "Button Down", UUID.randomUUID(), Instant.now(), "2", "Low", "abc", "Ben", "Resolved")

    @BeforeEach
    fun setup() = alertRepository.deleteAll()

    @AfterEach
    fun cleanup() = alertRepository.deleteAll()

    @Test
    fun `Get all alerts when retrieving existing alert then return status OK`() {
        val sampleAlert = sampleAlert1
        alertRepository.save(sampleAlert)
        alertRepository.save(sampleAlert2)
        val path = "/api/1.0/alerts/all"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    fun `Get alert when retrieving existing alert by alert id then return alert with status OK`() {
        val sampleAlert = sampleAlert1
        val alert = alertRepository.save(sampleAlert)
        val path = "/api/1.0/alerts/${alert.id}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)

        // then
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
    }

    @Disabled
    @Test
    fun `test when retrieving invalid alert then return status NOT FOUND`() {
        val path = "/api/1.0/alerts/${UUID.randomUUID()}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)

        // then
        response.assertStatus(HttpStatus.NOT_FOUND)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    fun `Get alerts by sensor id with valid alerts returns status OK`() {
        val sampleAlert = sampleAlert1
        alertRepository.save(sampleAlert)
        val path = "/api/1.0/alerts/sensor/${sampleAlert.sensorId}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    fun `Get alerts by sensor id in between start and end date returns list of alert and status OK`() {
        var sampleAlert = sampleAlert1
        sampleAlert = alertRepository.save(sampleAlert)
        val start = Instant.now().minus(1, ChronoUnit.DAYS)
        val end = Instant.now().plus(2, ChronoUnit.DAYS)
        val path = "/api/1.0/alerts/sensor/${sampleAlert.sensorId}?start=$start&end=$end"
        val response = testRestTemplate.getForEntity(path, String::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        assertTrue(body!!.contains(sampleAlert.id.toString()))
        assertNotEquals("[ ]", body)
    }

    @Test
    fun `Get alerts by sensor id when alert out of start and end date returns empty list and status OK`() {
        var sampleAlert = sampleAlert1
        sampleAlert = alertRepository.save(sampleAlert)
        val start = Instant.now().minus(2, ChronoUnit.DAYS)
        val end = Instant.now().minus(1, ChronoUnit.DAYS)
        val path = "/api/1.0/alerts/sensor/${sampleAlert.sensorId}?start=$start&end=$end"
        val response = testRestTemplate.getForEntity(path, String::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        assertEquals("[ ]", body)
    }

    @Test
    fun `Get alerts by sensor id when only alert in bound alert is returns and status OK`() {
        var sampleAlert = sampleAlert1
        sampleAlert = alertRepository.save(sampleAlert)
        val sampleAlert1 = alertRepository.save(sampleAlert)
        val start = Instant.now().minus(2, ChronoUnit.DAYS)
        val end = Instant.now().plus(1, ChronoUnit.DAYS)
        val path = "/api/1.0/alerts/sensor/${sampleAlert.sensorId}?start=$start&end=$end"
        val response = testRestTemplate.getForEntity(path, String::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        assertTrue(body!!.contains(sampleAlert1.id.toString()))
        assertNotEquals("[ ]", body)
    }

    @Test
    fun `Get alerts by sensor id with different data type returns status Bad Request`() {
        val path = "/api/1.0/alerts/sensor/foobar"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.BAD_REQUEST)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    fun `Get alerts by sensor id with invalid sensor id returns empty list`() {
        val sampleAlert = sampleAlert1
        alertRepository.save(sampleAlert)
        val path = "/api/1.0/alerts/sensor/${UUID.randomUUID()}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        val body = response.body
        assertNotNull(body)
        response.assertStatus(HttpStatus.OK)
        assertEquals("[]", "$body")
    }

    @Test
    fun `Get alerts by device id with valid alerts returns status OK`() {
        val sampleAlert = sampleAlert1
        alertRepository.save(sampleAlert)
        val path = "/api/1.0/alerts/device/${sampleAlert.deviceId}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
    }

    @Test
    fun `Get alerts by device id in between start and end date returns list of alert and status OK`() {
        var sampleAlert = sampleAlert1
        sampleAlert = alertRepository.save(sampleAlert)
        val start = Instant.now().minus(1, ChronoUnit.DAYS)
        val end = Instant.now().plus(2, ChronoUnit.DAYS)
        val path = "/api/1.0/alerts/device/${sampleAlert.deviceId}?start=$start&end=$end"
        val response = testRestTemplate.getForEntity(path, String::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        assertTrue(body!!.contains(sampleAlert.id.toString()))
        assertNotEquals("[ ]", body)
    }

    @Test
    fun `Get alerts by device id when alert out of start and end date returns empty list and status OK`() {
        var sampleAlert = sampleAlert1
        sampleAlert = alertRepository.save(sampleAlert)
        val start = Instant.now().minus(2, ChronoUnit.DAYS)
        val end = Instant.now().minus(1, ChronoUnit.DAYS)
        val path = "/api/1.0/alerts/device/${sampleAlert.deviceId}?start=$start&end=$end"
        val response = testRestTemplate.getForEntity(path, String::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        assertEquals("[ ]", body)
    }

    @Test
    fun `Get alerts by device id when only alert in bound alert is returned and status OK`() {
        var sampleAlert = sampleAlert1
        sampleAlert = alertRepository.save(sampleAlert)
        val sampleAlert1 = alertRepository.save(sampleAlert)
        val start = Instant.now().minus(2, ChronoUnit.DAYS)
        val end = Instant.now().plus(1, ChronoUnit.DAYS)
        val path = "/api/1.0/alerts/device/${sampleAlert.deviceId}?start=$start&end=$end"
        val response = testRestTemplate.getForEntity(path, String::class.java)
        response.assertStatus(HttpStatus.OK)
        val body = response.body
        assertNotNull(body)
        assertTrue(body!!.contains(sampleAlert1.id.toString()))
        assertNotEquals("[ ]", body)
    }

    @Test
    fun `Get alerts by device id with different type returns bad request 400`() {
        val path = "/api/1.0/alerts/device/foobar"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        val body = response.body
        assertNotNull(body)
        response.assertStatus(HttpStatus.BAD_REQUEST)
    }

    @Test
    fun `Get alerts by device id with invalid device id returns empty list`() {
        val sampleAlert = sampleAlert1
        alertRepository.save(sampleAlert)
        val path = "/api/1.0/alerts/device/${UUID.randomUUID()}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        val body = response.body
        assertNotNull(body)
        response.assertStatus(HttpStatus.OK)
    }

    @Test
    fun `Get unresolved alerts count by device id with 1 unresolved high priority alert`() {
        val iotDevice = sampleIotDevice.apply { this.id = UUID.randomUUID() }
        val sampleAlert = sampleAlert1.copy(deviceId = iotDevice.id)
        alertRepository.save(sampleAlert)

        Mockito.`when`(deviceIotService.getIotDeviceById(iotDevice.id))
            .thenReturn(sampleIotDevice)

        val path = "/api/1.0/alerts/unresolved/device/${sampleAlert.deviceId}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        val body = response.body
        assertNotNull(body)
        response.assertStatus(HttpStatus.OK)
        assertEquals("{High=1, Low=0, Medium=0, DeviceName=Crane}", body.toString())
    }

    @Test
    fun putAlert_whenUpdatingTheExistingAlert_thenReturnsOk() {
        val savedTemplate = alertService.save(sampleAlert1)
        val path = "/api/1.0/alerts/${savedTemplate.id}"
        val updatedAlert = sampleAlert2
        val requestEntity: HttpEntity<Alert> = HttpEntity(updatedAlert)
        val response = testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, Object::class.java)
        val body = response.body
        assertNotNull(body)
        response.assertStatus(HttpStatus.OK)
    }

    @Test
    fun putAlert_whenUpdatingTheExistingAlert_thenResponseContainsUpdatedAlert() {
        val savedTemplate = alertService.save(sampleAlert1)
        val path = "/api/1.0/alerts/${savedTemplate.id}"
        val updatedAlert = sampleAlert2
        val requestEntity: HttpEntity<Alert> = HttpEntity(updatedAlert)
        val response = testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, String::class.java)
        assertFalse(response.body!!.contains(sampleAlert1.alertDescription))
        assertTrue(response.body!!.contains(sampleAlert2.alertDescription))
    }

    @Disabled
    @Test
    fun putAlert_whenUpdatingNonExistingAlert_thenReturnsAPIError() {
        val incorrectAlertId = UUID.randomUUID().toString()
        val path = "/api/1.0/alerts/$incorrectAlertId"
        val updatedAlert = sampleAlert2
        val requestEntity: HttpEntity<Alert> = HttpEntity(updatedAlert)
        val response = testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, ApiError::class.java)
        response.assertStatus(HttpStatus.NOT_FOUND)
        assertEquals(
            "Unable to find com.vervetronics.cloudapp.alert.Alert with id $incorrectAlertId",
            response.body!!.message
        )
    }

    @Test
    fun `delete alerts by device name returns 200 Ok`() {
        val alert = sampleAlert1
        alertService.save(alert)
        val path = "/api/1.0/alerts/device/${alert.deviceId}"
        testRestTemplate.delete(path)
        assertEquals(0, alertRepository.count())
    }

    @Test
    fun `delete alerts by non existing device id returns error`() {
        alertService.save(sampleAlert1)
        val path = "/api/1.0/alerts/device/${UUID.randomUUID()}"
        testRestTemplate.delete(path)
        assertEquals(1, alertRepository.count())
    }

    @Test
    fun `delete alerts by sensor id returns 200`() {
        val alert = sampleAlert1
        alertService.save(alert)
        val path = "/api/1.0/alerts/sensor/${alert.sensorId}"
        testRestTemplate.delete(path)
        assertEquals(0, alertRepository.count())
    }

    @Test
    fun `delete alerts by non existing sensor id returns error`() {
        alertService.save(sampleAlert1)
        val path = "/api/1.0/alerts/sensor/${UUID.randomUUID()}"
        testRestTemplate.delete(path)
        assertEquals(1, alertRepository.count())
    }

    private val sampleIotModel = IotModel("Crane")

    private val sampleIotDevice = IotDevice(
        "55AA55AA55AA55AA55AA55AA55AA0000",
        "Crane",
        "xyz",
        "Active",
        LocalDate.of(2020, 1, 1),
        "EDMB210415V02",
        "EDMB210415V01",
        ZoneOffset.of("+05:30"),
        null,
        UUID.randomUUID(),
        UUID.randomUUID(),
        "VerveTronics"
    ).apply { this.iotModel = sampleIotModel }
}
