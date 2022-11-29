package com.vervetronics.cloudapp.company

import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.user.userDetails.UserDetailsService
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.LocalDate
import kotlin.test.assertTrue

@ExperimentalUnsignedTypes
@SpringBootTest
class CompanyServiceTest(
    @Autowired private val companyRepository: CompanyRepository,
    @Autowired private val deviceIotService: DeviceIotService,
    @Autowired private val userDetailsService: UserDetailsService
) {
    private val companyService = CompanyService(companyRepository, deviceIotService, userDetailsService)

    @BeforeEach
    fun cleanupOldData() {
        companyRepository.deleteAll()
        companyRepository.save(sampleCompanyDetail1)
    }

    @AfterEach
    fun cleanupAfter() {
        companyRepository.deleteAll()
    }

    @Test
    fun saveCompanyTest() {
        val companyDetail = companyService.saveCompany(sampleCompanyDetail2)
        assertTrue { companyDetail.companyName == sampleCompanyDetail2.companyName }
    }

    @Test
    fun getAllCompanyDetailsTest() {
        val companyDetails = companyService.getAllCompanyDetails()
        assertTrue { companyDetails.isNotEmpty() }
    }

    private val sampleCompanyDetail1 = CompanyDetail(
        "VerveTronics1",
        "cloud.team@vervetronics.com",
        "9688567423",
        "www.vervetronics.com",
        "Active",
        LocalDate.of(2022, 11, 4)
    )

    private val sampleCompanyDetail2 = CompanyDetail(
        "VerveTronics2",
        "cloud.team@vervetronics2.com",
        "9688567423",
        "www.vervetronics2.com",
        "Active",
        LocalDate.of(2022, 11, 4)
    )
}
