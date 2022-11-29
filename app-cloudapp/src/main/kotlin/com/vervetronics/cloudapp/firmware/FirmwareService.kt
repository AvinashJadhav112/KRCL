package com.vervetronics.cloudapp.firmware

import com.nelkinda.rel.InvalidDataException
import com.vervetronics.cloudapp.error.DuplicateEntityException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import com.vervetronics.cloudapp.iot.device.IotDevice
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.sql.SQLException
import java.util.UUID

@ExperimentalUnsignedTypes
@Service
class FirmwareService(
    @Autowired private val firmwareRepository: FirmwareRepository,
    @Autowired private val deviceIotService: DeviceIotService,
    @Value("\${application.firmwares.path:firmwares}")
    val firmwarePath: Path
) {
    fun list(): List<Firmware> {
        return Files.list(firmwarePath).use { pathStream ->
            pathStream.map {
                Firmware(it.fileName.toString())
            }.toList()
        }
    }

    fun store(firmwareVersion: String, bank1Image: MultipartFile, bank2Image: MultipartFile) {
        val deviceFirmwarePath = firmwarePath.resolve(firmwareVersion)
        try {
            Files.createDirectories(deviceFirmwarePath)
            bank1Image.transferTo(deviceFirmwarePath.resolve("bank1.bin"))
            bank2Image.transferTo(deviceFirmwarePath.resolve("bank2.bin"))
        } catch (e: InvalidDataException) {
            e.message!!
        }
    }

    @Override
    fun save(firmwareVersion: String, firmwareDetail: FirmwareDetail):
        FirmwareDetail {
        val deviceFirmwarePath = firmwarePath.resolve(firmwareVersion)
        firmwareDetail.firmwareBankonepath = deviceFirmwarePath.resolve("bank1.bin").toString()
        firmwareDetail.firmwareBanktwopath = deviceFirmwarePath.resolve("bank2.bin").toString()
        System.out.printf(firmwareDetail.toString())
        try {
            return firmwareRepository.save(firmwareDetail)
        } catch (e: DataIntegrityViolationException) {
            throw DuplicateEntityException("$firmwareVersion already exist", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun getAllFirmwareDetail(): MutableList<FirmwareDetail> {
        return firmwareRepository.findAll()
    }

    fun updateDeviceIotDetail(iotDeviceName: String, iotDevice: IotDevice): IotDevice {
        try {
            return deviceIotService.updateFirmwareVersion(iotDeviceName, iotDevice)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteFirmware(id: UUID) {
        val firmwareDetail = firmwareRepository.getById(id)
        try {
            return firmwareRepository.delete(firmwareDetail)
        } catch (e: NotFoundException) {
            throw NotFoundException("$id Not Found", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }
}
