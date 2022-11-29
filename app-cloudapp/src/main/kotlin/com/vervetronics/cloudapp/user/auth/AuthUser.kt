package com.vervetronics.cloudapp.user.auth

import com.fasterxml.jackson.annotation.JsonView
import com.vervetronics.cloudapp.user.User
import com.vervetronics.cloudapp.user.UserViews
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

data class AuthUser(
    private val user: User
) : UserDetails {
    @JsonView(UserViews.Base::class)
    var id: Long = user.id

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> =
        user.roles.map { SimpleGrantedAuthority(it.name) }.toMutableList()

    @JsonView(UserViews.Base::class)
    override fun getUsername() = user.email
    override fun getPassword() = user.password
    override fun isAccountNonExpired() = true
    override fun isAccountNonLocked() = true
    override fun isCredentialsNonExpired() = true
    override fun isEnabled() = true
}
