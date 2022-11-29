package com.vervetronics.cloudapp.user.auth

import com.vervetronics.cloudapp.TestUserFactory
import com.vervetronics.cloudapp.error.ApiError
import com.vervetronics.cloudapp.user.UserRepository
import com.vervetronics.cloudapp.user.UserService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod.POST
import org.springframework.http.HttpStatus.OK
import org.springframework.http.HttpStatus.UNAUTHORIZED
import java.util.Base64

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val userService: UserService,
    @Autowired private val testUserFactory: TestUserFactory
) {

    @BeforeEach
    fun cleanUp() {
        userRepository.deleteAll()
        testRestTemplate.restTemplate.interceptors.clear()
    }

    @Test
    fun givenUserWithEmptyCredentials_thenReturnsUnauthorized() {
        val response = testRestTemplate.postForEntity(API_10_LOGIN, null, Object::class.java)
        assertEquals(UNAUTHORIZED, response.statusCode)
    }

    @Test
    fun givenUserWithInvalidCredentials_thenReturnsUnauthorized() {
        val request = createRequest("SLDFJ", "LSDfLSDKf")
        val response = testRestTemplate.exchange(API_10_LOGIN, POST, request, Object::class.java)
        assertEquals(UNAUTHORIZED, response.statusCode)
    }

    @Test
    fun givenUserWithEmptyCredentials_thenReceiveApiError() {
        val response = testRestTemplate.postForEntity(API_10_LOGIN, null, ApiError::class.java)
        assertEquals(API_10_LOGIN, response.body!!.url)
    }

    @Disabled
    @Test
    fun givenUserWithEmptyCredentials_thenReceiveApiErrorWithoutValidationError() {
        val response = testRestTemplate.postForEntity(API_10_LOGIN, null, String::class.java)
        assertEquals(false, response.body!!.contains("validationErrors"))
    }

    @Test
    fun givenUserWithInvalidCredentials_thenReturnsUnauthorizedWithoutWWWAuthenticatedHeader() {
        val request = createRequest("SLDFJ", "LSDfLSDKf")
        val response = testRestTemplate.exchange(API_10_LOGIN, POST, request, Object::class.java)
        assertEquals(false, response.headers.containsKey("WWW-Authenticate"))
    }

    @Test
    fun givenUserWithValidCredentials_thenReturnsOk() {
        val user = testUserFactory.createUser()
        userService.save(user)
        val request = createRequest(testUserFactory.testEmail, testUserFactory.testPassword)
        val response = testRestTemplate.exchange(API_10_LOGIN, POST, request, Object::class.java)
        assertEquals(OK, response.statusCode)
    }

    @Suppress("kotlin:S1135")
    // TODO fix the issue of the id getting converted into Integer
    @Test
    fun givenUserWithValidCredentials_thenReturnsLoggedInUserId() {
        val user = testUserFactory.createUser()
        val inDb = userService.save(user)
        val request = createRequest(testUserFactory.testEmail, testUserFactory.testPassword)
        val response = testRestTemplate.exchange(
            API_10_LOGIN,
            POST,
            request,
            object : ParameterizedTypeReference<Map<String?, Any?>?>() {},
        )
        val body = response.body
        val id = body!!["id"]
        assertEquals(inDb.id.toInt(), id)
    }

    @Test
    fun givenUserWithValidCredentials_thenReturnsLoggedInUserEmail() {
        val user = testUserFactory.createUser()
        val inDb = userService.save(user)
        val request = createRequest(testUserFactory.testEmail, testUserFactory.testPassword)
        val response = testRestTemplate.exchange(
            API_10_LOGIN,
            POST,
            request,
            object : ParameterizedTypeReference<Map<String?, Any?>?>() {},
        )
        val body = response.body
        val email = body!!["username"]
        assertEquals(inDb.email, email)
    }

    @Test
    fun givenUserWithValidCredentials_thenDoesNotReturnPassword() {
        val user = testUserFactory.createUser()
        userService.save(user)
        val request = createRequest(testUserFactory.testEmail, testUserFactory.testPassword)
        val response = testRestTemplate.exchange(
            API_10_LOGIN,
            POST,
            request,
            object : ParameterizedTypeReference<Map<String?, Any?>?>() {},
        )
        val body = response.body
        assertFalse(body!!.containsKey("password"))
    }

    fun createRequest(username: String, password: String): HttpEntity<*> {
        val authStr = "$username:$password"
        val base64Creds: String = Base64.getEncoder().encodeToString(authStr.toByteArray())
        val headers = HttpHeaders()
        headers.add("Authorization", "Basic $base64Creds")
        return HttpEntity<Any?>(headers)
    }

    companion object {
        const val API_10_LOGIN = "/api/1.0/login"
    }
}
