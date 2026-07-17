import { describe, expect, it } from 'vitest'
import type { Application } from '../../api/applications/applications.types'
import { computeInsights } from './useInsightsViewModel'

const NOW = new Date('2026-07-17T12:00:00.000Z').getTime()

function makeApplication(overrides: Partial<Application>): Application {
  return {
    id: Math.random().toString(36).slice(2),
    company: 'Lumenpath',
    role: 'Frontend Engineer',
    location: '',
    stage: 'saved',
    stack: [],
    salaryRange: '',
    notes: '',
    createdAt: new Date(NOW - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(NOW).toISOString(),
    ...overrides,
  }
}

describe('computeInsights', () => {
  it('counts a funnel stage as everything that reached it or beyond', () => {
    const applications = [
      makeApplication({ stage: 'saved' }),
      makeApplication({ stage: 'applied' }),
      makeApplication({ stage: 'interview' }),
      makeApplication({ stage: 'offer' }),
      makeApplication({ stage: 'rejected' }),
    ]
    const { funnel } = computeInsights(applications, NOW)
    expect(funnel).toEqual([
      { stage: 'saved', count: 4 },
      { stage: 'applied', count: 3 },
      { stage: 'interview', count: 2 },
      { stage: 'offer', count: 1 },
    ])
  })

  it('excludes rejected applications from the active count', () => {
    const applications = [
      makeApplication({ stage: 'applied' }),
      makeApplication({ stage: 'rejected' }),
    ]
    const { stats } = computeInsights(applications, NOW)
    expect(stats).toEqual({ total: 2, active: 1, offers: 0, rejected: 1 })
  })

  it('ranks technologies by how often they appear', () => {
    const applications = [
      makeApplication({ stack: ['React', 'TypeScript'] }),
      makeApplication({ stack: ['React', 'GraphQL'] }),
      makeApplication({ stack: ['React'] }),
    ]
    const { stackFrequency } = computeInsights(applications, NOW)
    expect(stackFrequency[0]).toEqual({ technology: 'React', count: 3 })
    expect(stackFrequency).toHaveLength(3)
  })

  it('buckets applications into the week they were created', () => {
    const applications = [
      makeApplication({ createdAt: new Date(NOW - 2 * 24 * 60 * 60 * 1000).toISOString() }),
      makeApplication({ createdAt: new Date(NOW - 10 * 24 * 60 * 60 * 1000).toISOString() }),
    ]
    const { overTime } = computeInsights(applications, NOW)
    expect(overTime).toHaveLength(8)
    expect(overTime[7].count).toBe(1)
    expect(overTime[6].count).toBe(1)
  })
})
