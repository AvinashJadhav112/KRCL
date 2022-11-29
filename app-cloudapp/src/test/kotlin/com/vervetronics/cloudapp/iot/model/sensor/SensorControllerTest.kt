package com.vervetronics.cloudapp.iot.model.sensor

import com.vervetronics.cloudapp.error.ApiError
import com.vervetronics.cloudapp.iot.model.IotModel
import com.vervetronics.cloudapp.iot.model.IotModelRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod.PUT
import org.springframework.http.HttpStatus
import java.util.UUID

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SensorControllerTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val iotModelRepository: IotModelRepository,
    @Autowired private val sensorRepository: SensorRepository
) {

    @BeforeEach
    fun cleanUp() {
        iotModelRepository.deleteAll()
        sensorRepository.deleteAll()
    }

    @Test
    fun postSensor_whenCreatingTwoNewSensors_thenReturnsStatusCREATED() {
        val (_, sensor, path) = setup()
        var response = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        assertEquals(HttpStatus.CREATED, response.statusCode)
        response =
            testRestTemplate.postForEntity(path, sampleSensor2, Object::class.java)
        assertEquals(HttpStatus.CREATED, response.statusCode)
    }

    @Test
    fun postSensor_whenCreatingInvalidSensor_thenReturnsStatusBADREQUEST() {
        val iotModel = createIotModelFactory()
        val iotModelId = iotModel.id
        val sensor = invalidSampleSensor
        val path = "/api/1.0/iotModel/$iotModelId/sensors"
        val response = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
    }

    @Test
    fun postSensor_whenCreatingTwoNewSensors_thenAddedToTheDatabase() {
        val (_, sensor, path) = setup()
        testRestTemplate.postForEntity(path, sensor, Object::class.java)
        testRestTemplate.postForEntity(path, sampleSensor2, Object::class.java)
        assertEquals(1, iotModelRepository.count())
        assertEquals(2, sensorRepository.count())
    }

    @Test
    fun postSensor_whenCreatingDuplicateSensor_thenReturnsStatusConflict() {
        val (_, sensor, path) = setup()
        val firstSensorResponse = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        val sensorId = firstSensorResponse.headers["Location"]?.get(0)?.split("/")?.get(6)

        val response = testRestTemplate.postForEntity(path, sensor, ApiError::class.java)

        assertEquals(HttpStatus.CONFLICT, response.statusCode)
        assertEquals("$sensorId ${sensor.name} already exist", response.body!!.message)
    }

    @Test
    fun postSensor_whenFormulaHasSyntaxError_thenReturnsStatusUnprocessableEntity() {
        val (_, _, path) = setup()
        val sensor = sampleSensorWithSyntaxErrorInTheFormula
        val response = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.statusCode)
    }

    @Test
    fun getSensor_whenCreatingSensor_thenReturnSensor() {
        val (iotModel, sensor, path) = setup()

        val sensorResponse = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        val sensorId = sensorResponse.headers["Location"]?.get(0)?.split("/")?.get(6)

        val getSensorPath = "/api/1.0/iotModel/${iotModel.id}/sensor/$sensorId"
        val response = testRestTemplate.getForEntity(getSensorPath, Sensor::class.java)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(response.body!!.name, sensor.name)
    }

    @Test
    fun getSensor_whenRetrievingNonExistingSensor_thenReturnError() {
        val incorrectIotModelId = UUID.randomUUID()
        val incorrectSensorId = UUID.randomUUID()
        val path = "/api/1.0/iotModel/$incorrectIotModelId/sensor/$incorrectSensorId"
        val response = testRestTemplate.getForEntity(path, ApiError::class.java)

        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
        assertEquals("$incorrectSensorId not found", response.body!!.message)
    }

    @Test
    fun deleteSensor_whenDeletingExistingSensor_thenDeleteSensorFromDatabase() {
        val (iotModel, sensor, path) = setup()
        val sensorResponse = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        val sensorId = sensorResponse.headers["Location"]?.get(0)?.split("/")?.get(6)
        val sensorPath = "/api/1.0/iotModel/${iotModel.id}/sensor/$sensorId"
        testRestTemplate.delete(sensorPath)

        assertEquals(0, sensorRepository.count())
    }

    @Disabled
    @Test
    fun deleteSensor_whenDeletingNonExistingSensor_thenReturnsNotFound() {
        val (iotModel, sensor, path) = setup()
        val sensorResponse = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        sensorResponse.headers["Location"]?.get(0)?.split("/")?.get(6)
        val sensorPath = "/api/1.0/iotModel/${iotModel.id}/sensor/${UUID.randomUUID()}"
        testRestTemplate.delete(sensorPath)

        assertEquals(0, sensorRepository.count())
    }

    @Test
    fun putSensor_whenUpdatingNotExistingSensor_thenReturnsApiError() {
        val (iotModel, sensor, path) = setup()
        val sensorResponse = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        val sensorId = sensorResponse.headers["Location"]?.get(0)?.split("/")?.get(6)

        var incorrectSensorId = UUID.randomUUID().toString()
        if (sensorId.equals(incorrectSensorId)) incorrectSensorId = UUID.randomUUID().toString()
        val sensorPath = "/api/1.0/iotModel/${iotModel.id}/sensor/$incorrectSensorId"
        val newSensor = sampleSensor2
        val response =
            testRestTemplate.exchange(sensorPath, PUT, HttpEntity<Sensor>(newSensor), ApiError::class.java)

        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
        assertEquals("$incorrectSensorId not found", response.body!!.message)
    }

    @Test
    fun putSensor_whenUpdatingTheExistingSensor_thenResponseContainsUpdatedSensorAndStatusOK() {
        val (iotModel, sensor, path) = setup()
        val sensorResponse = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        val sensorId = sensorResponse.headers["Location"]?.get(0)?.split("/")?.get(6)
        val sensorPath = "/api/1.0/iotModel/${iotModel.id}/sensor/$sensorId"
        val newSensor = sampleSensor2
        val response =
            testRestTemplate.exchange(sensorPath, PUT, HttpEntity<Sensor>(newSensor), Sensor::class.java)

        assertNotNull(response)
        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(newSensor.name, response.body!!.name)
        assertEquals(newSensor.alertCriticality, response.body!!.alertCriticality)
        assertEquals(newSensor.dashboardOrder, response.body!!.dashboardOrder)
        assertEquals(newSensor.min, response.body!!.min)
        assertEquals(newSensor.max, response.body!!.max)
        assertEquals(newSensor.alertTime, response.body!!.alertTime)
        assertEquals(newSensor.formula, response.body!!.formula)
        assertEquals(newSensor.rawDataType, response.body!!.rawDataType)
        assertEquals(newSensor.processedDataType, response.body!!.processedDataType)
        assertEquals(newSensor.unit, response.body!!.unit)
        assertEquals(newSensor.sensorId, response.body!!.sensorId)
        assertEquals(newSensor.iotModel, response.body!!.iotModel)
    }

    @Test
    fun putSensor_whenFormulaHasSyntaxError_thenReturnsStatusUnprocessableEntity() {
        val (_, _, path) = setup()
        val sensor = sampleSensorWithSyntaxErrorInTheFormula
        sensor.formula = "value"
        val creationResponse = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        val location = creationResponse.headers["Location"]!![0]!!
        assertTrue(creationResponse.statusCode in setOf(HttpStatus.OK, HttpStatus.CREATED))

        val sensorWithError = testRestTemplate.getForEntity(location, Sensor::class.java).body!!
        sensorWithError.formula = "]"

        val response = testRestTemplate.exchange(
            location,
            PUT,
            HttpEntity<Sensor>(sensorWithError),
            ApiError::class.java
        )
        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.statusCode)
    }

    @Disabled
    @Test
    fun putSensor_whenWrongDataType_thenReturnsStatusBADREQUEST() {
        val (iotModel, sensor, path) = setup()
        val sensorResponse = testRestTemplate.postForEntity(path, sensor, Object::class.java)
        val sensorId = sensorResponse.headers["Location"]?.get(0)?.split("/")?.get(6)
        val sensorPath = "/api/1.0/iotModel/${iotModel.id}/sensor/$sensorId"
        val newSensor = invalidSampleSensor2
        val response =
            testRestTemplate.exchange(sensorPath, PUT, HttpEntity<Sensor>(newSensor), Sensor::class.java)
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
    }

    private fun setup(): Triple<IotModel, Sensor, String> {
        val iotModel = createIotModelFactory()
        val iotModelId = iotModel.id
        val sensor = sampleSensor1
        val path = "/api/1.0/iotModel/$iotModelId/sensors"
        return Triple(iotModel, sensor, path)
    }

    private fun createIotModelFactory() =
        iotModelRepository.save(IotModel("Hoist Template"))

    private val sampleSensor1 =
        Sensor(
            "13",
            "Button Up",
            "High",
            "1",
            "0",
            "1",
            "0", // Change to value != 0
            "value", // Change to UShort
            "Int", // Change to Boolean
            "Int",
            "Count"
        )

    private val sampleSensor2 =
        Sensor(
            "15",
            "Button Down",
            "Low",
            "2",
            "0",
            "1",
            "0", // Change to value != 0
            "value", // Change to UShort
            "Int", // Change to Boolean
            "Int",
            "Count"
        )

    private val invalidSampleSensor =
        Sensor(
            "15",
            "Button Down",
            "Low",
            "2",
            "0",
            "1",
            "0", // Change to value != 0
            "0", // Change to UShort
            "0", // Change to Boolean
            "0",
            "Count"
        )

    private val invalidSampleSensor2 =
        Sensor(
            "13",
            "Button Up",
            "High",
            "1",
            "0",
            "1",
            "0", // Change to value != 0
            "value", // Change to UShort
            "UInt", // Change to Boolean
            "BOOL",
            "Count"
        )

    private val sampleSensorWithSyntaxErrorInTheFormula =
        Sensor(
            "16",
            "Sample sensor with syntax error in the formula",
            "Low",
            "2",
            "0",
            "1",
            "0",
            "]",
            "Int",
            "Int",
            "Count"
        )
}
