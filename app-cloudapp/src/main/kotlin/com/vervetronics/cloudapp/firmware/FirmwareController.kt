package com.vervetronics.cloudapp.firmware

import com.vervetronics.cloudapp.iot.device.IotDevice
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.util.UUID
import javax.validation.Valid

@ExperimentalUnsignedTypes
@CrossOrigin
@RestController
@RequestMapping("/api/v1/firmwares")
class FirmwareController(
    @Autowired private val firmwareService: FirmwareService
) {
    @GetMapping
    fun list(): List<Firmware> = firmwareService.list()

    @PostMapping("/{firmwareVersion}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun uploadFirmware(
        @PathVariable("firmwareVersion") firmwareVersion: String,
        @RequestParam("bank1 image") bank1Image: MultipartFile,
        @RequestParam("bank2 image") bank2Image: MultipartFile,
        @ModelAttribute @Valid firmwareDetail: FirmwareDetail,
    ) {

        firmwareService.store(firmwareVersion, bank1Image, bank2Image)
        firmwareService.save(firmwareVersion, firmwareDetail)
    }

    @GetMapping("/getFirmwareDetails")
    @Operation(summary = "Get all firmware details")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Found firmware details",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Details not found",
        ),
    )
    fun getFirmwareDetail() = firmwareService.getAllFirmwareDetail()

    @PostMapping("/device/{iotDeviceName}")
    @Operation(summary = "Update device server firmware version and firmware ID")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Found device details",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device not found",
        )
    )
    fun updateIotDeviceDetail(
        @PathVariable("iotDeviceName") iotDeviceName: String,
        @RequestBody @Valid iotDevice: IotDevice,
    ) {
        firmwareService.updateDeviceIotDetail(iotDeviceName, iotDevice)
    }

    @DeleteMapping("/deleteFirmware/{firmwareId}")
    @Operation(summary = "Delete firmware by firmware ID")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Firmware Deleted Successfully",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Firmware not found",
        )
    )
    fun deleteFirmware(@PathVariable("firmwareId") id: UUID) {
        firmwareService.deleteFirmware(id)
    }
}
