package com.vervetronics.cloudapp.protocol.event

import com.nelkinda.kotlin.event.EventObject
import com.vervetronics.cloudapp.protocol.CloudAppServer

@ExperimentalUnsignedTypes
open class ServerEvent(source: CloudAppServer) : EventObject<CloudAppServer>(source)
