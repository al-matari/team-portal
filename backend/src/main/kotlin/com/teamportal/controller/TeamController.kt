package com.teamportal.controller

import com.teamportal.service.TeamService
import com.teamportal.service.TeamStatsDTO
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Validated
@RequestMapping("/api/teams")
class TeamController(
    private val teamService: TeamService
) {
    @GetMapping("/{team}/stats")
    fun getTeamStats(
        @PathVariable
        @Pattern(regexp = ".*\\S.*", message = "team must not be blank")
        @Size(min = 3, message = "team must be at least 3 characters")
        team: String
    ): TeamStatsDTO {
        return teamService.getTeamStats(team)
    }
}
