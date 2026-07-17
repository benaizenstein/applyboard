import { describe, expect, it } from 'vitest'
import type { Application } from '../../api/applications/applications.types'
import { groupByStage, resolveStageMove } from './useBoardViewModel'

function makeApplication(overrides: Partial<Application>): Application {
  return {
    id: 'app-1',
    company: 'Lumenpath',
    role: 'Senior Frontend Engineer',
    location: 'Tel Aviv',
    stage: 'saved',
    stack: ['React'],
    salaryRange: '',
    notes: '',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('groupByStage', () => {
  it('creates a bucket for every stage even when empty', () => {
    const groups = groupByStage([])
    expect(Object.keys(groups)).toEqual(['saved', 'applied', 'interview', 'offer', 'rejected'])
    expect(groups.saved).toEqual([])
  })

  it('places each application in its stage bucket', () => {
    const applications = [
      makeApplication({ id: 'a', stage: 'saved' }),
      makeApplication({ id: 'b', stage: 'interview' }),
      makeApplication({ id: 'c', stage: 'saved' }),
    ]
    const groups = groupByStage(applications)
    expect(groups.saved.map((application) => application.id)).toEqual(['a', 'c'])
    expect(groups.interview.map((application) => application.id)).toEqual(['b'])
    expect(groups.offer).toEqual([])
  })
})

describe('resolveStageMove', () => {
  const applications = [makeApplication({ id: 'a', stage: 'saved' })]

  it('returns the move when dropping on a different stage', () => {
    expect(resolveStageMove(applications, 'a', 'applied')).toEqual({ id: 'a', stage: 'applied' })
  })

  it('returns null when dropping on the same stage', () => {
    expect(resolveStageMove(applications, 'a', 'saved')).toBeNull()
  })

  it('returns null when there is no drop target', () => {
    expect(resolveStageMove(applications, 'a', undefined)).toBeNull()
  })

  it('returns null for an unknown application', () => {
    expect(resolveStageMove(applications, 'missing', 'applied')).toBeNull()
  })
})
