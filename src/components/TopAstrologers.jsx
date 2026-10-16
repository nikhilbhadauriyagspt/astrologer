import React, { useState, useEffect } from 'react'
import {
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  Star,
  Search,
  Sparkles,
  Languages,
  Award,
  ArrowRight,
  UserPlus,
} from 'lucide-react'
import { ASTROLOGERS } from '../data/astrologyData'
import { fetchApprovedAstrologersRequest } from '../admin/adminApi'

const CATEGORIES = [
  { id: 'all', label: 'All Acharyas', count: 148 },
  { id: 'marriage', label: 'Love & Marriage', icon: '💍' },
  { id: 'career', label: 'Career & Job', icon: '💼' },
  { id: 'vedic', label: 'Vedic Jyotish', icon: '🕉️' },
  { id: 'tarot', label: 'Tarot Reading', icon: '🃏' },
  { id: 'numerology', label: 'Numerology', icon: '🔢' },
  { id: 'vastu', label: 'Vastu Shastra', icon: '🏠' },
]

export default function TopAstrologers({
  onSelectAstrologer,
  onStartConsultation,
  onOpenAstrologerJoin,
}) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [onlineOnly, setOnlineOnly] = useState(false)
  const [allAstrologers, setAllAstrologers] = useState(ASTROLOGERS)

  useEffect(() => {
    fetchApprovedAstrologersRequest()
      .then((data) => {
        if (!data.astrologers || !Array.isArray(data.astrologers)) return
        const existingNames = new Set(
          ASTROLOGERS.map((a) => a.name.toLowerCase())
        )
        const newlyApproved = data.astrologers
          .filter((dbAstro) => !existingNames.has(dbAstro.name.toLowerCase()))
          .map((dbAstro) => ({
            id: `db-${dbAstro.id}`,
            name: dbAstro.name,
            hindiName: dbAstro.city || 'काशी ज्योतिषाचार्य',
            title: dbAstro.qualification || 'Verified Vedic Acharya',
            avatar:
              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
            skills: dbAstro.specialty
              ? dbAstro.specialty.split(',').map((s) => s.trim())
              : ['Vedic Jyotish', 'Kundli Reading'],
            categories: ['all', 'vedic', 'marriage', 'career'],
            languages: dbAstro.languages || 'Hindi, English',
            experience: `${dbAstro.experience_years || 10} Years`,
            rating: Number(dbAstro.rating) || 4.9,
            reviews: 'New Verified',
            orders: `${dbAstro.total_orders || 120}+`,
            price: Number(dbAstro.rate_per_min) || 30,
            oldPrice: (Number(dbAstro.rate_per_min) || 30) + 12,
            status:
              (dbAstro.status || 'ONLINE').toLowerCase() === 'online'
                ? 'online'
                : 'busy',
            waitTime: 'Instant',
            badge: 'Admin Verified',
            bio: dbAstro.bio,
          }))

        if (newlyApproved.length > 0) {
          setAllAstrologers([...newlyApproved, ...ASTROLOGERS])
        }
      })
      .catch(() => {})
  }, [])

  const filteredAstrologers = allAstrologers.filter((astro) => {
    const matchesCategory =
      activeCategory === 'all' || astro.categories.includes(activeCategory)
    const matchesSearch =
      astro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astro.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      astro.languages.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOnline = !onlineOnly || astro.status === 'online'
    return matchesCategory && matchesSearch && matchesOnline
  })

  const handleOpenProfile = (astro) => {
    if (onSelectAstrologer) {
      onSelectAstrologer(astro)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleStartSession = (astro, mode) => {
    if (onStartConsultation) {
      onStartConsultation(astro, mode)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section id="chat" className="w-full py-12 lg:py-16 bg-[#FFFDF9] border-t border-amber-900/10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Section Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-amber-900/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60">
              <Sparkles className="w-3.5 h-3.5 text-[#D9530F]" />
              <span className="font-serif text-xs sm:text-sm font-bold text-[#6C2E09]">
                LIVE JYOTISH CONSULTATION • हमारे अनुभवी ज्योतिषाचार्य
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1408] tracking-tight">
              Chat & Talk with{' '}
              <span className="text-[#D9530F]">Verified Acharyas</span>
            </h2>
            <p className="text-sm sm:text-base text-[#7C5841] max-w-2xl">
              Click on any Acharya card to view their complete Vedic profile, reviews & start a live consultation.
            </p>
          </div>

          {/* Right Search + Online Toggle */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-[#7C5841] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Acharya, Vedic, Tarot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-amber-900/15 text-sm text-[#2C1408] placeholder:text-[#7C5841]/65 focus:outline-none focus:border-[#D9530F]"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlineOnly(!onlineOnly)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                onlineOnly
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  : 'bg-white border-amber-900/15 text-[#3B2314] hover:border-[#D9530F]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  onlineOnly ? 'bg-emerald-600' : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span>Online Now</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills Row */}
        <div className="py-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap border ${
                  active
                    ? 'bg-[#2C1408] text-amber-200 border-[#2C1408]'
                    : 'bg-white text-[#3B2314] border-amber-900/12 hover:border-[#D9530F] hover:bg-amber-50/50'
                }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                <span>{cat.label}</span>
                {cat.count && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active
                        ? 'bg-amber-400/20 text-amber-200'
                        : 'bg-amber-100 text-[#6C2E09]'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Astrologers 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredAstrologers.map((astro) => (
            <div
              key={astro.id}
              onClick={() => handleOpenProfile(astro)}
              className="group bg-white hover:bg-[#FFFBF5] rounded-2xl border border-amber-900/12 hover:border-[#D9530F]/50 transition-all p-5 flex flex-col justify-between cursor-pointer"
            >
              {/* Top Section: Avatar, Badge & Bio */}
              <div>
                {/* Top Status & Ribbon Row */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100/90 text-[#6C2E09] border border-amber-300/50">
                    {astro.badge}
                  </span>

                  {astro.status === 'online' ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      Busy ({astro.waitTime})
                    </span>
                  )}
                </div>

                {/* Profile Avatar + Name + Rating */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={astro.image}
                      alt={astro.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/60"
                    />
                    <div className="mt-1.5 flex items-center justify-center gap-0.5 bg-[#FFF9F0] border border-amber-300/60 rounded-md px-1.5 py-0.5 text-[11px] font-extrabold text-[#2C1408]">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{astro.rating}</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="text-base font-extrabold text-[#2C1408] group-hover:text-[#D9530F] transition-colors truncate">
                        {astro.name}
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>

                    <p className="font-serif text-xs font-semibold text-[#7C5841] truncate">
                      {astro.title}
                    </p>

                    <div className="mt-2 space-y-1 text-xs text-[#5C3D28]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Award className="w-3.5 h-3.5 text-[#D9530F] shrink-0" />
                        <span className="font-semibold">{astro.exp} Exp</span>
                        <span className="text-[#7C5841]">• {astro.reviews} orders</span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <Languages className="w-3.5 h-3.5 text-[#7C5841] shrink-0" />
                        <span className="truncate">{astro.languages}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {astro.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-lg bg-[#FFF7ED] border border-orange-200/70 text-[11px] font-semibold text-[#9A3412]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Divider + Price + Dual Action Buttons */}
              <div className="mt-4 pt-3.5 border-t border-amber-900/10 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] text-stone-400 line-through">
                    {astro.originalPrice}
                  </div>
                  <div
                    className={`text-sm font-extrabold ${
                      astro.isFree ? 'text-emerald-700' : 'text-[#2C1408]'
                    }`}
                  >
                    {astro.price}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartSession(astro, 'audio')
                    }}
                    className="px-3 py-2 rounded-xl bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#9A3412] border border-[#FDBA74] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartSession(astro, 'chat')
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#B45309] hover:from-[#C2410C] hover:to-[#92400E] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom View All + Join as Astrologer CTA */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenProfile(allAstrologers[0])}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FFF7ED] text-[#2C1408] border border-amber-900/20 hover:border-[#D9530F] font-semibold text-sm transition-all cursor-pointer"
          >
            <span>View All 148+ Verified Online Acharyas</span>
            <ArrowRight className="w-4 h-4 text-[#D9530F]" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenAstrologerJoin) {
                onOpenAstrologerJoin()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFF9F2] hover:bg-orange-50 text-[#D9530F] border border-orange-200/80 font-semibold text-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join as Verified Astrologer</span>
          </button>
        </div>
      </div>
    </section>
  )
}
