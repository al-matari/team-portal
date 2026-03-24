package com.teamportal.controller

import com.teamportal.service.ActivityDTO
import com.teamportal.service.UserService
import jakarta.validation.constraints.Positive
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    @GetMapping("/{id}/activities")
    fun getUserActivities(
        @PathVariable
        @Positive(message = "id must be greater than 0")
        id: Long
    ): List<ActivityDTO> {
        return userService.getUserActivities(id)
    }
}
