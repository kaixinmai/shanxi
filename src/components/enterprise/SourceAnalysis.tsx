import Panel from '../Panel'
import DonutChart from '../charts/DonutChart'
import {
  SHARE_BY_SOURCE,
  SHARE_SOURCE_COLORS,
} from '../../data/enterpriseCommon'

export default function SourceAnalysis() {
  const total = SHARE_BY_SOURCE.reduce((s, d) => s + d.value, 0)

  return (
    <Panel title="按排放源分析" className="dashboard-panel">
      <DonutChart
        data={SHARE_BY_SOURCE}
        centerText={total.toFixed(1)}
        centerSubtext="万tCO₂"
        height={180}
        colors={SHARE_SOURCE_COLORS}
      />
    </Panel>
  )
}
