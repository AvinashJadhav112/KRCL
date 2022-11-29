package com.vervetronics.cloudapp

import com.vervetronics.cloudapp.alert.AlertService
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.protocol.CloudAppServer
import com.vervetronics.cloudapp.protocol.event.DeviceEvent
import com.vervetronics.cloudapp.protocol.event.DeviceListener
import com.vervetronics.cloudapp.protocol.event.DownloadStatusEvent
import com.vervetronics.cloudapp.protocol.event.DownloadStatusListener
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.annotation.PreDestroy

@Suppress("UnusedPrivateMember", "kotlin:S1135") // ToDo to be removed once the calls are placed

@ExperimentalUnsignedTypes
@Component
class Server @Autowired constructor(
    private val cloudAppServer: CloudAppServer,
    private val alertService: AlertService,
    private val deviceIotService: DeviceIotService,
) {
    init {
        cloudAppServer.addSensorReadingListener(alertService)
        cloudAppServer.addDeviceListener(object : DeviceListener {
            override fun updateFirmwareVersionOfDevice(e: DeviceEvent) {
                // TODO deviceIotService.todoCall(e.serialNumber, e.firmwareVersion)
                deviceIotService.updateDeviceFirmwareVersion(e.serialNumber, e.firmwareVersion)
            }
        })
        cloudAppServer.addDownloadStatusListener(object : DownloadStatusListener {
            override fun updateDownloadStatusOfFirmware(e: DownloadStatusEvent) {
                deviceIotService.updateDownloadStatus(e.serialNumber, e.downloadStatus)
            }
        })
        cloudAppServer.start()
    }

    @PreDestroy
    fun stop() {
        cloudAppServer.stop()
    }
}
