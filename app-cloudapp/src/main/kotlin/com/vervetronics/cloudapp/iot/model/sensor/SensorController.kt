package com.vervetronics.cloudapp.iot.model.sensor

import com.nelkinda.rel.CompilationErrorException
import com.vervetronics.cloudapp.error.ApiError
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.Parameter
import io.swagger.v3.oas.annotations.headers.Header
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus.CREATED
import org.springframework.http.HttpStatus.UNPROCESSABLE_ENTITY
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@RestController
@CrossOrigin
@RequestMapping("/api/1.0")
class SensorController(
    @Autowired private val sensorService: SensorService,
) {
    @PostMapping("/iotModel/{iotModelId}/sensors")
    @Operation(summary = "Add a new sensor in a iot model")
    @ApiResponses(
        ApiResponse(
            responseCode = "201",
            description = "The sensor was created successfully.",
            headers = [
                Header(
                    name = "Location",
                    description = "URL of the created sensor",
                )
            ]
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
            description = "Invalid Sensor request.",
            content = [Content(schema = Schema(implementation = ApiError::class))]
        )
    )
    @ResponseStatus(CREATED)
    @ExperimentalUnsignedTypes
    fun postSensor(
        @Parameter(description = "ID of the IoT Model")
        @PathVariable iotModelId: UUID,
        @RequestBody sensor: Sensor,
        response: HttpServletResponse
    ) {
        val savedTemplate = sensorService.save(iotModelId, sensor)
        val location = "/api/1.0/iotModel/$iotModelId/sensor/${savedTemplate.id}"
        response.addHeader("Location", location)
    }

    @GetMapping("/iotModel/{iotModelId}/sensor/{sensorId}")
    @Operation(summary = "Find sensor by id")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Sensor found successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Sensor not found.",
            content = [Content(schema = Schema(implementation = ApiError::class))],
        ),
    )
    fun getSensor(
        @PathVariable iotModelId: UUID,
        @PathVariable sensorId: UUID
    ): Sensor? = sensorService.getSensorByIotModelIdAndSensorId(iotModelId, sensorId)

    @PutMapping("/iotModel/{iotModelId}/sensor/{sensorId}")
    @Operation(summary = "Update an existing sensor")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "The sensor was updated successfully."),
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
            description = "Invalid Sensor request.",
            content = [Content(schema = Schema(implementation = ApiError::class))]
        )
    )
    @ExperimentalUnsignedTypes
    fun updateSensor(
        @Parameter(description = "ID of the IoT Model")
        @PathVariable iotModelId: UUID,
        @Parameter(description = "ID of the Sensor")
        @PathVariable sensorId: UUID,
        @RequestBody sensor: Sensor
    ) = sensorService.update(iotModelId, sensorId, sensor)

    @DeleteMapping("/iotModel/{iotModelId}/sensor/{sensorId}")
    @Operation(summary = "Delete a sensor")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Sensor deleted successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Sensor not found.",
            content = [Content(schema = Schema(implementation = ApiError::class))],
        ),
    )
    fun deleteSensor(
        @PathVariable iotModelId: UUID,
        @PathVariable sensorId: UUID,
    ) = sensorService.deleteSensorByIotModelIdAndSensorId(iotModelId, sensorId)

    @ExceptionHandler(value = [(CompilationErrorException::class)])
    @ResponseStatus(UNPROCESSABLE_ENTITY)
    fun handleCompilationErrorException(
        exception: CompilationErrorException,
        request: HttpServletRequest,
    ) = ApiError(
        UNPROCESSABLE_ENTITY.value(),
        "Syntax error when compiling the formula: ${exception.message}",
        request.servletPath
    )
}
