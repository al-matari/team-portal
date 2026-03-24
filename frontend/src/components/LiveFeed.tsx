import { useState, useEffect } from 'react'
import { fetchFeedActivity } from '../api/mockApi'
import ActivityCard from './ActivityCard'

interface Activity {
  id: number
  action: string
  timestamp: string
}

const mergeActivities = (_current: Activity[], incoming: Activity[]) => {
  return [...incoming]
    .slice(0, 100)
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : 'Failed to load activities'
}

function LiveFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isActive, setIsActive] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const syncActivities = async (shouldIgnore: () => boolean) => {
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

      setActivities([])
      setError(getErrorMessage(error))
    }
  }

  useEffect(() => {
    let ignoreResponse = false

    const loadInitialActivities = async () => {
      setLoading(true)
      setError(null)

      await syncActivities(() => ignoreResponse)

      if (!ignoreResponse) {
        setLoading(false)
      }
    }

    loadInitialActivities()

    return () => {
      ignoreResponse = true
    }
  }, [])

  useEffect(() => {
    if (!isActive) return

    let ignoreResponse = false

    const pollActivities = async () => {
      await syncActivities(() => ignoreResponse)
    }

    void pollActivities()
    const interval = setInterval(async () => {
      await pollActivities()
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
        {loading ? (
          <div className="no-messages">Loading live activity...</div>
        ) : error ? (
           <div className="error" role="alert">
            <p>{error}</p>
           </div>
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
