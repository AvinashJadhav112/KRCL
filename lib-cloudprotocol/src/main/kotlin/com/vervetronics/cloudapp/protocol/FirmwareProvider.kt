package com.vervetronics.cloudapp.protocol

import com.nelkinda.kotlin.Data

@ExperimentalUnsignedTypes
interface FirmwareProvider {
    fun getFirmwareVersion(factoryDeviceId: Data): String?
}
