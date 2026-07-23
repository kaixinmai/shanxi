import { SHAANXI_CITIES } from './shaanxiMap'

/** CCER 项目阶段（点位颜色） */
export type CcerProjectStage = '公示中' | '公示结束' | '已登记' | '已注销'

export interface CcerMapProject {
  id: string
  name: string
  location: string
  city: string
  stage: CcerProjectStage
  applyStatus: string
  method: string
  domain: string
  lng: number
  lat: number
}

export const CCER_STAGE_COLORS: Record<CcerProjectStage, string> = {
  公示中: '#00d4ff',
  公示结束: '#ffab00',
  已登记: '#00e676',
  已注销: '#90a4ae',
}

export const CCER_STAGE_LEGEND: { stage: CcerProjectStage; color: string }[] = [
  { stage: '公示中', color: CCER_STAGE_COLORS['公示中'] },
  { stage: '公示结束', color: CCER_STAGE_COLORS['公示结束'] },
  { stage: '已登记', color: CCER_STAGE_COLORS['已登记'] },
  { stage: '已注销', color: CCER_STAGE_COLORS['已注销'] },
]

function cityCenter(name: string) {
  const c = SHAANXI_CITIES.find((x) => x.name === name)
  return { lng: c?.lng ?? 108.95, lat: c?.lat ?? 35.6 }
}

function offset(base: { lng: number; lat: number }, dx: number, dy: number) {
  return { lng: base.lng + dx, lat: base.lat + dy }
}

const YL = cityCenter('榆林市')
const XA = cityCenter('西安市')
const YA = cityCenter('延安市')
const AK = cityCenter('安康市')
const BJ = cityCenter('宝鸡市')
const WN = cityCenter('渭南市')
const HZ = cityCenter('汉中市')
const XY = cityCenter('咸阳市')
const SL = cityCenter('商洛市')
const TC = cityCenter('铜川市')

/** 陕西 CCER 项目示意点位 */
export const CCER_MAP_PROJECTS: CcerMapProject[] = [
  {
    id: 'm1',
    name: '榆林市榆阳区小纪汗等四个国有林场防护林造林碳汇项目',
    location: '榆林市榆阳区',
    city: '榆林市',
    stage: '公示中',
    applyStatus: '公示中',
    method: '造林碳汇',
    domain: '林业和其他碳汇类型',
    ...offset(YL, 0.12, -0.08),
  },
  {
    id: 'm2',
    name: '华北油气分公司大牛地气田D12井区陆上气田开发项目伴生气回收利用',
    location: '榆林市',
    city: '榆林市',
    stage: '公示结束',
    applyStatus: '待审定机构上传审定附件',
    method: '煤矿瓦斯回收利用',
    domain: '燃料（固体、石油和天然气）的逸散性排放',
    ...offset(YL, -0.18, 0.1),
  },
  {
    id: 'm3',
    name: '延安市宝塔区退耕还林碳汇项目',
    location: '延安市宝塔区',
    city: '延安市',
    stage: '公示结束',
    applyStatus: '公示结束',
    method: '造林碳汇',
    domain: '林业和其他碳汇类型',
    ...offset(YA, 0.08, 0.05),
  },
  {
    id: 'm4',
    name: '安康市汉滨区沼气综合利用减排项目',
    location: '安康市汉滨区',
    city: '安康市',
    stage: '公示结束',
    applyStatus: '公示结束',
    method: '沼气利用',
    domain: '废弃物处理',
    ...offset(AK, 0.06, -0.04),
  },
  {
    id: 'm5',
    name: '宝鸡市凤翔区风光互补发电减排项目',
    location: '宝鸡市凤翔区',
    city: '宝鸡市',
    stage: '已登记',
    applyStatus: '已登记',
    method: '并网发电',
    domain: '可再生能源',
    ...offset(BJ, 0.1, 0.06),
  },
  {
    id: 'm6',
    name: '渭南市韩城市工业余热回收利用项目',
    location: '渭南市韩城市',
    city: '渭南市',
    stage: '公示结束',
    applyStatus: '公示结束',
    method: '余热利用',
    domain: '节能增效',
    ...offset(WN, 0.15, 0.08),
  },
  {
    id: 'm7',
    name: '西安市鄠邑区都市林业碳汇项目',
    location: '西安市鄠邑区',
    city: '西安市',
    stage: '公示结束',
    applyStatus: '公示结束',
    method: '造林碳汇',
    domain: '林业和其他碳汇类型',
    ...offset(XA, -0.22, -0.12),
  },
  {
    id: 'm8',
    name: '咸阳市淳化县低产油田伴生气回收项目',
    location: '咸阳市淳化县',
    city: '咸阳市',
    stage: '已注销',
    applyStatus: '已注销',
    method: '伴生气回收利用',
    domain: '燃料（固体、石油和天然气）的逸散性排放',
    ...offset(XY, -0.1, 0.18),
  },
  {
    id: 'm9',
    name: '汉中市南郑区红树林营造等效碳汇项目',
    location: '汉中市南郑区',
    city: '汉中市',
    stage: '公示结束',
    applyStatus: '公示结束',
    method: '红树林营造',
    domain: '林业和其他碳汇类型',
    ...offset(HZ, 0.08, 0.05),
  },
  {
    id: 'm10',
    name: '商洛市商州区公路隧道照明节能项目',
    location: '商洛市商州区',
    city: '商洛市',
    stage: '已登记',
    applyStatus: '已登记',
    method: '公路隧道照明节能',
    domain: '节能增效',
    ...offset(SL, -0.06, 0.04),
  },
  {
    id: 'm11',
    name: '铜川市耀州区废弃矿井瓦斯回收利用项目',
    location: '铜川市耀州区',
    city: '铜川市',
    stage: '公示结束',
    applyStatus: '公示结束',
    method: '煤矿瓦斯回收利用',
    domain: '燃料（固体、石油和天然气）的逸散性排放',
    ...offset(TC, 0.05, -0.06),
  },
  {
    id: 'm12',
    name: '榆林市神木市陆上气田试气放喷气回收利用项目',
    location: '榆林市神木市',
    city: '榆林市',
    stage: '公示结束',
    applyStatus: '已撤回',
    method: '陆上气田试气放喷气回收利用',
    domain: '燃料（固体、石油和天然气）的逸散性排放',
    ...offset(YL, 0.25, 0.15),
  },
  {
    id: 'm13',
    name: '西安市高陵区可再生能源电解水制氢示范项目',
    location: '西安市高陵区',
    city: '西安市',
    stage: '公示中',
    applyStatus: '公示中',
    method: '可再生能源电解水制氢',
    domain: '可再生能源',
    ...offset(XA, 0.2, 0.15),
  },
]

export function filterCcerProjectsByRegion(
  projects: CcerMapProject[],
  region: string,
) {
  if (region === '全省') return projects
  return projects.filter((p) => p.city === region)
}
