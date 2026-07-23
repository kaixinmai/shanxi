import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import Panel from '../Panel'
import { PROBLEM_TYPES } from '../../data/enterpriseCommon'

export default function ProblemClassification() {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(4, 22, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#e8f4ff', fontSize: 16 },
    },
    radar: {
      indicator: PROBLEM_TYPES.map((p) => ({
        name: p.label,
        max: Math.max(...PROBLEM_TYPES.map((x) => x.value)) + 4,
      })),
      center: ['50%', '52%'],
      radius: '58%',
      axisName: { color: 'rgba(232,244,255,0.85)', fontSize: 14 },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.12)' } },
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.2)' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: PROBLEM_TYPES.map((p) => p.value),
            name: '问题分布',
            areaStyle: { color: 'rgba(0, 212, 255, 0.18)' },
            lineStyle: { color: '#00d4ff', width: 2 },
            itemStyle: { color: '#00d4ff' },
          },
        ],
      },
    ],
  }

  const total = PROBLEM_TYPES.reduce((s, p) => s + p.value, 0)

  return (
    <Panel title="问题分类" className="dashboard-panel">
      <ReactECharts
        option={option}
        style={{ height: 150, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
      <div className="problem-tags">
        {PROBLEM_TYPES.map((p) => (
          <span key={p.key} className="problem-tag">
            <i style={{ background: p.color }} />
            {p.label}
            <em>{p.value}</em>
          </span>
        ))}
      </div>
      <div className="problem-summary">
        <span>
          问题合计 <strong>{total}</strong> 项
        </span>
        <span>
          省级退回 <strong>0</strong> / 市级退回 <strong>4</strong>
        </span>
      </div>
    </Panel>
  )
}
