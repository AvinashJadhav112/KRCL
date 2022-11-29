package com.vervetronics.cloudapp

import com.vervetronics.cloudapp.user.User
import com.vervetronics.cloudapp.user.UserRole
import org.springframework.stereotype.Component

@Component
class TestUserFactory {

    val testEmail = "testuser@vervetronics.com"
    val testPassword = "FoxyFox@123"

    fun createUser(
        email: String = testEmail,
        password: String = testPassword,
    ): User {
        return User(email, password).apply { roles = hashSetOf(UserRole("ADMIN")) }
    }
}
