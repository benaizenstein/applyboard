import ReactECharts from 'echarts-for-react'
import { tokens } from '../../theme/tokens'

interface StackFrequencyChartProps {
  data: { technology: string; count: number }[]
}

export function StackFrequencyChart({ data }: StackFrequencyChartProps) {
  const reversed = [...data].reverse()

  const option = {
    tooltip: { trigger: 'item' },
    textStyle: { fontFamily: tokens.fontFamily },
    grid: { top: 8, bottom: 28, left: 88, right: 32 },
    xAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: tokens.color.border } },
      axisLabel: { color: tokens.color.textSecondary },
    },
    yAxis: {
      type: 'category',
      data: reversed.map((item) => item.technology),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: tokens.color.textPrimary },
    },
    series: [
      {
        type: 'bar',
        barWidth: 14,
        itemStyle: { color: tokens.color.primary, borderRadius: [0, 4, 4, 0] },
        label: { show: true, position: 'right', color: tokens.color.textSecondary },
        data: reversed.map((item) => item.count),
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 300 }} notMerge />
}
