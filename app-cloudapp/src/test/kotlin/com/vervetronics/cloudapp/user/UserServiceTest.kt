package com.vervetronics.cloudapp.user

import com.vervetronics.cloudapp.TestUserFactory
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import kotlin.test.assertTrue

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserServiceTest(
    @Autowired private val userService: UserService,
    @Autowired private val testUserFactory: TestUserFactory,
    @Autowired private val userRepository: UserRepository,
) {
    @BeforeEach
    fun cleanUp() {
        userRepository.deleteAll()
    }

    @Test
    fun `when new user is created then user has default role as USER`() {
        val user = userService.save(testUserFactory.createUser())
        assertTrue(user.roles.contains(UserRole("USER")))
    }
}
