package com.teamportal.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

@Entity
@Table(name = "activities")
class Activity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @field:NotBlank(message = "Activity action must not be blank")
    @field:Size(min = 3, message = "Activity action must be at least 3 characters")
    @Column(nullable = false)
    val action: String,

    @Column(nullable = false)
    var timestamp: LocalDateTime,

    @field:NotNull(message = "Activity user is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User
) {
    @PrePersist
    fun setTimestampBeforeInsert() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now()
        }
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Activity) return false
        return id != 0L && id == other.id
    }

    override fun hashCode(): Int = id.hashCode()

    override fun toString(): String {
        return "Activity(id=$id, action='$action', timestamp=$timestamp)"
    }
}

