import { useMemo, useState } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import { useApplications, useMoveApplication } from '../../api/applications/applications.queries'
import { APPLICATION_STAGES } from '../../api/applications/applications.types'
import type { Application, ApplicationStage } from '../../api/applications/applications.types'

export function groupByStage(applications: Application[]): Record<ApplicationStage, Application[]> {
  const groups = Object.fromEntries(
    APPLICATION_STAGES.map((stage) => [stage, [] as Application[]]),
  ) as Record<ApplicationStage, Application[]>
  for (const application of applications) {
    groups[application.stage].push(application)
  }
  return groups
}

export function resolveStageMove(
  applications: Application[],
  applicationId: string,
  targetStage: ApplicationStage | undefined,
): { id: string; stage: ApplicationStage } | null {
  if (!targetStage || !APPLICATION_STAGES.includes(targetStage)) return null
  const application = applications.find((item) => item.id === applicationId)
  if (!application || application.stage === targetStage) return null
  return { id: applicationId, stage: targetStage }
}

export function useBoardViewModel() {
  const { data: applications = [], isLoading } = useApplications()
  const moveApplication = useMoveApplication()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const columns = useMemo(() => groupByStage(applications), [applications])
  const selected = applications.find((application) => application.id === selectedId) ?? null

  function handleDragEnd(event: DragEndEvent) {
    const move = resolveStageMove(
      applications,
      String(event.active.id),
      event.over?.id as ApplicationStage | undefined,
    )
    if (move) {
      moveApplication.mutate(move)
    }
  }

  return {
    columns,
    isLoading,
    selected,
    selectApplication: setSelectedId,
    closeDetails: () => setSelectedId(null),
    handleDragEnd,
  }
}
