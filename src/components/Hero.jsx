import React, { useState } from 'react'
import {
  MessageCircle,
  PhoneCall,
  Sparkles,
  Flame,
  ShoppingBag,
  ArrowUpRight,
  Star,
  CheckCircle2,
  Compass,
} from 'lucide-react'
import ZodiacIcon from './ZodiacIcon'

const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Aries', hi: 'मेष', element: 'Fire • Mangal', lucky: 'Lucky No. 9' },
  { id: 'taurus', name: 'Taurus', hi: 'वृषभ', element: 'Earth • Shukra', lucky: 'Lucky No. 6' },
  { id: 'gemini', name: 'Gemini', hi: 'मिथुन', element: 'Air • Budh', lucky: 'Lucky No. 5' },
  { id: 'cancer', name: 'Cancer', hi: 'कर्क', element: 'Water • Chandra', lucky: 'Lucky No. 2' },
  { id: 'leo', name: 'Leo', hi: 'सिंह', element: 'Fire • Surya', lucky: 'Lucky No. 1' },
  { id: 'virgo', name: 'Virgo', hi: 'कन्या', element: 'Earth • Budh', lucky: 'Lucky No. 5' },
  { id: 'libra', name: 'Libra', hi: 'तुला', element: 'Air • Shukra', lucky: 'Lucky No. 6' },
  { id: 'scorpio', name: 'Scorpio', hi: 'वृश्चिक', element: 'Water • Mangal', lucky: 'Lucky No. 9' },
  { id: 'sagittarius', name: 'Sagittarius', hi: 'धनु', element: 'Fire • Guru', lucky: 'Lucky No. 3' },
  { id: 'capricorn', name: 'Capricorn', hi: 'मकर', element: 'Earth • Shani', lucky: 'Lucky No. 8' },
  { id: 'aquarius', name: 'Aquarius', hi: 'कुंभ', element: 'Air • Shani', lucky: 'Lucky No. 8' },
  { id: 'pisces', name: 'Pisces', hi: 'मीन', element: 'Water • Guru', lucky: 'Lucky No. 3' },
]

const HERO_ACTION_CARDS = [
  {
    title: 'Chat with Astrologer',
    hi: 'ज्योतिषी से चैट करें',
    tag: 'First Chat FREE',
    tagBg: 'bg-emerald-600 text-white',
    icon: MessageCircle,
    gradient: 'from-[#FF6B00] to-[#D9530F]',
    lightBg: 'bg-orange-50/80 group-hover:bg-orange-100/80',
  },
  {
    title: 'Talk to Astrologer',
    hi: 'ज्योतिषी से बात करें',
    tag: 'Instant Call',
    tagBg: 'bg-[#2C1408] text-amber-200',
    icon: PhoneCall,
    gradient: 'from-[#D97706] to-[#B45309]',
    lightBg: 'bg-amber-50/80 group-hover:bg-amber-100/80',
  },
  {
    title: 'Book Online Pooja',
    hi: 'ऑनलाइन पूजा बुक करें',
    tag: 'Live Sankalp',
    tagBg: 'bg-red-700 text-white',
    icon: Flame,
    gradient: 'from-[#DC2626] to-[#B91C1C]',
    lightBg: 'bg-red-50/70 group-hover:bg-red-100/70',
  },
  {
    title: 'AstroMall Shop',
    hi: 'रत्न एवं रुद्राक्ष स्टोर',
    tag: 'Lab Certified',
    tagBg: 'bg-amber-700 text-white',
    icon: ShoppingBag,
    gradient: 'from-[#B45309] to-[#78350F]',
    lightBg: 'bg-stone-100/80 group-hover:bg-amber-50',
  },
]

export default function Hero() {
  const [activeRashi, setActiveRashi] = useState(ZODIAC_SIGNS[4]) // Default Leo (Simha)

  return (
    <section className="relative w-full overflow-hidden bg-[#FFFDF9]">
      {/* Warm Royal Banner Container */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 pt-6 pb-12">
        {/* Main Hero Visual Banner Card */}
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#2A1205] via-[#3D1A08] to-[#1E0C03] text-[#FFFDF9] border border-amber-500/20">
          {/* Subtle Ambient Glows inside Banner */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-10 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl" />

          {/* Subtle Sacred Dot Pattern Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, #F59E0B 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            {/* LEFT SIDE: Crisp Editorial Typography + Primary CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Sacred Gold Top Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-serif text-sm sm:text-base font-semibold tracking-wide text-amber-200">
                  ॥ ॐ सूर्याय नमः • वैदिक ज्योतिष परामर्श ॥
                </span>
              </div>

              {/* Majestic Headline */}
              <div className="space-y-4">
                <h1 className="font-display text-3xl sm:text-5xl xl:text-[56px] font-bold  text-white leading-[1.12]">
                  Discover What Your{' '}
                  <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                    Stars & Planets
                  </span>{' '}
                  Hold For You
                </h1>

                <p className="text-sm sm:text-base xl:text-lg text-[#FDEBD0]/80 max-w-xl leading-relaxed font-normal">
                  Talk or chat privately with India’s most revered Vedic Jyotishacharyas, Tarot Readers & Numerologists. Get accurate Kundli predictions and instant remedies.
                </p>
              </div>

              {/* Dual High-Contrast Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#chat"
                  className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#EA580C] to-[#D9530F] hover:from-[#EA580C] hover:to-[#B45309] text-white font-bold text-sm sm:text-base transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat with Astrologer</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase bg-amber-200 text-[#2A1205] rounded-full">
                    First Free
                  </span>
                </a>

                <a
                  href="#talk"
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 text-amber-100 border border-amber-400/30 font-bold text-sm sm:text-base transition-all"
                >
                  <PhoneCall className="w-5 h-5 text-amber-400" />
                  <span>Talk on Call</span>
                </a>
              </div>

              {/* Clean Minimal Live Avatars Line */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80"
                    alt="Acharya"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#2A1205]"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80"
                    alt="Astrologer"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#2A1205]"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="Pandit"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#2A1205]"
                  />
                </div>
                <div className="text-xs sm:text-sm text-[#FDEBD0]/85 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    <strong className="text-amber-300">148+ Verified Acharyas</strong> online right now for instant guidance
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Interactive Sacred Golden Rashi Chakra Wheel (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] flex items-center justify-center">
                {/* Outer Rotating Sacred Ring */}
                <svg
                  className="absolute inset-0 w-full h-full text-amber-400/25 animate-[spin_60s_linear_infinite]"
                  viewBox="0 0 360 360"
                  fill="none"
                >
                  <circle
                    cx="180"
                    cy="180"
                    r="174"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="138"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <circle
                    cx="180"
                    cy="180"
                    r="95"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                  />
                </svg>

                {/* 12 Interactive Zodiac Orbs Arranged in a Circle */}
                {ZODIAC_SIGNS.map((sign, index) => {
                  const angleDeg = index * 30 - 90
                  const angleRad = (angleDeg * Math.PI) / 180
                  const radius = 42 // percentage from center
                  const left = 50 + radius * Math.cos(angleRad)
                  const top = 50 + radius * Math.sin(angleRad)
                  const isSelected = activeRashi.name === sign.name

                  return (
                    <button
                      key={sign.name}
                      type="button"
                      onClick={() => setActiveRashi(sign)}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      className={`-translate-x-1/2 -translate-y-1/2 absolute w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 text-[#2A1205] scale-110 border-2 border-white z-20'
                          : 'bg-[#3D1A08]/90 hover:bg-amber-500/25 text-amber-200 border border-amber-400/30 hover:border-amber-300'
                      }`}
                      title={`${sign.name} (${sign.hi})`}
                    >
                      <ZodiacIcon id={sign.id} className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-[8px] font-bold  mt-0.5">
                        {sign.hi}
                      </span>
                    </button>
                  )
                })}

                {/* Center Sacred Surya / Active Rashi Hub */}
                <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-[#3D1A08] to-[#220D03] border border-amber-400/45 flex flex-col items-center justify-center text-center p-3">
                  <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-400/35 flex items-center justify-center text-amber-300">
                    <ZodiacIcon id={activeRashi.id} className="w-5 h-5" />
                  </div>
                  <div className="font-display text-sm sm:text-base font-bold text-white mt-1">
                    {activeRashi.name} ({activeRashi.hi})
                  </div>
                  <div className="text-[11px] text-amber-300/90 mt-0.5">
                    {activeRashi.element}
                  </div>
                  <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/35 text-[10px] font-bold text-amber-200">
                    {activeRashi.lucky}
                  </span>
                </div>
              </div>

              <p className="text-xs text-amber-200/70 mt-2 font-serif tracking-wide">
                ✦ Click any Rashi on the Chakra to view today’s planetary alignment ✦
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM 4-CARD SIGNATURE ACTION DOCK (Clean Border Style, No Heavy Shadows) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HERO_ACTION_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <a
                key={card.title}
                href="#action"
                className="group relative bg-white hover:bg-[#FFF9F2] rounded-2xl p-5 border border-amber-900/12 hover:border-[#D9530F]/50 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${card.tagBg}`}
                    >
                      {card.tag}
                    </span>
                    <h3 className="text-base font-extrabold text-[#2C1408] group-hover:text-[#D9530F] transition-colors truncate">
                      {card.title}
                    </h3>
                    <p className="font-serif text-xs font-semibold text-[#7C5841] truncate">
                      {card.hi}
                    </p>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-amber-50 group-hover:bg-[#D9530F] text-[#7C5841] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
