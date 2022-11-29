package com.nelkinda.kotlin.event

import java.util.Collections.synchronizedList
import java.util.EventListener
import java.util.EventObject

inline fun <reified L : EventListener, E : EventObject> List<L>.fireEvent(event: E, handler: L.(E) -> Unit) {
    toTypedArray().forEach {
        handler.invoke(it, event)
    }
}

fun <L : EventListener> list(): MutableList<L> = synchronizedList(mutableListOf<L>())
