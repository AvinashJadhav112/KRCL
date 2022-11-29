package com.vervetronics.cloudapp.protocol.event

import java.util.EventListener

@ExperimentalUnsignedTypes
interface MessageListener : EventListener {
    fun messageReceived(e: MessageEvent) {
        // Intentionally empty
    }
}
