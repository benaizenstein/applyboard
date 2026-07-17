import { APPLICATION_STAGES } from '../../api/applications/applications.types'
import type { ApplicationStage } from '../../api/applications/applications.types'
import { tokens } from '../../theme/tokens'

export const orderedStages = APPLICATION_STAGES

export const stageConfig: Record<ApplicationStage, { labelKey: string; color: string }> = {
  saved: { labelKey: 'stages.saved', color: tokens.color.stage.saved },
  applied: { labelKey: 'stages.applied', color: tokens.color.stage.applied },
  interview: { labelKey: 'stages.interview', color: tokens.color.stage.interview },
  offer: { labelKey: 'stages.offer', color: tokens.color.stage.offer },
  rejected: { labelKey: 'stages.rejected', color: tokens.color.stage.rejected },
}
