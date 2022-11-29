package com.vervetronics.cloudapp.protocol.error

@ExperimentalUnsignedTypes
class InconsistentSensorValueLength(sensorId: UShort) :
    NonRecoverableProtocolError(
        Error.INCONSISTENT_SENSOR_VALUE_LENGTH,
        "Inconsistent sensor value length from sensor $sensorId",
    )
