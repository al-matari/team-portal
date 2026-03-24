package com.teamportal.exception

class UserNotFoundException(userId: Long) : ResourceNotFoundException("User not found: $userId")
