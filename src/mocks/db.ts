import type { Application, ApplicationInput } from '../api/applications/applications.types'
import { seedApplications } from './seed'

const DB_STORAGE_KEY = 'applyboard-db'

function load(): Application[] {
  const raw = localStorage.getItem(DB_STORAGE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as Application[]
    } catch {
      localStorage.removeItem(DB_STORAGE_KEY)
    }
  }
  return seedApplications()
}

let applications = load()

function persist() {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(applications))
}

persist()

export const db = {
  list(): Application[] {
    return applications
  },
  create(input: ApplicationInput): Application {
    const now = new Date().toISOString()
    const application: Application = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    applications = [application, ...applications]
    persist()
    return application
  },
  update(id: string, patch: Partial<ApplicationInput>): Application | undefined {
    let updated: Application | undefined
    applications = applications.map((application) => {
      if (application.id !== id) return application
      updated = { ...application, ...patch, updatedAt: new Date().toISOString() }
      return updated
    })
    if (updated) persist()
    return updated
  },
  remove(id: string) {
    applications = applications.filter((application) => application.id !== id)
    persist()
  },
}
