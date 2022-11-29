package com.nelkinda.kotlin

fun Any.getClassPath(): String? {
    return this::class.java.protectionDomain.codeSource.location.path
}
