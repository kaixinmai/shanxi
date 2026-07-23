export type UnitType = '重点排放单位' | '省级管理单位'

export interface MapFilters {
  region: string
  year: string
  industry: string
  unitType: UnitType
}

export const DEFAULT_MAP_FILTERS: MapFilters = {
  region: '全省',
  year: '2023',
  industry: '全部',
  unitType: '重点排放单位',
}

/** 企业总览：按单位类型统计数量 */
export const ENTERPRISE_OVERVIEW = {
  keyUnits: 128,
  provincialUnits: 39,
  total: 167,
}

/** 历年排放趋势（百万 tCO₂）— 按区域×行业简易 mock */
export function getYearlyEmissionTrend(
  region: string,
  industry: string,
): { years: string[]; values: number[] } {
  const years = ['2019', '2020', '2021', '2022', '2023', '2024']
  const regionFactor =
    region === '全省'
      ? 1
      : region === '西安市' || region === '榆林市'
        ? 0.28
        : 0.12
  const industryFactor =
    industry === '全部'
      ? 1
      : industry === '发电'
        ? 0.45
        : industry === '钢铁'
          ? 0.18
          : 0.14

  const base = [218, 210, 205, 198, 190, 182]
  return {
    years,
    values: base.map((v, i) =>
      Number((v * regionFactor * industryFactor * (1 - i * 0.01)).toFixed(2)),
    ),
  }
}

/** 碳排放量占比：行业分布 */
export const SHARE_BY_INDUSTRY = [
  { name: '发电', value: 68.2 },
  { name: '石化', value: 22.5 },
  { name: '化工', value: 18.4 },
  { name: '建材', value: 25.1 },
  { name: '钢铁', value: 16.8 },
  { name: '有色金属', value: 12.3 },
  { name: '造纸', value: 8.6 },
  { name: '国内民用航空', value: 6.2 },
  { name: '其他', value: 22.49 },
]

export const SHARE_INDUSTRY_COLORS = [
  '#2f7bff',
  '#3ddc84',
  '#f5c542',
  '#ff8a3d',
  '#2ec7c9',
  '#3aa76d',
  '#f0a07a',
  '#a78bfa',
  '#f472b6',
]

/** 碳排放量占比：区域维度 */
export const SHARE_BY_REGION = {
  categories: [
    '西安市',
    '铜川市',
    '宝鸡市',
    '咸阳市',
    '渭南市',
    '韩城市',
    '延安市',
    '汉中市',
    '榆林市',
    '安康市',
    '商洛市',
  ],
  values: [18.5, 4.2, 9.8, 11.2, 10.5, 3.1, 12.6, 7.4, 21.0, 5.8, 4.6],
}

/** 碳排放量占比：排放源维度 */
export const SHARE_BY_SOURCE = [
  { name: '化石燃料燃烧排放', value: 17.2 },
  { name: '购入使用电力排放', value: 5.21 },
]

export const SHARE_SOURCE_COLORS = ['#2f7bff', '#3ddc84']

/** 高排放企业 TOP 榜单 */
export interface TopEnterprise {
  name: string
  /** 碳排放总量（万 tCO₂） */
  emission: number
  /** 排放强度（tCO₂/万元产值） */
  intensity: number
  industry: string
}

export const TOP_ENTERPRISES: TopEnterprise[] = [
  { name: '陕西榆林某发电有限公司', emission: 1286.5, intensity: 2.85, industry: '发电' },
  { name: '延安某石油化工有限公司', emission: 986.2, intensity: 3.12, industry: '石化' },
  { name: '西安某热电有限公司', emission: 875.4, intensity: 2.46, industry: '发电' },
  { name: '宝鸡某钢铁集团有限公司', emission: 762.8, intensity: 3.58, industry: '钢铁' },
  { name: '咸阳某建材股份有限公司', emission: 654.1, intensity: 2.91, industry: '建材' },
  { name: '渭南某化工有限公司', emission: 548.6, intensity: 3.25, industry: '化工' },
  { name: '汉中某有色金属有限公司', emission: 432.9, intensity: 2.68, industry: '有色' },
  { name: '安康某能源有限公司', emission: 386.3, intensity: 2.15, industry: '发电' },
  { name: '商洛某水泥有限公司', emission: 312.7, intensity: 2.72, industry: '建材' },
  { name: '铜川某煤电有限公司', emission: 278.4, intensity: 2.38, industry: '发电' },
]

/** 各行业通用：问题分类维度 */
export const PROBLEM_TYPES = [
  { key: 'missing', label: '数据缺失', value: 18, color: '#ff5252' },
  { key: 'logic', label: '逻辑校验异常', value: 12, color: '#ff8a00' },
  { key: 'deviation', label: '偏差超限', value: 9, color: '#ffd000' },
  { key: 'voucher', label: '凭证不一致', value: 6, color: '#00d4ff' },
  { key: 'overdue', label: '逾期未报', value: 4, color: '#0078ff' },
] as const

/** 各行业通用：关键参数选项 */
export const KEY_PARAMETERS = [
  { key: 'activity', label: '活动水平数据', bins: ['0-20', '20-40', '40-60', '60-80', '80-100'], counts: [8, 15, 32, 48, 64] },
  { key: 'factor', label: '排放因子', bins: ['0-20', '20-40', '40-60', '60-80', '80-100'], counts: [6, 18, 35, 42, 58] },
  { key: 'intensity', label: '碳排放强度', bins: ['0-20', '20-40', '40-60', '60-80', '80-100'], counts: [10, 22, 28, 40, 52] },
  { key: 'monitor', label: '监测频次', bins: ['0-20', '20-40', '40-60', '60-80', '80-100'], counts: [5, 12, 30, 46, 70] },
  { key: 'energy', label: '能源消耗量', bins: ['0-20', '20-40', '40-60', '60-80', '80-100'], counts: [7, 16, 34, 44, 62] },
] as const

/** 各行业通用：异常告警类型 */
export const ALERT_TYPES = [
  { key: 'missing', label: '数据缺失', color: '#ff5252' },
  { key: 'overlimit', label: '超限异常', color: '#ff8a00' },
  { key: 'trend', label: '趋势突变', color: '#00d4ff' },
  { key: 'report', label: '填报异常', color: '#0078ff' },
] as const

export const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

export const ALERT_TREND_MONTHLY: Record<string, number[]> = {
  missing: [3, 2, 4, 3, 5, 4, 3, 2, 3, 4, 3, 2],
  overlimit: [2, 1, 2, 2, 3, 2, 2, 1, 2, 3, 2, 1],
  trend: [1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1],
  report: [1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1],
}

export const ALERT_TREND_YEARLY: Record<string, number[]> = {
  missing: [28, 22, 18, 14, 10],
  overlimit: [18, 14, 11, 8, 5],
  trend: [10, 8, 6, 4, 3],
  report: [8, 6, 5, 3, 2],
}
