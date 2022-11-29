package com.vervetronics.cloudapp.user

import com.fasterxml.jackson.annotation.JsonView
import com.vervetronics.cloudapp.error.ApiError
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpServletRequest
import javax.validation.Valid

@RestController
@CrossOrigin
class UserController(
    @Autowired private val userService: UserService
) {

    @PostMapping("/api/1.0/users")
    fun createUser(@Valid @RequestBody user: User) {
        userService.save(user)
    }

    @JsonView(UserViews.Base::class)
    @GetMapping("/api/1.0/users/{email}")
    fun getUserByEmail(@PathVariable email: String) = userService.getUserByEmail(email)

    @ExceptionHandler(value = [(MethodArgumentNotValidException::class)])
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleVerificationException(exception: MethodArgumentNotValidException, request: HttpServletRequest): ApiError {
        val apiError = ApiError(HttpStatus.BAD_REQUEST.value(), "Validation error", request.servletPath)
        val result = exception.bindingResult
        val validationErrors = hashMapOf<String, String>()

        for (fieldError in result.fieldErrors) {
            validationErrors[fieldError.field] = fieldError.defaultMessage!!
        }
        apiError.validationErrors = validationErrors
        return apiError
    }

    @GetMapping("/api/1.0/users/roles/{email}")
    @Operation(summary = "Find user role by user email")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "User found with Role successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "User not found."
        ),
    )
    fun getRoleByEmail(
        @PathVariable email: String
    ) = userService.getRoleByEmail(email)

    @GetMapping("/api/1.0/users")
    @Operation(summary = "Find all users")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "User found with Role successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "User not found."
        ),
    )
    fun getRoleByEmail(): MutableList<ShowUserRoles> {
        return userService.getAllRegisteredUsers()
    }
}
