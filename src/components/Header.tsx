export type NavKey =
  | 'home'
  | 'ghg'
  | 'synergy'
  | 'enterprise'
  | 'ccer'
  | 'inclusive'
  | 'pilot'

interface NavItem {
  key: NavKey
  label: string
}

const LEFT_NAV: NavItem[] = [
  { key: 'home', label: '首页' },
  { key: 'ghg', label: '温室气体清单一张图' },
  { key: 'synergy', label: '减污降碳协同一张图' },
  { key: 'enterprise', label: '企业碳排放一张图' },
]

const RIGHT_NAV: NavItem[] = [
  { key: 'ccer', label: 'CCER一张图' },
  { key: 'inclusive', label: '碳普惠一张图' },
  { key: 'pilot', label: '试点示范一张图' },
]

interface HeaderProps {
  activeKey: NavKey
  onNavigate: (key: NavKey) => void
  onEnterSystem?: () => void
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`header-nav-item ${active ? 'active' : ''}`}
      onClick={onClick}
      type="button"
    >
      <span className="header-nav-item-text">{item.label}</span>
    </button>
  )
}

export default function Header({ activeKey, onNavigate, onEnterSystem }: HeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="header-bg" />
      <div className="header-content">
        <nav className="header-nav header-nav-left">
          {LEFT_NAV.map((item) => (
            <NavButton
              key={item.key}
              item={item}
              active={activeKey === item.key}
              onClick={() => onNavigate(item.key)}
            />
          ))}
        </nav>

        <div className="header-title-wrap">
          <div className="header-title-glow" />
          <h1 className="header-title">陕西省碳排放大数据管理平台</h1>
          <div className="header-title-line" />
        </div>

        <nav className="header-nav header-nav-right">
          {RIGHT_NAV.map((item) => (
            <NavButton
              key={item.key}
              item={item}
              active={activeKey === item.key}
              onClick={() => onNavigate(item.key)}
            />
          ))}
          <button className="header-enter-btn" type="button" onClick={onEnterSystem}>
            进入系统
          </button>
        </nav>
      </div>

      <style>{`
        .dashboard-header {
          position: relative;
          height: 80px;
          flex-shrink: 0;
          z-index: 100;
        }

        .header-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 40, 80, 0.9) 0%,
            rgba(2, 11, 26, 0.6) 100%
          );
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        }

        .header-bg::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--accent-cyan),
            transparent
          );
        }

        .header-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 24px;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }

        .header-nav-right {
          justify-content: flex-end;
        }

        .header-nav-item {
          padding: 10px 16px;
          font-size: 16px;
          line-height: 1.4;
          color: var(--text-secondary);
          position: relative;
          transition: color 0.3s;
          white-space: nowrap;
        }

        .header-nav-item:hover,
        .header-nav-item.active {
          color: var(--accent-cyan);
        }

        .header-nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          background: var(--accent-cyan);
          box-shadow: 0 0 8px var(--accent-cyan);
        }

        .header-title-wrap {
          position: relative;
          text-align: center;
          flex-shrink: 0;
          padding: 0 20px;
        }

        .header-title-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 60px;
          background: radial-gradient(
            ellipse,
            rgba(0, 212, 255, 0.15) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .header-title {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 4px;
          line-height: 1.35;
          background: linear-gradient(
            180deg,
            #ffffff 0%,
            var(--accent-cyan) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          filter: drop-shadow(0 0 12px rgba(0, 212, 255, 0.4));
        }

        .header-title-line {
          width: 200px;
          height: 2px;
          margin: 4px auto 0;
          background: linear-gradient(
            90deg,
            transparent,
            var(--accent-cyan),
            transparent
          );
        }

        .header-enter-btn {
          margin-left: 16px;
          padding: 10px 22px;
          font-size: 16px;
          line-height: 1.4;
          color: var(--accent-cyan);
          border: 1px solid var(--accent-cyan-dim);
          border-radius: 2px;
          background: rgba(0, 212, 255, 0.08);
          transition: all 0.3s;
          white-space: nowrap;
        }

        .header-enter-btn:hover {
          background: rgba(0, 212, 255, 0.2);
          box-shadow: 0 0 12px rgba(0, 212, 255, 0.3);
        }
      `}</style>
    </header>
  )
}
