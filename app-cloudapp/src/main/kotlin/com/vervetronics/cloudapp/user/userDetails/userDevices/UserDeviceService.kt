package com.vervetronics.cloudapp.user.userDetails.userDevices

import com.vervetronics.cloudapp.error.DuplicateEntityException
import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.user.UserService
import com.vervetronics.cloudapp.user.userDetails.ShowUserDevices
import com.vervetronics.cloudapp.user.userDetails.ShowUserDevicesRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class UserDeviceService(
    @Autowired private val userDeviceRepository: UserDeviceRepository,
    @Autowired private val userService: UserService,
    @Autowired private val showUserDevicesRepository: ShowUserDevicesRepository
) {

    fun save(email: String, deviceId: String, userDevices: UserDevice): UserDevice {
        userService.getUserByEmail(email)
        val ud = getUserByEmailAndDeviceId(email, deviceId)
        if (ud == null) {
            return userDeviceRepository.save(userDevices)
        } else
            throw DuplicateEntityException("device is already linked with ${userDevices.email}")
    }
    fun getUsersDevicesByEmail(email: String): List<ShowUserDevices>? {
        return showUserDevicesRepository.findByEmail(email)
            ?: throw NotFoundException("$email not found")
    }

    fun getUserByEmailAndDeviceId(email: String, deviceId: String): UserDevice? {
        return userDeviceRepository.findByEmailAndDevicesId(email, deviceId)
    }

    fun deleteLinkedDevice(email: String, deviceId: String) {
        val linkedDevice = userDeviceRepository.findByEmailAndDevicesId(email, deviceId)
            ?: throw NotFoundException("$email, $deviceId not found")
        userDeviceRepository.delete(linkedDevice)
    }
}
