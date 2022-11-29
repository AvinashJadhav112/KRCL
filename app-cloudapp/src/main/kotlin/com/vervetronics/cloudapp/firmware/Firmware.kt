package com.vervetronics.cloudapp.firmware // ktlint-disable filename

import java.net.URI

data class Firmware(
    val firmwareVersion: String,
    val bank1Path: URI,
    val bank2Path: URI,
) {
    constructor(firmwareVersion: String) : this(
        firmwareVersion,
        URI("/api/v1/firmwares/$firmwareVersion/bank1.bin"),
        URI("/api/v1/firmwares/$firmwareVersion/bank2.bin"),
    )
}
