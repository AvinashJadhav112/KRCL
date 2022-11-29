package com.vervetronics.cloudapp.security

import com.vervetronics.cloudapp.user.auth.AuthUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@EnableWebSecurity
class SecurityConfig(@Autowired private val authUserService: AuthUserService) : WebSecurityConfigurerAdapter() {

    override fun configure(http: HttpSecurity?) {
        http!!.csrf().disable()

        http.httpBasic().authenticationEntryPoint(BasicAuthenticationEntryPoint())
        http
            .authorizeRequests()
            .antMatchers(HttpMethod.POST, "/api/1.0/login").authenticated()
            .antMatchers(HttpMethod.POST, "/api/1.0/users").hasAuthority("ADMIN")
            .and()
            .authorizeRequests().anyRequest().permitAll()

        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
    }

    override fun configure(auth: AuthenticationManagerBuilder?) {
        auth!!.userDetailsService(authUserService).passwordEncoder(passwordEncoder())
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
}
