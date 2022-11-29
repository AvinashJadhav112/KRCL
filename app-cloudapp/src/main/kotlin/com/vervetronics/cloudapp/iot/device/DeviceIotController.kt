package com.vervetronics.cloudapp.iot.device

import com.vervetronics.cloudapp.error.ApiError
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
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import javax.servlet.http.HttpServletResponse
import javax.validation.Valid

@ExperimentalUnsignedTypes
@RestController
@CrossOrigin
class DeviceIotController(
    @Autowired private val deviceIotService: DeviceIotService
) {

    @PostMapping("/api/1.0/devices")
    @Operation(summary = "Add new iot device ")
    @ApiResponses(
        ApiResponse(
            responseCode = "201",
            description = "The device was created successfully.",
            headers = [
                Header(
                    name = "Location",
                    description = "URL of the created device",
                )
            ]
        ),
        ApiResponse(
            responseCode = "415",
            description = "Unsupported Media Type.",
            content = [Content(schema = Schema(implementation = ApiError::class))],
        ),
        ApiResponse(
            responseCode = "409",
            description = "Unique validation constraint violated.",
            content = [Content(schema = Schema(implementation = ApiError::class))],
        ),
        ApiResponse(
            responseCode = "422",
            description = "Compilation of the formula failed. Check formula and types.",
            content = [Content(schema = Schema(implementation = ApiError::class))],
        ),
        ApiResponse(
            responseCode = "400",
            description = "Invalid Device request.",
            content = [Content(schema = Schema(implementation = ApiError::class))]
        )
    )
    @ResponseStatus(HttpStatus.CREATED)
    fun postIotDevice(
        @RequestBody @Valid iotDevice: IotDevice,
        response: HttpServletResponse
    ) {
        val savedIotDevice = deviceIotService.save(iotDevice)
        val location = "api/1.0/devices/${savedIotDevice.deviceName}"
        response.addHeader("Location", location)
    }

    @GetMapping("/api/1.0/devices")
    @Operation(summary = "Find iot device")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Device found successfully.",
        ),
    )
    fun getIotDevices(): MutableList<IotDevice> {
        return deviceIotService.getAllIotDevices()
    }

    @GetMapping("/api/1.0/device/{iotDeviceId}")
    @Operation(summary = "Find iot device by id.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Iot device found successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Iot device not found."
        ),
    )
    fun getIotDeviceById(
        @PathVariable iotDeviceId: UUID
    ): IotDevice? {
        return deviceIotService.getIotDeviceById(iotDeviceId)
    }

    @PutMapping("/api/1.0/devices/{iotDeviceName}")
    @Operation(summary = "Update existing iot device")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "The device was updated successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device not found."
        ),
    )
    fun putIotDevice(
        @PathVariable iotDeviceName: String,
        @RequestBody iotDevice: IotDevice
    ): IotDevice {
        return deviceIotService.update(iotDeviceName, iotDevice)
    }

    @PutMapping("/api/1.0/devices/updateByID/{iotDeviceId}")
    @Operation(summary = "Update existing iot device")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "The device was updated successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device not found."
        ),
    )
    fun updateIotDeviceById(
        @PathVariable iotDeviceId: UUID,
        @RequestBody iotDevice: IotDevice
    ): IotDevice {
        return deviceIotService.updateDeviceByID(iotDeviceId, iotDevice)
    }

    @DeleteMapping("/api/1.0/devices/{iotDeviceName}")
    @Operation(summary = "Deletes iot device")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Device deleted successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device not found.",
        ),
    )
    fun deleteIotDeviceByName(@PathVariable iotDeviceName: String) {
        deviceIotService.deleteIotDeviceByName(iotDeviceName)
    }

    @DeleteMapping("/api/1.0/devices/deleteById/{iotDeviceId}")
    @Operation(summary = "Deletes iot device by ID")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Device deleted successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device not found.",
        ),
    )
    fun deleteIotDeviceById(@PathVariable iotDeviceId: String) {
        val deviceId = UUID.fromString(iotDeviceId)
        deviceIotService.deleteIotDeviceById(deviceId)
    }
}
