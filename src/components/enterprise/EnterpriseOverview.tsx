import Panel from '../Panel'
import DonutChart from '../charts/DonutChart'
import { ENTERPRISE_OVERVIEW } from '../../data/enterpriseCommon'

export default function EnterpriseOverview() {
  const data = [
    { name: '重点排放单位', value: ENTERPRISE_OVERVIEW.keyUnits },
    { name: '省级管理单位', value: ENTERPRISE_OVERVIEW.provincialUnits },
  ]

  return (
    <Panel title="企业总览" className="dashboard-panel">
      <DonutChart
        data={data}
        centerText={String(ENTERPRISE_OVERVIEW.total)}
        centerSubtext="家企业"
        height={180}
        colors={['#2f7bff', '#3ddc84']}
      />
    </Panel>
  )
}
