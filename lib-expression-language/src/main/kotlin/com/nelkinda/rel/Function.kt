package com.nelkinda.rel

interface Function<In, Out> {
    fun apply(value: In): Out
}
