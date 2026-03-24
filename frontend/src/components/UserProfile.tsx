import { useState, useEffect } from 'react'
import { fetchUserActivity } from '../api/mockApi'
import ProfileCard from './ProfileCard'
import ActivityCard from './ActivityCard'

interface Activity {
  id: number
  action: string
  timestamp: string
}

interface UserData {
  name: string
  role: string
  email: string
  lastActive: string
}

function UserProfile() {
  const [userData] = useState<UserData>({
    name: 'Alex Johnson',
    role: 'Senior Engineer',
    email: 'alex.johnson@company.com',
    lastActive: new Date().toLocaleString()
  })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadActivity = async () => {
      setLoading(true)
      setError(null)
      try {
        const activities = await fetchUserActivity()
        setRecentActivity(activities)
      } catch (err) {
        setRecentActivity([])
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadActivity()
  }, [])

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>

      <ProfileCard user={userData} />

      <div className="activity-section">
        <h3>Recent Activity</h3>

        <div className="activity-list">
          {loading ? (
            <div className="loading">Loading recent activity...</div>
          ) : error ? (
            <div className="error" role="alert">
              <p>{error}</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="no-activity">No recent activity</div>
          ) : (
            recentActivity.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
