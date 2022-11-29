package com.vervetronics.cloudapp.iot.model

import com.vervetronics.cloudapp.error.DuplicateEntityException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.iot.device.DeviceIotService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import java.sql.SQLException
import java.util.UUID

@ExperimentalUnsignedTypes
@Service
class IotModelService(
    @Autowired private val iotModelRepository: IotModelRepository,
    @Autowired private val deviceIotService: DeviceIotService
) {

    fun save(iotModel: IotModel): IotModel {
        try {
            return iotModelRepository.save(iotModel)
        } catch (e: DataIntegrityViolationException) {
            throw DuplicateEntityException("${iotModel.iotModelName} already exist", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun getIotModelByIotModelName(iotModelName: String): IotModel =
        try {
            iotModelRepository.mustFindByIotModelName(iotModelName)
        } catch (e: NotFoundException) {
            throw NotFoundException("$iotModelName Not Found $e")
        } catch (e: DuplicateEntityException) {
            throw DuplicateEntityException("$iotModelName has Two or More Entries", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }

    fun update(iotModelId: UUID, updatedIotModel: IotModel): IotModel {
        try {
            val actualIotModel = iotModelRepository.getById(iotModelId)
            actualIotModel.iotModelName = updatedIotModel.iotModelName
            deviceIotService.updateIotDeviceByIotModelName(actualIotModel.iotModelName, updatedIotModel)
            return iotModelRepository.save(actualIotModel)
        } catch (e: NotFoundException) {
            throw NotFoundException("$iotModelId Not Found", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun getAllIotModels(): MutableList<IotModel> {
        return iotModelRepository.findAll()
    }

    fun deleteIotModelByIotModelName(iotModelName: String) {
        try {
            val iotModel = iotModelRepository.mustFindByIotModelName(iotModelName)
            deviceIotService.deleteIotDeviceByIotModelName(iotModelName)
            iotModelRepository.delete(iotModel)
        } catch (e: NotFoundException) {
            throw NotFoundException("$iotModelName Not Found", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun deleteIotModelByIotModelID(iotModelId: UUID) {
        try {
            val iotModel = iotModelRepository.getById(iotModelId)
            iotModelRepository.delete(iotModel)
        } catch (e: NotFoundException) {
            throw NotFoundException("$iotModelId Not Found", e)
        } catch (e: SQLException) {
            throw SQLException("$e")
        }
    }

    fun getIotModelById(id: UUID): IotModel = try {
        iotModelRepository.getById(id)
    } catch (e: NotFoundException) {
        throw NotFoundException("$id Not Found", e)
    } catch (e: SQLException) {
        throw SQLException("$e")
    }
}
