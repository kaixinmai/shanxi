import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import Panel from '../components/Panel'
import PageLayout from '../components/PageLayout'
import DonutChart from '../components/charts/DonutChart'
import TipMark from '../components/TipMark'

const HERO_STATS = [
  {
    label: '项目总数',
    value: '11',
    unit: '个',
    tip: '该数据为去除重复项目后的项目总数',
  },
  {
    label: '各阶段项目总数',
    value: '13',
    unit: '个',
  },
]

type StageKey = 'publicizing' | 'publicized' | 'registered' | 'cancelled'

interface StageStat {
  key: StageKey
  label: string
  value: string
  unit: string
}

const STAGE_STATS: StageStat[] = [
  { key: 'publicizing', label: '公示中项目数', value: '1', unit: '个' },
  { key: 'publicized', label: '公示结束项目数', value: '12', unit: '个' },
  { key: 'registered', label: '已登记项目数', value: '0', unit: '个' },
]

const REDUCTION_STATS = [
  { label: '公示中减排量', value: '0', unit: '吨' },
  { label: '公示结束减排量', value: '0', unit: '吨' },
  { label: '已登记减排量', value: '0', unit: '吨' },
  { key: 'cancelled' as const, label: '已注销项目数', value: '0', unit: '个', clickable: true },
]

interface ProjectCardData {
  id: string
  title: string
  company: string
  applyStatus: string
  projectStatus: string
  annualReduction: string
  totalReduction: string
  typeTag: string
  methodTag: string
}

const PROJECTS_BY_STAGE: Record<StageKey, ProjectCardData[]> = {
  publicizing: [
    {
      id: 'p1',
      title: '榆林市榆阳区小纪汗等四个国有林场防护林造林碳汇项目',
      company: '榆林市榆阳区国有资产运营有限公司',
      applyStatus: '公示中',
      projectStatus: '公示中',
      annualReduction: '27,636',
      totalReduction: '829,087',
      typeTag: '林业和其他碳汇类型',
      methodTag: '造林碳汇',
    },
  ],
  publicized: [
    {
      id: 'e1',
      title: '华北油气分公司大牛地气田D12井区陆上气田开发项目伴生气回收利用',
      company: '中国石油化工集团华北石油局有限公司',
      applyStatus: '待审定机构上传审定附件',
      projectStatus: '未申请登记',
      annualReduction: '10,277',
      totalReduction: '102,776',
      typeTag: '燃料逸出性排放(固体燃料、石油和天然气)',
      methodTag: '煤矿瓦斯回收利用',
    },
    {
      id: 'e2',
      title: '榆林市榆阳区小纪汗等四个国有林场防护林造林碳汇项目',
      company: '榆林市榆阳区国有资产运营有限公司',
      applyStatus: '已撤回',
      projectStatus: '已终止',
      annualReduction: '27,636',
      totalReduction: '829,087',
      typeTag: '林业和其他碳汇类型',
      methodTag: '造林碳汇',
    },
    {
      id: 'e3',
      title: '延安市宝塔区退耕还林碳汇项目',
      company: '延安市宝塔区林业发展有限公司',
      applyStatus: '公示结束',
      projectStatus: '未申请登记',
      annualReduction: '8,420',
      totalReduction: '168,400',
      typeTag: '林业和其他碳汇类型',
      methodTag: '造林碳汇',
    },
    {
      id: 'e4',
      title: '安康市汉滨区沼气综合利用减排项目',
      company: '安康市绿色能源科技有限公司',
      applyStatus: '公示结束',
      projectStatus: '未申请登记',
      annualReduction: '5,120',
      totalReduction: '51,200',
      typeTag: '废弃物处理',
      methodTag: '沼气利用',
    },
    {
      id: 'e5',
      title: '宝鸡市凤翔区风光互补发电减排项目',
      company: '宝鸡新能源开发有限公司',
      applyStatus: '公示结束',
      projectStatus: '未申请登记',
      annualReduction: '15,860',
      totalReduction: '158,600',
      typeTag: '可再生能源',
      methodTag: '并网发电',
    },
    {
      id: 'e6',
      title: '渭南市韩城市工业余热回收利用项目',
      company: '韩城市循环经济产业有限公司',
      applyStatus: '公示结束',
      projectStatus: '未申请登记',
      annualReduction: '6,940',
      totalReduction: '69,400',
      typeTag: '节能增效',
      methodTag: '余热利用',
    },
  ],
  registered: [],
  cancelled: [],
}

const STAGE_TITLES: Record<StageKey, string> = {
  publicizing: '公示中项目',
  publicized: '公示结束项目',
  registered: '已登记项目',
  cancelled: '已注销项目',
}

const INDUSTRY_DOMAIN = [
  { name: '林业和其他碳汇类型', value: 68 },
  { name: '燃料（固体、石油和天然气）的逸散性排放', value: 32 },
]

/** 各阶段方法学项目数对比 */
const METHOD_STAGE_CATEGORIES = [
  '公示中',
  '公示结束',
  '公示中减排量',
  '公示结束减排量',
  '已登记减排量',
  '已注销',
]

const METHOD_SERIES: { name: string; color: string; data: number[] }[] = [
  { name: '煤矿瓦斯回收利用', color: '#3b6fd9', data: [0, 1, 0, 0, 0, 0] },
  { name: '陆上油田低气量伴生气回收利用', color: '#7ec8a3', data: [0, 0, 0, 0, 0, 0] },
  { name: '并网光热发电', color: '#f5a623', data: [0, 0, 0, 0, 0, 0] },
  { name: '造林碳汇', color: '#e36d8a', data: [1, 10, 0, 0, 0, 0] },
  { name: '可再生能源电解水制氢', color: '#5bc0de', data: [0, 0, 0, 0, 0, 0] },
  { name: '红树林营造', color: '#4caf7a', data: [0, 0, 0, 0, 0, 0] },
  { name: '公路隧道照明节能', color: '#f07850', data: [0, 0, 0, 0, 0, 0] },
  { name: '陆上气田试气放喷气回收利用', color: '#6b7fd7', data: [0, 1, 0, 0, 0, 0] },
  { name: '并网海上风力发电', color: '#8bc34a', data: [0, 0, 0, 0, 0, 0] },
]

function buildMethodStageOption(): EChartsOption {
  return {
    color: METHOD_SERIES.map((s) => s.color),
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: '#e6eaf0',
      borderWidth: 1,
      textStyle: { color: '#1f2a37', fontSize: 15 },
      axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(0,120,255,0.08)' } },
      formatter: (params) => {
        const items = (Array.isArray(params) ? params : [params]) as Array<{
          axisValue?: string | number
          name?: string
          value?: number | string
          color?: string
          seriesName?: string
        }>
        const axis = String(items[0]?.axisValue ?? items[0]?.name ?? '')
        const total = items.reduce((sum, p) => sum + (Number(p.value) || 0), 0)
        const rows = items
          .filter((p) => Number(p.value) > 0)
          .map(
            (p) =>
              `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin:4px 0;line-height:1.6">
                <span><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};margin-right:8px"></span>${p.seriesName}</span>
                <strong>${p.value}</strong>
              </div>`,
          )
          .join('')
        return `<div style="font-weight:600;margin-bottom:6px;font-size:16px">${axis}（总数 ${total}）</div>${rows || '<div style="color:#667085">暂无数据</div>'}`
      },
    },
    legend: {
      type: 'scroll',
      bottom: 0,
      left: 'center',
      width: '96%',
      itemWidth: 12,
      itemHeight: 10,
      itemGap: 12,
      textStyle: { color: 'rgba(232,244,255,0.85)', fontSize: 13, lineHeight: 18 },
      pageTextStyle: { color: 'rgba(232,244,255,0.7)' },
      pageIconColor: '#00d4ff',
      pageIconInactiveColor: 'rgba(232,244,255,0.3)',
    },
    grid: { left: 40, right: 12, top: 28, bottom: 72 },
    xAxis: {
      type: 'category',
      data: METHOD_STAGE_CATEGORIES,
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.2)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(232,244,255,0.85)',
        fontSize: 13,
        interval: 0,
        rotate: 20,
        lineHeight: 16,
      },
    },
    yAxis: {
      type: 'value',
      name: '(个)',
      nameTextStyle: { color: 'rgba(232,244,255,0.75)', fontSize: 14, padding: [0, 0, 0, 0] },
      minInterval: 1,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.1)' } },
      axisLabel: { color: 'rgba(232,244,255,0.7)', fontSize: 14 },
    },
    series: METHOD_SERIES.map((s) => ({
      name: s.name,
      type: 'bar' as const,
      stack: 'method',
      barWidth: 28,
      data: s.data,
      itemStyle: { color: s.color },
      emphasis: { focus: 'series' as const },
    })),
  }
}

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

/** 生成接近参考图的均价序列（含少量空缺） */
function buildPriceSeries(seed: number): (number | null)[] {
  const base = [
    82, 79, 74, 68, 66, 71, 78, 85, 88, 83, 80, 86, 92, 89, 84, 81, 87, 94, 91, 86, 83,
    88, 85, 90, 96, 93, 88, 84, 87, 91, null, 86, 89, null, 85, 88, 92, 87, 84, 89, 91,
    86, 90, 88, 85, 89, 92, 87,
  ]
  return base.map((v) => (v == null ? null : Number((v + seed).toFixed(1))))
}

function buildVolumeSeries(seed: number): number[] {
  return Array.from({ length: 48 }, (_, i) => {
    const wave = Math.abs(Math.sin((i + seed) * 0.45)) * 1800 + 400
    return Math.round(wave + ((i * 17 + seed * 13) % 500))
  })
}

const TRADE_SERIES = {
  categories: MONTHS.concat(MONTHS, MONTHS, MONTHS).slice(0, 48),
  price: buildPriceSeries(0),
  volume: buildVolumeSeries(1),
}

const TRADE_GUIDE = [
  '蓝色线：代表成交均价，可查看区间内均价走势情况。',
  '下方蓝柱：代表成交量/成交额，柱越高交易越活跃。',
]

type DocsTab = 'method' | 'policy'

const METHOD_DOCS = [
  {
    id: 'md1',
    code: 'CCER-CM-001',
    title: '造林碳汇方法学',
    tag: '林业碳汇',
    date: '2024-03-15',
  },
  {
    id: 'md2',
    code: 'CCER-CM-002',
    title: '煤矿瓦斯回收利用方法学',
    tag: '逸散性排放',
    date: '2024-05-20',
  },
  {
    id: 'md3',
    code: 'CCER-CM-003',
    title: '陆上气田试气放喷气回收利用方法学',
    tag: '逸散性排放',
    date: '2024-06-08',
  },
  {
    id: 'md4',
    code: 'CCER-CM-004',
    title: '并网光热发电方法学',
    tag: '可再生能源',
    date: '2024-08-12',
  },
  {
    id: 'md5',
    code: 'CCER-CM-005',
    title: '可再生能源电解水制氢方法学',
    tag: '可再生能源',
    date: '2025-01-18',
  },
  {
    id: 'md6',
    code: 'CCER-CM-006',
    title: '公路隧道照明节能方法学',
    tag: '节能增效',
    date: '2025-04-02',
  },
]

const POLICY_DOCS = [
  {
    id: 'pd1',
    code: '发改气候〔2024〕12号',
    title: '温室气体自愿减排交易管理办法（试行）',
    tag: '管理办法',
    date: '2024-01-11',
  },
  {
    id: 'pd2',
    code: '生态环境部公告 2024年第15号',
    title: '关于发布温室气体自愿减排项目方法学的公告',
    tag: '方法学公告',
    date: '2024-03-01',
  },
  {
    id: 'pd3',
    code: '陕发改环资〔2025〕28号',
    title: '陕西省碳市场建设工作要点',
    tag: '省级政策',
    date: '2025-02-20',
  },
  {
    id: 'pd4',
    code: '陕环发〔2025〕46号',
    title: '关于规范全省 CCER 项目申报与公示的通知',
    tag: '省级通知',
    date: '2025-06-15',
  },
  {
    id: 'pd5',
    code: '生态环境部办公厅函',
    title: '温室气体自愿减排项目设计与实施指南',
    tag: '技术指南',
    date: '2025-09-08',
  },
]

function buildTradeTrendOption(
  categories: string[],
  price: (number | null)[],
  volume: number[],
): EChartsOption {
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(4, 22, 48, 0.95)',
      borderColor: 'rgba(0, 212, 255, 0.3)',
      textStyle: { color: '#e8f4ff', fontSize: 15 },
      axisPointer: { type: 'cross' },
    },
    legend: {
      top: 0,
      right: 8,
      data: ['均价', '成交量'],
      textStyle: { color: 'rgba(232,244,255,0.85)', fontSize: 14 },
      itemWidth: 14,
      itemHeight: 8,
    },
    grid: { left: 44, right: 40, top: 28, bottom: 8 },
    xAxis: {
      type: 'category',
      data: categories,
      boundaryGap: true,
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.2)' } },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: [
      {
        type: 'value',
        name: '元/吨',
        nameTextStyle: { color: 'rgba(232,244,255,0.75)', fontSize: 13 },
        min: 65,
        max: 100,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(0,212,255,0.1)' } },
        axisLabel: { color: 'rgba(232,244,255,0.7)', fontSize: 13 },
      },
      {
        type: 'value',
        name: '吨',
        nameTextStyle: { color: 'rgba(232,244,255,0.55)', fontSize: 13 },
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: 'rgba(232,244,255,0.55)', fontSize: 12 },
      },
    ],
    series: [
      {
        name: '成交量',
        type: 'bar',
        yAxisIndex: 1,
        data: volume,
        barWidth: 4,
        itemStyle: { color: 'rgba(64, 158, 255, 0.45)' },
        z: 1,
      },
      {
        name: '均价',
        type: 'line',
        yAxisIndex: 0,
        data: price,
        connectNulls: false,
        smooth: false,
        symbol: 'circle',
        symbolSize: 4,
        showSymbol: false,
        lineStyle: { width: 2, color: '#5eb8ff' },
        itemStyle: { color: '#5eb8ff' },
        z: 2,
      },
    ],
  }
}

function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article className="ccer-project-card">
      <h4 className="ccer-project-card-title" title={project.title}>
        {project.title}
      </h4>
      <p className="ccer-project-card-company">{project.company}</p>
      <div className="ccer-project-card-rows">
        <div className="ccer-project-card-row">
          <span>申请状态：</span>
          {project.applyStatus}
        </div>
        <div className="ccer-project-card-row">
          <span>项目状态：</span>
          {project.projectStatus}
        </div>
        <div className="ccer-project-card-row">
          <span>预计年均减排量(吨)：</span>
          {project.annualReduction}
        </div>
        <div className="ccer-project-card-row">
          <span>预计计入期总减排量(吨)：</span>
          {project.totalReduction}
        </div>
      </div>
      <div className="ccer-project-card-tags">
        <span className="ccer-tag ccer-tag-green">{project.typeTag}</span>
        <span className="ccer-tag ccer-tag-blue">{project.methodTag}</span>
      </div>
    </article>
  )
}

function ProjectListModal({
  stageKey,
  onClose,
}: {
  stageKey: StageKey
  onClose: () => void
}) {
  const projects = PROJECTS_BY_STAGE[stageKey]
  const title = STAGE_TITLES[stageKey]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="ccer-modal-mask" onClick={onClose} role="presentation">
      <div
        className="ccer-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ccer-modal-header">
          <h3 className="ccer-modal-title">{title}</h3>
          <span className="ccer-modal-count">共 {projects.length} 个</span>
          <button type="button" className="ccer-modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <div className="ccer-modal-body">
          {projects.length === 0 ? (
            <div className="ccer-modal-empty">暂无项目</div>
          ) : (
            <div className="ccer-project-grid">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CcerPage() {
  const [docsTab, setDocsTab] = useState<DocsTab>('method')
  const [modalStage, setModalStage] = useState<StageKey | null>(null)
  const docsList = docsTab === 'method' ? METHOD_DOCS : POLICY_DOCS

  return (
    <>
      <PageLayout
        className="dashboard-page-ccer"
        updateDate="2026-07-10"
        mapMode="projects"
        left={
          <>
            <Panel title="项目数据统计" className="dashboard-panel ccer-stats-panel">
              <div className="ccer-stats">
                <div className="ccer-stats-hero">
                  {HERO_STATS.map((item) => (
                    <div key={item.label} className="ccer-hero-card">
                      <div className="ccer-hero-label">
                        {item.label}
                        <span className="ccer-hero-unit">（{item.unit}）</span>
                        {item.tip ? <TipMark text={item.tip} /> : null}
                      </div>
                      <div className="ccer-hero-value">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="ccer-stats-grid ccer-stats-grid-3">
                  {STAGE_STATS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className="ccer-stat-card ccer-stat-card-clickable"
                      onClick={() => setModalStage(item.key)}
                    >
                      <div className="ccer-stat-value">{item.value}</div>
                      <div className="ccer-stat-label">
                        {item.label}
                        <span className="ccer-stat-unit">（{item.unit}）</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="ccer-stats-grid ccer-stats-grid-4">
                  {REDUCTION_STATS.map((item) =>
                    'clickable' in item && item.clickable ? (
                      <button
                        key={item.label}
                        type="button"
                        className="ccer-stat-card ccer-stat-card-clickable"
                        onClick={() => setModalStage(item.key)}
                      >
                        <div className="ccer-stat-value">{item.value}</div>
                        <div className="ccer-stat-label">
                          {item.label}
                          <span className="ccer-stat-unit">（{item.unit}）</span>
                        </div>
                      </button>
                    ) : (
                      <div key={item.label} className="ccer-stat-card">
                        <div className="ccer-stat-value">{item.value}</div>
                        <div className="ccer-stat-label">
                          {item.label}
                          <span className="ccer-stat-unit">（{item.unit}）</span>
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="ccer-stats-note">
                  <TipMark text="减排量指预计计入期总减排量" />
                  <span>减排量指预计计入期总减排量</span>
                </div>
              </div>
            </Panel>

            <Panel title="各阶段方法学项目数对比" className="dashboard-panel ccer-chart-panel">
              <ReactECharts
                option={buildMethodStageOption()}
                style={{ height: 200, width: '100%' }}
                opts={{ renderer: 'svg' }}
              />
            </Panel>

            <Panel title="行业领域" className="dashboard-panel ccer-chart-panel">
              <DonutChart
                data={INDUSTRY_DOMAIN}
                centerText="2"
                centerSubtext="领域"
                height={180}
                legendPlacement="right"
                pieCenter={['30%', '50%']}
              />
            </Panel>
          </>
        }
        right={
          <>
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

            <Panel
              title="交易走势"
              className="dashboard-panel ccer-trade-panel"
              extra={
                <TipMark
                  title="交易走势快速指南："
                  lines={TRADE_GUIDE}
                />
              }
            >
              <div className="ccer-trade">
                <ReactECharts
                  option={buildTradeTrendOption(
                    TRADE_SERIES.categories,
                    TRADE_SERIES.price,
                    TRADE_SERIES.volume,
                  )}
                  style={{ height: '100%', minHeight: 160, width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
              </div>
            </Panel>

            <Panel
              title="方法学与政策文件"
              className="dashboard-panel ccer-docs-panel"
              extra={
                <div className="ccer-docs-tabs">
                  <button
                    type="button"
                    className={docsTab === 'method' ? 'active' : ''}
                    onClick={() => setDocsTab('method')}
                  >
                    方法学
                  </button>
                  <button
                    type="button"
                    className={docsTab === 'policy' ? 'active' : ''}
                    onClick={() => setDocsTab('policy')}
                  >
                    政策文件
                  </button>
                </div>
              }
            >
              <div className="ccer-docs">
                <div className="ccer-docs-list">
                  {docsList.map((doc) => (
                    <div key={doc.id} className="ccer-docs-item">
                      <div className="ccer-docs-item-main">
                        <div className="ccer-docs-item-title" title={doc.title}>
                          {doc.title}
                        </div>
                        <div className="ccer-docs-item-meta">
                          <span className="ccer-docs-item-code">{doc.code}</span>
                          <span className="ccer-docs-item-date">{doc.date}</span>
                        </div>
                      </div>
                      <span className="ccer-docs-item-tag">{doc.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </>
        }
      />

      {modalStage && (
        <ProjectListModal stageKey={modalStage} onClose={() => setModalStage(null)} />
      )}
    </>
  )
}
