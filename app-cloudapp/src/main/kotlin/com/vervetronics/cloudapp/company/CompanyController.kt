package com.vervetronics.cloudapp.company

import com.vervetronics.cloudapp.error.ApiError
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.user.userDetails.UserDetailsService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.headers.Header
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import javax.servlet.http.HttpServletResponse
import javax.validation.Valid

@ExperimentalUnsignedTypes
@RestController
@CrossOrigin
@RequestMapping("/api/1.0/company")
class CompanyController(
    @Autowired private val companyRepository: CompanyRepository,
    @Autowired private val deviceIotService: DeviceIotService,
    @Autowired private val userDetailsService: UserDetailsService
) {
    private val companyService = CompanyService(companyRepository, deviceIotService, userDetailsService)

    @PostMapping("/")
    @Operation(summary = "Add new Company")
    @ApiResponses(
        ApiResponse(
            responseCode = "201",
            description = "The company was created successfully.",
            headers = [
                Header(
                    name = "Location",
                    description = "URL of the created company"
                )
            ]
        ),
        ApiResponse(
            responseCode = "415",
            description = "Unsupported Media Type.",
            content = [Content(schema = Schema(implementation = ApiError::class))]
        ),
        ApiResponse(
            responseCode = "409",
            description = "Unique validation constraint violated.",
            content = [Content(schema = Schema(implementation = ApiError::class))]
        ),
        ApiResponse(
            responseCode = "422",
            description = "Compilation of the formula failed. Check formula and types.",
            content = [Content(schema = Schema(implementation = ApiError::class))]
        ),
        ApiResponse(
            responseCode = "400",
            description = "Invalid Company request.",
            content = [Content(schema = Schema(implementation = ApiError::class))]
        )
    )
    @ResponseStatus(HttpStatus.CREATED)
    fun postCompanyDetails(
        @RequestBody @Valid
        companyDetail: CompanyDetail,
        response: HttpServletResponse
    ) {
        val savedCompanyDetail = companyService.saveCompany(companyDetail)
        val location = "api/1.0/company/${savedCompanyDetail.companyName}"
        response.addHeader("Location", location)
    }

    @GetMapping("/")
    @Operation(summary = "Find company Details")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Company Details found successfully."
        )
    )
    fun getCompanyDetails(): List<CompanyDetail> {
        return companyService.getAllCompanyDetails()
    }

    @GetMapping("/getCompanyById/{companyId}")
    @Operation(summary = "Find Company Details by id.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Company Details found successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Company Details not found."
        )
    )
    fun getCompanyDetailsById(
        @PathVariable companyId: UUID
    ): CompanyDetail? {
        return companyService.getCompanyDetailsById(companyId)
    }

    @GetMapping("/getCompanyByName/{companyName}")
    @Operation(summary = "Find Company Details by Name")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Company Details found successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Company Details not Found."
        )
    )
    fun getCompanyDetailsByName(
        @PathVariable companyName: String
    ): CompanyDetail? {
        return companyService.getCompanyDetailsByName(companyName)
    }

    @PutMapping("/updateCompanyByName/{companyName}")
    @Operation(summary = "Update Company Details By Name")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Company Details updated successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Company Details not Found."
        )
    )
    fun updateCompanyDetailsByName(
        @PathVariable companyName: String,
        @RequestBody companyDetail: CompanyDetail
    ): CompanyDetail? {
        return companyService.updateCompanyDetailsByName(companyName, companyDetail)
    }

    @PutMapping("/updateCompanyById/{companyId}")
    @Operation(summary = "Update Company Details By Id")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Company Details updated successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Company Details not Found."
        )
    )
    fun updateCompanyDetailsById(
        @PathVariable companyId: UUID,
        @RequestBody companyDetail: CompanyDetail
    ): CompanyDetail? {
        return companyService.updateCompanyDetailsById(companyId, companyDetail)
    }

    @DeleteMapping("/deleteCompanyById/{companyId}")
    @Operation(summary = "Delete Company Details By Id")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Company Details deleted successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Company Details not Found."
        )
    )
    fun deleteCompanyById(
        @PathVariable companyId: UUID
    ) {
        return companyService.deleteCompanyDetailById(companyId)
    }

    @DeleteMapping("/deleteCompanyByName/{companyName}")
    @Operation(summary = "Delete Company by Company Name")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Company Details deleted successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Company Details not Found."
        )
    )
    fun deleteCompanyByName(
        @PathVariable companyName: String
    ) {
        return companyService.deleteCompanyDetailsByName(companyName)
    }
}
