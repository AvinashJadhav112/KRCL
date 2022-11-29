package com.vervetronics.cloudapp.error

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.web.error.ErrorAttributeOptions
import org.springframework.boot.web.servlet.error.ErrorAttributes
import org.springframework.boot.web.servlet.error.ErrorController
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.context.request.WebRequest

@RestController
@CrossOrigin
class ErrorHandler(
    @Autowired private val errorAttributes: ErrorAttributes
) : ErrorController {

    @RequestMapping("/error")
    fun handleError(webRequest: WebRequest): ApiError {
        val attributes = errorAttributes.getErrorAttributes(
            webRequest,
            ErrorAttributeOptions.of(ErrorAttributeOptions.Include.MESSAGE)
        )
        val message = attributes["message"]
        val url = attributes["path"]
        val status = attributes["status"]
        return ApiError(status as Int, message as String, url as String)
    }
}
