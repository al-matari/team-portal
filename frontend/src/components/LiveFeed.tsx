import { useState, useEffect } from 'react'
import { fetchFeedActivity } from '../api/mockApi'
import { getErrorMessage } from '../api/error.handler'
import type { Activity } from '../model/api.model'
import ActivityCard from './ActivityCard'

const mergeActivities = (_current: Activity[], incoming: Activity[]) => {
  return [...incoming]
    .slice(0, 100)
}

function LiveFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isActive, setIsActive] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const syncActivities = async (shouldIgnore: () => boolean, isInitial: boolean) => {
    if (isInitial) {
      setLoading(true)
    }

    try {
      const nextActivities = await fetchFeedActivity()

      if (shouldIgnore()) {
        return
      }

      setError(null)
      setActivities((currentActivities) =>
        mergeActivities(currentActivities, nextActivities)
      )
    } catch (error) {
      if (shouldIgnore()) {
        return
      }

      if (isInitial) {
        setActivities([])
      }

      setError(getErrorMessage(error, 'Failed to load activities'))
    } finally {
      if (!shouldIgnore() && isInitial) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!isActive) return

    let ignoreResponse = false

    const pollActivities = async (isInitial: boolean) => {
      await syncActivities(() => ignoreResponse, isInitial)
    }

    pollActivities(true)
    const interval = setInterval(async () => {
      await pollActivities(false)
    }, 3000)

    return () => {
      ignoreResponse = true
     clearInterval(interval)
    }
  }, [isActive])

  const toggleFeed = () => {
    setIsActive(!isActive)
  }

  return (
    <div className="live-feed">
      <div className="feed-header">
        <h2>Live Activity Feed</h2>
        <div className="feed-controls">
          <span className="message-counter">
            Showing latest {activities.length} of max 100 activities
          </span>
          <button
            onClick={toggleFeed}
            className={`toggle-button ${isActive ? 'active' : 'paused'}`}
          >
            {isActive ? '⏸ Pause Feed' : '▶ Resume Feed'}
          </button>
        </div>
      </div>

      <div className="feed-status">
        <span className={`status-indicator ${isActive ? 'live' : 'paused'}`}></span>
        <span>{isActive ? 'Live updates active' : 'Feed paused'}</span>
      </div>

      <div className="messages-container">
      {error && (
                  <div className="error" role="alert">
                   <p>{error}</p>
                  </div>
               ) }
        {loading ? (
          <div className="no-messages">Loading live activity...</div>
        ) : activities.length === 0 ? (
          <div className="no-messages">Waiting for activities...</div>
        ) : (
          activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  )
}

export default LiveFeed
