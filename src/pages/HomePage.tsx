import Panel from '../components/Panel'
import PageLayout from '../components/PageLayout'
import DonutChart from '../components/charts/DonutChart'
import TipMark from '../components/TipMark'
import { PILOT_TYPE_META, PILOTS_BY_TYPE } from '../data/pilotSites'

const HOME_PILOT_TYPES = PILOT_TYPE_META.map((item) => ({
  ...item,
  count: PILOTS_BY_TYPE[item.key].length,
}))

const HOME_PILOT_TOTAL = HOME_PILOT_TYPES.reduce((sum, item) => sum + item.count, 0)
const HOME_PILOT_MAX = Math.max(...HOME_PILOT_TYPES.map((item) => item.count), 1)

const FIELD_DATA = [
  { name: '能源活动', value: 45 },
  { name: '工业过程', value: 28 },
  { name: '农业活动', value: 18 },
  { name: '废弃物', value: 9 },
]

const TYPE_DATA = [
  { name: 'CO₂', value: 142.5 },
  { name: 'CH₄', value: 12.3 },
  { name: 'N₂O', value: 8.2 },
  { name: 'SF₆', value: 4.0 },
]

const ENTERPRISE_DONUT = [
  { name: '发电', value: 52 },
  { name: '建材', value: 24 },
  { name: '钢铁', value: 14 },
  { name: '化工', value: 10 },
]

const EMISSION_DONUT = [
  { name: '发电', value: 86542 },
  { name: '建材', value: 42156 },
  { name: '钢铁', value: 24890 },
  { name: '化工', value: 13939 },
]

const INCLUSIVE_ENTERPRISE = [
  { name: '绿色出行', value: 35 },
  { name: '绿色生活', value: 28 },
  { name: '绿色消费', value: 22 },
  { name: '绿色公益', value: 15 },
]

const INCLUSIVE_USER = [
  { name: '绿色出行', value: 42 },
  { name: '绿色生活', value: 26 },
  { name: '绿色消费', value: 20 },
  { name: '绿色公益', value: 12 },
]

function TrendMark({ up }: { up: boolean }) {
  return (
    <span
      className={up ? 'synergy-trend synergy-trend-up' : 'synergy-trend synergy-trend-down'}
      aria-label={up ? '上升' : '下降'}
    >
      {up ? '↑' : '↓'}
    </span>
  )
}

function SynergyIcon({ kind }: { kind: 'carbon' | 'pollutant' | 'air' }) {
  if (kind === 'carbon') {
    return (
      <svg className="synergy-cat-icon" viewBox="0 0 48 48" aria-hidden>
        <rect x="10" y="24" width="26" height="14" rx="2" fill="currentColor" />
        <rect x="14" y="16" width="5" height="8" fill="currentColor" />
        <rect x="22" y="12" width="5" height="12" fill="currentColor" />
        <rect x="30" y="18" width="5" height="6" fill="currentColor" />
        <path
          d="M16.5 12c.5-3 2-5 3.5-5M24.5 8c.5-3 2-5 3.5-5M32.5 14c.4-2 1.2-3.5 2.5-3.5"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    )
  }
  if (kind === 'pollutant') {
    return (
      <svg className="synergy-cat-icon" viewBox="0 0 48 48" aria-hidden>
        <path
          d="M24 8l14 8v16l-14 8-14-8V16z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" strokeWidth="2.4" />
      </svg>
    )
  }
  return (
    <svg className="synergy-cat-icon" viewBox="0 0 48 48" aria-hidden>
      <rect
        x="9"
        y="11"
        width="30"
        height="20"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path d="M16 36h16M20 40h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M15 25c2.5-5 5 1.5 7.5-3.5S28 25 33 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

const SYNERGY_ROWS = [
  {
    key: 'carbon',
    title: '碳排放数据',
    icon: 'carbon' as const,
    metrics: [
      { label: '碳排放总量', unit: '万吨', value: '1,654.12', up: true as boolean | null },
      { label: '发电量', unit: '亿kWh', value: '286.4', up: false as boolean | null },
      { label: '供热量', unit: '万GJ', value: '42.8', up: false as boolean | null },
    ],
  },
  {
    key: 'pollutant',
    title: '污染物数据',
    icon: 'pollutant' as const,
    metrics: [
      { label: 'PM10', unit: '吨', value: '1,613.53', up: true as boolean | null },
      { label: 'PM2.5', unit: '吨', value: '986.2', up: false as boolean | null },
      { label: 'SO₂', unit: '吨', value: '12,551.15', up: true as boolean | null },
      { label: 'NOx', unit: '吨', value: '17,853.3', up: true as boolean | null },
    ],
  },
  {
    key: 'air',
    title: '大气监测数据',
    icon: 'air' as const,
    metrics: [
      { label: '优良天数', unit: '天', value: '286', up: true as boolean | null },
      { label: 'AQI均值', unit: '', value: '68', up: false as boolean | null },
      { label: '臭氧', unit: 'μg/m³', value: '118', up: false as boolean | null },
      { label: '一氧化碳', unit: 'mg/m³', value: '0.72', up: false as boolean | null },
    ],
  },
]

export default function HomePage() {
  return (
    <PageLayout
      showIndustry
      left={
        <>
          <Panel title="温室气体清单数据" className="dashboard-panel">
            <div className="donut-row">
              <div>
                <div className="sub-panel-title">领域占比</div>
                <DonutChart
                  data={FIELD_DATA}
                  centerText="167"
                  centerSubtext="家"
                  height={150}
                  colors={['#00d4ff', '#0078ff', '#00e676', '#ffab00']}
                />
              </div>
              <div>
                <div className="sub-panel-title">类型占比</div>
                <DonutChart
                  data={TYPE_DATA}
                  centerText="167"
                  centerSubtext="tCO₂"
                  height={150}
                />
              </div>
            </div>
          </Panel>

          <Panel title="减污降碳协同数据" className="dashboard-panel home-synergy-panel">
            <div className="synergy-rows">
              {SYNERGY_ROWS.map((row) => (
                <div key={row.key} className="synergy-row">
                  <div className="synergy-cat">
                    <SynergyIcon kind={row.icon} />
                    <span className="synergy-cat-title">{row.title}</span>
                  </div>
                  <div className="synergy-metrics">
                    {row.metrics.map((m) => (
                      <div key={m.label} className="synergy-metric">
                        <div className="synergy-metric-label">{m.label}</div>
                        <div className="synergy-metric-main">
                          <span className="synergy-metric-value">{m.value}</span>
                          {m.unit ? <span className="synergy-metric-unit">{m.unit}</span> : null}
                          {m.up === null ? null : <TrendMark up={m.up} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="碳排放数据" className="dashboard-panel">
            <div className="top-stats-row">
              <div className="top-stat-item">
                <div className="top-stat-value">167527.68</div>
                <div className="top-stat-label">总量 tCO₂</div>
              </div>
              <div className="top-stat-item">
                <div className="top-stat-value">167</div>
                <div className="top-stat-label">企业 家</div>
              </div>
              <div className="top-stat-item">
                <div className="top-stat-value">7527.68</div>
                <div className="top-stat-label">标煤 tce</div>
              </div>
            </div>
            <div className="donut-row">
              <div>
                <div className="sub-panel-title">企业总数</div>
                <DonutChart data={ENTERPRISE_DONUT} centerText="167" centerSubtext="家" height={140} />
              </div>
              <div>
                <div className="sub-panel-title">碳排放总量</div>
                <DonutChart
                  data={EMISSION_DONUT}
                  centerText="16.75万"
                  centerSubtext="tCO₂"
                  height={140}
                />
              </div>
            </div>
          </Panel>
        </>
      }
      right={
        <>
          <Panel title="碳普惠数据" className="dashboard-panel">
            <div className="kpi-grid" style={{ marginBottom: 8 }}>
              <div className="kpi-card">
                <div className="kpi-card-value">128,456</div>
                <div className="kpi-card-label">注册用户</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-card-value">3,567,890</div>
                <div className="kpi-card-label">碳积分</div>
              </div>
            </div>
            <div className="donut-row">
              <div>
                <div className="sub-panel-title">企业</div>
                <DonutChart data={INCLUSIVE_ENTERPRISE} height={130} />
              </div>
              <div>
                <div className="sub-panel-title">用户</div>
                <DonutChart data={INCLUSIVE_USER} height={130} />
              </div>
            </div>
          </Panel>

          <Panel title="CCER行情分析" className="dashboard-panel ccer-market-panel">
            <div className="ccer-market">
              <div className="ccer-market-range">
                <span>2024年1月9日至2026年7月21日</span>
                <TipMark text="统计区间为全国碳市场 CCER 累计成交数据" />
              </div>
              <div className="ccer-market-row ccer-market-row-2">
                <div className="ccer-market-card ccer-market-card-blue">
                  <div className="ccer-market-card-label">累计成交量(吨)</div>
                  <div className="ccer-market-card-value">1,865.95万</div>
                  <div className="ccer-market-card-sub">18,659,540</div>
                </div>
                <div className="ccer-market-card ccer-market-card-orange">
                  <div className="ccer-market-card-label">累计成交额(元)</div>
                  <div className="ccer-market-card-value">12.58亿</div>
                  <div className="ccer-market-card-sub">1,257,611,761.03</div>
                </div>
              </div>

              <div className="ccer-market-period">
                <span className="ccer-market-period-label">统计区间</span>
                <span className="ccer-market-period-value">2026-01-01 至 2026-07-22</span>
              </div>
              <div className="ccer-market-row ccer-market-row-3">
                <div className="ccer-market-card ccer-market-card-blue ccer-market-card-sm">
                  <div className="ccer-market-card-label">累计成交量(吨)</div>
                  <div className="ccer-market-card-value">743.68万</div>
                  <div className="ccer-market-card-sub">7,436,753</div>
                </div>
                <div className="ccer-market-card ccer-market-card-orange ccer-market-card-sm">
                  <div className="ccer-market-card-label">累计成交额(元)</div>
                  <div className="ccer-market-card-value">6.14亿</div>
                  <div className="ccer-market-card-sub">614,225,689.83</div>
                </div>
                <div className="ccer-market-card ccer-market-card-purple ccer-market-card-sm">
                  <div className="ccer-market-card-label">均价合计(元/吨)</div>
                  <div className="ccer-market-card-value">82.59</div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="试点示范数据" className="dashboard-panel home-pilot-panel">
            <div className="top-stats-row">
              <div className="top-stat-item">
                <div className="top-stat-value">{HOME_PILOT_TOTAL}</div>
                <div className="top-stat-label">试点总数 个</div>
              </div>
              <div className="top-stat-item">
                <div className="top-stat-value">{HOME_PILOT_TYPES.length}</div>
                <div className="top-stat-label">试点类型 类</div>
              </div>
            </div>
            <div className="home-pilot-type-list">
              {HOME_PILOT_TYPES.map((item) => (
                <div key={item.key} className="progress-item">
                  <div className="progress-item-header">
                    <span className="home-pilot-type-name" title={item.label}>
                      {item.label}
                    </span>
                    <span className="progress-item-count">
                      {item.count}
                      {item.unit}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.max(8, Math.round((item.count / HOME_PILOT_MAX) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </>
      }
    />
  )
}
