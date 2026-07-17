import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { CircularProgress, Paper, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { tokens } from '../../theme/tokens'
import { EXTRACTION_FIELD_ORDER } from './useExtractionViewModel'
import type { ExtractionStatus } from './useExtractionViewModel'
import type { ExtractionChunk } from '../../services/extraction/extraction.types'

interface ExtractionProgressProps {
  status: ExtractionStatus
  completedFields: ExtractionChunk['field'][]
}

export function ExtractionProgress({ status, completedFields }: ExtractionProgressProps) {
  const { t } = useTranslation()

  if (status === 'idle') return null

  const currentIndex = completedFields.length

  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: `${tokens.radius.md}px`, bgcolor: 'background.default' }}
    >
      <Stack direction="row" alignItems="center" gap={1} mb={1.5}>
        <AutoAwesomeIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2">
          {status === 'running' ? t('extraction.analyzing') : t('extraction.done')}
        </Typography>
      </Stack>
      <Stack direction="row" gap={2} flexWrap="wrap">
        {EXTRACTION_FIELD_ORDER.map((field, index) => {
          const isDone = completedFields.includes(field)
          const isCurrent = status === 'running' && index === currentIndex
          return (
            <Stack key={field} direction="row" alignItems="center" gap={0.5}>
              {isDone ? (
                <CheckCircleIcon fontSize="small" color="success" />
              ) : isCurrent ? (
                <CircularProgress size={14} />
              ) : (
                <RadioButtonUncheckedIcon fontSize="small" color="disabled" />
              )}
              <Typography
                variant="caption"
                color={isDone ? 'text.primary' : 'text.secondary'}
              >
                {t(`form.fields.${field}`)}
              </Typography>
            </Stack>
          )
        })}
      </Stack>
    </Paper>
  )
}
