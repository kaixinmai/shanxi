export type PilotType =
  | 'climate-adapt'
  | 'pollution-carbon'
  | 'climate-finance'
  | 'low-carbon'

export interface PilotTypeMeta {
  key: PilotType
  label: string
  unit: string
}

export interface PilotSite {
  id: string
  name: string
  /** 归属地市（地图聚合用） */
  city: string
  progress: string
  prepareDate: string
  approveDate: string
}

export const PILOT_TYPE_META: PilotTypeMeta[] = [
  { key: 'climate-adapt', label: '国家深化气候适应型城市建设试点', unit: '个' },
  { key: 'pollution-carbon', label: '国家减污降碳协同创新试点城市', unit: '个' },
  { key: 'climate-finance', label: '国家气候投融资试点', unit: '个' },
  { key: 'low-carbon', label: '省级低碳近零碳试点', unit: '个' },
]

export const PILOT_TYPE_LABELS: Record<PilotType, string> = Object.fromEntries(
  PILOT_TYPE_META.map((item) => [item.key, item.label]),
) as Record<PilotType, string>

export const PILOTS_BY_TYPE: Record<PilotType, PilotSite[]> = {
  'climate-adapt': [
    {
      id: 'ca-xa',
      name: '西安市',
      city: '西安市',
      progress: '建设实施',
      prepareDate: '2023-03-15',
      approveDate: '2023-09-20',
    },
    {
      id: 'ca-ya',
      name: '延安市',
      city: '延安市',
      progress: '建设实施',
      prepareDate: '2023-04-08',
      approveDate: '2023-10-12',
    },
    {
      id: 'ca-yl',
      name: '榆林市',
      city: '榆林市',
      progress: '筹备申报',
      prepareDate: '2024-06-01',
      approveDate: '—',
    },
  ],
  'pollution-carbon': [
    {
      id: 'pc-xa',
      name: '西安市',
      city: '西安市',
      progress: '建设实施',
      prepareDate: '2022-11-10',
      approveDate: '2023-05-18',
    },
  ],
  'climate-finance': [
    {
      id: 'cf-xx',
      name: '西咸新区',
      city: '西安市',
      progress: '建设实施',
      prepareDate: '2021-12-08',
      approveDate: '2022-08-25',
    },
    {
      id: 'cf-xa',
      name: '西安市',
      city: '西安市',
      progress: '筹备申报',
      prepareDate: '2024-09-01',
      approveDate: '—',
    },
    {
      id: 'cf-xy',
      name: '咸阳市',
      city: '咸阳市',
      progress: '筹备申报',
      prepareDate: '2025-01-20',
      approveDate: '—',
    },
  ],
  'low-carbon': [
    { id: 'lc1', name: '铜川市', city: '铜川市', progress: '建设实施', prepareDate: '2019-06-12', approveDate: '2020-03-18' },
    { id: 'lc2', name: '渭南高新区近零碳园区', city: '渭南市', progress: '建设实施', prepareDate: '2021-04-22', approveDate: '2021-11-09' },
    { id: 'lc3', name: '西安浐灞生态区', city: '西安市', progress: '建设实施', prepareDate: '2020-08-15', approveDate: '2021-02-26' },
    { id: 'lc4', name: '宝鸡市', city: '宝鸡市', progress: '建设实施', prepareDate: '2020-05-10', approveDate: '2020-12-03' },
    { id: 'lc5', name: '汉中市', city: '汉中市', progress: '建设实施', prepareDate: '2021-01-18', approveDate: '2021-07-30' },
    { id: 'lc6', name: '安康高新区近零碳园区', city: '安康市', progress: '建设实施', prepareDate: '2021-09-06', approveDate: '2022-03-21' },
    { id: 'lc7', name: '商洛市', city: '商洛市', progress: '建设实施', prepareDate: '2022-02-14', approveDate: '2022-08-19' },
    { id: 'lc8', name: '杨凌示范区', city: '咸阳市', progress: '建设实施', prepareDate: '2020-11-25', approveDate: '2021-05-16' },
    { id: 'lc9', name: '延安新区近零碳园区', city: '延安市', progress: '建设实施', prepareDate: '2022-06-08', approveDate: '2022-12-11' },
    { id: 'lc10', name: '榆林高新区近零碳园区', city: '榆林市', progress: '建设实施', prepareDate: '2021-07-19', approveDate: '2022-01-28' },
    { id: 'lc11', name: '西咸沣东新城', city: '西安市', progress: '建设实施', prepareDate: '2022-03-03', approveDate: '2022-09-15' },
    { id: 'lc12', name: '咸阳高新区', city: '咸阳市', progress: '建设实施', prepareDate: '2021-10-27', approveDate: '2022-04-08' },
    { id: 'lc13', name: '韩城市', city: '渭南市', progress: '筹备申报', prepareDate: '2024-05-12', approveDate: '—' },
    { id: 'lc14', name: '兴平市近零碳园区', city: '咸阳市', progress: '建设实施', prepareDate: '2023-01-09', approveDate: '2023-07-22' },
    { id: 'lc15', name: '神木市', city: '榆林市', progress: '建设实施', prepareDate: '2022-09-14', approveDate: '2023-03-06' },
    { id: 'lc16', name: '府谷工业园区', city: '榆林市', progress: '建设实施', prepareDate: '2023-04-18', approveDate: '2023-10-25' },
    { id: 'lc17', name: '彬州市', city: '咸阳市', progress: '筹备申报', prepareDate: '2024-08-02', approveDate: '—' },
    { id: 'lc18', name: '洛南县近零碳园区', city: '商洛市', progress: '建设实施', prepareDate: '2023-06-20', approveDate: '2023-12-14' },
    { id: 'lc19', name: '旬阳市', city: '安康市', progress: '筹备申报', prepareDate: '2025-02-11', approveDate: '—' },
    { id: 'lc20', name: '凤翔区近零碳园区', city: '宝鸡市', progress: '建设实施', prepareDate: '2023-08-28', approveDate: '2024-02-19' },
    { id: 'lc21', name: '华阴市', city: '渭南市', progress: '筹备申报', prepareDate: '2025-03-05', approveDate: '—' },
  ],
}

export type PilotTypeCounts = Record<PilotType, number>

export interface CityPilotStats {
  city: string
  total: number
  byType: PilotTypeCounts
}

function emptyTypeCounts(): PilotTypeCounts {
  return {
    'climate-adapt': 0,
    'pollution-carbon': 0,
    'climate-finance': 0,
    'low-carbon': 0,
  }
}

/** 各地市试点数量聚合 */
export function getCityPilotStatsMap(): Record<string, CityPilotStats> {
  const map: Record<string, CityPilotStats> = {}

  ;(Object.keys(PILOTS_BY_TYPE) as PilotType[]).forEach((type) => {
    PILOTS_BY_TYPE[type].forEach((site) => {
      if (!map[site.city]) {
        map[site.city] = {
          city: site.city,
          total: 0,
          byType: emptyTypeCounts(),
        }
      }
      map[site.city].total += 1
      map[site.city].byType[type] += 1
    })
  })

  return map
}

export function getCityPilotStats(cityName: string): CityPilotStats {
  return (
    getCityPilotStatsMap()[cityName] ?? {
      city: cityName,
      total: 0,
      byType: emptyTypeCounts(),
    }
  )
}

/** 试点数量填色（DistrictLayer hex） */
export function getPilotFillHex(total: number): string {
  if (total >= 6) return '#e74c5a'
  if (total >= 4) return '#e6a23c'
  if (total >= 2) return '#3eb8c8'
  if (total >= 1) return '#5bc77a'
  return '#1a3a5c'
}

export function getPilotFillColor(total: number): string {
  if (total >= 6) return 'rgba(231, 76, 90, 0.92)'
  if (total >= 4) return 'rgba(230, 162, 60, 0.92)'
  if (total >= 2) return 'rgba(62, 184, 200, 0.92)'
  if (total >= 1) return 'rgba(91, 199, 122, 0.92)'
  return 'rgba(26, 58, 92, 0.55)'
}

export function buildPilotLabelHtml(name: string, total: number): string {
  const shortName = name.replace('市', '')
  return `<div class="region-data-label">
    <div class="region-data-label-name">${shortName}</div>
    <div class="region-data-label-value">${total}个</div>
  </div>`
}

export const PILOT_COUNT_LEGEND = [
  { color: '#e74c5a', range: '≥6个', label: '较多' },
  { color: '#e6a23c', range: '4-5个', label: '' },
  { color: '#3eb8c8', range: '2-3个', label: '' },
  { color: '#5bc77a', range: '1个', label: '较少' },
] as const
