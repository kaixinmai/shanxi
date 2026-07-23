import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import Panel from '../Panel'
import { SHARE_BY_REGION } from '../../data/enterpriseCommon'

interface RegionDistributionProps {
  region?: string
}

export default function RegionDistribution({
  region = '全省',
}: RegionDistributionProps) {
  const values = SHARE_BY_REGION.values.map((v, i) => {
    const name = SHARE_BY_REGION.categories[i]
    if (region === '全省') return v
    return name === region ? v : Number((v * 0.35).toFixed(1))
  })

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(4, 22, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#e8f4ff', fontSize: 16 },
      axisPointer: { type: 'shadow' },
      valueFormatter: (v) => `${v} 百万tCO₂`,
    },
    grid: { left: 44, right: 12, top: 20, bottom: 44 },
    dataZoom: [
      {
        type: 'slider',
        height: 16,
        bottom: 4,
        start: 0,
        end: 70,
        borderColor: 'rgba(0,212,255,0.25)',
        fillerColor: 'rgba(0,212,255,0.15)',
        handleStyle: { color: '#00d4ff' },
        textStyle: { color: 'rgba(232,244,255,0.75)', fontSize: 14 },
      },
    ],
    xAxis: {
      type: 'category',
      data: SHARE_BY_REGION.categories,
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
    series: [
      {
        name: '碳排放量',
        type: 'bar',
        data: values,
        barWidth: 16,
        itemStyle: { color: '#2f7bff', borderRadius: [2, 2, 0, 0] },
      },
    ],
  }

  return (
    <Panel title="区域维度分布" className="dashboard-panel">
      <ReactECharts
        option={option}
        style={{ height: 180, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </Panel>
  )
}
