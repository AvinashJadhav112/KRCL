package com.vervetronics.cloudapp.dashboard

import com.vervetronics.cloudapp.storage.SensorReading
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDateTime
import java.util.UUID

@ExperimentalUnsignedTypes
@RestController
@CrossOrigin
class DashboardController(
    @Autowired private val dashboardService: DashboardService,
) {
    @GetMapping("/api/1.0/dashboard/devices")
    @Operation(summary = "Retrieve the list of devices for the dashboard.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Returns the list of devices for the dashboard. "
        ),
    )
    @ResponseStatus(HttpStatus.OK)
    fun getDeviceList(): List<DeviceListEntry> = dashboardService.getAllDevices()

    @ExperimentalUnsignedTypes
    @GetMapping("/api/1.0/dashboard/devices/{id}/sensors/latest")
    @Operation(summary = "Retrieve the latest sensor data.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Returns the list of sensors with latest value. "
        ),
        ApiResponse(
            responseCode = "400",
            description = "Invalid device id."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device id not found. "
        ),
    )
    fun getLatestSensorReadings(
        @PathVariable id: UUID,
        @RequestParam showSensorsMissingInModel: Boolean?,
    ): LatestSensorReadings {
        return dashboardService.getLatestSensorReadings(id, showSensorsMissingInModel)
    }

    @ExperimentalUnsignedTypes
    @GetMapping("/api/1.0/dashboard/{deviceId}/sensors/{sensorId}/readings")
    @Operation(summary = "Find all sensors data for given duration.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Returns the list of sensor readings for given duration."
        ),
        ApiResponse(
            responseCode = "400",
            description = "Invalid input start/end datetime."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device/Sensor id not found."
        ),
    )
    fun getSensorDataForSelectedDate(
        @PathVariable deviceId: UUID,
        @PathVariable sensorId: String,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam start: LocalDateTime,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam end: LocalDateTime,
    ): List<SensorReading> {
        return dashboardService.getSensorReadingBetweenDays(deviceId, sensorId, start, end)
    }

    @ExperimentalUnsignedTypes
    @GetMapping("/api/1.0/dashboard/{deviceId}/sensors/{sensorId}/readings/calculated")
    @Operation(summary = "Find all calculated sensors data for given duration.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Returns the list of sensor readings for given duration."
        ),
        ApiResponse(
            responseCode = "400",
            description = "Invalid input start/end datetime."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device/Sensor id not found."
        ),
    )
    fun getCalculatedSensorDataForSelectedDate(
        @PathVariable deviceId: UUID,
        @PathVariable sensorId: String,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam start: LocalDateTime,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam end: LocalDateTime,
    ): List<Calculated> {
        return dashboardService.getCalculatedSensorReadingBetween(deviceId, sensorId, start, end)
    }

    @ExperimentalUnsignedTypes
    @GetMapping("/api/1.0/dashboard/{deviceId}/sensors/{sensorId}/entries")
    @Operation(summary = "Find all sensors entries for given duration.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Returns the list of sensor entries for given duration."
        ),
        ApiResponse(
            responseCode = "400",
            description = "Invalid input start/end datetime."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device/Sensor id not found."
        ),
    )
    fun getSensorEntriesForSelectedDate(
        @PathVariable deviceId: UUID,
        @PathVariable sensorId: String,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam start: LocalDateTime,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam end: LocalDateTime,
    ): List<Calculated> {
        return dashboardService.getSensorEntriesBetweenDays(deviceId, sensorId, start, end)
    }

    @ExperimentalUnsignedTypes
    @GetMapping("/api/1.0/dashboard/{deviceId}/location")
    @Operation(summary = "Get latitude and longitude to track device's location")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Location parameters fetched successfully",
        ),
        ApiResponse(
            responseCode = "404",
            description = "device not found"
        )
    )
    fun getDevicesLocation(
        @PathVariable deviceId: UUID
    ) = dashboardService.getLocationSensorsLatestValue(deviceId)

    @ExperimentalUnsignedTypes
    @GetMapping("/api/1.0/dashboard/devices/{id}/sensors/latest/calculated")
    @Operation(summary = "Retrieve the latest calculated sensor data.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Returns the list of sensors with latest value. "
        ),
        ApiResponse(
            responseCode = "400",
            description = "Invalid device id."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device id not found. "
        ),
    )
    fun getLatestCalculatedSensorReadings(
        @PathVariable id: UUID,
        @RequestParam showSensorsMissingInModel: Boolean?,
    ): LatestSensorReadings {
        return dashboardService.getLatestCalculatedSensorReadings(id, showSensorsMissingInModel)
    }
}
