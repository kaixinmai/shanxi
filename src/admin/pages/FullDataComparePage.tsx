import { useMemo, useState } from 'react'
import {
  FULL_COMPARE_ENTERPRISES,
  FULL_COMPARE_INDUSTRIES,
  FULL_COMPARE_REGIONS,
  FULL_COMPARE_YEARS,
  type FullCompareEnterprise,
} from '../../data/fullDataCompare'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

function formatNum(n: number) {
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

export default function FullDataComparePage() {
  const [year, setYear] = useState('2021')
  const [name, setName] = useState('')
  const [region, setRegion] = useState('陕西省')
  const [industry, setIndustry] = useState('')
  const [query, setQuery] = useState({
    year: '2021',
    name: '',
    region: '陕西省',
    industry: '',
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    return FULL_COMPARE_ENTERPRISES.filter((row) => {
      if (query.year && row.year !== query.year) return false
      if (query.name && !row.name.includes(query.name.trim())) return false
      if (query.region && query.region !== '陕西省' && row.region !== query.region) return false
      if (query.industry && row.industry !== query.industry) return false
      return true
    })
  }, [query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function handleSearch() {
    setQuery({ year, name, region, industry })
    setPage(1)
  }

  function handleReset() {
    setYear('2021')
    setName('')
    setRegion('陕西省')
    setIndustry('')
    setQuery({ year: '2021', name: '', region: '陕西省', industry: '' })
    setPage(1)
    setPageSize(10)
  }

  const pageNumbers = useMemo(() => {
    const maxButtons = 7
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const start = Math.max(1, Math.min(currentPage - 3, totalPages - maxButtons + 1))
    return Array.from({ length: maxButtons }, (_, i) => start + i)
  }, [currentPage, totalPages])

  return (
    <div className="admin-page full-compare-page">
      <div className="admin-filter-card">
        <div className="admin-filter-row">
          <label className="admin-filter-item">
            <span>年度</span>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {FULL_COMPARE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-filter-item admin-filter-item-wide">
            <span>企业名称</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入企业名称"
            />
          </label>
          <label className="admin-filter-item">
            <span>区域</span>
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              {FULL_COMPARE_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-filter-item">
            <span>行业</span>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">请选择</option>
              {FULL_COMPARE_INDUSTRIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <div className="admin-filter-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleSearch}>
              查询
            </button>
            <button type="button" className="admin-btn admin-btn-default" onClick={handleReset}>
              重置
            </button>
          </div>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>年度</th>
                <th>企业名称</th>
                <th>统一社会信用代码</th>
                <th>区域</th>
                <th>行业</th>
                <th>
                  二氧化碳排放量
                  <br />
                  （万吨）
                </th>
                <th>
                  核查后的二氧化碳排放量
                  <br />
                  （万吨）
                </th>
                <th>
                  企业的核定配额量
                  <br />
                  （万吨）
                </th>
                <th>
                  颗粒物
                  <br />
                  （万吨）
                </th>
                <th>
                  二氧化硫
                  <br />
                  （万吨）
                </th>
                <th>
                  氮氧化物
                  <br />
                  （万吨）
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="admin-table-empty">
                    暂无数据
                  </td>
                </tr>
              ) : (
                pageRows.map((row: FullCompareEnterprise) => (
                  <tr key={row.id}>
                    <td>{row.year}</td>
                    <td className="admin-table-name" title={row.name}>
                      {row.name}
                    </td>
                    <td>{row.creditCode}</td>
                    <td>{row.region}</td>
                    <td>{row.industry}</td>
                    <td>{formatNum(row.co2)}</td>
                    <td>{formatNum(row.co2Verified)}</td>
                    <td>{formatNum(row.quota)}</td>
                    <td>{formatNum(row.pm)}</td>
                    <td>{formatNum(row.so2)}</td>
                    <td>{formatNum(row.nox)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <span className="admin-pagination-total">共 {total} 条</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}条/页
              </option>
            ))}
          </select>
          <div className="admin-pagination-pages">
            <button
              type="button"
              className="admin-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </button>
            {pageNumbers.map((num) => (
              <button
                key={num}
                type="button"
                className={`admin-page-btn${num === currentPage ? ' is-active' : ''}`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              className="admin-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
          <label className="admin-pagination-jump">
            前往
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue={currentPage}
              key={currentPage}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return
                const next = Number((e.target as HTMLInputElement).value)
                if (Number.isFinite(next)) {
                  setPage(Math.min(totalPages, Math.max(1, next)))
                }
              }}
            />
            页
          </label>
        </div>
      </div>
    </div>
  )
}
