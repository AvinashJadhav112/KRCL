package com.vervetronics.cloudapp.user.userDetails

import com.fasterxml.jackson.annotation.JsonIgnore
import com.vervetronics.cloudapp.iot.device.IotDevice
import com.vervetronics.cloudapp.user.User
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Immutable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.OneToOne
import javax.persistence.Table
import javax.validation.constraints.NotBlank

@Repository
interface UserDetailsRepository : JpaRepository<UserDetails, UUID> {
    fun findByEmail(email: String): UserDetails?
    fun findByCompanyName(companyName: String): List<UserDetails>
    fun findByCompanyId(companyId: UUID): List<UserDetails>
}

@Repository
interface ShowUserDevicesRepository : JpaRepository<ShowUserDevices, UUID> {

    fun findByEmail(email: String): List<ShowUserDevices>?
}

@Entity
@Table(name = "user_details")
data class UserDetails(
    @Column(name = "first_name")
    var firstName: String,
    @Column(name = "last_name")
    var lastName: String,
    @Column(unique = true, name = "email")
    val email: String,
    @Column(name = "alternate_email")
    var alternateEmail: String,
    @Column(unique = true, name = "mobile_number")
    @field:NotBlank
    var mobileNumber: String,
    @Column(unique = true, name = "alternate_mobile_number")
    @field:NotBlank
    var alternateMobileNumber: String,
    @Column(name = "company_name")
    @field:NotBlank
    var companyName: String,
    @Column(name = "user_status")
    @field:NotBlank
    var userStatus: String,
    @Column(name = "user_status_date")
    var userStatusDate: LocalDate,
    @Column(name = "user_added_date")
    var userAddedDate: LocalDate,
    @Column(name = "company_id")
    var companyId: UUID
) {
    @Id
    @Column(name = "user_details_id", columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    var id: UUID = UUID(0, 0)

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    var user: User? = null
}

@Entity
@Immutable
@Table(name = "`show_user_devices`")
data class ShowUserDevices(
    @field:NotBlank
    var email: String
) {
    @Id
    @Column(name = "id", columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID = UUID(0, 0)

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "devices_id")
    var iotDevice: IotDevice? = null
}
