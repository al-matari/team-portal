package com.teamportal.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.cors")
data class CorsProperties(
    val pathPattern: String = "/api/**",
    val allowedOrigins: List<String> = emptyList(),
    val allowedMethods: List<String> = emptyList(),
    val allowedHeaders: List<String> = emptyList(),
    val allowCredentials: Boolean = true,
    val maxAge: Long = 3600
)
