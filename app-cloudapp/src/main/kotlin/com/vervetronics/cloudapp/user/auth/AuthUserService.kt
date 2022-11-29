package com.vervetronics.cloudapp.user.auth

import com.vervetronics.cloudapp.user.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service

@Service
class AuthUserService(@Autowired val userRepository: UserRepository) : UserDetailsService {

    override fun loadUserByUsername(email: String?): UserDetails {
        val user = userRepository.findByEmail(email!!)
        return AuthUser(user!!)
    }
}
