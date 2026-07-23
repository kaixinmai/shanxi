import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ScreenAdapter from './components/ScreenAdapter'
import Header, { type NavKey } from './components/Header'
import HomePage from './pages/HomePage'
import GhgPage from './pages/GhgPage'
import SynergyPage from './pages/SynergyPage'
import EnterprisePage from './pages/EnterprisePage'
import CcerPage from './pages/CcerPage'
import InclusivePage from './pages/InclusivePage'
import PilotPage from './pages/PilotPage'
import AdminApp from './admin/AdminApp'

const PAGE_MAP: Record<NavKey, React.ComponentType> = {
  home: HomePage,
  ghg: GhgPage,
  synergy: SynergyPage,
  enterprise: EnterprisePage,
  ccer: CcerPage,
  inclusive: InclusivePage,
  pilot: PilotPage,
}

export default function App() {
  const [mode, setMode] = useState<'dashboard' | 'admin'>('dashboard')
  const [activeKey, setActiveKey] = useState<NavKey>('home')
  const ActivePage = PAGE_MAP[activeKey]

  if (mode === 'admin') {
    return <AdminApp onBackHome={() => setMode('dashboard')} />
  }

  return (
    <ScreenAdapter>
      <div className="app-layout">
        <Header
          activeKey={activeKey}
          onNavigate={setActiveKey}
          onEnterSystem={() => setMode('admin')}
        />
        <div className="app-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              className="page-container"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <ActivePage />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ScreenAdapter>
  )
}
