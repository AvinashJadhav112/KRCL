package com.vervetronics.cloudapp.company

import io.swagger.v3.oas.annotations.media.Schema
import org.hibernate.annotations.GenericGenerator
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.UUID
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table

@Repository
interface CompanyRepository : JpaRepository<CompanyDetail, UUID> {
    fun findByCompanyName(companyName: String): CompanyDetail?
}

@Entity
@Table(name = "company")
@Schema
data class CompanyDetail(
    @Column(name = "company_name")
    var companyName: String,

    @Column(name = "email")
    var email: String,

    @Column(name = "mobile_number")
    var mobileNumber: String,

    @Column(name = "website")
    var website: String,

    @Column(name = "company_status")
    var companyStatus: String,

    @Column(name = "company_added_date")
    var companyAddedDate: LocalDate
) {
    @Id
    @Column(name = "id", columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    val id: UUID = UUID(0, 0)
}
