package com.vervetronics.cloudapp.protocol.event

import java.util.EventListener

@ExperimentalUnsignedTypes
interface DownloadStatusListener : EventListener {
    fun updateDownloadStatusOfFirmware(e: DownloadStatusEvent)
}
