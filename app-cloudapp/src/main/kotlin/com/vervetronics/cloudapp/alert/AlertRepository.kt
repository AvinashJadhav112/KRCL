package com.vervetronics.cloudapp.alert

import io.swagger.v3.oas.annotations.media.Schema
import org.hibernate.annotations.GenericGenerator
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Repository
interface AlertRepository : JpaRepository<Alert, UUID> {
    fun findAlertBySensorId(sensorId: UUID): List<Alert>?
    fun findAlertByDeviceId(deviceId: UUID): List<Alert>?
    fun findAlertsByTimestampBetween(start: Instant, end: Instant): List<Alert>
    fun findAlertsByDeviceIdAndTimestampBetween(deviceId: UUID, start: Instant, end: Instant): List<Alert>?
    fun findAlertsBySensorIdAndTimestampBetween(sensorId: UUID, start: Instant, end: Instant): List<Alert>?
}

@Entity
@Table(name = "alerts")
@Schema
data class Alert(
    @Column(name = "sensor_id")
    val sensorId: UUID,
    @Column(name = "sensor_name")
    val sensorName: String,
    @Column(name = "device_id")
    val deviceId: UUID,
    @Column(name = "timestamp")
    val timestamp: Instant,
    @Column(name = "processed_value")
    val processedValue: String,
    @Column(name = "alert_criticality")
    val alertCriticality: String,
    @Column(name = "alert_description")
    var alertDescription: String = "none",
    @Column(name = "employee_name")
    var employeeName: String = "none",
    @Column(name = "alertStatus", columnDefinition = "varchar(255) default 'Unresolved'")
    var alertStatus: String = "Unresolved",
) {
    @Id
    @Column(name = "id", columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID = UUID(0, 0)
}
