import { useMemo } from 'react'
import { useApplications } from '../../api/applications/applications.queries'
import type { Application, ApplicationStage } from '../../api/applications/applications.types'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const WEEKS_SHOWN = 8

const STAGE_RANK: Record<ApplicationStage, number> = {
  rejected: -1,
  saved: 0,
  applied: 1,
  interview: 2,
  offer: 3,
}

const FUNNEL_STAGES: ApplicationStage[] = ['saved', 'applied', 'interview', 'offer']

export interface InsightsData {
  stats: { total: number; active: number; offers: number; rejected: number }
  funnel: { stage: ApplicationStage; count: number }[]
  overTime: { label: string; count: number }[]
  stackFrequency: { technology: string; count: number }[]
}

export function computeInsights(applications: Application[], now = Date.now()): InsightsData {
  const rejected = applications.filter((application) => application.stage === 'rejected').length
  const offers = applications.filter((application) => application.stage === 'offer').length

  const funnel = FUNNEL_STAGES.map((stage) => ({
    stage,
    count: applications.filter((application) => STAGE_RANK[application.stage] >= STAGE_RANK[stage])
      .length,
  }))

  const overTime = Array.from({ length: WEEKS_SHOWN }, (_, index) => {
    const weeksBack = WEEKS_SHOWN - index
    const start = now - weeksBack * WEEK_MS
    const end = start + WEEK_MS
    const endDate = new Date(end)
    return {
      label: `${endDate.getDate()}/${endDate.getMonth() + 1}`,
      count: applications.filter((application) => {
        const created = new Date(application.createdAt).getTime()
        return created >= start && created < end
      }).length,
    }
  })

  const stackCounts = new Map<string, number>()
  for (const application of applications) {
    for (const technology of application.stack) {
      stackCounts.set(technology, (stackCounts.get(technology) ?? 0) + 1)
    }
  }
  const stackFrequency = [...stackCounts.entries()]
    .map(([technology, count]) => ({ technology, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return {
    stats: {
      total: applications.length,
      active: applications.length - rejected,
      offers,
      rejected,
    },
    funnel,
    overTime,
    stackFrequency,
  }
}

export function useInsightsViewModel() {
  const { data: applications = [], isLoading } = useApplications()
  const insights = useMemo(() => computeInsights(applications), [applications])
  return { ...insights, isLoading, isEmpty: applications.length === 0 }
}
