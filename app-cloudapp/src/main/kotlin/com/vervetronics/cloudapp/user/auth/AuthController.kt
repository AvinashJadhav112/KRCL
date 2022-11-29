package com.vervetronics.cloudapp.user.auth

import com.fasterxml.jackson.annotation.JsonView
import com.vervetronics.cloudapp.user.UserViews
import io.swagger.v3.oas.annotations.Operation
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin
class AuthController {

    @PostMapping("/api/1.0/login")
    @Operation(summary = "User Login")
    @JsonView(UserViews.Base::class)
    fun handleLogin(@AuthenticationPrincipal loggedInUser: AuthUser) = loggedInUser
}
