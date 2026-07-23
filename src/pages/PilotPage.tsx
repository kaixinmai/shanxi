import { useMemo, useState } from 'react'
import Panel from '../components/Panel'
import PageLayout from '../components/PageLayout'
import {
  PILOT_TYPE_META,
  PILOTS_BY_TYPE,
  type PilotType,
  type PilotSite,
} from '../data/pilotSites'

interface PolicyItem {
  date: string
  title: string
  status: string
}

interface CaseItem {
  id: string
  title: string
  date: string
  summary: string
  tone: 0 | 1 | 2 | 3 | 4
}

const POLICY_BY_TYPE: Record<PilotType, PolicyItem[]> = {
  'climate-adapt': [
    { date: '2024-06', title: '气候适应型城市建设试点工作指引', status: '已发布' },
    { date: '2024-03', title: '极端天气应对能力提升实施方案', status: '已发布' },
    { date: '2023-12', title: '气候适应型城市建设试点方案', status: '已发布' },
    { date: '2023-08', title: '城市韧性基础设施行动计划', status: '进行中' },
  ],
  'pollution-carbon': [
    { date: '2024-05', title: '减污降碳协同创新试点城市工作方案', status: '已发布' },
    { date: '2024-02', title: '重点行业协同减排技术指南', status: '已发布' },
    { date: '2023-11', title: '减污降碳协同监测评估办法', status: '征求意见' },
    { date: '2023-07', title: '工业园区协同治理示范通知', status: '进行中' },
  ],
  'climate-finance': [
    { date: '2024-04', title: '进一步支持气候投融资试点建设若干措施', status: '已发布' },
    { date: '2024-01', title: '气候投融资项目库管理办法', status: '已发布' },
    { date: '2023-09', title: '绿色信贷支持气候友好项目指引', status: '已发布' },
    { date: '2023-05', title: '气候投融资试点建设实施方案', status: '进行中' },
  ],
  'low-carbon': [
    { date: '2024-03', title: '关于加快推进近零碳园区建设的指导意见', status: '已发布' },
    { date: '2024-01', title: '2024年度试点示范项目申报通知', status: '进行中' },
    { date: '2023-10', title: '省级低碳近零碳试点评估办法', status: '已发布' },
    { date: '2023-06', title: '低碳城市试点建设工作要点', status: '已发布' },
  ],
}

const CASES_BY_TYPE: Record<PilotType, CaseItem[]> = {
  'climate-adapt': [
    {
      id: 'ca1',
      title: '西安市气候适应型城市韧性提升实践',
      date: '2025-03-12',
      summary: '提升极端天气应对能力，完善城市韧性设施体系。',
      tone: 0,
    },
    {
      id: 'ca2',
      title: '延安市极端天气预警与应急响应案例',
      date: '2025-01-20',
      summary: '构建预警—响应—处置闭环，缩短应急处置时间。',
      tone: 1,
    },
    {
      id: 'ca3',
      title: '榆林市气候风险普查与适应规划',
      date: '2024-11-08',
      summary: '开展全域气候风险识别，形成适应规划路径。',
      tone: 2,
    },
    {
      id: 'ca4',
      title: '海绵城市与气候适应设施协同建设经验',
      date: '2024-09-16',
      summary: '蓝绿空间联动，降低内涝与热岛风险。',
      tone: 3,
    },
    {
      id: 'ca5',
      title: '城市内涝防治与蓝绿空间网络建设',
      date: '2024-07-22',
      summary: '排水与生态修复并重，增强城市适应能力。',
      tone: 4,
    },
    {
      id: 'ca6',
      title: '气候适应型社区示范点建设成效',
      date: '2024-05-30',
      summary: '社区级适应设施落地，提升公众参与度。',
      tone: 0,
    },
    {
      id: 'ca7',
      title: '农业气候灾害保险与适应能力提升',
      date: '2024-03-18',
      summary: '保险机制与适应技术结合，降低农业气候损失。',
      tone: 1,
    },
    {
      id: 'ca8',
      title: '陕西省气候适应型城市建设阶段总结',
      date: '2023-12-10',
      summary: '总结试点经验，形成可复制推广模式。',
      tone: 2,
    },
  ],
  'pollution-carbon': [
    {
      id: 'pc1',
      title: '西安市减污降碳协同创新试点城市工作进展',
      date: '2025-04-02',
      summary: '统筹大气污染治理与碳减排，推进协同创新。',
      tone: 0,
    },
    {
      id: 'pc2',
      title: '重点行业大气污染与碳排放协同治理案例',
      date: '2025-02-14',
      summary: '以重点行业为突破口，实现减污降碳双目标。',
      tone: 1,
    },
    {
      id: 'pc3',
      title: '工业园区减污降碳“一园一策”实践',
      date: '2024-12-06',
      summary: '按园区特征制定差异化协同治理方案。',
      tone: 2,
    },
    {
      id: 'pc4',
      title: '燃煤电厂超低排放与碳减排协同路径',
      date: '2024-10-19',
      summary: '超低排放改造与低碳转型同步推进。',
      tone: 3,
    },
    {
      id: 'pc5',
      title: '交通领域污染与碳排放协同管控经验',
      date: '2024-08-11',
      summary: '优化运输结构，降低移动源污染与排放。',
      tone: 4,
    },
    {
      id: 'pc6',
      title: '建筑领域节能改造与减碳示范项目',
      date: '2024-06-25',
      summary: '既有建筑节能改造带动碳排放强度下降。',
      tone: 0,
    },
    {
      id: 'pc7',
      title: '减污降碳协同监测评估指标体系解读',
      date: '2024-04-09',
      summary: '建立协同监测指标，支撑科学评估决策。',
      tone: 1,
    },
    {
      id: 'pc8',
      title: '陕西省减污降碳协同创新年度成效报告',
      date: '2023-12-28',
      summary: '年度成效梳理，明确下一阶段重点任务。',
      tone: 2,
    },
  ],
  'climate-finance': [
    {
      id: 'cf1',
      title: '2023年气候投融资项目签约暨气候投融资研讨会在西咸新区举办',
      date: '2023-12-15',
      summary: '项目集中签约，推动气候投融资落地见效。',
      tone: 0,
    },
    {
      id: 'cf2',
      title: '8000万！首单气候投融资业务落地！',
      date: '2023-11-08',
      summary: '首单业务落地，打开气候金融实践空间。',
      tone: 1,
    },
    {
      id: 'cf3',
      title: '【图解】关于进一步支持气候投融资试点建设推动陕西绿色低碳发展的若干措施',
      date: '2024-04-18',
      summary: '图解政策要点，明确支持方向与保障措施。',
      tone: 2,
    },
    {
      id: 'cf4',
      title: '气候投融资试点整体成效介绍',
      date: '2024-06-20',
      summary: '梳理试点建设进展与阶段性成效。',
      tone: 3,
    },
    {
      id: 'cf5',
      title: '陕西日报刊发报道《绿色金融“贷”动低碳发展——西咸新区入选国家气候投融资试点》',
      date: '2023-09-22',
      summary: '主流媒体聚焦试点，展示绿色金融实践。',
      tone: 4,
    },
    {
      id: 'cf6',
      title: '陕西日报头版刊发《气候投融资“碳”寻先机》',
      date: '2024-01-16',
      summary: '头版报道解读气候投融资机遇与路径。',
      tone: 0,
    },
    {
      id: 'cf7',
      title: '陕西首单气候投融资项目获批8000万元',
      date: '2023-10-30',
      summary: '首单项目获批，形成可复制融资模式。',
      tone: 1,
    },
    {
      id: 'cf8',
      title: '西咸案例入选“全国改革创新实践案例”',
      date: '2025-02-08',
      summary: '试点经验获国家级认可，示范效应增强。',
      tone: 2,
    },
    {
      id: 'cf9',
      title: '西咸新区2023年气候投融资项目签约暨气候投融资研讨会成功举办',
      date: '2023-12-16',
      summary: '政银企协同对接，推动项目批量落地。',
      tone: 3,
    },
    {
      id: 'cf10',
      title: '西咸新区发放全市首单取水权质押贷款',
      date: '2024-03-05',
      summary: '创新质押融资方式，拓宽绿色融资渠道。',
      tone: 4,
    },
  ],
  'low-carbon': [
    {
      id: 'lc1',
      title: '铜川市低碳城市试点建设实践案例',
      date: '2025-03-01',
      summary: '城市低碳转型路径清晰，减排成效显著。',
      tone: 0,
    },
    {
      id: 'lc2',
      title: '渭南近零碳园区建设路径与成效',
      date: '2024-12-12',
      summary: '园区能源结构优化，近零碳目标稳步推进。',
      tone: 1,
    },
    {
      id: 'lc3',
      title: '省级低碳近零碳试点申报与评估指南',
      date: '2024-10-08',
      summary: '明确申报条件与评估标准，规范试点建设。',
      tone: 2,
    },
    {
      id: 'lc4',
      title: '工业园区绿电直供与能效提升示范',
      date: '2024-08-21',
      summary: '绿电直供与节能技改并举，降低碳强度。',
      tone: 3,
    },
    {
      id: 'lc5',
      title: '近零碳社区建设与碳足迹管理经验',
      date: '2024-06-14',
      summary: '社区碳足迹管理落地，居民低碳意识提升。',
      tone: 4,
    },
    {
      id: 'lc6',
      title: '陕西省低碳城市试点阶段总结报告',
      date: '2024-02-27',
      summary: '阶段总结提炼经验，服务下一轮扩围。',
      tone: 0,
    },
    {
      id: 'lc7',
      title: '建筑领域近零能耗改造典型项目',
      date: '2023-11-19',
      summary: '近零能耗改造示范，形成可推广技术路径。',
      tone: 1,
    },
    {
      id: 'lc8',
      title: '交通领域绿色出行与低碳转型案例',
      date: '2023-09-05',
      summary: '绿色出行体系建设，降低交通领域排放。',
      tone: 2,
    },
    {
      id: 'lc9',
      title: '近零碳园区碳管理平台建设实践',
      date: '2025-01-18',
      summary: '数字化碳管理平台支撑园区精细化降碳。',
      tone: 3,
    },
  ],
}

function PilotTypeModule({
  label,
  unit,
  sites,
  active,
  onSelect,
}: {
  label: string
  unit: string
  sites: PilotSite[]
  active: boolean
  onSelect: () => void
}) {
  const [page, setPage] = useState(0)
  const total = sites.length
  const current = sites[Math.min(page, Math.max(total - 1, 0))]
  const canPrev = page > 0
  const canNext = page < total - 1

  return (
    <section
      className={`pilot-type-module${active ? ' is-active' : ''}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={active}
    >
      <header className="pilot-type-module-header">
        <h4 className="pilot-type-module-title" title={label}>
          {label}
        </h4>
        <div className="pilot-type-module-count">
          {total}
          <span>{unit}</span>
        </div>
      </header>

      {current ? (
        <div className="pilot-type-module-body">
          <article className="pilot-site-row-card">
            <div className="pilot-site-row-main">
              <div className="pilot-site-row">
                <span className="pilot-site-label">试点名称</span>
                <span className="pilot-site-value">{current.name}</span>
              </div>
              <div className="pilot-site-row">
                <span className="pilot-site-label">试点进度</span>
                <span className="pilot-site-value pilot-site-progress">{current.progress}</span>
              </div>
            </div>
            <div className="pilot-site-meta">
              <div className="pilot-site-meta-item">
                <span>筹备申报时间</span>
                <strong>{current.prepareDate}</strong>
              </div>
              <div className="pilot-site-meta-item">
                <span>申报获批时间</span>
                <strong>{current.approveDate}</strong>
              </div>
            </div>
          </article>

          {total > 1 ? (
            <div
              className="pilot-type-pager"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="pilot-type-pager-btn"
                disabled={!canPrev}
                aria-label="上一个试点"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ‹
              </button>
              <span className="pilot-type-pager-text">
                {page + 1}/{total}
              </span>
              <button
                type="button"
                className="pilot-type-pager-btn"
                disabled={!canNext}
                aria-label="下一个试点"
                onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
              >
                ›
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="pilot-type-module-empty">暂无试点</div>
      )}
    </section>
  )
}

export default function PilotPage() {
  const [activeType, setActiveType] = useState<PilotType>('climate-finance')

  const policies = POLICY_BY_TYPE[activeType]
  const cases = useMemo(() => CASES_BY_TYPE[activeType], [activeType])

  return (
    <PageLayout
      defaultYear="2024"
      className="dashboard-page-pilot"
      mapMode="pilots"
      left={
        <Panel title="数据概览" className="dashboard-panel pilot-overview-panel">
          <div className="pilot-type-grid">
            {PILOT_TYPE_META.map((item) => (
              <PilotTypeModule
                key={item.key}
                label={item.label}
                unit={item.unit}
                sites={PILOTS_BY_TYPE[item.key]}
                active={item.key === activeType}
                onSelect={() => setActiveType(item.key)}
              />
            ))}
          </div>
        </Panel>
      }
      right={
        <>
          <Panel title="政策动态" className="dashboard-panel">
            <table className="data-table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>政策名称</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((row) => (
                  <tr key={row.title}>
                    <td>{row.date}</td>
                    <td>{row.title}</td>
                    <td style={{ color: 'var(--accent-cyan)' }}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="试点案例" className="dashboard-panel pilot-cases-panel">
            <div className="pilot-cases">
              <div className="pilot-cases-list">
                {cases.map((item) => (
                  <article key={item.id} className="pilot-case-item" title={item.title}>
                    <div
                      className={`pilot-case-thumb pilot-case-thumb-${item.tone}`}
                      aria-hidden
                    />
                    <div className="pilot-case-body">
                      <h4 className="pilot-case-title">{item.title}</h4>
                      <p className="pilot-case-summary">{item.summary}</p>
                      <div className="pilot-case-date">{item.date}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Panel>
        </>
      }
    />
  )
}
