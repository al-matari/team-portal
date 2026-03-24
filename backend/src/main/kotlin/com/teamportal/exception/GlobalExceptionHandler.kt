package com.teamportal.exception

import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.MissingServletRequestParameterException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException
import java.time.OffsetDateTime
import java.time.ZoneOffset

@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleResourceNotFound(
        exception: ResourceNotFoundException,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        return buildResponse(
            status = HttpStatus.NOT_FOUND,
            message = exception.message ?: "Resource not found",
            path = request.requestURI
        )
    }

    @ExceptionHandler(
        MethodArgumentTypeMismatchException::class,
        MissingServletRequestParameterException::class,
        MethodArgumentNotValidException::class
    )
    fun handleBadRequest(
        exception: Exception,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        return buildResponse(
            status = HttpStatus.BAD_REQUEST,
            message = resolveBadRequestMessage(exception),
            path = request.requestURI
        )
    }

    @ExceptionHandler(Exception::class)
    fun handleUnexpectedException(
        exception: Exception,
        request: HttpServletRequest
    ): ResponseEntity<ApiErrorResponse> {
        logger.error("Unhandled exception for {} {}", request.method, request.requestURI, exception)

        return buildResponse(
            status = HttpStatus.INTERNAL_SERVER_ERROR,
            message = "An unexpected error occurred",
            path = request.requestURI
        )
    }

    private fun buildResponse(
        status: HttpStatus,
        message: String,
        path: String
    ): ResponseEntity<ApiErrorResponse> {
        val body = ApiErrorResponse(
            timestamp = OffsetDateTime.now(ZoneOffset.UTC).toString(),
            status = status.value(),
            error = status.reasonPhrase,
            message = message,
            path = path
        )

        return ResponseEntity.status(status).body(body)
    }

    private fun resolveBadRequestMessage(exception: Exception): String {
        return when (exception) {
            is MethodArgumentTypeMismatchException -> {
                val rejectedValue = exception.value?.toString() ?: "null"
                "Invalid value for '${exception.name}': '$rejectedValue'"
            }

            is MissingServletRequestParameterException ->
                "Missing required parameter: ${exception.parameterName}"

            is MethodArgumentNotValidException -> "Validation failed"

            else -> "Invalid request"
        }
    }
}
