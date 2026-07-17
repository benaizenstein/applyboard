import { useDroppable } from '@dnd-kit/core'
import { Chip, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { Application, ApplicationStage } from '../../api/applications/applications.types'
import { tokens } from '../../theme/tokens'
import { ApplicationCard } from './ApplicationCard'
import { stageConfig } from './stageConfig'

interface StageColumnProps {
  stage: ApplicationStage
  applications: Application[]
  onSelect: (id: string) => void
}

export function StageColumn({ stage, applications, onSelect }: StageColumnProps) {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const config = stageConfig[stage]

  return (
    <Paper
      ref={setNodeRef}
      variant="outlined"
      sx={{
        p: 1.5,
        minHeight: 340,
        borderRadius: `${tokens.radius.md}px`,
        borderTop: `3px solid ${config.color}`,
        bgcolor: isOver ? 'action.hover' : 'background.paper',
        transition: 'background-color 120ms ease',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Typography variant="subtitle2">{t(config.labelKey)}</Typography>
        <Chip
          label={applications.length}
          size="small"
          sx={{ bgcolor: config.color, color: '#FFFFFF' }}
        />
      </Stack>
      <Stack gap={1}>
        {applications.length === 0 ? (
          <Typography variant="caption" color="text.secondary" textAlign="center" py={2}>
            {t('board.empty')}
          </Typography>
        ) : (
          applications.map((application) => (
            <ApplicationCard key={application.id} application={application} onSelect={onSelect} />
          ))
        )}
      </Stack>
    </Paper>
  )
}
