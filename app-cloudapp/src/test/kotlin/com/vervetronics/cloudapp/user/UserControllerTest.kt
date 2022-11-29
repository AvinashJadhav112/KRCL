package com.vervetronics.cloudapp.user

import com.vervetronics.cloudapp.TestUserFactory
import com.vervetronics.cloudapp.error.ApiError
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.client.support.BasicAuthenticationInterceptor

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerTest(
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
    fun `given admin user when creates new user then return OK`() {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertEquals(HttpStatus.OK, response.statusCode)
    }

    @Test
    fun `given invalid admin user when creates new user return Unauthorized`() {
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
    }

    @Test
    fun `given invalid admin when creates new child then returns ApiError`() {
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, ApiError::class.java)
        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.body!!.status)
    }

    @Test
    fun `given valid admin when creates new user then user stored in database`() {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertEquals(2, userRepository.count())
    }

    @Test
    fun `given valid admin when creates child then receive success message`() {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertNull(response.body)
    }

    @Test
    fun `given valid admin when create user then password is hashed`() {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        val userList = userRepository.findAll()
        assertNotEquals(testUserFactory.testPassword, userList[1].password)
    }

    @ParameterizedTest
    @ValueSource(strings = ["", "  ", "abc", "abcde", "$$$@##.com", "@sid.gmail"])
    fun `given valid admin when creates user with invalid email then receive Bad Request`(email: String) {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User(email, testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertEquals(HttpStatus.BAD_REQUEST, response!!.statusCode)
    }

    @Test
    fun `given valid admin when create user with email more than 256 char then receive Bad Request`() {
        val charPool: List<Char> = ('a'..'z') + ('A'..'Z')
        val email256Chars = (1..256)
            .map { kotlin.random.Random.nextInt(0, charPool.size) }
            .map(charPool::get)
            .joinToString("")
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User("$email256Chars.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertEquals(HttpStatus.BAD_REQUEST, response!!.statusCode)
    }

    @ParameterizedTest
    @ValueSource(strings = ["", "  ", "ABCDEFGHIJ", "abcdefghij", "123456789"])
    fun `given valid admin when enroll user with invalid password then receive Bad Request`(password: String) {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User(testUserFactory.testEmail, password)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertEquals(HttpStatus.BAD_REQUEST, response!!.statusCode)
    }

    @Test
    fun `given valid admin when create user with password with more than 256 char then receive Bad Request`() {
        val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        val password256Chars = (1..256)
            .map { kotlin.random.Random.nextInt(0, charPool.size) }
            .map(charPool::get)
            .joinToString("")
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User(testUserFactory.testEmail, password256Chars)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertEquals(HttpStatus.BAD_REQUEST, response!!.statusCode)
    }

    @Suppress("kotlin:S1135")
    // TODO Check if the number of validation errors is correct. 4 errors are generated but 2 are returned
    @Test
    fun `given invalid admin receive ApiErrors with Validation Errors`() {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = createUserWithEmptyCredentials()
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, ApiError::class.java)
        assertEquals(2, response.body!!.validationErrors?.size)
    }

    @Test
    fun `given user when create user then return Forbidden`() {
        val user = User("testUser2@vervetronics.com", testUserFactory.testPassword)
            .apply { roles = hashSetOf(UserRole("User")) }
        userService.save(user)
        authenticate(user.email)
        val user2 = User("testUser3@vervetronics.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(API_10_USERS, user2, Object::class.java)
        assertEquals(HttpStatus.FORBIDDEN, response.statusCode)
    }

    @Test
    fun `given user when get user then return OK `() {
        userService.save(testUserFactory.createUser())
        val response: ResponseEntity<Any>? = getUser(testUserFactory.testEmail, Any::class.java)
        assertEquals(HttpStatus.OK, response!!.statusCode)
    }

    @Test
    fun `given user when get user then return without password `() {
        userService.save(testUserFactory.createUser())
        val response: ResponseEntity<String>? = getUser(testUserFactory.testEmail, String::class.java)
        assertFalse(response!!.body!!.contains("password"))
    }

    @Test
    fun `given user Does Not Exist when get user then return Not Found`() {
        val response: ResponseEntity<Any>? = getUser("hello@hello.com", Any::class.java)
        assertEquals(HttpStatus.NOT_FOUND, response!!.statusCode)
    }

    @Test
    fun `given user Does Not Exist when get user then return Api Error`() {
        val response: ResponseEntity<ApiError>? = getUser("hello@hello.com", ApiError::class.java)
        assertTrue(response!!.body!!.message!!.contains("hello@hello.com"))
    }

    private fun createUserWithEmptyCredentials() = testUserFactory.createUser("", "")

    fun <T> getUser(username: String, responseType: Class<T>?) =
        testRestTemplate.getForEntity("$API_10_USERS/$username", responseType)

    private fun authenticate(email: String) {
        testRestTemplate
            .restTemplate
            .interceptors
            .add(BasicAuthenticationInterceptor(email, testUserFactory.testPassword))
    }

    companion object {
        const val API_10_USERS = "/api/1.0/users"
    }
}
