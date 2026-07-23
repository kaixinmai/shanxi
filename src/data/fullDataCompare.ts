export interface FullCompareEnterprise {
  id: string
  year: string
  name: string
  creditCode: string
  region: string
  industry: string
  /** 二氧化碳排放量（万吨） */
  co2: number
  /** 核查后的二氧化碳排放量（万吨） */
  co2Verified: number
  /** 企业核定配额量（万吨） */
  quota: number
  /** 颗粒物（万吨） */
  pm: number
  /** 二氧化硫（万吨） */
  so2: number
  /** 氮氧化物（万吨） */
  nox: number
}

export const FULL_COMPARE_YEARS = ['2024', '2023', '2022', '2021', '2020']

export const FULL_COMPARE_REGIONS = [
  '陕西省',
  '西安市',
  '宝鸡市',
  '咸阳市',
  '渭南市',
  '延安市',
  '汉中市',
  '榆林市',
  '安康市',
  '商洛市',
  '铜川市',
]

export const FULL_COMPARE_INDUSTRIES = [
  '发电行业',
  '建材',
  '钢铁',
  '化工',
  '有色',
  '石化',
  '造纸',
]

const SEEDS: Array<Pick<FullCompareEnterprise, 'name' | 'creditCode' | 'region' | 'industry'>> = [
  {
    name: '大唐陕西发电有限公司灞桥热电厂',
    creditCode: '91610000719685451C',
    region: '西安市',
    industry: '发电行业',
  },
  {
    name: '华能陕西秦岭发电有限公司',
    creditCode: '91610000220552810X',
    region: '渭南市',
    industry: '发电行业',
  },
  {
    name: '陕西煤业化工集团有限责任公司',
    creditCode: '91610000728938452H',
    region: '西安市',
    industry: '化工',
  },
  {
    name: '陕西延长石油（集团）有限责任公司',
    creditCode: '91610000719682345K',
    region: '延安市',
    industry: '石化',
  },
  {
    name: '陕西龙门钢铁（集团）有限责任公司',
    creditCode: '91610500728911223M',
    region: '渭南市',
    industry: '钢铁',
  },
  {
    name: '冀东海德堡（扶风）水泥有限公司',
    creditCode: '91610300728944567P',
    region: '宝鸡市',
    industry: '建材',
  },
  {
    name: '陕西有色榆林新材料集团有限责任公司',
    creditCode: '91610800728955678Q',
    region: '榆林市',
    industry: '有色',
  },
  {
    name: '陕西华电蒲城发电有限责任公司',
    creditCode: '91610500719666789R',
    region: '渭南市',
    industry: '发电行业',
  },
  {
    name: '铜川声威建材有限责任公司',
    creditCode: '91610200728977890S',
    region: '铜川市',
    industry: '建材',
  },
  {
    name: '陕煤集团神木红柳林矿业有限公司',
    creditCode: '91610800728988901T',
    region: '榆林市',
    industry: '化工',
  },
  {
    name: '汉中钢铁集团有限公司',
    creditCode: '91610700728999012U',
    region: '汉中市',
    industry: '钢铁',
  },
  {
    name: '安康水电开发有限公司',
    creditCode: '91610900728100123V',
    region: '安康市',
    industry: '发电行业',
  },
]

function buildRow(
  seed: (typeof SEEDS)[number],
  year: string,
  index: number,
): FullCompareEnterprise {
  const base = 80 + ((index * 37) % 220)
  const co2 = Number((base + (2024 - Number(year)) * 1.8).toFixed(2))
  const co2Verified = Number((co2 * (0.96 + (index % 5) * 0.008)).toFixed(2))
  const quota = Number((co2 * (0.92 + (index % 4) * 0.02)).toFixed(2))
  return {
    id: `${year}-${index}`,
    year,
    name: seed.name,
    creditCode: seed.creditCode,
    region: seed.region,
    industry: seed.industry,
    co2,
    co2Verified,
    quota,
    pm: Number((0.4 + (index % 9) * 0.35).toFixed(2)),
    so2: Number((1.2 + (index % 11) * 0.85).toFixed(2)),
    nox: Number((2.1 + (index % 13) * 1.15).toFixed(2)),
  }
}

/** 生成近年示意企业比对数据 */
export const FULL_COMPARE_ENTERPRISES: FullCompareEnterprise[] = FULL_COMPARE_YEARS.flatMap(
  (year, yi) => SEEDS.map((seed, si) => buildRow(seed, year, yi * SEEDS.length + si)),
)
