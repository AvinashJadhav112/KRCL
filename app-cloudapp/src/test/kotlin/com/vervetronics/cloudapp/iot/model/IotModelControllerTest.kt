package com.vervetronics.cloudapp.iot.model

import com.vervetronics.cloudapp.assertStatus
import com.vervetronics.cloudapp.error.ApiError
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.postForEntity
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus.BAD_REQUEST
import org.springframework.http.HttpStatus.CONFLICT
import org.springframework.http.HttpStatus.CREATED
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.http.HttpStatus.OK
import org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.http.MediaType.TEXT_PLAIN
import java.util.UUID

@ExperimentalUnsignedTypes
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class IotModelControllerTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val modelIotRepository: IotModelRepository,
    @Autowired private val iotModelService: IotModelService,
) {
    private val sampleIotModel1 = IotModel("Sample Hoist Model")
    private val sampleIotModel2 = IotModel("Sample Forklift Model")

    @BeforeEach
    fun cleanUp() {
        modelIotRepository.deleteAll()
    }

    @Test
    @DisplayName("POST /api/1.0/iotModels returns 201 Created")
    fun `POST iotModels returns 201 Created`() {
        val entity = HttpEntity<String>(
            """{"iotModelName": "Sample Hoist Model"}""",
            HttpHeaders().apply { contentType = APPLICATION_JSON },
        )
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTMODELS, entity)
        response.assertStatus(CREATED)
    }

    @Test
    @DisplayName("POST /api/1.0/iotModels with wrong content type returns 415 Unsupported Media Type")
    fun `POST iotModels with wrong content type returns 415 Unsupported Media Type`() {
        val entity = HttpEntity<String>(
            """{"iotModelName": "Sample Hoist Model"}""",
            HttpHeaders().apply { contentType = TEXT_PLAIN },
        )
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTMODELS, entity)
        response.assertStatus(UNSUPPORTED_MEDIA_TYPE)
    }

    @Test
    @DisplayName("POST /api/1.0/iotModels with syntax error in JSON returns 400 Bad Request")
    fun `POST iotModels with syntax error in JSON returns 400 Bad Request`() {
        val entity = HttpEntity<String>(
            """{""",
            HttpHeaders().apply { contentType = APPLICATION_JSON },
        )
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTMODELS, entity)
        response.assertStatus(BAD_REQUEST)
    }

    @ParameterizedTest
    @DisplayName("POST /api/1.0/iotModels with semantic error in JSON returns Bad Request")
    @ValueSource(
        strings = [
            """{"iotModelName": {}}""",
            """{"iotModelName": null}""",
            """{"iotModelName": []}""",
            """{"iotModelName": ""}""",
            """{"iotModelName": " "}""",
        ]
    )
    fun `POST iotModels with semantic error in JSON returns 400 Bad Request`(body: String) {
        val entity = HttpEntity<String>(
            body,
            HttpHeaders().apply { contentType = APPLICATION_JSON },
        )
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTMODELS, entity)
        response.assertStatus(BAD_REQUEST)
    }

    @Disabled
    @Test
    @DisplayName("POST /api/1.0/iotModels with a duplicate model returns 409 Conflict")
    fun `POST iotModels with a duplicate model returns 409 Conflict`() {
        val iotModel = sampleIotModel1
        iotModelService.save(iotModel)
        val response = testRestTemplate.postForEntity<Any>(API_10_IOTMODELS, iotModel)
        response.assertStatus(CONFLICT)
    }

    @Disabled
    @Test
    fun postIotModel_whenCreatingDuplicateIotModel_thenApiError() {
        val iotModel = sampleIotModel1
        iotModelService.save(iotModel)
        val response = testRestTemplate.postForEntity(API_10_IOTMODELS, iotModel, ApiError::class.java)
        assertNotNull(response.body!!.message)
    }

    @Test
    fun postIotModel_whenCreatingANewIotModel_thenSavesToDatabase() {
        val iotModel = sampleIotModel1
        testRestTemplate.postForEntity(API_10_IOTMODELS, iotModel, Object::class.java)
        assertEquals(1, modelIotRepository.count())
    }

    @Test
    fun testUUIDinResponseLocationHeader_whenPostingIotModel() {
        val iotModel = sampleIotModel1
        val response = testRestTemplate.postForEntity(API_10_IOTMODELS, iotModel, Object::class.java)
        val location = response.headers["Location"]?.get(0)
        val uuid = location!!.substring((location.length - 36), location.length)
        val pattern = Regex("[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")
        assertTrue(pattern.matches(uuid))
    }

    @Test
    fun getIotModelByIotModelName_whenRetrievingExistingIotModel_thenReturnsStatusOk() {
        val iotModel = sampleIotModel1
        iotModelService.save(iotModel)
        val path = "$API_10_IOTMODELS/${sampleIotModel1.iotModelName}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        assertEquals(OK, response.statusCode)
        assertNotNull(response.body!!)
    }

    @Test
    fun getIotModelByIotModelName_whenRetrievingNonExistingIotModel_thenReturnsStatusNotFound() {
        val path = "$API_10_IOTMODELS/Hoist Template"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        assertEquals(NOT_FOUND, response.statusCode)
    }

    @Test
    fun getIotModelByIotModelName_whenRetrievingNonExistingIotModel_thenReturnsNotFoundException() {
        val path = "$API_10_IOTMODELS/Hoist Template"
        val response = testRestTemplate.getForEntity(path, ApiError::class.java)
        response.body!!.message?.let { assertTrue(it.startsWith("Hoist Template Not Found")) }
    }

    @Test
    fun getIotModel_whenRetrievingAllIotModels_thenReturnsStatusOk() {
        val iotModel = sampleIotModel1
        iotModelService.save(iotModel)
        val response = testRestTemplate.getForEntity(API_10_IOTMODELS, Object::class.java)
        response.assertStatus(OK)
    }

    @Test
    fun getIotModel_whenRetrievingAllIotModels_thenReturnsAllModels() {
        val iotModel = sampleIotModel1
        iotModelService.save(iotModel)
        val response = testRestTemplate.getForEntity(API_10_IOTMODELS, String::class.java)
        assertTrue(response.body!!.contains(sampleIotModel1.iotModelName))
    }

    @Test
    fun putIotModel_whenUpdatingTheExistingIotModel_thenReturnsOk() {
        val savedTemplate = iotModelService.save(sampleIotModel1)
        val path = "$API_10_IOTMODELS/" + savedTemplate.id
        val updatedIotModel = sampleIotModel2
        val requestEntity: HttpEntity<IotModel> = HttpEntity(updatedIotModel)
        val response = testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, Object::class.java)
        response.assertStatus(OK)
    }

    @Test
    fun putIotModel_whenUpdatingTheExistingIotModel_thenResponseContainsUpdatedIotModel() {
        val savedTemplate = iotModelService.save(sampleIotModel1)
        val path = "$API_10_IOTMODELS/" + savedTemplate.id
        val updatedIotModel = sampleIotModel2
        val requestEntity: HttpEntity<IotModel> = HttpEntity(updatedIotModel)
        val response = testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, String::class.java)
        assertFalse(response.body!!.contains(sampleIotModel1.iotModelName))
        assertTrue(response.body!!.contains(sampleIotModel2.iotModelName))
    }

    @Test
    fun putIotModel_whenUpdatingNonExistingIotModel_thenReturnsAPIError() {
        val incorrectModelId = UUID.randomUUID().toString()
        val path = "$API_10_IOTMODELS/$incorrectModelId"
        val updatedIotModel = sampleIotModel2
        val requestEntity: HttpEntity<IotModel> = HttpEntity(updatedIotModel)
        val response = testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, ApiError::class.java)
        response.assertStatus(NOT_FOUND)
        assertEquals(
            response.body!!.message,
            "Unable to find com.vervetronics.cloudapp.iot.model.IotModel with id $incorrectModelId"
        )
    }

    @Test
    fun deleteIotModelByIotModelName_whenDeletingExistingIotModel_thenDeletesIotModelFromDatabase() {
        val iotModel = sampleIotModel1
        iotModelService.save(iotModel)
        val path = "$API_10_IOTMODELS/${sampleIotModel1.iotModelName}"
        testRestTemplate.delete(path)
        assertEquals(0, modelIotRepository.count())
    }

    @Suppress("kotlin:S1135")
    @Test
    fun deleteIotModelByIotModelName_whenRetrievingNonExistingIotModel_thenReturnsApiError() {
        val path = "$API_10_IOTMODELS/Hoist Template"
        val response = testRestTemplate.getForEntity(path, ApiError::class.java)
        response.body!!.message?.let { assertTrue(it.startsWith("Hoist Template Not Found")) }
    }

    @Test
    fun getIotModelByIotModelId_whenRetrievingExistingIotModel_thenReturnsStatusOk() {
        val iotModel = sampleIotModel1
        val path = "/api/1.0/iotModel/${iotModelService.save(iotModel).id}"
        val response = testRestTemplate.getForEntity(path, String::class.java)
        assertTrue(response.body!!.contains(sampleIotModel1.iotModelName))
        response.assertStatus(OK)
    }

    companion object {
        const val API_10_IOTMODELS = "/api/1.0/iotModels"
    }
}
