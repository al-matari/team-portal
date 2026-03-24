package com.teamportal.model

import jakarta.persistence.*

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val name: String,

    @Column(nullable = false, unique = true)
    val email: String,

    @OneToMany(
        mappedBy = "user",
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    val activities: MutableList<Activity> = mutableListOf()
) {

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is User) return false
        return id != 0L && id == other.id
    }

    override fun hashCode(): Int = id.hashCode()

    override fun toString(): String {
        return "User(id=$id, name='$name', email='$email')"
    }
}

