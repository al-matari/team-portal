export interface ApiErrorResponse {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
}

export interface TeamStats {
  members: number
  activeProjects: number
  completedThisMonth: number
  efficiency: number
}

export interface Activity {
  id: number
  action: string
  timestamp: string
}

export interface UserData {
  name: string
  role: string
  email: string
  lastActive: string
}
