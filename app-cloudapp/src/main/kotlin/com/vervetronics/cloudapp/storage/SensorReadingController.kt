package com.vervetronics.cloudapp.storage

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpHeaders.CONTENT_DISPOSITION
import org.springframework.http.HttpHeaders.CONTENT_TYPE
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.io.FileNotFoundException
import java.nio.file.NoSuchFileException
import javax.servlet.http.HttpServletResponse

@ExperimentalUnsignedTypes
@RestController
@CrossOrigin
class SensorReadingController(
    @Autowired val sensorReadingService: SensorReadingService,
) {
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(value = [ FileNotFoundException::class, NoSuchFileException::class ])
    fun handleException() {
        // Nothing to do
    }

    @GetMapping("/api/alpha/devices")
    @Operation(summary = "Find all devices")
    @ApiResponses(
        ApiResponse(
            responseCode = "200", description = "Devices data found"
        ),
    )
    @ResponseBody
    fun getDevices(): List<String> {
        return sensorReadingService.getAllDevices()
    }

    @GetMapping("/api/alpha/device/{factoryDeviceId}/sensors")
    @Operation(summary = "Find all sensors by factory device id")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Sensor data found"
            ),
            ApiResponse(
                responseCode = "404", description = "Device not found"
            ),
        ]
    )
    @ResponseBody
    fun getSensors(@PathVariable factoryDeviceId: String): List<String> {
        return sensorReadingService.getAllSensors(factoryDeviceId)
    }

    @GetMapping("/api/alpha/device/{factoryDeviceId}/sensor/{sensorId}/days")
    @Operation(summary = "Find all days by factory device id and sensor id")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Days data found"
            ),
            ApiResponse(
                responseCode = "404", description = "Device/Sensor not found"
            ),
        ]
    )
    @ResponseBody
    fun getDays(@PathVariable factoryDeviceId: String, @PathVariable sensorId: String): List<String> {
        return sensorReadingService.getDays(factoryDeviceId, sensorId)
    }

    @GetMapping("/api/alpha/device/{factoryDeviceId}/sensor/{sensorId}/day/{day}/readings")
    @Operation(summary = "Find all sensor readings by factory device id, sensor id and day")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Sensor data found"
            ),
            ApiResponse(
                responseCode = "404", description = "Device/Sensor/Day not found"
            ),
        ]
    )
    @ResponseBody
    fun getReadings(
        @PathVariable factoryDeviceId: String,
        @PathVariable sensorId: String,
        @PathVariable day: String,
    ): List<SensorReadingView> {
        with(sensorReadingService) {
            return sensorReadingRepository
                .findAllSensorReadings(factoryDeviceId, sensorId, day)
                .map { it.createView() }
        }
    }

    @Operation(
        summary = "Get the latest sensor data for a device.",
        description = "This is useful for dashboards."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200", description = "Sensor data found"
            ),
            ApiResponse(
                responseCode = "404", description = "Device not found or no sensor data found for this device"
            ),
        ]
    )
    @GetMapping("/api/alpha/device/{factoryDeviceId}/sensors/latest")
    @ResponseBody
    fun getLatest(
        @Parameter(description = "The factory device id of the device for which to return the latest sensor data.")
        @PathVariable factoryDeviceId: String
    ): List<SensorReadingView> {
        with(sensorReadingService) {
            return sensorReadingRepository
                .getLatestSensorReadings(factoryDeviceId)
                .map { it.createView() }
        }
    }

    @GetMapping(
        path = ["/api/alpha/bulk-export"],
        produces = ["text/csv"],
    )
    @Operation(summary = "Export all sensors readings")
    @ResponseBody
    fun bulkExport(response: HttpServletResponse) {
        val contentDisposition = ContentDisposition.builder("attachment").filename("sensor-data.csv").build().toString()
        response.setHeader(CONTENT_DISPOSITION, contentDisposition)
        response.setHeader(CONTENT_TYPE, MediaType("text", "csv").toString())
        response.outputStream.use {
            sensorReadingService.export(it)
        }
    }

    companion object {
        val csvHeader = listOf("FactoryDeviceId", "SensorId", "Timestamp", "Value").joinToString(",")
    }
}
