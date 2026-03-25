import type { ApiErrorResponse } from '../model/api.model'

export const getErrorMessage = (
  error: unknown,
  fallback = 'Request failed.'
): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  return fallback
}

export const parseErrorMessage = async (
  response: Response
): Promise<string> => {
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
