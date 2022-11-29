package com.vervetronics.cloudapp.user.userDetails.userDevices

import com.vervetronics.cloudapp.error.ApiError
import com.vervetronics.cloudapp.user.userDetails.ShowUserDevices
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
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
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import javax.servlet.http.HttpServletResponse
import javax.validation.Valid

@RestController
@CrossOrigin
class UserDeviceController(
    @Autowired private val userDeviceService: UserDeviceService
) {
    @PostMapping("/api/1.0/userDevices/{email}/{deviceId}/devices")
    @Operation(summary = "Link devices to users")
    @ApiResponses(
        ApiResponse(
            responseCode = "201",
            description = "Device linked with user successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "email not found",
        ),
    )
    @ResponseStatus(HttpStatus.CREATED)
    @ExperimentalUnsignedTypes
    fun linkDevices(
        @Parameter(description = "device Id of added user")
        @PathVariable email: String,
        @PathVariable deviceId: String,
        @RequestBody @Valid userDevice: UserDevice,
        response: HttpServletResponse
    ) {
        val savedUserDevice = userDeviceService.save(email, deviceId, userDevice)
        val location = "api/1.0/userDevices/$email/$deviceId/devices/${savedUserDevice.id}"
        response.addHeader("Location", location)
    }

    @GetMapping("/api/1.0/userDevices/{email}")
    @Operation(summary = "Find linked userDetails by email")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "linked user devices found successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Email not found",
            content = [Content(schema = Schema(implementation = ApiError::class))],
        ),
    )
    fun getLinkedUsersDevices(
        @PathVariable email: String
    ): List<ShowUserDevices>? = userDeviceService.getUsersDevicesByEmail(email)

    @DeleteMapping("/api/1.0/userDevices/{email}/{deviceId}/devices")
    @Operation(summary = "Delete linked device to user")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Linked device deleted successfully",
        ),
        ApiResponse(
            responseCode = "404",
            description = "User and device not found",
        ),
    )
    fun deleteLinkedDevice(
        @PathVariable email: String,
        @PathVariable deviceId: String
    ) {
        userDeviceService.deleteLinkedDevice(email, deviceId)
    }
}
