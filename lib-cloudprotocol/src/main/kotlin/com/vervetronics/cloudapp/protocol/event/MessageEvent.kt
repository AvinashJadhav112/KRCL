package com.vervetronics.cloudapp.protocol.event

import com.nelkinda.kotlin.event.EventObject
import com.vervetronics.cloudapp.protocol.CloudAppHandler
import com.vervetronics.cloudapp.protocol.Message

@ExperimentalUnsignedTypes
open class MessageEvent(cloudAppHandler: CloudAppHandler, val message: Message) :
    EventObject<CloudAppHandler>(cloudAppHandler)
