import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

export interface BarSeries {
  name: string
  data: number[]
  color?: string | object
  stack?: string
}

interface BarChartProps {
  categories: string[]
  series: BarSeries[]
  height?: number | string
  horizontal?: boolean
  stacked?: boolean
  grouped?: boolean
  showLegend?: boolean
  barWidth?: number | string
}

const DEFAULT_GRADIENT = {
  type: 'linear' as const,
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: '#0078ff' },
    { offset: 1, color: '#00d4ff' },
  ],
}

export default function BarChart({
  categories,
  series,
  height = 200,
  horizontal = false,
  stacked = false,
  grouped = true,
  showLegend = series.length > 1,
  barWidth,
}: BarChartProps) {
  const stackId = stacked ? 'total' : undefined
  const count = series.length
  const computedBarWidth =
    barWidth ?? (horizontal ? 10 : grouped && count > 1 ? `${Math.floor(60 / count)}%` : '40%')

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(4, 22, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#e8f4ff', fontSize: 16 },
      axisPointer: { type: 'shadow' },
    },
    legend: showLegend
      ? {
          top: 0,
          right: 0,
          textStyle: { color: 'rgba(232,244,255,0.85)', fontSize: 14 },
          itemWidth: 12,
          itemHeight: 10,
        }
      : undefined,
    grid: {
      left: horizontal ? 100 : 48,
      right: 16,
      top: showLegend ? 32 : 16,
      bottom: horizontal ? 16 : 34,
    },
    xAxis: horizontal
      ? {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(0,212,255,0.08)' } },
          axisLabel: { color: 'rgba(232,244,255,0.7)', fontSize: 14 },
        }
      : {
          type: 'category',
          data: categories,
          axisLine: { lineStyle: { color: 'rgba(0,212,255,0.2)' } },
          axisLabel: { color: 'rgba(232,244,255,0.8)', fontSize: 14 },
          axisTick: { show: false },
        },
    yAxis: horizontal
      ? {
          type: 'category',
          data: categories,
          axisLine: { show: false },
          axisLabel: { color: 'rgba(232,244,255,0.8)', fontSize: 14 },
          axisTick: { show: false },
        }
      : {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'rgba(0,212,255,0.08)' } },
          axisLabel: { color: 'rgba(232,244,255,0.7)', fontSize: 14 },
        },
    series: series.map((s, i) => ({
      name: s.name,
      type: 'bar',
      data: s.data,
      stack: s.stack ?? stackId,
      barWidth: computedBarWidth,
      barGap: grouped && !stacked ? '20%' : undefined,
      itemStyle: {
        color: s.color ?? DEFAULT_GRADIENT,
        borderRadius: stacked
          ? 0
          : horizontal
            ? [0, 2, 2, 0]
            : i === series.length - 1 && stacked
              ? [2, 2, 0, 0]
              : [2, 2, 0, 0],
      },
    })),
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  )
}
