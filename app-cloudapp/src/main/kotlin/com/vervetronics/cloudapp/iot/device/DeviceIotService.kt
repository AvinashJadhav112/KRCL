@file:Suppress("TooGenericExceptionCaught", "TooGenericExceptionThrown", "TooManyFunctions")

package com.vervetronics.cloudapp.iot.device

import com.nelkinda.kotlin.Data
import com.vervetronics.cloudapp.error.DuplicateEntityException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.iot.model.IotModel
import com.vervetronics.cloudapp.iot.model.IotModelRepository
import com.vervetronics.cloudapp.iot.model.mustFindByIotModelName
import com.vervetronics.cloudapp.iot.model.sensor.Sensor
import com.vervetronics.cloudapp.protocol.FirmwareProvider
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import java.sql.SQLException
import java.util.UUID

@ExperimentalUnsignedTypes
@Service
class DeviceIotService(
    @Autowired private val iotDeviceRepository: IotDeviceRepository,
    @Autowired private val iotModelRepository: IotModelRepository
) : FirmwareProvider {

    fun updateDeviceFirmwareVersion(serialNumber: String, deviceFirmwareVersion: String) {
        val iotDevice = iotDeviceRepository.findIotDeviceBySerialNumber(serialNumber)
            ?: throw NotFoundException("$serialNumber not found")
        if (iotDevice.deviceFirmwareVersion != deviceFirmwareVersion) {
            iotDevice.deviceFirmwareVersion = deviceFirmwareVersion
            try {
                iotDeviceRepository.save(iotDevice)
            } catch (e: SQLException) {
                throw SQLException("$e")
            }
        }
    }

    fun updateDownloadStatus(serialNumber: String, downloadStatus: String) {
        val iotDevice = iotDeviceRepository.findIotDeviceBySerialNumber(serialNumber)
            ?: throw NotFoundException("$serialNumber not found")
        iotDevice.downloadStatus = downloadStatus
        try {
            iotDeviceRepository.save(iotDevice)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun getAllIotDevices(): MutableList<IotDevice> {
        return iotDeviceRepository.findAll()
    }

    fun getIotDeviceById(id: UUID) = try {
        iotDeviceRepository.getById(id)
    } catch (e: NotFoundException) {
        throw NotFoundException("$id not Found", e)
    } catch (e: SQLException) {
        throw SQLException("$e")
    }

    fun save(iotDevice: IotDevice): IotDevice {
        iotDevice.iotModel = iotModelRepository.mustFindByIotModelName(iotDevice.modelName)
        try {
            return iotDeviceRepository.save(iotDevice)
        } catch (e: DataIntegrityViolationException) {
            throw DuplicateEntityException("${iotDevice.deviceName} already exist", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteIotDeviceByName(iotDeviceName: String) {
        val iotDevice = iotDeviceRepository.findIotDeviceByDeviceName(iotDeviceName)
            ?: throw NotFoundException("$iotDeviceName not found")
        try {
            iotDeviceRepository.delete(iotDevice)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun update(iotDeviceName: String, iotDevice: IotDevice): IotDevice {
        val actualIotDevice = iotDeviceRepository.findIotDeviceByDeviceName(iotDeviceName)
            ?: throw NotFoundException("$iotDeviceName not found")

        actualIotDevice.serialNumber = iotDevice.serialNumber
        actualIotDevice.deviceName = iotDevice.deviceName
        actualIotDevice.status = iotDevice.status
        actualIotDevice.manufacturingDate = iotDevice.manufacturingDate
        actualIotDevice.modelName = iotDevice.modelName
        actualIotDevice.serverFirmwareVersion = iotDevice.serverFirmwareVersion
        actualIotDevice.deviceFirmwareVersion = iotDevice.deviceFirmwareVersion
        actualIotDevice.companyId = iotDevice.companyId
        actualIotDevice.companyName = iotDevice.companyName
        try {
            return iotDeviceRepository.save(actualIotDevice)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateDeviceByID(iotDeviceId: UUID, iotDevice: IotDevice): IotDevice {
        val actualIotDevice = iotDeviceRepository.getById(iotDeviceId)

        actualIotDevice.serialNumber = iotDevice.serialNumber
        actualIotDevice.deviceName = iotDevice.deviceName
        actualIotDevice.status = iotDevice.status
        actualIotDevice.manufacturingDate = iotDevice.manufacturingDate
        actualIotDevice.modelName = iotDevice.modelName
        actualIotDevice.serverFirmwareVersion = iotDevice.serverFirmwareVersion
        actualIotDevice.deviceFirmwareVersion = iotDevice.deviceFirmwareVersion
        actualIotDevice.companyId = iotDevice.companyId
        actualIotDevice.companyName = iotDevice.companyName

        try {
            return iotDeviceRepository.save(actualIotDevice)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateFirmwareVersion(iotDeviceName: String, iotDevice: IotDevice): IotDevice {
        val actualIotDevice = iotDeviceRepository.findIotDeviceByDeviceName(iotDeviceName)
            ?: throw NotFoundException("$iotDeviceName not found")

        actualIotDevice.serverFirmwareVersion = iotDevice.serverFirmwareVersion
        actualIotDevice.firmwareId = iotDevice.firmwareId

        try {
            return iotDeviceRepository.save(actualIotDevice)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun mustFindSensorBySerialNumberAndSensorId(serialNumber: String, sensorId: String): Sensor {
        val iotDevice = iotDeviceRepository.findIotDeviceBySerialNumber(serialNumber)
            ?: throw NotFoundException("serial number $serialNumber  not found")
        return iotDevice.iotModel!!.sensors.find { it.sensorId == sensorId }
            ?: throw NotFoundException("sensor id $sensorId not found")
    }

    fun findDeviceBySerialNumber(serialNumber: String): IotDevice {
        return iotDeviceRepository.findIotDeviceBySerialNumber(serialNumber)
            ?: throw NotFoundException("serial Number $serialNumber not found")
    }

    fun deleteIotDeviceById(iotDeviceId: UUID) {
        try {
            val iotDevice = iotDeviceRepository.getById(iotDeviceId)
            iotDeviceRepository.delete(iotDevice)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteIotDeviceByCompanyName(companyName: String) {
        try {
            val deviceList = iotDeviceRepository.findIotDeviceByCompanyName(companyName)
            if (deviceList.isNotEmpty()) {
                for (device in deviceList) {
                    iotDeviceRepository.delete(device)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteIotDeviceByCompanyId(companyId: UUID) {
        try {
            val deviceList = iotDeviceRepository.findIotDeviceByCompanyId(companyId)
            if (deviceList.isNotEmpty()) {
                for (device in deviceList) {
                    iotDeviceRepository.delete(device)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteIotDeviceByIotModelName(iotModelName: String) {
        try {
            val deviceList = iotDeviceRepository.findIotDeviceByModelName(iotModelName)
            if (deviceList.isNotEmpty()) {
                for (device in deviceList) {
                    iotDeviceRepository.delete(device)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateIotDeviceByCompanyId(companyId: UUID, companyName: String) {
        try {
            val deviceList = iotDeviceRepository.findIotDeviceByCompanyId(companyId)
            if (deviceList.isNotEmpty()) {
                for (device in deviceList) {
                    device.companyName = companyName
                    iotDeviceRepository.save(device)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateIotDeviceByCompanyName(oldCompanyName: String, updatedCompanyName: String) {
        try {
            val deviceList = iotDeviceRepository.findIotDeviceByCompanyName(oldCompanyName)
            if (deviceList.isNotEmpty()) {
                for (device in deviceList) {
                    device.companyName = updatedCompanyName
                    iotDeviceRepository.save(device)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun updateIotDeviceByIotModelName(iotModelName: String, iotModel: IotModel) {
        try {
            val deviceList = iotDeviceRepository.findIotDeviceByModelName(iotModelName)
            if (deviceList.isNotEmpty()) {
                for (device in deviceList) {
                    device.modelName = iotModelName
                    device.iotModel = iotModel
                    iotDeviceRepository.save(device)
                }
            }
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    override fun getFirmwareVersion(factoryDeviceId: Data): String? {
        val serialNumber = factoryDeviceId.toString()
        val iotDevice = findDeviceBySerialNumber(serialNumber)
        return iotDevice.serverFirmwareVersion
    }
}
