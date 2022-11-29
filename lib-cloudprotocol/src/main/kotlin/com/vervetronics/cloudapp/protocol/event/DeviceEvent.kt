package com.vervetronics.cloudapp.protocol.event

import com.nelkinda.kotlin.event.EventObject
import com.vervetronics.cloudapp.protocol.CloudAppHandler

@ExperimentalUnsignedTypes
open class DeviceEvent(cloudAppHandler: CloudAppHandler, val firmwareVersion: String, val serialNumber: String) :
    EventObject<CloudAppHandler>(cloudAppHandler)
