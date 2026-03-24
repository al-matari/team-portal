package com.teamportal.model

import jakarta.persistence.*

@Entity
@Table(name = "teams")
class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String,

    @Column(name = "active_projects", nullable = false)
    val activeProjects: Int = 0,

    @Column(name = "completed_this_month", nullable = false)
    val completedThisMonth: Int = 0,

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

