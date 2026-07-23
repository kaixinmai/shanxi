import { useEffect, useState, type ReactNode } from 'react'

const DESIGN_WIDTH = 1920
const DESIGN_HEIGHT = 1080

interface ScreenAdapterProps {
  children: ReactNode
}

export default function ScreenAdapter({ children }: ScreenAdapterProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / DESIGN_WIDTH
      const scaleY = window.innerHeight / DESIGN_HEIGHT
      setScale(Math.min(scaleX, scaleY))
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div className="screen-adapter-wrapper">
      <div
        className="screen-adapter-content"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
