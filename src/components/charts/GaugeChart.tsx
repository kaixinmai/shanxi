import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'

interface GaugeChartProps {
  value: number
  max?: number
  title?: string
  unit?: string
  height?: number | string
}

export default function GaugeChart({
  value,
  max = 5000,
  title,
  unit = 'tCO₂',
  height = 140,
}: GaugeChartProps) {
  const option: EChartsOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max,
        splitNumber: 5,
        radius: '90%',
        center: ['50%', '60%'],
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, '#00e676'],
              [0.7, '#00d4ff'],
              [1, '#ff5252'],
            ],
          },
        },
        pointer: {
          itemStyle: { color: '#00d4ff' },
          width: 4,
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          formatter: `{value}\n{unit|${unit}}`,
          rich: {
            unit: { fontSize: 14, color: 'rgba(232,244,255,0.75)', padding: [6, 0, 0, 0] },
          },
          color: '#00d4ff',
          fontSize: 24,
          fontWeight: 'bold',
          offsetCenter: [0, '20%'],
        },
        title: title
          ? { show: true, offsetCenter: [0, '55%'], color: 'rgba(232,244,255,0.85)', fontSize: 15 }
          : { show: false },
        data: [{ value, name: title ?? '' }],
      },
    ],
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  )
}
