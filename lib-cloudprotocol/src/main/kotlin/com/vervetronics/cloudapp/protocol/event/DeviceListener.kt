package com.vervetronics.cloudapp.protocol.event

import java.util.EventListener

@ExperimentalUnsignedTypes
interface DeviceListener : EventListener {

    fun updateFirmwareVersionOfDevice(e: DeviceEvent) {
        // Intentionally empty
    }
}
