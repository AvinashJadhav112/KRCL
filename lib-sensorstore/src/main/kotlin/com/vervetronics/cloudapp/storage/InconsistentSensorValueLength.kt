package com.vervetronics.cloudapp.storage

@ExperimentalUnsignedTypes
class InconsistentSensorValueLength(
    val sensorId: UShort
) : RuntimeException()
