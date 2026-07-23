import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import Panel from '../Panel'
import { TOP_ENTERPRISES } from '../../data/enterpriseCommon'

export default function HighEmissionTopRank() {
  const ranked = useMemo(() => {
    return [...TOP_ENTERPRISES]
      .sort((a, b) => b.emission - a.emission)
      .slice(0, 8)
      .reverse()
  }, [])

  const categories = ranked.map((e) => e.name)
  const values = ranked.map((e) => e.emission)
  const emissionMap = Object.fromEntries(
    ranked.map((e) => [e.name, e.emission]),
  )

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(4, 22, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#e8f4ff', fontSize: 16 },
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const items = Array.isArray(params) ? params : [params]
        const name = String(items[0]?.name ?? '')
        const emission = emissionMap[name]
        return `<div style="font-weight:600;margin-bottom:6px;font-size:16px">${name}</div>
          <div style="font-size:15px">碳排放量：<span style="color:#ff9f2e">${emission?.toFixed(1)} 万tCO₂</span></div>`
      },
    },
    grid: { left: 140, right: 52, top: 8, bottom: 8 },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.08)' } },
      axisLabel: { color: 'rgba(232,244,255,0.7)', fontSize: 14 },
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(232,244,255,0.85)',
        fontSize: 14,
        width: 128,
        overflow: 'truncate',
      },
    },
    series: [
      {
        name: '碳排放量',
        type: 'bar',
        data: values,
        barWidth: 12,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#0078ff' },
              { offset: 1, color: '#00d4ff' },
            ],
          },
          borderRadius: [0, 2, 2, 0],
        },
        label: {
          show: true,
          position: 'right',
          color: 'rgba(232,244,255,0.9)',
          fontSize: 14,
          formatter: (p) => `${Number(p.value).toFixed(0)}`,
        },
      },
    ],
  }

  return (
    <Panel title="高排放企业 TOP 榜单" className="dashboard-panel">
      <ReactECharts
        option={option}
        style={{ height: 200, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </Panel>
  )
}
