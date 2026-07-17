import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import type { ApplicationStage } from '../../api/applications/applications.types'
import { tokens } from '../../theme/tokens'
import { stageConfig } from '../Board/stageConfig'

interface PipelineFunnelChartProps {
  data: { stage: ApplicationStage; count: number }[]
}

export function PipelineFunnelChart({ data }: PipelineFunnelChartProps) {
  const { t } = useTranslation()

  const option = {
    tooltip: { trigger: 'item' },
    textStyle: { fontFamily: tokens.fontFamily },
    series: [
      {
        type: 'funnel',
        sort: 'none',
        gap: 2,
        top: 8,
        bottom: 8,
        left: '12%',
        width: '76%',
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c}',
          color: '#FFFFFF',
          fontWeight: 600,
        },
        itemStyle: { borderRadius: 4 },
        data: data.map((item) => ({
          name: t(stageConfig[item.stage].labelKey),
          value: item.count,
          itemStyle: { color: stageConfig[item.stage].color },
        })),
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 280 }} notMerge />
}
