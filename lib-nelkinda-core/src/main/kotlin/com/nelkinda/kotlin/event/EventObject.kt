package com.nelkinda.kotlin.event

open class EventObject<T>(source: T) : java.util.EventObject(source) {
    override fun getSource(): T {
        @Suppress("UNCHECKED_CAST") // This is guaranteed to be T.
        return super.getSource() as T
    }
}
