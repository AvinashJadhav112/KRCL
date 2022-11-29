package com.vervetronics.cloudapp.iot.device

import com.vervetronics.cloudapp.iot.model.IotModel
import org.hibernate.annotations.GenericGenerator
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.time.ZoneOffset
import java.util.UUID
import javax.persistence.AttributeConverter
import javax.persistence.Column
import javax.persistence.Convert
import javax.persistence.Converter
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.validation.constraints.NotBlank

@Repository
interface IotDeviceRepository : JpaRepository<IotDevice, UUID> {
    fun findIotDeviceByDeviceName(iotDeviceName: String): IotDevice?
    fun findIotDeviceBySerialNumber(serialNumber: String): IotDevice?
    fun findIotDeviceByCompanyName(companyName: String): List<IotDevice>
    fun findIotDeviceByCompanyId(companyId: UUID): List<IotDevice>
    fun findIotDeviceByModelName(modelName: String): List<IotDevice>
}

@Entity
@Table(name = "iot_devices")
data class IotDevice(

    @Column(unique = true)
    @field:NotBlank
    var serialNumber: String,

    @Column(unique = true)
    @field:NotBlank
    var deviceName: String,
    var modelName: String,
    var status: String,
    var manufacturingDate: LocalDate,
    var serverFirmwareVersion: String?,
    var deviceFirmwareVersion: String?,
    @Convert(converter = ZoneOffsetConverter::class)
    val timezone: ZoneOffset = ZoneOffset.of("+05:30"),
    var downloadStatus: String?,
    var firmwareId: UUID?,
    var companyId: UUID,
    var companyName: String
) {
    @Id
    @Column(name = "iot_device_id", columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    var id: UUID = UUID(0, 0)

    //    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "iot_model_id")
    var iotModel: IotModel? = null
}

@Converter
class ZoneOffsetConverter : AttributeConverter<ZoneOffset, String> {
    override fun convertToDatabaseColumn(attribute: ZoneOffset): String = attribute.id
    override fun convertToEntityAttribute(dbData: String?): ZoneOffset = ZoneOffset.of(dbData ?: "+05:30")
}
