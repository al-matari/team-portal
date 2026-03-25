import { useState, useEffect } from 'react'
import { fetchTeamStats } from '../api/mockApi'
import { getErrorMessage } from '../api/error.handler'
import type { TeamStats } from '../model/api.model'
import StatsDisplay from './StatsDisplay'

function Dashboard() {
  const [selectedTeam, setSelectedTeam] = useState<string>(() => {
    return sessionStorage.getItem('selectedTeam') || 'engineering'
  })
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignoreResponse = false

    const loadStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchTeamStats(selectedTeam)
        if (ignoreResponse) return
        setStats(data)
      } catch (err) {
        if (ignoreResponse) return
        setStats(null)
        setError(getErrorMessage(err, 'Unable to load team statistics.'))
      } finally {
        if (!ignoreResponse) {
          setLoading(false)
        }
      }
    }

    void loadStats()

    return () => {
      ignoreResponse = true
    }
  }, [selectedTeam])

  useEffect(() => {
    if (!autoRefresh) return

    let ignoreResponse = false

    const interval = setInterval(() => {
      const refreshStats = async () => {
        setError(null)

        try {
          const data = await fetchTeamStats(selectedTeam)
          if (ignoreResponse) return

          setStats(data)
        } catch (err) {
          if (ignoreResponse) return

          setError(getErrorMessage(err, 'Unable to refresh team statistics.'))
        }
      }

      void refreshStats()
    }, 10000)

    return () => {
      ignoreResponse = true
      clearInterval(interval)
    }
  }, [autoRefresh, selectedTeam])

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTeam = event.target.value
    setSelectedTeam(newTeam)
    sessionStorage.setItem('selectedTeam', newTeam)
  }

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Team Performance Dashboard</h2>
        <div className="dashboard-controls">
          <div className="team-selector">
            <label htmlFor="team-select">Select Team: </label>
            <select 
              id="team-select"
              value={selectedTeam} 
              onChange={handleTeamChange}
              className="team-dropdown"
            >
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="support">Support</option>
            </select>
          </div>
          <button 
            onClick={toggleAutoRefresh}
            className={`toggle-button ${autoRefresh ? 'active' : 'paused'}`}
          >
            {autoRefresh ? '⏸ Stop Auto-refresh' : '▶ Start Auto-refresh'}
          </button>
        </div>
      </div>

      {autoRefresh && (
        <div className="auto-refresh-indicator">
          <span className="pulse-dot"></span>
          Auto-refreshing every 10 seconds
        </div>
      )}

      {error &&
          <div className="error" role="alert">
            <p>{error}</p>
          </div>
      }

      {loading ? (
        <div className="loading">Loading team statistics...</div>
      ) : !error ? (
        <StatsDisplay stats={stats} teamName={selectedTeam} />
      ) : null}

    </div>
  )
}

export default Dashboard
