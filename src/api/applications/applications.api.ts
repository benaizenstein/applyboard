import { apiClient } from '../apiClient'
import type { Application, ApplicationInput } from './applications.types'

const APPLICATIONS_URL = '/api/applications'

export function fetchApplications() {
  return apiClient.get<Application[]>(APPLICATIONS_URL)
}

export function createApplication(input: ApplicationInput) {
  return apiClient.post<Application>(APPLICATIONS_URL, input)
}

export function updateApplication(id: string, patch: Partial<ApplicationInput>) {
  return apiClient.patch<Application>(`${APPLICATIONS_URL}/${id}`, patch)
}

export function deleteApplication(id: string) {
  return apiClient.delete(`${APPLICATIONS_URL}/${id}`)
}
