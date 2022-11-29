package com.vervetronics.cloudapp.user.userDetails.userDevices

import com.vervetronics.cloudapp.iot.device.IotDevice
import io.swagger.v3.oas.annotations.media.Schema
import org.hibernate.annotations.GenericGenerator
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table

@Repository
interface UserDeviceRepository : JpaRepository<UserDevice, UUID> {

    fun findByDevicesId(devicesId: UUID): List<UserDevice>?

    fun findByEmail(email: String): List<UserDevice>?

    fun findByEmailAndDevicesId(email: String, devicesId: String): UserDevice?
}

@Entity
@Table(name = "user_devices")
@Schema
data class UserDevice(
    @Column(name = "devices_id")
    var devicesId: String,
    @Column(name = "email")
    var email: String,

) {
    @Id
    @Column(name = "id", columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID = UUID(0, 0)
}
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "devices_id")
var iotDevice: IotDevice? = null
