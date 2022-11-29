package com.vervetronics.cloudapp.user.userDetails.userDevices

import com.vervetronics.cloudapp.CloudAppApplication
import com.vervetronics.cloudapp.TestUserFactory
import com.vervetronics.cloudapp.user.User
import com.vervetronics.cloudapp.user.UserControllerTest
import com.vervetronics.cloudapp.user.UserRepository
import com.vervetronics.cloudapp.user.UserService
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.any
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.mock.mockito.MockBeans
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.client.support.BasicAuthenticationInterceptor
import javax.persistence.EntityNotFoundException

@ExperimentalUnsignedTypes
@MockBeans(
    MockBean(UserDeviceService :: class),
    MockBean(UserDeviceRepository::class),
)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    classes = [CloudAppApplication::class, UserDeviceService :: class]
)
class UserDeviceServiceTest(
    @Autowired private val userDeviceRepository: UserDeviceRepository,
    @Autowired private val testUserFactory: TestUserFactory,
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val userRepository: UserRepository,
    @Autowired private val userService: UserService,
) {

    @BeforeEach
    fun prepareMocks() {
        userDeviceRepository.deleteAll()
        `when`(userDeviceRepository.findById(any())).thenThrow(EntityNotFoundException())
    }

    @Test
    fun givenNoLinkedDevice_thenLinkedDeviceIsEmpty() {
        userDeviceRepository.deleteAll()
        userRepository.deleteAll()
        testRestTemplate.restTemplate.interceptors.clear()

        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(UserControllerTest.API_10_USERS, user2, Object::class.java)
        Assertions.assertEquals(HttpStatus.OK, response.statusCode)

// Given
        `when`(userDeviceRepository.findByEmail(user2.email))
            .thenReturn(
                listOf(
                    UserDevice
                    ("ff02d7ce-7737-463a-8a9e-c90ac86485ac", "testUser2@vervetronics.com")
                )
            )
    }

    fun addUser() {
        userService.save(testUserFactory.createUser())
        authenticate(testUserFactory.testEmail)
        val user2 = User("testUser2@vervetronics.com", testUserFactory.testPassword)
        val response = testRestTemplate.postForEntity(UserControllerTest.API_10_USERS, user2, Object::class.java)
        Assertions.assertEquals(HttpStatus.OK, response.statusCode)
    }
    private fun authenticate(email: String) {
        testRestTemplate
            .restTemplate
            .interceptors
            .add(BasicAuthenticationInterceptor(email, testUserFactory.testPassword))
    }
}
