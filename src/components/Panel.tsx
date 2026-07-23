import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  extra?: ReactNode
}

export default function Panel({
  title,
  children,
  className = '',
  style,
  extra,
}: PanelProps) {
  return (
    <div className={`panel ${className}`} style={style}>
      <div className="panel-corner panel-corner-tl" />
      <div className="panel-corner panel-corner-tr" />
      <div className="panel-corner panel-corner-bl" />
      <div className="panel-corner panel-corner-br" />

      <div className="panel-header">
        <div className="panel-header-accent" />
        <h3 className="panel-title">{title}</h3>
        {extra && <div className="panel-header-extra">{extra}</div>}
      </div>

      <div className="panel-body">{children}</div>

      <style>{`
        .panel {
          position: relative;
          background: var(--bg-panel);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          z-index: 2;
        }

        .panel-corner-tl {
          top: -1px;
          left: -1px;
          border-top: 2px solid var(--accent-cyan);
          border-left: 2px solid var(--accent-cyan);
        }

        .panel-corner-tr {
          top: -1px;
          right: -1px;
          border-top: 2px solid var(--accent-cyan);
          border-right: 2px solid var(--accent-cyan);
        }

        .panel-corner-bl {
          bottom: -1px;
          left: -1px;
          border-bottom: 2px solid var(--accent-cyan);
          border-left: 2px solid var(--accent-cyan);
        }

        .panel-corner-br {
          bottom: -1px;
          right: -1px;
          border-bottom: 2px solid var(--accent-cyan);
          border-right: 2px solid var(--accent-cyan);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: var(--bg-panel-header);
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .panel-header-accent {
          width: 3px;
          height: 18px;
          background: var(--accent-cyan);
          box-shadow: 0 0 6px var(--accent-cyan);
          flex-shrink: 0;
        }

        .panel-header-extra {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .panel-title {
          font-size: 20px;
          font-weight: 500;
          color: var(--text-primary);
          letter-spacing: 1px;
          line-height: 1.35;
          white-space: nowrap;
        }

        .panel-body {
          flex: 1;
          padding: 14px 16px;
          overflow-x: hidden;
          overflow-y: auto;
          min-height: 0;
          font-size: 16px;
          line-height: 1.7;
        }
      `}</style>
    </div>
  )
}
