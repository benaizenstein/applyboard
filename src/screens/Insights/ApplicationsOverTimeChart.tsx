import ReactECharts from 'echarts-for-react'
import { tokens } from '../../theme/tokens'

interface ApplicationsOverTimeChartProps {
  data: { label: string; count: number }[]
}

export function ApplicationsOverTimeChart({ data }: ApplicationsOverTimeChartProps) {
  const option = {
    tooltip: { trigger: 'axis' },
    textStyle: { fontFamily: tokens.fontFamily },
    grid: { top: 16, bottom: 28, left: 32, right: 16 },
    xAxis: {
      type: 'category',
      data: data.map((item) => item.label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: tokens.color.textSecondary },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: tokens.color.border } },
      axisLabel: { color: tokens.color.textSecondary },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 2, color: tokens.color.primary },
        itemStyle: { color: tokens.color.primary },
        areaStyle: { color: tokens.color.primary, opacity: 0.08 },
        data: data.map((item) => item.count),
      },
    ],
  }

  return <ReactECharts option={option} style={{ height: 280 }} notMerge />
}
