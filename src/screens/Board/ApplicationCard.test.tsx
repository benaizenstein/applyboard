import { DndContext } from '@dnd-kit/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Application } from '../../api/applications/applications.types'
import { ApplicationCard } from './ApplicationCard'

const application: Application = {
  id: 'app-1',
  company: 'Lumenpath',
  role: 'Senior Frontend Engineer',
  location: 'Tel Aviv',
  stage: 'interview',
  stack: ['React', 'TypeScript', 'MUI', 'Vitest', 'GraphQL'],
  salaryRange: '',
  notes: '',
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
}

function renderCard(onSelect = vi.fn()) {
  render(
    <DndContext>
      <ApplicationCard application={application} onSelect={onSelect} />
    </DndContext>,
  )
  return onSelect
}

describe('ApplicationCard', () => {
  it('shows the role, company and location', () => {
    renderCard()
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument()
    expect(screen.getByText('Lumenpath')).toBeInTheDocument()
    expect(screen.getByText('Tel Aviv')).toBeInTheDocument()
  })

  it('collapses long stacks into a counter chip', () => {
    renderCard()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('MUI')).toBeInTheDocument()
    expect(screen.queryByText('Vitest')).not.toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('reports a selection on click', () => {
    const onSelect = renderCard()
    fireEvent.click(screen.getByText('Lumenpath'))
    expect(onSelect).toHaveBeenCalledWith('app-1')
  })
})
