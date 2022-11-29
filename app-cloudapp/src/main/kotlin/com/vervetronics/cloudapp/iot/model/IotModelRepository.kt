package com.vervetronics.cloudapp.iot.model

import com.vervetronics.cloudapp.error.NotFoundException
import com.vervetronics.cloudapp.iot.model.sensor.Sensor
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.TypeDef
import org.hibernate.annotations.TypeDefs
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID
import javax.persistence.CascadeType
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.OneToMany
import javax.persistence.Table
import javax.validation.constraints.NotBlank

@Repository
interface IotModelRepository : JpaRepository<IotModel, UUID> {
    fun findByIotModelName(iotModelName: String): IotModel?
}
fun IotModelRepository.mustFindByIotModelName(iotModelName: String) =
    findByIotModelName(iotModelName) ?: throw NotFoundException("iot model name $iotModelName not found")

@Entity
@Table(name = "iot_models")
@TypeDefs(
    TypeDef(name = "jsonb", typeClass = JsonBinaryType::class)
)
data class IotModel constructor(
    @Column(unique = true)
    @field:NotBlank
    var iotModelName: String,
) {
    @Id
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID = UUID(0, 0)

    @OneToMany(mappedBy = "iotModel", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    var sensors: List<Sensor> = emptyList()
}
