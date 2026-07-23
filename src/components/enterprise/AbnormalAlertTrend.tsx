import { useState } from 'react'
import Panel from '../Panel'
import LineChart from '../charts/LineChart'
import {
  ALERT_TREND_MONTHLY,
  ALERT_TREND_YEARLY,
  ALERT_TYPES,
  MONTH_LABELS,
} from '../../data/enterpriseCommon'

export default function AbnormalAlertTrend() {
  const [mode, setMode] = useState<'month' | 'year'>('month')

  const categories =
    mode === 'month' ? MONTH_LABELS : ['2020', '2021', '2022', '2023', '2024']
  const trendData = mode === 'month' ? ALERT_TREND_MONTHLY : ALERT_TREND_YEARLY

  const series = ALERT_TYPES.map((t) => ({
    name: t.label,
    data: trendData[t.key],
    color: t.color,
  }))

  return (
    <Panel title="异常数据告警趋势" className="dashboard-panel">
      <div className="tab-bar">
        <button
          type="button"
          className={`tab-btn ${mode === 'month' ? 'active' : ''}`}
          onClick={() => setMode('month')}
        >
          月
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === 'year' ? 'active' : ''}`}
          onClick={() => setMode('year')}
        >
          年
        </button>
      </div>
      <LineChart categories={categories} series={series} stacked height={118} />
    </Panel>
  )
}
