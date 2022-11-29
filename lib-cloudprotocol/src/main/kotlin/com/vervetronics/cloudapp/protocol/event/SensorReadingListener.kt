package com.vervetronics.cloudapp.protocol.event

import java.util.EventListener

@ExperimentalUnsignedTypes
interface SensorReadingListener : EventListener {
    fun sensorReadingReceived(e: SensorReadingEvent)
}
