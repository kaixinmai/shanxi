import { useEffect, useRef, useState } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import {
  EMISSION_LEGEND,
  REGION_VIEW,
  SHAANXI_CITIES,
  SHAANXI_PROVINCE_ADCODE,
  buildRegionLabelHtml,
  getCityByAdcode,
  getCityByName,
  getEmissionFillColor,
  getEmissionFillHex,
} from '../data/shaanxiMap'
import {
  CCER_MAP_PROJECTS,
  CCER_STAGE_COLORS,
  CCER_STAGE_LEGEND,
  filterCcerProjectsByRegion,
  type CcerMapProject,
} from '../data/ccerProjects'
import {
  PILOT_COUNT_LEGEND,
  PILOT_TYPE_META,
  buildPilotLabelHtml,
  getCityPilotStats,
  getPilotFillColor,
  getPilotFillHex,
  type PilotTypeCounts,
} from '../data/pilotSites'
import type { MapFilters, UnitType } from '../data/enterpriseCommon'

declare global {
  interface Window {
    _AMapSecurityConfig?: {
      securityJsCode?: string
      serviceHost?: string
    }
  }
}

interface MapCenterProps {
  showIndustry?: boolean
  showUnitType?: boolean
  defaultYear?: string
  /** 有值时隐藏年度下拉，改为展示更新日期 */
  updateDate?: string
  /** emission=区域排放填色；projects=CCER 项目点位；pilots=试点数量 */
  mapMode?: 'emission' | 'projects' | 'pilots'
  onFiltersChange?: (filters: MapFilters) => void
}

interface DistrictItem {
  name: string
  adcode: string
  boundaries: AMap.LngLat[][]
}

type DistrictLayerInstance = {
  setMap: (map: AMap.Map | null) => void
  setStyles?: (styles: object) => void
  on?: (event: string, handler: (e: { props?: Record<string, unknown> }) => void) => void
  off?: (event: string, handler: (e: { props?: Record<string, unknown> }) => void) => void
}

interface RegionPopupInfo {
  kind: 'region'
  name: string
  year: string
  industry: string
  emissionMt: number
  x: number
  y: number
}

interface PilotPopupInfo {
  kind: 'pilot'
  name: string
  total: number
  byType: PilotTypeCounts
  x: number
  y: number
}

interface ProjectPopupInfo {
  kind: 'project'
  project: CcerMapProject
  x: number
  y: number
}

type MapPopupInfo = RegionPopupInfo | PilotPopupInfo | ProjectPopupInfo

type AMapWithDistrictLayer = typeof AMap & {
  DistrictLayer: {
    Province: new (opts: object) => DistrictLayerInstance
  }
}

type DistrictSearchInstance = {
  search: (
    keyword: string,
    callback: (
      status: string,
      result: {
        districtList?: Array<{
          name?: string
          adcode?: string | number
          boundaries?: AMap.LngLat[][]
        }>
      },
    ) => void,
  ) => void
}

const REGIONS = [
  '全省',
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
const YEARS = ['2024', '2023', '2022', '2021', '2020']
const INDUSTRIES = ['全部', '发电', '钢铁', '建材', '化工', '有色', '石化']
const UNIT_TYPES: UnitType[] = ['重点排放单位', '省级管理单位']

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY as string | undefined
const AMAP_SECURITY = import.meta.env.VITE_AMAP_SECURITY as string | undefined

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function searchOnce(
  districtSearch: DistrictSearchInstance,
  keyword: string,
): Promise<DistrictItem | null> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(null), 6000)
    districtSearch.search(keyword, (status, result) => {
      window.clearTimeout(timer)
      const item = result?.districtList?.[0]
      if (status === 'complete' && item?.boundaries?.length) {
        resolve({
          name: item.name ?? keyword,
          adcode: String(item.adcode ?? ''),
          boundaries: item.boundaries,
        })
      } else {
        resolve(null)
      }
    })
  })
}

/** 逐个拉取，避免并发限流导致半截着色 */
async function loadAllCityBoundaries(
  districtSearch: DistrictSearchInstance,
): Promise<DistrictItem[]> {
  const list: DistrictItem[] = []
  for (const city of SHAANXI_CITIES) {
    let found =
      (await searchOnce(districtSearch, city.name)) ??
      (await searchOnce(districtSearch, city.adcode))

    if (!found?.boundaries.length) {
      await sleep(200)
      found =
        (await searchOnce(districtSearch, city.name)) ??
        (await searchOnce(districtSearch, city.adcode))
    }

    list.push({
      name: city.name,
      adcode: city.adcode,
      boundaries: found?.boundaries ?? [],
    })
    await sleep(120)
  }
  return list
}

export default function MapCenter({
  showIndustry = false,
  showUnitType = false,
  defaultYear = '2023',
  updateDate,
  mapMode = 'emission',
  onFiltersChange,
}: MapCenterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<AMap.Map | null>(null)
  const districtLayerRef = useRef<DistrictLayerInstance | null>(null)
  const polygonsRef = useRef<AMap.Polygon[]>([])
  const markersRef = useRef<AMap.Marker[]>([])
  const AMapRef = useRef<typeof AMap | null>(null)
  const regionRef = useRef('全省')
  const yearRef = useRef(defaultYear)
  const industryRef = useRef('全部')
  const unitTypeRef = useRef<UnitType>('重点排放单位')
  const mapModeRef = useRef(mapMode)
  const districtsRef = useRef<DistrictItem[]>([])
  const stageRef = useRef<HTMLDivElement>(null)

  const [region, setRegion] = useState('全省')
  const [year, setYear] = useState(defaultYear)
  const [industry, setIndustry] = useState('全部')
  const [unitType, setUnitType] = useState<UnitType>('重点排放单位')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'nokey'>(
    AMAP_KEY ? 'loading' : 'nokey',
  )
  const [errorMsg, setErrorMsg] = useState('')
  const [layerReady, setLayerReady] = useState(0)
  const [popup, setPopup] = useState<MapPopupInfo | null>(null)

  regionRef.current = region
  yearRef.current = year
  industryRef.current = industry
  unitTypeRef.current = unitType
  mapModeRef.current = mapMode

  useEffect(() => {
    onFiltersChange?.({ region, year, industry, unitType })
  }, [region, year, industry, unitType, onFiltersChange])

  function openCityPopup(
    city: (typeof SHAANXI_CITIES)[0],
    clientX: number,
    clientY: number,
  ) {
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    const isPilot = mapModeRef.current === 'pilots'
    const popupW = isPilot ? 280 : 220
    const popupH = isPilot ? 210 : 120

    let x = clientX - rect.left + 14
    let y = clientY - rect.top - 10
    if (x + popupW > rect.width - 8) x = clientX - rect.left - popupW - 14
    if (y + popupH > rect.height - 8) y = rect.height - popupH - 12
    if (y < 8) y = 8
    if (x < 8) x = 8

    if (isPilot) {
      const stats = getCityPilotStats(city.name)
      setPopup({
        kind: 'pilot',
        name: city.name,
        total: stats.total,
        byType: stats.byType,
        x,
        y,
      })
      return
    }

    const industryLabel =
      industryRef.current === '全部' ? city.industry : `${industryRef.current}行业`

    setPopup({
      kind: 'region',
      name: city.name,
      year: yearRef.current,
      industry: industryLabel,
      emissionMt: city.emissionMt,
      x,
      y,
    })
  }

  function openProjectPopup(
    project: CcerMapProject,
    clientX: number,
    clientY: number,
  ) {
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    let x = clientX - rect.left + 14
    let y = clientY - rect.top - 10
    const popupW = 300
    const popupH = 220
    if (x + popupW > rect.width - 8) x = clientX - rect.left - popupW - 14
    if (y + popupH > rect.height - 8) y = rect.height - popupH - 12
    if (y < 8) y = 8
    if (x < 8) x = 8

    setPopup({
      kind: 'project',
      project,
      x,
      y,
    })
  }

  function resolveCityFromProps(props?: Record<string, unknown>) {
    if (!props) return undefined
    const adcode = props.adcode ?? props.adCode ?? props.ADCODE
    const name = String(props.NAME_CHN ?? props.name ?? props.NAME ?? '')
    return getCityByAdcode(String(adcode ?? '')) ?? getCityByName(name)
  }

  function clearOverlays() {
    if (districtLayerRef.current) {
      districtLayerRef.current.setMap(null)
      districtLayerRef.current = null
    }
    polygonsRef.current.forEach((p) => p.setMap(null as unknown as AMap.Map))
    polygonsRef.current = []
    markersRef.current.forEach((m) => m.setMap(null as unknown as AMap.Map))
    markersRef.current = []
  }

  function buildFillStyle(activeRegion: string) {
    return {
      'province-stroke': 'rgba(94, 184, 255, 0.45)',
      'city-stroke': 'rgba(120, 200, 255, 0.95)',
      'county-stroke': 'rgba(120, 200, 255, 0.35)',
      'stroke-width': 1.8,
      fill: (props: {
        adcode?: number | string
        NAME_CHN?: string
        name?: string
      }) => {
        const city =
          getCityByAdcode(props.adcode ?? '') ??
          getCityByName(props.NAME_CHN ?? props.name ?? '')
        if (!city) return '#1a3a5c'
        if (activeRegion !== '全省' && city.name !== activeRegion) {
          return '#152d48'
        }
        if (mapModeRef.current === 'pilots') {
          return getPilotFillHex(getCityPilotStats(city.name).total)
        }
        return getEmissionFillHex(city.value)
      },
    }
  }

  function renderLabels(
    map: AMap.Map,
    AMapCls: typeof AMap,
    cities: typeof SHAANXI_CITIES,
  ) {
    cities.forEach((c) => {
      const [ox = 0, oy = 0] = c.labelOffset ?? [0, 0]
      const labelHtml =
        mapModeRef.current === 'pilots'
          ? buildPilotLabelHtml(c.name, getCityPilotStats(c.name).total)
          : buildRegionLabelHtml(c.name, c.value)
      const marker = new AMapCls.Marker({
        position: [c.lng, c.lat],
        offset: new AMapCls.Pixel(ox, oy),
        anchor: 'center',
        content: labelHtml,
        zIndex: 130,
      })
      marker.on('click', (e: { pixel?: { x: number; y: number }; originEvent?: MouseEvent }) => {
        const oe = e.originEvent
        if (oe) {
          openCityPopup(c, oe.clientX, oe.clientY)
        } else {
          const stage = stageRef.current?.getBoundingClientRect()
          openCityPopup(
            c,
            (stage?.left ?? 0) + (e.pixel?.x ?? 0),
            (stage?.top ?? 0) + (e.pixel?.y ?? 0),
          )
        }
      })
      marker.setMap(map)
      markersRef.current.push(marker)
    })
  }

  function renderPolygons(
    map: AMap.Map,
    AMapCls: typeof AMap,
    cities: typeof SHAANXI_CITIES,
    districts: DistrictItem[],
    activeRegion: string,
  ) {
    const activeNames = new Set(cities.map((c) => c.name))
    let drawn = 0

    districts.forEach((d) => {
      const city = getCityByAdcode(d.adcode) ?? getCityByName(d.name)
      if (!city || !d.boundaries.length) return

      const isActive = activeRegion === '全省' || activeNames.has(city.name)
      const fill = !isActive
        ? 'rgba(26, 58, 92, 0.55)'
        : mapModeRef.current === 'pilots'
          ? getPilotFillColor(getCityPilotStats(city.name).total)
          : getEmissionFillColor(city.value)

      d.boundaries.forEach((path) => {
        const polygon = new AMapCls.Polygon({
          path,
          fillColor: fill,
          fillOpacity: 0.92,
          strokeColor: '#78c8ff',
          strokeWeight: 1.5,
          strokeOpacity: 0.95,
          zIndex: 50,
          cursor: 'pointer',
          bubble: true,
          extData: { cityName: city.name, adcode: city.adcode },
        })
        polygon.on('click', (e: { originEvent?: MouseEvent; pixel?: { x: number; y: number } }) => {
          const oe = e.originEvent
          if (oe) {
            openCityPopup(city, oe.clientX, oe.clientY)
          } else {
            const stage = stageRef.current?.getBoundingClientRect()
            openCityPopup(
              city,
              (stage?.left ?? 0) + (e.pixel?.x ?? 0),
              (stage?.top ?? 0) + (e.pixel?.y ?? 0),
            )
          }
        })
        polygon.setMap(map)
        polygonsRef.current.push(polygon)
        drawn++
      })
    })

    return drawn
  }

  function renderDistrictLayer(
    map: AMap.Map,
    AMapCls: typeof AMap,
    activeRegion: string,
  ) {
    const ExtendedAMap = AMapCls as AMapWithDistrictLayer
    if (!ExtendedAMap.DistrictLayer?.Province) return false

    const layer = new ExtendedAMap.DistrictLayer.Province({
      zIndex: 48,
      adcode: [Number(SHAANXI_PROVINCE_ADCODE)],
      depth: 1,
      opacity: 1,
      styles: buildFillStyle(activeRegion),
    })
    layer.setMap(map)
    layer.on?.('click', (e) => {
      const city = resolveCityFromProps(e.props)
      if (!city) return
      // DistrictLayer 点击没有可靠像素坐标，弹到城市中心附近
      const stage = stageRef.current?.getBoundingClientRect()
      if (!stage) return
      openCityPopup(city, stage.left + stage.width * 0.55, stage.top + stage.height * 0.4)
    })
    districtLayerRef.current = layer
    return true
  }

  function buildOutlineFillStyle() {
    return {
      'province-stroke': 'rgba(94, 184, 255, 0.55)',
      'city-stroke': 'rgba(120, 200, 255, 0.75)',
      'county-stroke': 'rgba(120, 200, 255, 0.25)',
      'stroke-width': 1.5,
      fill: () => '#163a5c',
    }
  }

  function paintProvinceOutline(
    map: AMap.Map,
    AMapCls: typeof AMap,
    activeRegion: string,
  ) {
    const completeCount = districtsRef.current.filter(
      (d) => d.boundaries.length > 0,
    ).length

    if (completeCount >= SHAANXI_CITIES.length) {
      districtsRef.current.forEach((d) => {
        const city = getCityByAdcode(d.adcode) ?? getCityByName(d.name)
        if (!city || !d.boundaries.length) return
        const isActive = activeRegion === '全省' || city.name === activeRegion
        d.boundaries.forEach((path) => {
          const polygon = new AMapCls.Polygon({
            path,
            fillColor: isActive ? 'rgba(22, 58, 92, 0.72)' : 'rgba(12, 28, 48, 0.55)',
            fillOpacity: 1,
            strokeColor: '#78c8ff',
            strokeWeight: 1.4,
            strokeOpacity: 0.9,
            zIndex: 40,
            bubble: true,
          })
          polygon.setMap(map)
          polygonsRef.current.push(polygon)
        })
      })
      return
    }

    const ExtendedAMap = AMapCls as AMapWithDistrictLayer
    if (!ExtendedAMap.DistrictLayer?.Province) return
    const layer = new ExtendedAMap.DistrictLayer.Province({
      zIndex: 40,
      adcode: [Number(SHAANXI_PROVINCE_ADCODE)],
      depth: 1,
      opacity: 1,
      styles: buildOutlineFillStyle(),
    })
    layer.setMap(map)
    districtLayerRef.current = layer
  }

  function renderProjectMarkers(
    map: AMap.Map,
    AMapCls: typeof AMap,
    projects: CcerMapProject[],
  ) {
    projects.forEach((p) => {
      const color = CCER_STAGE_COLORS[p.stage]
      const marker = new AMapCls.Marker({
        position: [p.lng, p.lat],
        offset: new AMapCls.Pixel(-10, -10),
        anchor: 'center',
        zIndex: 160,
        title: p.name,
        content: `<div class="project-map-dot" style="
          width:20px;height:20px;border-radius:50%;
          background:radial-gradient(circle at 35% 30%, #fff 0%, ${color} 38%, ${color} 72%, transparent 78%);
          border:2px solid #fff;
          box-shadow:0 0 10px ${color}, 0 2px 6px rgba(0,0,0,0.45);
          cursor:pointer;
        "></div>`,
      })
      marker.on('click', (e: { originEvent?: MouseEvent }) => {
        const oe = e.originEvent
        if (oe) {
          openProjectPopup(p, oe.clientX, oe.clientY)
        } else {
          const stage = stageRef.current?.getBoundingClientRect()
          if (!stage) return
          openProjectPopup(p, stage.left + stage.width * 0.5, stage.top + stage.height * 0.4)
        }
      })
      marker.setMap(map)
      markersRef.current.push(marker)
    })
  }

  function paintChoropleth(
    map: AMap.Map,
    AMapCls: typeof AMap,
    cities: typeof SHAANXI_CITIES,
    activeRegion: string,
  ) {
    const completeCount = districtsRef.current.filter(
      (d) => d.boundaries.length > 0,
    ).length

    // 10 市边界齐全才用多边形；否则用地市级 DistrictLayer 保证完整着色
    if (completeCount >= SHAANXI_CITIES.length) {
      renderPolygons(map, AMapCls, cities, districtsRef.current, activeRegion)
    } else {
      renderDistrictLayer(map, AMapCls, activeRegion)
      // 已拉到的市再用多边形补强，避免图层偶发漏色
      if (completeCount > 0) {
        renderPolygons(map, AMapCls, cities, districtsRef.current, activeRegion)
      }
    }
    renderLabels(map, AMapCls, cities)
  }

  useEffect(() => {
    if (!AMAP_KEY || !containerRef.current) {
      setStatus('nokey')
      return
    }

    let cancelled = false

    if (AMAP_SECURITY) {
      window._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY }
    }

    AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.DistrictSearch'],
    })
      .then((AMapCls) => {
        if (cancelled || !containerRef.current) return
        AMapRef.current = AMapCls

        const view = REGION_VIEW['全省']
        const map = new AMapCls.Map(containerRef.current, {
          viewMode: '2D',
          zoom: view.zoom,
          center: view.center,
          mapStyle: 'amap://styles/blue',
          features: ['bg', 'road', 'point'],
          showLabel: true,
        })

        map.addControl(new AMapCls.Scale({ position: 'LB' }))
        mapRef.current = map
        setStatus('ready')

        // 先立刻用 DistrictLayer 铺满颜色
        setLayerReady((v) => v + 1)

        const districtSearch = new AMapCls.DistrictSearch({
          extensions: 'all',
          subdistrict: 0,
          level: 'city',
        })

        loadAllCityBoundaries(districtSearch).then((districts) => {
          if (cancelled) return
          districtsRef.current = districts
          setLayerReady((v) => v + 1)
        })

        const ro = new ResizeObserver(() => map.resize())
        ro.observe(containerRef.current)
        map.on('destroy', () => ro.disconnect())
      })
      .catch((err: unknown) => {
        console.error(err)
        if (!cancelled) {
          setStatus('error')
          setErrorMsg(err instanceof Error ? err.message : '地图加载失败')
        }
      })

    return () => {
      cancelled = true
      clearOverlays()
      mapRef.current?.destroy()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'ready') return
    const view = REGION_VIEW[region] ?? REGION_VIEW['全省']
    map.setZoomAndCenter(view.zoom, view.center)
  }, [region, status])

  useEffect(() => {
    const map = mapRef.current
    const AMapCls = AMapRef.current
    if (!map || !AMapCls || status !== 'ready') return

    clearOverlays()
    setPopup(null)

    if (mapMode === 'projects') {
      paintProvinceOutline(map, AMapCls, region)
      const projects = filterCcerProjectsByRegion(CCER_MAP_PROJECTS, region)
      renderProjectMarkers(map, AMapCls, projects)
      return
    }

    const cities =
      region === '全省'
        ? SHAANXI_CITIES
        : SHAANXI_CITIES.filter((c) => c.name === region)

    paintChoropleth(map, AMapCls, cities, region)
  }, [mapMode, region, year, industry, unitType, status, layerReady])

  return (
    <div className="map-center">
      <div className="map-filters">
        <div className="map-filter-group">
          <label>区域</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r === '全省' ? '陕西' : r}
              </option>
            ))}
          </select>
        </div>
        {updateDate ? (
          <div className="map-filter-group">
            <label>更新日期</label>
            <span className="map-filter-date">{updateDate}</span>
          </div>
        ) : (
          <div className="map-filter-group">
            <label>年度</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}
        {showIndustry && (
          <div className="map-filter-group">
            <label>行业</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        )}
        {showUnitType && (
          <div className="map-filter-group">
            <label>类型</label>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value as UnitType)}
            >
              {UNIT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="map-stage" ref={stageRef}>
        <div ref={containerRef} className="amap-container" />

        {(status === 'loading' || status === 'nokey' || status === 'error') && (
          <div className="map-overlay">
            {status === 'loading' && <p>高德地图加载中…</p>}
            {status === 'nokey' && (
              <div className="map-key-tip">
                <p>请配置高德地图 Key 以显示陕西真实地图</p>
                <pre>{`VITE_AMAP_KEY=你的Key\nVITE_AMAP_SECURITY=你的安全密钥`}</pre>
              </div>
            )}
            {status === 'error' && (
              <div className="map-key-tip">
                <p>地图加载失败</p>
                <p className="map-key-sub">{errorMsg}</p>
              </div>
            )}
          </div>
        )}

        {popup && popup.kind === 'region' && (
          <div
            className="region-popup"
            style={{ left: popup.x, top: popup.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="region-popup-close"
              onClick={() => setPopup(null)}
              aria-label="关闭"
            >
              ×
            </button>
            <div className="region-popup-title">{popup.name}</div>
            <div className="region-popup-row">
              <span>年度：</span>
              <em>{popup.year} 年</em>
            </div>
            <div className="region-popup-row">
              <span>所属行业：</span>
              <em>{popup.industry}</em>
            </div>
            <div className="region-popup-row">
              <span>碳排放量：</span>
              <em>
                {popup.emissionMt.toFixed(2)}{' '}
                <i className="region-popup-unit">百万tCO₂</i>
              </em>
            </div>
          </div>
        )}

        {popup && popup.kind === 'pilot' && (
          <div
            className="region-popup pilot-popup"
            style={{ left: popup.x, top: popup.y }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="试点数量"
          >
            <button
              type="button"
              className="region-popup-close"
              onClick={() => setPopup(null)}
              aria-label="关闭"
            >
              ×
            </button>
            <div className="region-popup-title">{popup.name}</div>
            <div className="region-popup-row">
              <span>试点总数：</span>
              <em>
                {popup.total}
                <i className="region-popup-unit"> 个</i>
              </em>
            </div>
            <div className="pilot-popup-divider" />
            {PILOT_TYPE_META.map((item) => (
              <div key={item.key} className="region-popup-row pilot-popup-type-row">
                <span title={item.label}>{item.label}</span>
                <em>
                  {popup.byType[item.key]}
                  <i className="region-popup-unit"> 个</i>
                </em>
              </div>
            ))}
          </div>
        )}

        {popup && popup.kind === 'project' && (
          <div
            className="region-popup project-popup"
            style={{ left: popup.x, top: popup.y }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="项目简介"
          >
            <button
              type="button"
              className="region-popup-close"
              onClick={() => setPopup(null)}
              aria-label="关闭"
            >
              ×
            </button>
            <div className="region-popup-title">{popup.project.name}</div>
            <div className="region-popup-row">
              <span>项目位置：</span>
              <em>{popup.project.location}</em>
            </div>
            <div className="region-popup-row">
              <span>项目状态：</span>
              <em style={{ color: CCER_STAGE_COLORS[popup.project.stage] }}>
                {popup.project.stage}
              </em>
            </div>
            <div className="region-popup-row">
              <span>申请状态：</span>
              <em>{popup.project.applyStatus}</em>
            </div>
            <div className="region-popup-row">
              <span>方法学：</span>
              <em>{popup.project.method}</em>
            </div>
            <div className="region-popup-row">
              <span>行业领域：</span>
              <em>{popup.project.domain}</em>
            </div>
          </div>
        )}

        {mapMode === 'projects' ? (
          <div className="map-legend map-legend-choropleth">
            <div className="map-legend-title">项目阶段</div>
            {CCER_STAGE_LEGEND.map((item) => (
              <div key={item.stage} className="map-legend-row">
                <i
                  style={{
                    background: item.color,
                    borderRadius: '50%',
                    boxShadow: `0 0 8px ${item.color}`,
                  }}
                />
                <span className="map-legend-range">{item.stage}</span>
              </div>
            ))}
          </div>
        ) : mapMode === 'pilots' ? (
          <div className="map-legend map-legend-choropleth">
            <div className="map-legend-title">试点数量（个）</div>
            {PILOT_COUNT_LEGEND.map((item) => (
              <div key={item.range} className="map-legend-row">
                <i style={{ background: item.color }} />
                <span className="map-legend-range">{item.range}</span>
                {item.label && (
                  <span className="map-legend-tag">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="map-legend map-legend-choropleth">
            <div className="map-legend-title">碳排放量（万吨CO₂）</div>
            {EMISSION_LEGEND.map((item) => (
              <div key={item.range} className="map-legend-row">
                <i style={{ background: item.color }} />
                <span className="map-legend-range">{item.range}</span>
                {item.label && (
                  <span className="map-legend-tag">{item.label}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .map-center {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .map-filters {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 6px 12px;
          flex-shrink: 0;
          z-index: 2;
        }

        .map-filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .map-filter-group label {
          font-size: 16px;
          line-height: 1.5;
          color: rgba(232, 244, 255, 0.85);
        }

        .map-filter-group select {
          min-width: 100px;
          background: rgba(6, 28, 58, 0.9);
          border: 1px solid rgba(0, 212, 255, 0.35);
          color: #e8f4ff;
          padding: 6px 12px;
          font-size: 16px;
          line-height: 1.4;
          border-radius: 2px;
          outline: none;
          font-family: inherit;
        }

        .map-filter-date {
          min-width: 120px;
          padding: 6px 12px;
          font-size: 16px;
          line-height: 1.4;
          color: #00d4ff;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          background: rgba(6, 28, 58, 0.9);
          border: 1px solid rgba(0, 212, 255, 0.35);
          border-radius: 2px;
        }

        .map-stage {
          position: relative;
          flex: 1;
          min-height: 0;
          border: 1px solid rgba(0, 212, 255, 0.15);
          border-radius: 4px;
          overflow: hidden;
        }

        .amap-container {
          width: 100%;
          height: 100%;
          background: #143052;
        }

        .map-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(2, 11, 26, 0.82);
          z-index: 5;
          color: #e8f4ff;
          text-align: center;
          padding: 24px;
        }

        .map-key-tip pre {
          text-align: left;
          background: rgba(0, 40, 80, 0.7);
          border: 1px solid rgba(0, 212, 255, 0.3);
          padding: 12px 16px;
          margin: 12px auto;
          font-size: 15px;
          color: #00d4ff;
          line-height: 1.6;
        }

        .map-key-sub {
          font-size: 15px;
          color: rgba(232, 244, 255, 0.75);
          margin: 8px 0;
          line-height: 1.6;
        }

        .map-legend-choropleth {
          position: absolute;
          left: 14px;
          bottom: 14px;
          z-index: 4;
          background: rgba(8, 20, 40, 0.92);
          border: 1px solid rgba(80, 160, 255, 0.35);
          border-radius: 10px;
          padding: 12px 14px;
          min-width: 168px;
        }

        .map-legend-title {
          font-size: 15px;
          color: rgba(232, 244, 255, 0.95);
          margin-bottom: 10px;
          font-weight: 500;
          line-height: 1.4;
        }

        .map-legend-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0;
        }

        .map-legend-row i {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .map-legend-range {
          font-size: 14px;
          color: rgba(232, 244, 255, 0.85);
          flex: 1;
          line-height: 1.5;
        }

        .map-legend-tag {
          font-size: 14px;
          color: rgba(232, 244, 255, 0.7);
        }

        .region-data-label {
          background: rgba(8, 18, 36, 0.9);
          border: 1px solid rgba(100, 180, 255, 0.4);
          border-radius: 8px;
          padding: 8px 14px;
          text-align: center;
          min-width: 88px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
          cursor: pointer;
          white-space: nowrap;
        }

        .region-data-label-name {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
        }

        .region-data-label-value {
          color: rgba(255, 255, 255, 0.85);
          font-size: 14px;
          margin-top: 4px;
          line-height: 1.5;
        }

        .region-popup {
          position: absolute;
          z-index: 20;
          min-width: 240px;
          padding: 14px 16px 16px;
          background: rgba(6, 14, 28, 0.94);
          border: 1px solid rgba(0, 212, 255, 0.35);
          border-radius: 4px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
          pointer-events: auto;
          line-height: 1.7;
        }

        .region-popup-close {
          position: absolute;
          top: 6px;
          right: 10px;
          font-size: 20px;
          line-height: 1;
          color: rgba(232, 244, 255, 0.65);
        }

        .region-popup-close:hover {
          color: #00d4ff;
        }

        .region-popup-title {
          color: #00d4ff;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          padding-right: 18px;
          line-height: 1.35;
        }

        .project-popup {
          max-width: 340px;
          min-width: 280px;
        }

        .project-popup .region-popup-title {
          font-size: 17px;
          white-space: normal;
          word-break: break-word;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-popup .region-popup-row {
          align-items: flex-start;
        }

        .project-popup .region-popup-row em {
          max-width: 60%;
          white-space: normal;
          word-break: break-word;
        }

        .pilot-popup {
          min-width: 300px;
          max-width: 340px;
        }

        .pilot-popup-divider {
          height: 1px;
          margin: 8px 0 10px;
          background: rgba(0, 212, 255, 0.18);
        }

        .pilot-popup-type-row span {
          max-width: 210px;
          white-space: normal;
          line-height: 1.4;
        }

        .region-popup-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          margin: 8px 0;
          font-size: 16px;
          line-height: 1.6;
        }

        .region-popup-row span {
          color: rgba(232, 244, 255, 0.92);
          white-space: nowrap;
        }

        .region-popup-row em {
          font-style: normal;
          color: #ff9f2e;
          font-weight: 600;
          text-align: right;
        }

        .region-popup-unit {
          font-style: normal;
          color: rgba(232, 244, 255, 0.9);
          font-weight: 400;
          font-size: 15px;
        }

        .amap-logo,
        .amap-copyright {
          opacity: 0.4 !important;
          transform: scale(0.85);
          transform-origin: left bottom;
        }
      `}</style>
    </div>
  )
}
