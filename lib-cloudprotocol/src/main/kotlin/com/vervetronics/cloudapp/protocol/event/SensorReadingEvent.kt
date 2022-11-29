package com.vervetronics.cloudapp.protocol.event

import com.nelkinda.kotlin.event.EventObject
import com.vervetronics.cloudapp.protocol.CloudAppHandler
import com.vervetronics.cloudapp.storage.SensorReading

@ExperimentalUnsignedTypes
class SensorReadingEvent constructor(cloudAppHandler: CloudAppHandler, val sensorReading: SensorReading) :
    EventObject<CloudAppHandler>(cloudAppHandler)
