import { useState } from 'react'
import Panel from '../Panel'
import BarChart from '../charts/BarChart'
import { KEY_PARAMETERS } from '../../data/enterpriseCommon'

export default function KeyParameterDistribution() {
  const [paramKey, setParamKey] = useState<string>(KEY_PARAMETERS[0].key)
  const current =
    KEY_PARAMETERS.find((p) => p.key === paramKey) ?? KEY_PARAMETERS[0]

  return (
    <Panel title="关键参数填报分布" className="dashboard-panel">
      <div className="module-toolbar">
        <label htmlFor="param-select">参数项</label>
        <select
          id="param-select"
          value={paramKey}
          onChange={(e) => setParamKey(e.target.value)}
        >
          {KEY_PARAMETERS.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>
        <span className="module-toolbar-hint">填报完整度区间（%）</span>
      </div>
      <BarChart
        categories={current.bins.map((b) => `${b}%`)}
        series={[{ name: '企业数', data: [...current.counts], color: '#00d4ff' }]}
        height={108}
      />
    </Panel>
  )
}
