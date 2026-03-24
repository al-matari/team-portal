package com.teamportal.model

import jakarta.persistence.*
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size

@Entity
@Table(name = "teams")
class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @field:NotBlank(message = "Team name must not be blank")
    @field:Size(min = 3, message = "Team name must be at least 3 characters")
    @Column(nullable = false)
    val name: String,

    @field:PositiveOrZero(message = "Active projects must be zero or greater")
    @Column(name = "active_projects", nullable = false)
    val activeProjects: Int = 0,

    @field:PositiveOrZero(message = "Completed tasks must be zero or greater")
    @Column(name = "completed_this_month", nullable = false)
    val completedThisMonth: Int = 0,

    @field:Min(value = 0, message = "Efficiency must be between 0 and 100")
    @field:Max(value = 100, message = "Efficiency must be between 0 and 100")
    @Column(nullable = false)
    val efficiency: Int = 0,

    @OneToMany
    @JoinColumn(name = "team_id")
    val users: MutableList<User> = mutableListOf()
) {

    @get:Transient
    val members: Int
        get() = users.size

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Team) return false
        return id != 0L && id == other.id
    }

    override fun hashCode(): Int = id.hashCode()

    override fun toString(): String {
        return "Team(id=$id, name='$name', efficiency=$efficiency)"
    }
}
