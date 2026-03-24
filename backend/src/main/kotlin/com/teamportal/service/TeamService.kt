package com.teamportal.service

import com.teamportal.exception.TeamNotFoundException
import com.teamportal.repository.TeamRepository
import org.springframework.stereotype.Service

data class TeamStatsDTO(
    val members: Int,
    val activeProjects: Int,
    val completedThisMonth: Int,
    val efficiency: Int
)

@Service
class TeamService(
    private val teamRepository: TeamRepository
) {
    fun getTeamStats(teamName: String): TeamStatsDTO {
        val team = teamRepository.findByNameIgnoreCase(teamName)
            ?: throw TeamNotFoundException(teamName)

        return TeamStatsDTO(
            members = team.members,
            activeProjects = team.activeProjects,
            completedThisMonth = team.completedThisMonth,
            efficiency = team.efficiency
        )
    }
}
