package com.vervetronics.cloudapp.user

import com.vervetronics.cloudapp.error.NotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    @Autowired private val userRepository: UserRepository,
    @Autowired private val roleRepository: RoleRepository,
    @Autowired private val userRoleRepository: UserRoleRepository,
    @Autowired private val passwordEncoder: PasswordEncoder
) {

    fun save(user: User): User {
        user.password = passwordEncoder.encode(user.password)
        user.roles += roleRepository.getUserRole()
        return userRepository.save(user)
    }

    fun getUserByEmail(email: String) = userRepository.mustFindByEmail(email)

    fun getRoleByEmail(email: String) = userRoleRepository.findByEmail(email)
        ?: throw NotFoundException("email id: $email not found")

    fun getAllRegisteredUsers(): MutableList<ShowUserRoles> = userRoleRepository.findAll()
}
