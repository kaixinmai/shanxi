import { useEffect, useRef, useState } from 'react'

export default function TipMark({
  text,
  title,
  lines,
  placement = 'auto',
}: {
  text?: string
  title?: string
  lines?: string[]
  placement?: 'auto' | 'bottom-end'
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const label = title ?? text ?? '说明'

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <span
      ref={rootRef}
      className={`ccer-tip-wrap${open ? ' is-open' : ''}${placement === 'bottom-end' ? ' ccer-tip-bottom-end' : ''}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="ccer-tip"
        aria-label={label}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
      >
        !
      </button>
      {open && (
        <span className="ccer-tip-bubble" role="tooltip">
          {lines ? (
            <>
              {title ? <div className="ccer-tip-bubble-title">{title}</div> : null}
              <ol className="ccer-tip-bubble-list">
                {lines.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </>
          ) : (
            text
          )}
        </span>
      )}
    </span>
  )
}
