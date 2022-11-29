package com.vervetronics.cloudapp.error

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
class DateParseException(message: String, e: Throwable? = null) : RuntimeException(message, e)
