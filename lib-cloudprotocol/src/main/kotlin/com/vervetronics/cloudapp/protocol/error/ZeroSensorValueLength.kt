package com.vervetronics.cloudapp.protocol.error

@ExperimentalUnsignedTypes
class ZeroSensorValueLength(sensorId: UShort) :
    RecoverableProtocolError(
        Error.ZERO_SENSOR_VALUE_LENGTH,
        "Zero sensor value length for sensor %d".format(sensorId.toInt())
    )
