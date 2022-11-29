package com.vervetronics.cloudapp.protocol.event

import java.util.EventListener

@ExperimentalUnsignedTypes
interface ServerListener : EventListener {
    fun serverStarted(e: ServerEvent) {
        // Intentionally empty
    }

    fun serverStopped(e: ServerEvent) {
        // Intentionally empty
    }

    fun connectionReceived(e: ServerEvent) {
        // Intentionally empty
    }
}
