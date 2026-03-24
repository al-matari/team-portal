package com.teamportal.exception

class TeamNotFoundException(teamName: String) : ResourceNotFoundException("Team not found: $teamName")
