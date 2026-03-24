const API_BASE = 'http://localhost:8080/api'

interface ApiErrorResponse {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
}

interface TeamStats {
  members: number
  activeProjects: number
  completedThisMonth: number
  efficiency: number
}

interface Activity {
  id: number
  action: string
  timestamp: string
}

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorBody = (await response.json()) as ApiErrorResponse
    if (errorBody.message) {
      return errorBody.message
    }
  } catch {
    return 'Unknown Error: Please contact support'
  }

  return response.statusText || 'Request failed.'
}

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
