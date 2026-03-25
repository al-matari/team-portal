import { parseErrorMessage } from './error.handler'
import type { Activity, TeamStats } from '../model/api.model'

const API_BASE = 'http://localhost:8080/api'

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export const fetchTeamStats = async (team: string): Promise<TeamStats> => {
  return fetchJson<TeamStats>(`/teams/${team}/stats`)
}

export const fetchFeedActivity = async (): Promise<Activity[]> => {
  return fetchJson<Activity[]>('/activities/feed')
}

export const fetchUserActivity = async (): Promise<Activity[]> => {
  return fetchJson<Activity[]>('/users/1/activities')
}
