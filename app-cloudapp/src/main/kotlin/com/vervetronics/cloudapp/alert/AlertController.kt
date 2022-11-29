package com.vervetronics.cloudapp.alert

import com.vervetronics.cloudapp.error.ApiError
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID
import javax.persistence.EntityNotFoundException

@ExperimentalUnsignedTypes
@RestController
@CrossOrigin
@ControllerAdvice
class AlertController(
    @Autowired private val alertService: AlertService
) {

    @ExceptionHandler(EntityNotFoundException::class)
    @ResponseStatus(NOT_FOUND)
    @ResponseBody
    fun notFound(e: EntityNotFoundException): ApiError {
        return ApiError(NOT_FOUND.value(), e.message, "")
    }

    @GetMapping("/api/1.0/alerts/all")
    @Operation(summary = "Get all alerts")
    @ApiResponses(ApiResponse(responseCode = "200", description = "Returns the list of all Alerts."))
    fun getAlerts(
        @RequestParam(name = "page", defaultValue = "0") page: Int,
        @RequestParam(name = "size", defaultValue = "100") size: Int
    ): Page<Alert> = alertService.getAllAlerts(PageRequest.of(page, size))

    @GetMapping("/api/1.0/alerts/{alertId}")
    @Operation(summary = "Find alert by id.")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Alert found."),
        ApiResponse(responseCode = "404", description = "Alert not found.")
    )
    fun getAlertByAlertId(@PathVariable alertId: UUID) = alertService.getAlertByAlertId(alertId)

    @GetMapping("/api/1.0/alerts/sensor/{sensorId}")
    @Operation(summary = "Find alerts by sensor id.")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Alert found."),
        ApiResponse(responseCode = "404", description = "Alert not found.")
    )
    fun getAlertsBySensorId(

        @PathVariable sensorId: UUID,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam
        start: Instant?,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam
        end: Instant?
    ) = alertService.getAlertsBySensorIdAndInBetween(sensorId, start, end)

    @GetMapping("/api/1.0/alerts/device/{deviceId}")
    @Operation(summary = "Find alerts by device id.")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Alerts found."),
        ApiResponse(responseCode = "404", description = "Alerts not found")
    )
    fun getAlertsByDeviceId(
        @PathVariable deviceId: UUID,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam
        start: Instant?,
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam
        end: Instant?
    ) = alertService.getAlertsByDeviceIdAndTimestampBetween(deviceId, start, end)

    @GetMapping("/api/1.0/alerts/count")
    @Operation(summary = "Get total number of alerts")
    fun getAlertCount() = alertService.alertCount()

    @GetMapping("/api/1.0/alerts/unresolved/device/{deviceId}")
    @Operation(summary = "Find alerts by device id.")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Alerts found."),
        ApiResponse(responseCode = "404", description = "Alerts not found")
    )
    fun getUnresolvedAlertByDeviceId(
        @PathVariable deviceId: UUID
    ) = alertService.getUnresolvedAlertsByDeviceId(deviceId)

    @PutMapping("/api/1.0/alerts/{id}")
    @Operation(summary = "Update existing alert")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Alert updated."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Alert not found."
        )
    )
    fun putAlert(
        @PathVariable id: UUID,
        @RequestBody alert: Alert
    ): Alert {
        return alertService.update(id, alert)
    }

    @DeleteMapping("/api/1.0/alerts/device/{deviceId}")
    @Operation(summary = "Deletes alerts by device id")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Device's alerts deleted successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Device not found."
        )
    )
    fun deleteAlertsByDeviceId(@PathVariable deviceId: UUID) {
        alertService.deleteAlertsByDeviceId(deviceId)
    }

    @DeleteMapping("/api/1.0/alerts/sensor/{sensorId}")
    @Operation(summary = "Deletes alerts by sensor id")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Alerts deleted successfully."
        ),
        ApiResponse(
            responseCode = "404",
            description = "Sensor not found."
        )
    )
    fun deleteAlertsBySensorId(@PathVariable sensorId: UUID) {
        alertService.deleteAlertsBySensorId(sensorId)
    }
}
