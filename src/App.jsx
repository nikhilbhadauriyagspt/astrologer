import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TopAstrologers from './components/TopAstrologers'
import DailyHoroscope from './components/DailyHoroscope'
import KundliPanchang from './components/KundliPanchang'
import PoojaAstroMall from './components/PoojaAstroMall'
import ReviewsFaq from './components/ReviewsFaq'
import Footer from './components/Footer'
import AstrologerDetail from './pages/AstrologerDetail'
import KundliReportDetail from './pages/KundliReportDetail'
import RemedyDetail from './pages/RemedyDetail'
import ConsultationRoom from './pages/ConsultationRoom'
import AstrologerJoin from './pages/AstrologerJoin'
import AdminPortal from './admin/AdminPortal'
import { ASTROLOGERS } from './data/astrologyData'

function isSuperAdminRoute() {
  const path = window.location.pathname.toLowerCase()
  const hash = window.location.hash.toLowerCase()
  return path.startsWith('/admin') || hash.startsWith('#/admin')
}

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(isSuperAdminRoute)

  // Public site state: 'home' | 'astrologer-detail' | 'kundli-detail' | 'remedy-detail' | 'consultation' | 'astrologer-join'
  const [activePage, setActivePage] = useState('home')
  const [selectedAstrologer, setSelectedAstrologer] = useState(ASTROLOGERS[0])
  const [consultationMode, setConsultationMode] = useState('chat')
  const [kundliMode, setKundliMode] = useState('kundli')
  const [selectedRemedy, setSelectedRemedy] = useState(null)

  useEffect(() => {
    const syncRoute = () => setIsAdminRoute(isSuperAdminRoute())
    window.addEventListener('popstate', syncRoute)
    window.addEventListener('hashchange', syncRoute)
    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('hashchange', syncRoute)
    }
  }, [])

  // Standalone Super Admin Portal at /admin (No public website Header or Footer)
  if (isAdminRoute) {
    return <AdminPortal />
  }

  const goHome = () => {
    setActivePage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openAstrologerDetail = (astro) => {
    setSelectedAstrologer(astro || ASTROLOGERS[0])
    setActivePage('astrologer-detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startConsultation = (astro, mode = 'chat') => {
    setSelectedAstrologer(astro || ASTROLOGERS[0])
    setConsultationMode(mode)
    setActivePage('consultation')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openKundliDetail = (mode = 'kundli') => {
    setKundliMode(mode)
    setActivePage('kundli-detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openRemedyDetail = (item) => {
    setSelectedRemedy(item)
    setActivePage('remedy-detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openAstrologerJoin = () => {
    setActivePage('astrologer-join')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1610]">
      <Header
        onGoHome={goHome}
        onOpenKundli={openKundliDetail}
        onOpenAstrologer={() => startConsultation(ASTROLOGERS[0], 'chat')}
      />

      {activePage === 'home' && (
        <main>
          <Hero />
          <TopAstrologers
            onSelectAstrologer={openAstrologerDetail}
            onStartConsultation={startConsultation}
            onOpenAstrologerJoin={openAstrologerJoin}
          />
          <DailyHoroscope />
          <KundliPanchang onOpenKundliReport={openKundliDetail} />
          <PoojaAstroMall onSelectRemedy={openRemedyDetail} />
          <ReviewsFaq />
        </main>
      )}

      {activePage === 'astrologer-join' && (
        <main>
          <AstrologerJoin onBack={goHome} />
        </main>
      )}

      {activePage === 'astrologer-detail' && (
        <main>
          <AstrologerDetail
            astrologer={selectedAstrologer}
            onBack={goHome}
            onSelectAstrologer={openAstrologerDetail}
            onStartConsultation={startConsultation}
          />
        </main>
      )}

      {activePage === 'consultation' && (
        <main>
          <ConsultationRoom
            astrologer={selectedAstrologer}
            initialMode={consultationMode}
            onBack={() => openAstrologerDetail(selectedAstrologer)}
          />
        </main>
      )}

      {activePage === 'kundli-detail' && (
        <main>
          <KundliReportDetail
            initialMode={kundliMode}
            onBack={goHome}
            onTalkToAcharya={() => startConsultation(ASTROLOGERS[0], 'chat')}
          />
        </main>
      )}

      {activePage === 'remedy-detail' && (
        <main>
          <RemedyDetail
            item={selectedRemedy}
            onBack={goHome}
            onSelectItem={openRemedyDetail}
          />
        </main>
      )}

      <Footer onOpenAstrologerJoin={openAstrologerJoin} />
    </div>
  )
}

export default App
