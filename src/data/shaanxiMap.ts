/// <reference types="@types/amap-js-api" />

export interface CityPoint {
  name: string
  adcode: string
  lng: number
  lat: number
  /** 排放量（万吨 CO₂），用于填色分级 */
  value: number
  /** 弹窗展示：百万 tCO₂ */
  emissionMt: number
  /** 主要行业 */
  industry: string
  /** 标签相对中心的像素偏移，避免关中城市群重叠 */
  labelOffset?: [number, number]
}

/** 陕西各地市 adcode 与示意排放量 */
export const SHAANXI_CITIES: CityPoint[] = [
  { name: '榆林市', adcode: '610800', lng: 109.7344, lat: 38.2905, value: 420, emissionMt: 109.81, industry: '发电行业' },
  { name: '延安市', adcode: '610600', lng: 109.4907, lat: 36.5965, value: 280, emissionMt: 72.35, industry: '石化行业' },
  { name: '铜川市', adcode: '610200', lng: 108.9791, lat: 34.9167, value: 95, emissionMt: 24.68, industry: '建材行业', labelOffset: [0, -18] },
  { name: '西安市', adcode: '610100', lng: 108.9398, lat: 34.3416, value: 380, emissionMt: 98.56, industry: '发电行业', labelOffset: [18, 22] },
  { name: '宝鸡市', adcode: '610300', lng: 107.2377, lat: 34.362, value: 160, emissionMt: 41.22, industry: '钢铁行业', labelOffset: [-20, 0] },
  { name: '咸阳市', adcode: '610400', lng: 108.7088, lat: 34.3296, value: 210, emissionMt: 54.18, industry: '化工行业', labelOffset: [-28, -16] },
  { name: '渭南市', adcode: '610500', lng: 109.5098, lat: 34.4995, value: 185, emissionMt: 47.65, industry: '发电行业', labelOffset: [28, -8] },
  { name: '汉中市', adcode: '610700', lng: 107.0282, lat: 33.0777, value: 120, emissionMt: 30.92, industry: '建材行业' },
  { name: '安康市', adcode: '610900', lng: 109.0293, lat: 32.6903, value: 88, emissionMt: 22.71, industry: '有色行业' },
  { name: '商洛市', adcode: '611000', lng: 109.9403, lat: 33.8704, value: 72, emissionMt: 18.56, industry: '建材行业', labelOffset: [16, 0] },
]

export const SHAANXI_PROVINCE_ADCODE = '610000'

export const REGION_VIEW: Record<
  string,
  { center: [number, number]; zoom: number }
> = {
  全省: { center: [108.95, 35.6], zoom: 6.6 },
  西安市: { center: [108.94, 34.34], zoom: 9.2 },
  宝鸡市: { center: [107.24, 34.36], zoom: 9 },
  咸阳市: { center: [108.71, 34.33], zoom: 9 },
  渭南市: { center: [109.5, 34.5], zoom: 9 },
  延安市: { center: [109.49, 36.6], zoom: 8.5 },
  汉中市: { center: [107.02, 33.07], zoom: 9 },
  榆林市: { center: [109.73, 38.29], zoom: 8.5 },
  安康市: { center: [109.03, 32.69], zoom: 9 },
  商洛市: { center: [109.94, 33.87], zoom: 9 },
  铜川市: { center: [108.95, 34.9], zoom: 10 },
}

/** 区县 adcode → 地市 adcode（如 610102 → 610100） */
export function toCityAdcode(adcode: string | number): string {
  const s = String(adcode).padStart(6, '0')
  return `${s.slice(0, 4)}00`
}

const ADCODE_LOOKUP = Object.fromEntries(
  SHAANXI_CITIES.map((c) => [c.adcode, c]),
)

const NAME_LOOKUP = Object.fromEntries(
  SHAANXI_CITIES.map((c) => [c.name, c]),
)

export function getCityByAdcode(adcode: string | number): CityPoint | undefined {
  const raw = String(adcode)
  return ADCODE_LOOKUP[raw] ?? ADCODE_LOOKUP[toCityAdcode(raw)]
}

export function getCityByName(name: string): CityPoint | undefined {
  return NAME_LOOKUP[name] ?? NAME_LOOKUP[`${name}市`]
}

/** 图2风格四档填色（DistrictLayer 用 hex） */
export function getEmissionFillHex(value: number): string {
  if (value > 400) return '#e74c5a'
  if (value > 300) return '#e6a23c'
  if (value > 200) return '#3eb8c8'
  return '#5bc77a'
}

export function getEmissionFillColor(value: number): string {
  if (value > 400) return 'rgba(231, 76, 90, 0.92)'
  if (value > 300) return 'rgba(230, 162, 60, 0.92)'
  if (value > 200) return 'rgba(62, 184, 200, 0.92)'
  return 'rgba(91, 199, 122, 0.92)'
}

export function buildRegionLabelHtml(name: string, value: number): string {
  const shortName = name.replace('市', '')
  return `<div class="region-data-label">
    <div class="region-data-label-name">${shortName}</div>
    <div class="region-data-label-value">${value}万吨</div>
  </div>`
}

export const EMISSION_LEGEND = [
  { color: '#e74c5a', range: '>400万', label: '高排放' },
  { color: '#e6a23c', range: '300-400万', label: '' },
  { color: '#3eb8c8', range: '200-300万', label: '' },
  { color: '#5bc77a', range: '<200万', label: '低排放' },
] as const
