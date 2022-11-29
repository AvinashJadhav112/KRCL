package com.vervetronics.cloudapp.user.userDetails

import com.vervetronics.cloudapp.error.ApiError
import io.swagger.v3.oas.annotations.Operation
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
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpServletResponse
import javax.validation.Valid

@RestController
@CrossOrigin
class UserDetailsController(
    @Autowired private val userDetailsService: UserDetailsService
) {
    @GetMapping("/api/1.0/userDetails")
    @Operation(summary = "Find details for all users")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Sensor found successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Sensor not found.",
        ),
    )
    fun getUserDetails() = userDetailsService.getAllUsersDetails()

    @PostMapping("/api/1.0/userDetails")
    @Operation(summary = "Add Users details")
    @ApiResponses(
        ApiResponse(
            responseCode = "201",
            description = "Users details added successfully.",
        ),
        ApiResponse(
            responseCode = "409",
            description = "Unique validation constraint violated.",
            content = [Content(schema = Schema(implementation = ApiError::class))],
        )
    )
    @ResponseStatus(HttpStatus.CREATED)
    fun postUserDetails(
        @RequestBody @Valid userDetails: UserDetails,
        response: HttpServletResponse
    ) {
        val savedUserDetail = userDetailsService.save(userDetails)
        val location = "api/1.0/userDetails/${savedUserDetail.mobileNumber}"
        response.addHeader("Location", location)
    }

    @PutMapping("/api/1.0/userDetails/{email}")
    @Operation(summary = "Edit User Details field")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "User Details updated",
        ),
        ApiResponse(
            responseCode = "404",
            description = "User Not found."
        )
    )
    fun putUserDetails(
        @PathVariable email: String,
        @RequestBody userDetails: UserDetails,
    ): UserDetails {
        return userDetailsService.update(email, userDetails)
    }

    @DeleteMapping("/api/1.0/userDetails/{email}")
    @Operation(summary = "Delete Users Details By Using Registered Email")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Users Details deleted successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "User not found.",
        ),
    )
    fun deleteUserDetailsByEmail(@PathVariable email: String) {
        userDetailsService.deleteUserDetailByEmail(email)
    }
}
