package com.vervetronics.cloudapp.error

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

@JsonInclude(value = NON_NULL)
data class ApiError(
    @field:Schema(
        description = "HTTP Response Status (repeated from the HTTP Response here for convenience).",
        example = "422",
    )
    val status: Int,

    @field:Schema(
        description = "Error message",
        example = "Formula compilation error",
    )
    val message: String?,

    @field:Schema(
        description = "URL that caused the error.",
        example = "/api/v1/iotModels",
    )
    val url: String,
) {
    @field:Schema(
        description = "Timestamp of the error.",
        example = "2021-05-31T18:14:02.961Z",
    )
    val timeStamp: LocalDateTime = LocalDateTime.now()

    @field:Schema(
        description = "In case of validation errors, a map (key: field, value: message) with the actual errors.",
    )
    var validationErrors: Map<String, String>? = mapOf()
}
