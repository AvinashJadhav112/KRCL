package com.vervetronics.cloudapp.protocol

import java.time.Clock
import java.time.LocalDateTime

private val clock = Clock.systemUTC()

fun log(msg: String) {
    System.err.println("${LocalDateTime.now(clock)} $msg")
}
