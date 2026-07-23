import Panel from '../Panel'
import LineChart from '../charts/LineChart'
import { getYearlyEmissionTrend } from '../../data/enterpriseCommon'

interface YearlyEmissionTrendProps {
  region: string
  industry: string
}

export default function YearlyEmissionTrend({
  region,
  industry,
}: YearlyEmissionTrendProps) {
  const { years, values } = getYearlyEmissionTrend(region, industry)
  const regionLabel = region === '全省' ? '陕西' : region
  const industryLabel = industry === '全部' ? '全部行业' : industry

  return (
    <Panel title="历年碳排放变化趋势" className="dashboard-panel">
      <div className="trend-filter-hint">
        区域：{regionLabel}　行业：{industryLabel}
        <span>单位：百万 tCO₂</span>
      </div>
      <LineChart
        categories={years}
        series={[
          {
            name: '排放总量',
            data: values,
            color: '#00d4ff',
            area: true,
          },
        ]}
        height={140}
        showLegend={false}
      />
    </Panel>
  )
}
