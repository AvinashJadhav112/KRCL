package com.vervetronics.cloudapp.iot.model

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.headers.Header
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
@RequestMapping("/api/1.0")
@CrossOrigin
@RestController
class IotModelController(
    @Autowired private val iotModelService: IotModelService
) {

    @PostMapping("/iotModels")
    @Operation(summary = "Add new iot model")
    @ApiResponses(
        ApiResponse(
            responseCode = "201",
            description = "The iot model was created successfully.",
            headers = [
                Header(
                    name = "Location",
                    description = "URL of created iot model"
                )
            ]
        ),
        ApiResponse(
            responseCode = "409",
            description = "The iot model already exists.",
        ),
        ApiResponse(
            responseCode = "415",
            description = "Unsupported Media Type",
        ),
        ApiResponse(
            responseCode = "400",
            description = "Syntax error in JSON.",
        )
    )
    @ResponseStatus(HttpStatus.CREATED)
    fun postIotModel(@RequestBody @Valid iotModel: IotModel, response: HttpServletResponse) {
        val savedIotModel = iotModelService.save(iotModel)
        val location = "api/1.0/iotModel/${savedIotModel.id}"
        response.addHeader("Location", location)
    }

    @GetMapping("/iotModels/{iotModelName}")
    @Operation(summary = "Find iot model by name")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Iot model found successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Iot model not found."
        ),
    )
    fun getIotModelByName(@PathVariable iotModelName: String): IotModel {
        return iotModelService.getIotModelByIotModelName(iotModelName)
    }

    @GetMapping("/iotModels")
    @Operation(summary = "Finds all iot models")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Iot models found successfully.",
        ),
    )
    fun getIotModels(): MutableList<IotModel> {
        return iotModelService.getAllIotModels()
    }

    @GetMapping("/iotModel/{id}")
    @Operation(summary = "Find iotModel by id")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Iot model found successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Iot model not found."
        ),
    )
    fun getIotModelById(@PathVariable id: UUID): IotModel {
        return iotModelService.getIotModelById(id)
    }

    @PutMapping("/iotModels/{iotModelId}")
    @Operation(summary = "Update existing iot model")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Iot model updated.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Iot model not found."
        )
    )
    fun putIotModel(
        @PathVariable iotModelId: UUID,
        @RequestBody iotModel: IotModel
    ): IotModel {
        return iotModelService.update(iotModelId, iotModel)
    }

    @DeleteMapping("/iotModels/{iotModelName}")
    @Operation(summary = "Deletes  iot model by name")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Iot model deleted successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Iot model not found."
        )
    )
    fun deleteIotModelByIotModelName(@PathVariable iotModelName: String) {
        iotModelService.deleteIotModelByIotModelName(iotModelName)
    }

    @DeleteMapping("/iotModels/deleteByID/{iotModelID}")
    @Operation(summary = "Deletes  iot model by ID")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Iot model deleted successfully.",
        ),
        ApiResponse(
            responseCode = "404",
            description = "Iot model not found."
        )
    )
    fun deleteIotModelByIotModelID(@PathVariable iotModelID: UUID) {
        iotModelService.deleteIotModelByIotModelID(iotModelID)
    }
}
