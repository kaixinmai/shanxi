import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

export interface LineSeries {
  name: string
  data: number[]
  color?: string
  area?: boolean
  stack?: string
  type?: 'line' | 'bar'
}

interface LineChartProps {
  categories: string[]
  series: LineSeries[]
  height?: number | string
  stacked?: boolean
  showLegend?: boolean
  boundaryGap?: boolean
}

const AREA_COLORS = [
  'rgba(0, 212, 255, 0.3)',
  'rgba(0, 120, 255, 0.25)',
  'rgba(0, 230, 118, 0.2)',
  'rgba(255, 171, 0, 0.2)',
]

export default function LineChart({
  categories,
  series,
  height = 200,
  stacked = false,
  showLegend = series.length > 1,
  boundaryGap = false,
}: LineChartProps) {
  const stackId = stacked ? 'total' : undefined

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(4, 22, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#e8f4ff', fontSize: 16 },
    },
    legend: showLegend
      ? {
          top: 0,
          right: 0,
          textStyle: { color: 'rgba(232,244,255,0.85)', fontSize: 14 },
          itemWidth: 14,
          itemHeight: 3,
        }
      : undefined,
    grid: {
      left: 48,
      right: 16,
      top: showLegend ? 32 : 16,
      bottom: 34,
    },
    xAxis: {
      type: 'category',
      data: categories,
      boundaryGap,
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.2)' } },
      axisLabel: { color: 'rgba(232,244,255,0.8)', fontSize: 14 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.08)' } },
      axisLabel: { color: 'rgba(232,244,255,0.7)', fontSize: 14 },
    },
    series: series.map((s, i) => {
      const color = s.color ?? ['#00d4ff', '#0078ff', '#00e676', '#ffab00'][i % 4]
      const isBar = s.type === 'bar'
      return {
        name: s.name,
        type: isBar ? 'bar' : 'line',
        data: s.data,
        stack: s.stack ?? stackId,
        smooth: !isBar,
        symbol: isBar ? undefined : 'circle',
        symbolSize: isBar ? undefined : 5,
        barWidth: isBar ? '30%' : undefined,
        lineStyle: isBar ? undefined : { width: 2, color },
        itemStyle: { color },
        areaStyle:
          s.area || (stacked && !isBar)
            ? {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: AREA_COLORS[i % AREA_COLORS.length] },
                    { offset: 1, color: 'rgba(0, 212, 255, 0)' },
                  ],
                },
              }
            : undefined,
      }
    }),
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  )
}
