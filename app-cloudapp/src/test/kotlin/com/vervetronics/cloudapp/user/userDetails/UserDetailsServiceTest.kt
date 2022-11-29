package com.vervetronics.cloudapp.user.userDetails

import com.vervetronics.cloudapp.TestUserFactory
import com.vervetronics.cloudapp.user.User
import com.vervetronics.cloudapp.user.UserControllerTest
import com.vervetronics.cloudapp.user.UserService
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpStatus
import org.springframework.http.client.support.BasicAuthenticationInterceptor
import java.time.LocalDate
import java.util.UUID

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserDetailsServiceTest(
    @Autowired private val testRestTemplate: TestRestTemplate,
    @Autowired private val userDetailsService: UserDetailsService,
    @Autowired private val userDetailsRepository: UserDetailsRepository,
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
        "Verve",
        "Active",
        LocalDate.of(2022, 1, 17),
        LocalDate.of(2021, 12, 22),
        UUID.randomUUID()
    )

    @BeforeEach
    fun cleanUp() {
        userDetailsRepository.deleteAll()
    }

    @Test
    fun `get all stored users details`() {
        userDetailsService.getAllUsersDetails()
    }

    @Test
    fun `Store user details for registered user`() {
        val sampleUser = sampleUser1
        userDetailsService.save(sampleUser)
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
