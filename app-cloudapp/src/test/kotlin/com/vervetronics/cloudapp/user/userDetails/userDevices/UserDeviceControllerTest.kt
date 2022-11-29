package com.vervetronics.cloudapp.user.userDetails.userDevices

import com.vervetronics.cloudapp.TestUserFactory
import com.vervetronics.cloudapp.assertStatus
import com.vervetronics.cloudapp.user.User
import com.vervetronics.cloudapp.user.UserControllerTest
import com.vervetronics.cloudapp.user.UserRepository
import com.vervetronics.cloudapp.user.UserService
import com.vervetronics.cloudapp.user.userDetails.ShowUserDevices
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.boot.test.web.client.getForEntity
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.OK
import org.springframework.http.client.support.BasicAuthenticationInterceptor

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserDeviceControllerTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val userDeviceRepository: UserDeviceRepository,
    @Autowired private val userService: UserService,
    @Autowired private val testUserFactory: TestUserFactory
) {
    private val sampleUserDevice = ShowUserDevices(
        "testUser2@vervetronics.com",
    )

    @BeforeEach
    fun cleanUp() {
        userRepository.deleteAll()
        userDeviceRepository.deleteAll()
        testRestTemplate.restTemplate.interceptors.clear()
    }

    @Test
    fun `Link devices to non existing user returns 404 NOT FOUND`() {
        val sampleUser = sampleUserDevice
        val path = "/api/1.0/userDevices/foo/devices"
        val resp = testRestTemplate.postForEntity(path, sampleUser, Object::class.java)
        Assertions.assertEquals(HttpStatus.NOT_FOUND, resp.statusCode)
    }

    @Test
    fun `Get Linked devices list to created USER`() {
        userRepository.deleteAll()
        addUser()
        val sampleUser = sampleUserDevice
        val path = "/api/1.0/userDevices/${sampleUser.email}/devices"
        testRestTemplate.postForEntity(path, sampleUser, Object::class.java)
        val getPath = "/api/1.0/userDevices/${sampleUser.email}"
        val response = testRestTemplate.getForEntity<Any>(getPath)
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
