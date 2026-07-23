import Panel from '../Panel'
import DonutChart from '../charts/DonutChart'
import {
  SHARE_BY_INDUSTRY,
  SHARE_INDUSTRY_COLORS,
} from '../../data/enterpriseCommon'

export default function IndustryShare() {
  const total = SHARE_BY_INDUSTRY.reduce((s, d) => s + d.value, 0)

  return (
    <Panel title="碳排放量行业占比情况" className="dashboard-panel">
      <DonutChart
        data={SHARE_BY_INDUSTRY}
        centerText={total.toFixed(1)}
        centerSubtext="百万tCO₂"
        height={200}
        colors={SHARE_INDUSTRY_COLORS}
      />
    </Panel>
  )
}
