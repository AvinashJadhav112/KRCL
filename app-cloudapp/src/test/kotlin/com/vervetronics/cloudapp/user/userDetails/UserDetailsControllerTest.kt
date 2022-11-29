package com.vervetronics.cloudapp.user.userDetails

import com.vervetronics.cloudapp.TestUserFactory
import com.vervetronics.cloudapp.assertStatus
import com.vervetronics.cloudapp.user.User
import com.vervetronics.cloudapp.user.UserControllerTest
import com.vervetronics.cloudapp.user.UserRepository
import com.vervetronics.cloudapp.user.UserService
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod.PUT
import org.springframework.http.HttpStatus.OK
import org.springframework.http.client.support.BasicAuthenticationInterceptor
import java.time.LocalDate
import java.util.UUID
import kotlin.test.assertNotNull

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserDetailsControllerTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val userDetailsService: UserDetailsService,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val userService: UserService,
    @Autowired private val testUserFactory: TestUserFactory
) {
    private val sampleUser1 = UserDetails(
        "XYZ",
        "ABC",
        "testuser@vervetronics.com",
        "testuser@vervetronics.com",
        "9896562356",
        "8995645235",
        "VerveTronics",
        "Active",
        LocalDate.of(2022, 1, 17),
        LocalDate.of(2021, 12, 22),
        UUID.randomUUID()
    )

    private val sampleUser2 =
        UserDetails(
            "Mark",
            "Lee",
            "testuser@vervetronics.com",
            "mark.lee@gmail.com",
            "9896562356",
            "8995645235",
            "Mark Enterprises",
            "Active",
            LocalDate.of(2022, 1, 17),
            LocalDate.of(2022, 1, 2),
            UUID.randomUUID()
        )

    @BeforeEach
    fun cleanUp() {
        userRepository.deleteAll()
        testRestTemplate.restTemplate.interceptors.clear()
    }

    @Test
    fun `Get all users details returns OK`() {
        addUser()
        val sampleUser = sampleUser1
        userDetailsService.save(sampleUser)
        var path = "/api/1.0/userDetails"
        val response = testRestTemplate.getForEntity<Any>(path)
        response.assertStatus(OK)
        assertNotNull(response.body)
        val body = response.body
        assertNotNull(body)
        printThis(body)
        path = "/api/1.0/userDetails/${sampleUser.email}"
        testRestTemplate.delete(path)
    }

    @Test
    fun `PUT userDetails with valid input returns OK`() {
        addUser()
        val savedUserDetail = userDetailsService.save(sampleUser1)
        val path = "/api/1.0/userDetails/${savedUserDetail.email}"
        val updatedUserDetail = sampleUser2
        val requestEntity: HttpEntity<UserDetails> = HttpEntity(updatedUserDetail)
        val response = testRestTemplate.exchange(path, PUT, requestEntity, Object::class.java)
        val body = response.body
        Assertions.assertNotNull(body)
        printThis(body)
        response.assertStatus(OK)
    }

    fun printThis(body: Any?) {
        System.err.println("++++++++++++++++++++++++++++++++++++++")
        System.err.println(body)
        System.err.println("++++++++++++++++++++++++++++++++++++++")
    }
    fun addUser() {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(UserControllerTest.API_10_USERS, user2, Object::class.java)
        Assertions.assertEquals(OK, response.statusCode)
    }
    private fun authenticate(email: String) {
        testRestTemplate
            .restTemplate
            .interceptors
            .add(BasicAuthenticationInterceptor(email, testUserFactory.testPassword))
    }
}
