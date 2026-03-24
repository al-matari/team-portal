package com.teamportal.repository

import com.teamportal.model.Activity
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ActivityRepository : JpaRepository<Activity, Long> {
    @EntityGraph(attributePaths = ["user"])
    fun findByUserId(userId: Long): List<Activity>

    @Query(
        """
            select a
            from Activity a
            join fetch a.user
            order by a.timestamp desc
            """
    )
    fun findFeedActivities(): List<Activity>
}
