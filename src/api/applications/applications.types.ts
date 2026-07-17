export const APPLICATION_STAGES = ['saved', 'applied', 'interview', 'offer', 'rejected'] as const

export type ApplicationStage = (typeof APPLICATION_STAGES)[number]

export interface Application {
  id: string
  company: string
  role: string
  location: string
  stage: ApplicationStage
  stack: string[]
  salaryRange: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type ApplicationInput = Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
