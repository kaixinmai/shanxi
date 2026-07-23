import { useState } from 'react'
import Panel from '../components/Panel'
import PageLayout from '../components/PageLayout'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import LineChart from '../components/charts/LineChart'

const DEPT_DONUT = [
  { name: '能源活动', value: 45 },
  { name: '工业过程', value: 28 },
  { name: '农业活动', value: 18 },
  { name: '废弃物', value: 9 },
]

const GAS_DONUT = [
  { name: 'CO₂', value: 72 },
  { name: 'CH₄', value: 14 },
  { name: 'N₂O', value: 10 },
  { name: 'HFCs', value: 4 },
]

const TYPE_CATEGORIES = ['CO₂', 'CH₄', 'N₂O', 'HFCs', 'PFCs', 'SF₆']
const TYPE_STACKED = [
  { name: '能源', data: [85, 12, 5, 2, 1, 0], color: '#00d4ff' },
  { name: '工业', data: [42, 8, 6, 3, 2, 1], color: '#0078ff' },
  { name: '农业', data: [8, 18, 12, 0, 0, 0], color: '#00e676' },
  { name: '废弃物', data: [6, 4, 8, 1, 0, 0], color: '#ffab00' },
]

const REGION_CATEGORIES = ['西安', '咸阳', '延安', '安康']
const REGION_DATA = [{ name: '排放量', data: [45200, 28600, 19800, 12400] }]

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

export default function GhgPage() {
  const [deptFilter, setDeptFilter] = useState('能源活动')

  return (
    <PageLayout
      showIndustry
      left={
        <>
          <Panel title="温室气体排放指标" className="dashboard-panel">
            <table className="data-table">
              <thead>
                <tr>
                  <th>指标</th>
                  <th>含土地利用</th>
                  <th>不含土地利用</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>排放总量 (MtCO₂e)</td>
                  <td>167.52</td>
                  <td>165.38</td>
                </tr>
                <tr>
                  <td>CO₂ (Mt)</td>
                  <td>142.5</td>
                  <td>140.8</td>
                </tr>
                <tr>
                  <td>CH₄ (MtCO₂e)</td>
                  <td>12.3</td>
                  <td>12.1</td>
                </tr>
                <tr>
                  <td>N₂O (MtCO₂e)</td>
                  <td>8.2</td>
                  <td>8.0</td>
                </tr>
                <tr>
                  <td>人均排放 (tCO₂e)</td>
                  <td>4.28</td>
                  <td>4.22</td>
                </tr>
              </tbody>
            </table>
          </Panel>

          <Panel title="构成分布" className="dashboard-panel">
            <div className="donut-row">
              <div>
                <div className="sub-panel-title">按部门</div>
                <DonutChart data={DEPT_DONUT} centerText="167" centerSubtext="MtCO₂e" height={150} />
              </div>
              <div>
                <div className="sub-panel-title">按气体</div>
                <DonutChart data={GAS_DONUT} centerText="100%" height={150} />
              </div>
            </div>
          </Panel>

          <Panel title="类型统计" className="dashboard-panel">
            <BarChart
              categories={TYPE_CATEGORIES}
              series={TYPE_STACKED}
              stacked
              height={140}
              showLegend
            />
          </Panel>
        </>
      }
      right={
        <>
          <Panel title="按部门统计" className="dashboard-panel">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
              <select
                className="panel-dropdown"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option>能源活动</option>
                <option>工业过程</option>
                <option>农业活动</option>
                <option>废弃物</option>
              </select>
            </div>
            <BarChart
              categories={['CO₂', 'CH₄', 'N₂O', 'HFCs']}
              series={[
                { name: '2023', data: [85, 12, 5, 2], color: '#0078ff' },
                { name: '2024', data: [82, 11, 4.5, 1.8], color: '#00d4ff' },
              ]}
              grouped
              height={120}
            />
          </Panel>

          <Panel title="区域排放分布" className="dashboard-panel">
            <BarChart categories={REGION_CATEGORIES} series={REGION_DATA} height={120} horizontal />
          </Panel>

          <Panel title="年度变化趋势" className="dashboard-panel">
            <LineChart
              categories={MONTHS}
              series={[
                { name: 'CO₂', data: [12, 11, 13, 14, 15, 16, 17, 16, 15, 14, 13, 12], color: '#00d4ff' },
                { name: 'CH₄', data: [2, 2.1, 2, 2.2, 2.3, 2.1, 2.4, 2.2, 2.1, 2, 1.9, 2], color: '#00e676' },
                { name: 'N₂O', data: [1.2, 1.1, 1.3, 1.4, 1.3, 1.2, 1.5, 1.4, 1.3, 1.2, 1.1, 1.2], color: '#ffab00' },
              ]}
              height={140}
            />
          </Panel>
        </>
      }
    />
  )
}
