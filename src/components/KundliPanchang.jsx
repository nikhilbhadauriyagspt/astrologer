import React, { useState } from 'react'
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  User,
  Sun,
  Sunset,
  Sparkles,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react'

const PANCHANG_ITEMS = [
  {
    label: 'Tithi (तिथि)',
    value: 'Shukla Paksha Saptami',
    sub: 'Upto 08:42 PM',
    tag: 'Shubh',
    tagStyle: 'bg-amber-100 text-[#6C2E09]',
  },
  {
    label: 'Nakshatra (नक्षत्र)',
    value: 'Pushya Nakshatra',
    sub: 'Most Auspicious Yoga',
    tag: 'Siddha',
    tagStyle: 'bg-orange-100 text-[#D9530F]',
  },
  {
    label: 'Abhijit Muhurat (अभिजीत मुहूर्त)',
    value: '11:43 AM – 12:29 PM',
    sub: 'Best time for new beginnings',
    tag: 'Auspicious',
    tagStyle: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  {
    label: 'Rahu Kaal (राहु काल)',
    value: '01:30 PM – 03:00 PM',
    sub: 'Avoid starting important work',
    tag: 'Avoid',
    tagStyle: 'bg-rose-50 text-rose-700 border border-rose-200',
  },
]

export default function KundliPanchang({ onOpenKundliReport }) {
  const [activeTab, setActiveTab] = useState('kundli')

  const handleOpenReport = () => {
    if (onOpenKundliReport) {
      onOpenKundliReport(activeTab)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="kundli"
      className="w-full py-12 lg:py-16 bg-[#FFF9F2] border-t border-amber-900/10"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Clean Section Heading */}
        <div className="mb-8 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60">
            <Compass className="w-3.5 h-3.5 text-[#D9530F]" />
            <span className="font-serif text-xs font-bold text-[#6C2E09]">
              कुंडली एवं पंचांग • FREE VEDIC TOOLS
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1408] ">
            Free <span className="text-[#D9530F]">Janam Kundli</span> & Today’s Panchang
          </h2>
          <p className="text-sm sm:text-base text-[#7C5841]">
            Generate your instant Vedic birth chart, 36 Gun Milan, and check today’s auspicious timings.
          </p>
        </div>

        {/* Light 2-Card Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* CARD 1 (7 Cols): Simple Free Kundli & Kundli Matching Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Card Top Header + 2 Clean Pill Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-amber-900/10">
                <div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2C1408]">
                    {activeTab === 'kundli'
                      ? 'Instant Free Janam Kundli'
                      : 'Kundli Matching (36 Gun Milan)'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7C5841] mt-0.5">
                    {activeTab === 'kundli'
                      ? 'Enter birth details for Lagna chart, planetary degrees & Dasha.'
                      : 'Check Ashtakoot compatibility, Nadi & Mangal Dosh between partners.'}
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="inline-flex items-center bg-[#FFF7ED] p-1 rounded-xl border border-orange-200/80">
                  <button
                    type="button"
                    onClick={() => setActiveTab('kundli')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'kundli'
                        ? 'bg-[#D9530F] text-white'
                        : 'text-[#5C3D28] hover:text-[#D9530F]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Free Kundli</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('matching')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'matching'
                        ? 'bg-[#D9530F] text-white'
                        : 'text-[#5C3D28] hover:text-[#D9530F]'
                    }`}
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Gun Milan</span>
                  </button>
                </div>
              </div>

              {/* Clean Form Inputs */}
              {activeTab === 'kundli' ? (
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#3B2314] mb-1.5">
                      Full Name (आपका नाम)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7C5841] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] placeholder:text-[#7C5841]/60 focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2314] mb-1.5">
                      Birth Place (जन्म स्थान / शहर)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#7C5841] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. New Delhi, Varanasi, Jaipur"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] placeholder:text-[#7C5841]/60 focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2314] mb-1.5">
                      Date of Birth (जन्म तिथि)
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#7C5841] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2314] mb-1.5">
                      Time of Birth (जन्म समय)
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-[#7C5841] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="time"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                  </div>
                </form>
              ) : (
                /* Clean Compact Boy & Girl Kundli Matching Inputs */
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {/* Boy Column */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-900/10 space-y-3">
                    <div className="text-xs font-extrabold text-[#D9530F] uppercase tracking-wider">
                      Boy’s Details (वर का विवरण)
                    </div>
                    <input
                      type="text"
                      placeholder="Boy's Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                      <input
                        type="time"
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Birth City"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                    />
                  </div>

                  {/* Girl Column */}
                  <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-900/10 space-y-3">
                    <div className="text-xs font-extrabold text-[#D9530F] uppercase tracking-wider">
                      Girl’s Details (वधू का विवरण)
                    </div>
                    <input
                      type="text"
                      placeholder="Girl's Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                      <input
                        type="time"
                        className="w-full px-2.5 py-2 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Birth City"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Submit Row */}
            <div className="mt-6 pt-5 border-t border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-xs text-[#7C5841]">
                ✦ 100% Free Vedic Report based on Lahiri Ayanamsa
              </span>

              <button
                type="button"
                onClick={handleOpenReport}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#B45309] hover:from-[#C2410C] hover:to-[#92400E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>
                  {activeTab === 'kundli'
                    ? 'Generate Free Janam Kundli'
                    : 'Check 36 Gun Milan Score'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CARD 2 (5 Cols): Clean Today's Shubh Panchang Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Top Panchang Header */}
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-amber-900/10">
                <div>
                  <span className="font-serif text-xs font-bold text-[#D9530F]">
                    आज का शुभ पंचांग
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2C1408]">
                    Today’s Panchang
                  </h3>
                </div>

                {/* Sunrise / Sunset Pill */}
                <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#FFF7ED] border border-orange-200/80 text-xs font-bold text-[#5C3D28]">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-[#D9530F]" />
                    06:18 AM
                  </span>
                  <span className="text-orange-300">|</span>
                  <span className="flex items-center gap-1">
                    <Sunset className="w-3.5 h-3.5 text-amber-700" />
                    05:54 PM
                  </span>
                </div>
              </div>

              {/* 4 Clean Panchang Rows */}
              <div className="mt-4 divide-y divide-amber-900/10">
                {PANCHANG_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#7C5841]">{item.label}</div>
                      <div className="text-sm sm:text-[15px] font-extrabold text-[#2C1408] mt-0.5">
                        {item.value}
                      </div>
                      <div className="text-[11px] text-[#9A7B65]">{item.sub}</div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${item.tagStyle}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Choghadiya Link */}
            <div className="mt-4 pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs">
              <span className="text-[#7C5841]">Kashi Vishwanath Panchang Standard</span>
              <a
                href="#panchang"
                className="font-bold text-[#D9530F] hover:underline flex items-center gap-1"
              >
                <span>View Full Choghadiya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
