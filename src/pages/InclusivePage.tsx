import Panel from '../components/Panel'
import PageLayout from '../components/PageLayout'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import LineChart from '../components/charts/LineChart'

const KPI_CARDS = [
  { label: '碳积分获得', value: '3,567,890', unit: '分' },
  { label: '碳积分消耗', value: '1,234,567', unit: '分' },
  { label: '参与用户', value: '128,456', unit: '人' },
  { label: '入驻商家', value: '1,678', unit: '家' },
  { label: '绿色场景', value: '24', unit: '个' },
  { label: '兑换次数', value: '45,678', unit: '次' },
  { label: '减排总量', value: '12,345.67', unit: '吨' },
  { label: '活跃度', value: '86.5', unit: '%' },
  { label: '新增用户', value: '8,956', unit: '人' },
]

const SCENE_DONUT = [
  { name: '绿色出行', value: 42 },
  { name: '绿色生活', value: 26 },
  { name: '绿色消费', value: 20 },
  { name: '绿色公益', value: 12 },
]

const PARTICIPANT_DONUT = [
  { name: '个人', value: 78 },
  { name: '企业', value: 22 },
]

const POINTS_DONUT = [
  { name: '出行', value: 45 },
  { name: '生活', value: 28 },
  { name: '消费', value: 18 },
  { name: '公益', value: 9 },
]

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const MERCHANT_RANK = [
  { rank: 1, name: '绿色出行科技有限公司', points: '456,789' },
  { rank: 2, name: '低碳生活超市连锁', points: '389,456' },
  { rank: 3, name: '环保公益基金会', points: '312,678' },
  { rank: 4, name: '新能源充电服务', points: '278,345' },
]

export default function InclusivePage() {
  return (
    <PageLayout
      defaultYear="2024"
      left={
        <>
          <Panel title="数据概览" className="dashboard-panel">
            <div className="kpi-grid kpi-grid-3">
              {KPI_CARDS.map((k) => (
                <div key={k.label} className="kpi-card">
                  <div className="kpi-card-value" style={{ fontSize: 18 }}>
                    {k.value}
                  </div>
                  <div className="kpi-card-label">
                    {k.label}
                    <span className="kpi-card-unit"> {k.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="绿色场景分布" className="dashboard-panel">
            <DonutChart data={SCENE_DONUT} centerText="24" centerSubtext="个场景" height={160} />
          </Panel>

          <Panel title="参与统计" className="dashboard-panel">
            <div className="donut-row">
              <div>
                <div className="sub-panel-title">参与人数</div>
                <DonutChart data={PARTICIPANT_DONUT} centerText="12.8万" centerSubtext="人" height={150} />
              </div>
              <div>
                <div className="sub-panel-title">获得积分</div>
                <DonutChart data={POINTS_DONUT} centerText="356.8万" centerSubtext="分" height={150} />
              </div>
            </div>
          </Panel>
        </>
      }
      right={
        <>
          <Panel title="月度获得趋势" className="dashboard-panel">
            <LineChart
              categories={MONTHS}
              series={[
                { name: '获得积分', data: [280, 310, 295, 340, 360, 380, 420, 400, 370, 350, 320, 290], type: 'bar', color: '#0078ff' },
                { name: '趋势线', data: [280, 300, 310, 330, 350, 370, 390, 395, 380, 360, 340, 310], color: '#00d4ff' },
              ]}
              boundaryGap
              height={130}
            />
          </Panel>

          <Panel title="获得 vs 消耗" className="dashboard-panel">
            <BarChart
              categories={MONTHS.slice(0, 6)}
              series={[
                { name: '获得', data: [280, 310, 295, 340, 360, 380], color: '#00d4ff' },
                { name: '消耗', data: [120, 135, 128, 145, 152, 168], color: '#0078ff' },
              ]}
              grouped
              height={120}
            />
          </Panel>

          <Panel title="入驻商家排行" className="dashboard-panel">
            <table className="data-table">
              <thead>
                <tr>
                  <th>排名</th>
                  <th>商家名称</th>
                  <th>积分</th>
                </tr>
              </thead>
              <tbody>
                {MERCHANT_RANK.map((row) => (
                  <tr key={row.rank}>
                    <td style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{row.rank}</td>
                    <td>{row.name}</td>
                    <td>{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </>
      }
    />
  )
}
