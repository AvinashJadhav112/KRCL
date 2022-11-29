package com.vervetronics.cloudapp.iot.model.sensor

import com.fasterxml.jackson.annotation.JsonIgnore
import com.nelkinda.rel.convertValue
import com.vervetronics.cloudapp.iot.model.IotModel
import io.swagger.v3.oas.annotations.Parameter
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
interface SensorRepository : JpaRepository<Sensor, UUID> {
    fun findSensorByIdAndIotModelId(sensorId: UUID, iotModelId: UUID): Sensor?
}

@Entity
@Table(name = "sensors")
@Schema
data class Sensor(
    @Column(name = "sensor_id")
    var sensorId: String,
    var name: String,
    var alertCriticality: String,
    var dashboardOrder: String,
    var min: String,
    var max: String,
    var alertTime: String = "30",

    @field:Schema(
        description = "formula for the expression compiler.",
        example = "(value - 32) * 5 / 9.0 + 273.15",
    )
    var formula: String,

    @field:Schema(
        description = "data type for the interpretation of sensor wire data in the formula.",
        example = "Int",
    )
    var rawDataType: String,

    @field:Schema(
        description = "data type for the interpretation of formula result.",
        example = "Double",
    )
    var processedDataType: String,

    @field:Schema(
        description = "unit of the formula result.",
        example = "K",
    )
    var unit: String,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "iotModel_id", nullable = false)
    @JsonIgnore
    var iotModel: IotModel = IotModel(""),

) {

    @Id
    @Column(name = "id", columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Parameter(
        description = "Not on POST! Internal ID for cross-reference. Same as iotModelId.",
    )
    val id: UUID = UUID(0, 0)

    @ExperimentalUnsignedTypes
    fun isWithinBounds(inputValue: String): Boolean {
        val min = convertValue(this.processedDataType, this.min)
        val max = convertValue(this.processedDataType, this.max)
        val processedValue = convertValue(this.processedDataType, inputValue)
        return min <= processedValue && processedValue <= max
    }
}

private operator fun Any.compareTo(target: Any): Int {
    return when (this) {
        is Byte -> this.compareTo(target as Byte)
        is UByte -> this.compareTo(target as UByte)
        is Short -> this.compareTo(target as Short)
        is UShort -> this.compareTo(target as UShort)
        is Int -> this.compareTo(target as Int)
        is UInt -> this.compareTo(target as UInt)
        is Long -> this.compareTo(target as Long)
        is ULong -> this.compareTo(target as ULong)
        is Float -> this.compareTo(target as Float)
        is Double -> this.compareTo(target as Double)

        else -> throw CannotCompareException("cannot compare data of type ${target::class.simpleName}")
    }
}

class CannotCompareException(message: String) : RuntimeException("Unsupported data type: $message")
