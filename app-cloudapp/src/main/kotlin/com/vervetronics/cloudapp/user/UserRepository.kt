package com.vervetronics.cloudapp.user

import com.fasterxml.jackson.annotation.JsonView
import com.vervetronics.cloudapp.error.NotFoundException
import org.hibernate.annotations.Immutable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID
import javax.persistence.CascadeType
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.Table
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size
import kotlin.collections.HashSet

@Repository
interface UserRepository : JpaRepository<User, Long> {
    fun findByEmail(email: String): User?
}

fun UserRepository.mustFindByEmail(email: String) = findByEmail(email)
    ?: throw NotFoundException("cannot find user with email $email")

@Repository
interface UserRoleRepository : JpaRepository<ShowUserRoles, UUID> {

    fun findByEmail(email: String): ShowUserRoles?
}

@Entity
@Table(name = "users")
data class User(
    @Suppress("kotlin:S1135")
    // TODO check if there is a better alternative for validation. Adding a custom validator for example.
    @field:[Email NotBlank Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\$")]
    @Column(unique = true)
    @JsonView(UserViews.Base::class)
    val email: String,

    @field:[Size(min = 8, max = 255) Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$")]
    @Column
    var password: String

) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(UserViews.Base::class)
    @Column(name = "user_id")
    val id: Long = 0

    @ManyToMany(cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
    @JoinTable(
        name = "users_roles",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "role_id")]
    )
    var roles: Set<UserRole> = HashSet()
}

@Entity
@Immutable
@Table(name = "`show_user_roles`")
data class ShowUserRoles(
    @field:NotBlank
    var email: String,
    var name: String,
) {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0
}
