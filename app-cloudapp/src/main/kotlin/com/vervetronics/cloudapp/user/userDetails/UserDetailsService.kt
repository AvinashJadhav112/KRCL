package com.vervetronics.cloudapp.user.userDetails

import com.vervetronics.cloudapp.error.DuplicateEntityException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.user.UserRepository
import com.vervetronics.cloudapp.user.mustFindByEmail
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.sql.SQLException
import java.util.UUID

@Service
class UserDetailsService(
    @Autowired private val userDetailsRepository: UserDetailsRepository,
    @Autowired private val userRepository: UserRepository
) {
    fun save(userDetails: UserDetails): UserDetails {
        userDetails.user = userRepository.mustFindByEmail(userDetails.email)
        val ud = userDetailsRepository.findByEmail(userDetails.email)
        if (ud == null) {
            return userDetailsRepository.save(userDetails)
        } else throw DuplicateEntityException("user details for ${userDetails.email} already exist")
    }

    fun getAllUsersDetails(): MutableList<UserDetails> {
        return userDetailsRepository.findAll()
    }

    fun getUsersDetailByEmail(email: String): UserDetails? {
        return userDetailsRepository.findByEmail(email)
    }

    fun update(email: String, userDetails: UserDetails): UserDetails {
        val actualUserDetails = userDetailsRepository.findByEmail(email)
            ?: throw NotFoundException("$email not found")

        actualUserDetails.firstName = userDetails.firstName
        actualUserDetails.lastName = userDetails.lastName
        actualUserDetails.mobileNumber = userDetails.mobileNumber
        actualUserDetails.alternateMobileNumber = userDetails.alternateMobileNumber
        actualUserDetails.alternateEmail = userDetails.alternateEmail
        actualUserDetails.companyName = userDetails.companyName
        actualUserDetails.userStatus = userDetails.userStatus
        actualUserDetails.userStatusDate = userDetails.userStatusDate
        actualUserDetails.userAddedDate = userDetails.userAddedDate
        actualUserDetails.companyId = userDetails.companyId
        return userDetailsRepository.save(actualUserDetails)
    }

    fun deleteUserDetailByEmail(email: String) {
        val userDetail = userDetailsRepository.findByEmail(email)
            ?: throw NotFoundException("$email not found")
        userDetailsRepository.delete(userDetail)
    }

    fun deleteUserDetailsByCompanyName(companyName: String) {
        try {
            val userDetailsList = userDetailsRepository.findByCompanyName(companyName)
            if (userDetailsList.isNotEmpty()) {
                for (userDetails in userDetailsList) {
                    userDetailsRepository.delete(userDetails)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteUserDetailsByCompanyId(companyId: UUID) {
        try {
            val userDetailsList = userDetailsRepository.findByCompanyId(companyId)
            if (userDetailsList.isNotEmpty()) {
                for (userDetails in userDetailsList) {
                    userDetailsRepository.delete(userDetails)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateUserDetailsByCompanyId(companyId: UUID, updatedCompanyName: String) {
        try {
            val userDetailsList = userDetailsRepository.findByCompanyId(companyId)
            if (userDetailsList.isNotEmpty()) {
                for (userDetails in userDetailsList) {
                    userDetails.companyName = updatedCompanyName
                    userDetailsRepository.save(userDetails)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateUserDetailsByCompanyName(oldCompanyName: String, updatedCompanyName: String) {
        try {
            val userDetailsList = userDetailsRepository.findByCompanyName(oldCompanyName)
            if (userDetailsList.isNotEmpty()) {
                for (userDetails in userDetailsList) {
                    userDetails.companyName = updatedCompanyName
                    userDetailsRepository.save(userDetails)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }
}
