package com.vervetronics.cloudapp.user

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.Table

@Repository
interface RoleRepository : JpaRepository<UserRole, Long> {
    fun findByName(name: String): UserRole?
}

fun RoleRepository.getUserRole() = findByName("USER") ?: UserRole("USER")
fun RoleRepository.getAdminRole() = findByName("ADMIN") ?: UserRole("ADMIN")

@Entity
@Table(name = "roles")
data class UserRole(
    @Column
    val name: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    val id: Long = 0
}
