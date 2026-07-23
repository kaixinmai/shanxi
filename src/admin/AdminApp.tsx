import { useMemo, useState } from 'react'
import FullDataComparePage from './pages/FullDataComparePage'

type TopMenuKey =
  | 'enterprise'
  | 'ghg'
  | 'ccer'
  | 'inclusive'
  | 'synergy'
  | 'pilot'
  | 'policy'
  | 'org'

interface SideMenuItem {
  key: string
  label: string
}

const TOP_MENUS: { key: TopMenuKey; label: string }[] = [
  { key: 'enterprise', label: '企业碳排放' },
  { key: 'ghg', label: '温室气体清单' },
  { key: 'ccer', label: 'CCER' },
  { key: 'inclusive', label: '碳普惠' },
  { key: 'synergy', label: '减污降碳协同' },
  { key: 'pilot', label: '试点示范' },
  { key: 'policy', label: '政策资讯' },
  { key: 'org', label: '机构管理' },
]

const SIDE_MENUS: Record<TopMenuKey, SideMenuItem[]> = {
  enterprise: [{ key: 'full-compare', label: '全量数据比对' }],
  ghg: [{ key: 'ghg-placeholder', label: '清单数据管理' }],
  ccer: [
    { key: 'ccer-detail', label: 'CCER项目明细' },
    { key: 'ccer-manage', label: 'CCER项目管理' },
  ],
  inclusive: [{ key: 'inclusive-placeholder', label: '碳普惠管理' }],
  synergy: [{ key: 'synergy-placeholder', label: '协同数据管理' }],
  pilot: [{ key: 'pilot-placeholder', label: '试点示范管理' }],
  policy: [{ key: 'policy-placeholder', label: '政策资讯管理' }],
  org: [{ key: 'org-placeholder', label: '机构管理' }],
}

interface AdminAppProps {
  onBackHome: () => void
}

export default function AdminApp({ onBackHome }: AdminAppProps) {
  const [topKey, setTopKey] = useState<TopMenuKey>('enterprise')
  const [sideKey, setSideKey] = useState('full-compare')

  const sideMenus = SIDE_MENUS[topKey]

  const content = useMemo(() => {
    if (topKey === 'enterprise' && sideKey === 'full-compare') {
      return <FullDataComparePage />
    }
    const current = sideMenus.find((item) => item.key === sideKey)
    return (
      <div className="admin-placeholder">
        <h2>{current?.label ?? '功能建设中'}</h2>
        <p>该模块示意页，后续可继续接入业务功能。</p>
      </div>
    )
  }, [topKey, sideKey, sideMenus])

  return (
    <div className="admin-app">
      <header className="admin-topbar">
        <div className="admin-brand">
          <span className="admin-brand-mark" />
          <span className="admin-brand-text">碳排放业务管理系统</span>
        </div>
        <nav className="admin-top-nav">
          {TOP_MENUS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`admin-top-nav-item${topKey === item.key ? ' is-active' : ''}`}
              onClick={() => {
                setTopKey(item.key)
                setSideKey(SIDE_MENUS[item.key][0]?.key ?? '')
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="admin-top-extra">
          <span className="admin-org">陕西省-陕西省生态环境厅</span>
          <button type="button" className="admin-back-home" onClick={onBackHome}>
            返回首页
          </button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sider">
          <div className="admin-sider-toggle" aria-hidden>
            ☰
          </div>
          <nav className="admin-side-nav">
            {sideMenus.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`admin-side-nav-item${sideKey === item.key ? ' is-active' : ''}`}
                onClick={() => setSideKey(item.key)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="admin-main">{content}</main>
      </div>
    </div>
  )
}
