package com.vervetronics.cloudapp.protocol.event

import com.nelkinda.kotlin.event.EventObject
import com.vervetronics.cloudapp.protocol.CloudAppHandler

@ExperimentalUnsignedTypes
open class DownloadStatusEvent(cloudAppHandler: CloudAppHandler, val downloadStatus: String, val serialNumber: String) :
    EventObject<CloudAppHandler>(cloudAppHandler)
