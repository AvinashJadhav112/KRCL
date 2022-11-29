package com.vervetronics.cloudapp.error

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NOT_FOUND)
class NotFoundException(message: String?, e: Throwable? = null) : RuntimeException(message, e)
