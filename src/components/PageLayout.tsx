import { useCallback, useState, type ReactNode } from 'react'
import MapCenter from './MapCenter'
import {
  DEFAULT_MAP_FILTERS,
  type MapFilters,
} from '../data/enterpriseCommon'

interface PageLayoutProps {
  left: ReactNode | ((filters: MapFilters) => ReactNode)
  right: ReactNode | ((filters: MapFilters) => ReactNode)
  showIndustry?: boolean
  showUnitType?: boolean
  defaultYear?: string
  /** 显示「更新日期」替代年度筛选 */
  updateDate?: string
  mapMode?: 'emission' | 'projects' | 'pilots'
  className?: string
}

export default function PageLayout({
  left,
  right,
  showIndustry,
  showUnitType,
  defaultYear,
  updateDate,
  mapMode,
  className = '',
}: PageLayoutProps) {
  const [filters, setFilters] = useState<MapFilters>({
    ...DEFAULT_MAP_FILTERS,
    year: defaultYear ?? DEFAULT_MAP_FILTERS.year,
  })

  const handleFiltersChange = useCallback((next: MapFilters) => {
    setFilters(next)
  }, [])

  const leftContent = typeof left === 'function' ? left(filters) : left
  const rightContent = typeof right === 'function' ? right(filters) : right

  return (
    <div className={`dashboard-page ${className}`.trim()}>
      <div className="dashboard-col dashboard-col-left">{leftContent}</div>
      <div className="dashboard-col dashboard-col-center">
        <MapCenter
          showIndustry={showIndustry}
          showUnitType={showUnitType}
          defaultYear={defaultYear}
          updateDate={updateDate}
          mapMode={mapMode}
          onFiltersChange={handleFiltersChange}
        />
      </div>
      <div className="dashboard-col dashboard-col-right">{rightContent}</div>
    </div>
  )
}
