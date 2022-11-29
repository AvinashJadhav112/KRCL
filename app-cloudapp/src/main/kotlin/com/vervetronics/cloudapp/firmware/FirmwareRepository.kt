package com.vervetronics.cloudapp.firmware

import io.swagger.v3.oas.annotations.media.Schema
import org.hibernate.annotations.GenericGenerator
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Repository
interface FirmwareRepository : JpaRepository<FirmwareDetail, UUID> {

    fun findByFirmwareName(firmwareName: String): FirmwareDetail?

    fun findByFirmwareVersion(firmwareVersion: String): FirmwareDetail?
}

@Entity
@Table(name = "firmware")
@Schema
data class FirmwareDetail(
    @Column(name = "firmware_name")
    var firmwareName: String?,

    @Column(name = "firmware_version")
    var firmwareVersion: String,

    @Column(name = "firmware_added_date")
    var firmwareAddedDate: String?,

    @Column(name = "firmwarebankone_path")
    var firmwareBankonepath: String?,

    @Column(name = "firmwarebanktwo_path")
    var firmwareBanktwopath: String?,

) {
    @Id
    @Column(name = "id", columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID = UUID(0, 0)
}
