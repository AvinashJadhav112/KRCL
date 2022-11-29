package com.vervetronics.cloudapp.company

import com.vervetronics.cloudapp.error.DuplicateEntityException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.user.userDetails.UserDetailsService
import org.springframework.beans.factory.annotation.Autowired
import java.sql.SQLException
import java.util.UUID

@ExperimentalUnsignedTypes
class CompanyService(
    @Autowired private val companyRepository: CompanyRepository,
    @Autowired private val deviceIotService: DeviceIotService,
    @Autowired private val userDetailsService: UserDetailsService
) {

    fun saveCompany(companyDetail: CompanyDetail): CompanyDetail {
        val company = companyRepository.findByCompanyName(companyDetail.companyName)
        if (company == null) {
            try {
                return companyRepository.save(companyDetail)
            } catch (e: SQLException) {
                throw SQLException("$e")
            }
        } else {
            throw DuplicateEntityException("Company already exists by ${companyDetail.companyName} ")
        }
    }

    fun getAllCompanyDetails(): List<CompanyDetail> {
        try {
            return companyRepository.findAll()
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun getCompanyDetailsByName(companyName: String): CompanyDetail {
        try {
            return companyRepository.findByCompanyName(companyName)
                ?: throw NotFoundException("Company Not Found by $companyName")
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun getCompanyDetailsById(companyId: UUID): CompanyDetail {
        try {
            return companyRepository.getById(companyId)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteCompanyDetailsByName(companyName: String) {
        val companyDetail = companyRepository.findByCompanyName(companyName)
            ?: throw NotFoundException("$companyName not found")
        try {
            deviceIotService.deleteIotDeviceByCompanyName(companyName)
            userDetailsService.deleteUserDetailsByCompanyName(companyName)
            return companyRepository.delete(companyDetail)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteCompanyDetailById(companyId: UUID) {
        try {
            userDetailsService.deleteUserDetailsByCompanyId(companyId)
            deviceIotService.deleteIotDeviceByCompanyId(companyId)
            companyRepository.deleteById(companyId)
        } catch (e: NotFoundException) {
            throw NotFoundException("$companyId Not Found", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateCompanyDetailsById(companyId: UUID, company: CompanyDetail): CompanyDetail {
        val actualCompanyDetail = companyRepository.getById(companyId)

        actualCompanyDetail.companyName = company.companyName
        actualCompanyDetail.email = company.email
        actualCompanyDetail.mobileNumber = company.mobileNumber
        actualCompanyDetail.website = company.website
        actualCompanyDetail.companyStatus = company.companyStatus
        actualCompanyDetail.companyAddedDate = company.companyAddedDate

        try {
            userDetailsService.updateUserDetailsByCompanyId(companyId, company.companyName)
            deviceIotService.updateIotDeviceByCompanyId(companyId, company.companyName)
            return companyRepository.save(actualCompanyDetail)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateCompanyDetailsByName(companyName: String, company: CompanyDetail): CompanyDetail {
        val actualCompanyDetail = companyRepository.findByCompanyName(companyName)
            ?: throw NotFoundException("$companyName not found")

        actualCompanyDetail.companyName = company.companyName
        actualCompanyDetail.email = company.email
        actualCompanyDetail.mobileNumber = company.mobileNumber
        actualCompanyDetail.website = company.website
        actualCompanyDetail.companyStatus = company.companyStatus
        actualCompanyDetail.companyAddedDate = company.companyAddedDate

        try {
            userDetailsService.updateUserDetailsByCompanyName(companyName, company.companyName)
            deviceIotService.updateIotDeviceByCompanyName(companyName, company.companyName)
            return companyRepository.save(actualCompanyDetail)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }
}
