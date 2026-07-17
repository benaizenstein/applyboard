import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { tokens } from '../../theme/tokens'
import { ApplicationsOverTimeChart } from './ApplicationsOverTimeChart'
import { ChartCard } from './ChartCard'
import { PipelineFunnelChart } from './PipelineFunnelChart'
import { StackFrequencyChart } from './StackFrequencyChart'
import { StatTile } from './StatTile'
import { useInsightsViewModel } from './useInsightsViewModel'

export function InsightsScreen() {
  const { t } = useTranslation()
  const { stats, funnel, overTime, stackFrequency, isLoading, isEmpty } = useInsightsViewModel()

  if (isLoading) {
    return (
      <Stack alignItems="center" py={8}>
        <CircularProgress />
      </Stack>
    )
  }

  if (isEmpty) {
    return (
      <Stack alignItems="center" py={8}>
        <Typography color="text.secondary">{t('insights.empty')}</Typography>
      </Stack>
    )
  }

  return (
    <Stack gap={2}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        <StatTile label={t('insights.stats.total')} value={stats.total} />
        <StatTile
          label={t('insights.stats.active')}
          value={stats.active}
          accentColor={tokens.color.stage.applied}
        />
        <StatTile
          label={t('insights.stats.offers')}
          value={stats.offers}
          accentColor={tokens.color.stage.offer}
        />
        <StatTile
          label={t('insights.stats.rejected')}
          value={stats.rejected}
          accentColor={tokens.color.stage.rejected}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        <ChartCard title={t('insights.funnelTitle')}>
          <PipelineFunnelChart data={funnel} />
        </ChartCard>
        <ChartCard title={t('insights.overTimeTitle')}>
          <ApplicationsOverTimeChart data={overTime} />
        </ChartCard>
      </Box>
      <ChartCard title={t('insights.stackTitle')}>
        <StackFrequencyChart data={stackFrequency} />
      </ChartCard>
    </Stack>
  )
}
