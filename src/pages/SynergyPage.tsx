import Panel from '../components/Panel'
import PageLayout from '../components/PageLayout'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import LineChart from '../components/charts/LineChart'
import GaugeChart from '../components/charts/GaugeChart'

const INDUSTRY_DONUT = [
  { name: '电力', value: 35 },
  { name: '钢铁', value: 22 },
  { name: '水泥', value: 18 },
  { name: '化工', value: 15 },
  { name: '其他', value: 10 },
]

const POLLUTANT_TABLE = [
  { name: 'PM2.5', value: '35.6', unit: 'μg/m³', trend: 'down' },
  { name: 'PM10', value: '58.2', unit: 'μg/m³', trend: 'down' },
  { name: 'SO₂', value: '352.35', unit: '吨', trend: 'up' },
  { name: 'NOx', value: '486.72', unit: '吨', trend: 'down' },
  { name: 'VOCs', value: '128.45', unit: '吨', trend: 'down' },
]

const REGION_CATEGORIES = ['西安', '咸阳', '延安', '安康', '榆林']
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

export default function SynergyPage() {
  return (
    <PageLayout
      defaultYear="2024"
      left={
        <>
          <Panel title="数据总览" className="dashboard-panel">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <GaugeChart value={2462} max={5000} title="碳排放" unit="tCO₂" height={150} />
              <div className="kpi-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="kpi-card-value">7462</div>
                <div className="kpi-card-label">废气污染源 家</div>
              </div>
            </div>
            <div className="kpi-grid kpi-grid-3" style={{ marginTop: 8 }}>
              <div className="kpi-card">
                <div className="kpi-card-value">35.6</div>
                <div className="kpi-card-label">PM2.5</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-card-value">352.35</div>
                <div className="kpi-card-label">SO₂ 吨</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-card-value">486.72</div>
                <div className="kpi-card-label">NOx 吨</div>
              </div>
            </div>
          </Panel>

          <Panel title="行业分布" className="dashboard-panel">
            <DonutChart
              data={INDUSTRY_DONUT}
              centerText="352.35"
              centerSubtext="SO₂ 吨"
              height={170}
            />
          </Panel>

          <Panel title="污染物分布" className="dashboard-panel">
            <table className="data-table">
              <thead>
                <tr>
                  <th>污染物</th>
                  <th>排放量</th>
                  <th>趋势</th>
                </tr>
              </thead>
              <tbody>
                {POLLUTANT_TABLE.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>
                      {row.value} {row.unit}
                    </td>
                    <td>
                      <span className={row.trend === 'up' ? 'trend-up' : 'trend-down'}>
                        {row.trend === 'up' ? '↑' : '↓'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </>
      }
      right={
        <>
          <Panel title="污染物行业比对" className="dashboard-panel">
            <BarChart
              categories={['电力', '钢铁', '水泥', '化工', '建材']}
              series={[
                { name: 'SO₂', data: [120, 85, 62, 48, 37], color: '#00d4ff' },
                { name: 'NOx', data: [180, 95, 72, 58, 42], color: '#0078ff' },
                { name: 'PM2.5', data: [45, 32, 28, 22, 18], color: '#00e676' },
              ]}
              grouped
              height={130}
            />
          </Panel>

          <Panel title="区域污染物分布" className="dashboard-panel">
            <BarChart
              categories={REGION_CATEGORIES}
              series={[{ name: '排放量', data: [520, 380, 290, 210, 450] }]}
              height={120}
              horizontal
            />
          </Panel>

          <Panel title="月度变化趋势" className="dashboard-panel">
            <LineChart
              categories={MONTHS}
              series={[
                { name: 'SO₂', data: [32, 28, 30, 35, 38, 36, 34, 32, 30, 28, 26, 24], area: true, color: '#00d4ff' },
                { name: 'NOx', data: [42, 40, 44, 48, 50, 46, 44, 42, 40, 38, 36, 34], area: true, color: '#0078ff' },
                { name: 'PM2.5', data: [38, 36, 40, 42, 44, 40, 38, 36, 34, 32, 30, 28], area: true, color: '#00e676' },
              ]}
              stacked
              height={140}
            />
          </Panel>
        </>
      }
    />
  )
}
