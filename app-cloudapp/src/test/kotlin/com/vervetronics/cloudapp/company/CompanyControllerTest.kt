package com.vervetronics.cloudapp.company

import com.vervetronics.cloudapp.assertStatus
import com.vervetronics.cloudapp.error.ApiError
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.exchange
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.boot.test.web.client.postForEntity
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import java.time.LocalDate
import java.util.UUID
import kotlin.test.assertEquals

@ExperimentalUnsignedTypes
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CompanyControllerTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val companyRepository: CompanyRepository
) {

    @BeforeEach
    fun cleanupOldData() {
        companyRepository.deleteAll()
    }

    @AfterEach
    fun cleanupAfter() {
        companyRepository.deleteAll()
    }

    @Test
    @DisplayName("POST /api/1.0/company/saveCompany returns 201 Created")
    fun `POST companyDetails returns 201 Created`() {
        val path = "/api/1.0/company/"
        val response = testRestTemplate.postForEntity<Any>(path, sampleCompanyDetail1)
        response.assertStatus(HttpStatus.CREATED)
    }

    @Test
    @DisplayName("POST /api/1.0/company with invalid company Details returns 404 NOT FOUND")
    fun `POST companyDetails with invalid company returns 404 NOT FOUND`() {
        val companyDetail = sampleCompanyDetail1.copy(companyName = "Random Name")
        val response = testRestTemplate.postForEntity<Any>(API_10_COMPANY, companyDetail)
        response.assertStatus(HttpStatus.NOT_FOUND)
    }

    @Test
    @DisplayName("GET /api/1.0/company returns 200 OK and Company Details")
    fun `GET Company Details returns 200 status and Company Details`() {
        val companyDetail = sampleCompanyDetail1
        companyRepository.save(companyDetail)
        var path = "/api/1.0/company/"
        val response = testRestTemplate.getForEntity<Any>(path)
        response.assertStatus(HttpStatus.OK)
        Assertions.assertNotNull(response.body)
        path = "$API_10_COMPANY/${companyDetail.companyName}"
        testRestTemplate.delete(path)
    }

    @Test
    @DisplayName("GET /api/1.0/company/{id} returns 200 ok and Company Details")
    fun `GET Company Details by valid Id returns 200 status`() {
        val companyDetail = sampleCompanyDetail1
        val companyId = companyRepository.save(companyDetail).id
        var path = "/api/1.0/company/getCompanyById/$companyId"
        val response = testRestTemplate.getForEntity<Any>(path)
        response.assertStatus(HttpStatus.OK)
        Assertions.assertNotNull(response.body)
        path = "$API_10_COMPANY/${companyDetail.companyName}"
        testRestTemplate.delete(path)
    }

    @Test
    @DisplayName("GET /api/1.0/company/{id} with invalid id returns 404 NOT FOUND")
    fun `GET companyDetails with invalid id returns 404 NOT FOUND`() {
        val path = "/api/1.0/company/${UUID.randomUUID()}"
        val response = testRestTemplate.getForEntity<Any>(path)
        response.assertStatus(HttpStatus.NOT_FOUND)
    }

    @Test
    fun `Get company details by company id with invalid company id returns empty body`() {
        val path = "/api/1.0/company/getCompanyById/${UUID.randomUUID()}"
        val response = testRestTemplate.getForEntity(path, Object::class.java)
        val body = response.body
        Assertions.assertNotNull(body)
        response.assertStatus(HttpStatus.NOT_FOUND)
    }

    @Test
    @DisplayName("PUT /api/1.0/company/updateCompanyByName/{companyName} with Company Details returns 200 OK")
    fun `PUT company name with valid company details returns OK`() {
        val savedCompanyDetail = companyRepository.save(sampleCompanyDetail1)
        val path = "/api/1.0/company/updateCompanyByName/${savedCompanyDetail.companyName}"
        val requestEntity: HttpEntity<CompanyDetail> = HttpEntity(sampleCompanyDetail2)
        val response = testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, Object::class.java)
        response.assertStatus(HttpStatus.OK)
    }

    @Test
    @DisplayName("PUT /api/1.0/company/updateCompanyById/{companyName} with Company Details returns 200 OK")
    fun `PUT company id with valid company details returns OK`() {
        val savedCompanyDetail = companyRepository.save(sampleCompanyDetail1)
        val path = "/api/1.0/company/updateCompanyById/${savedCompanyDetail.id}"
        val requestEntity: HttpEntity<CompanyDetail> = HttpEntity(sampleCompanyDetail2)
        val response = testRestTemplate.exchange(path, HttpMethod.PUT, requestEntity, Object::class.java)
        response.assertStatus(HttpStatus.OK)
    }

    @Test
    @DisplayName(
        "PUT /api/1.0/company/updateCompanyByName/{companyName} with incorrect company name Return 404 NOT FOUND"
    )
    fun `PUT company details with incorrect name returns 404  NOT FOUND`() {
        val path = "/api/1.0/company/updateCompanyByName/IncorrectCompanyName"
        val requestEntity: HttpEntity<CompanyDetail> = HttpEntity(sampleCompanyDetail1)
        val response = testRestTemplate.exchange<ApiError>(path, HttpMethod.PUT, requestEntity)
        response.assertStatus(HttpStatus.NOT_FOUND)
        Assertions.assertEquals(response.body!!.message, "IncorrectCompanyName not found")
    }

    @Test
    @DisplayName(
        "DELETE /api/1.0/company/deleteCompanyByName/{companyName} remove company from db returns 200 OK"
    )
    fun `DELETE Company details with name returns 200 OK`() {
        val companyDetail = companyRepository.save(sampleCompanyDetail1)
        val path = "/api/1.0/company/deleteCompanyByName/${companyDetail.companyName}"
        testRestTemplate.delete(path)
        assertEquals(0, companyRepository.count())
    }

    @Test
    @DisplayName("DELETE /api/1.0/company/deleteCompanyByName/{companyName} remove company from db returns 200 OK")
    fun `DELETE Company details with invalid name returns 404 NOT_FOUND`() {
        companyRepository.save(sampleCompanyDetail1)
        val path = "/api/1.0/company/deleteCompanyByName/InvalidCompanyName"
        testRestTemplate.delete(path)
        assertEquals(1, companyRepository.count())
    }

    private val sampleCompanyDetail1 = CompanyDetail(
        "VerveTronics",
        "cloud.team@vervetronics.com",
        "9688567423",
        "www.vervetronics.com",
        "Active",
        LocalDate.of(2022, 11, 4)
    )

    private val sampleCompanyDetail2 = CompanyDetail(
        "VerveTronics3",
        "cloud.team@vervetronics2.com",
        "9688567423",
        "www.vervetronics2.com",
        "Active",
        LocalDate.of(2022, 11, 4)
    )
    companion object {
        const val API_10_COMPANY = "/api/1.0/company"
    }
}
