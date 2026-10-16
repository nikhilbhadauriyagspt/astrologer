import React, { useState } from 'react'
import {
  ArrowLeft,
  Compass,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Flame,
  MessageCircle,
  Download,
} from 'lucide-react'

const PLANET_TABLE = [
  { planet: 'Surya (Sun)', rashi: 'Leo (सिंह)', degree: '18° 24′', house: '5th House', nakshatra: 'Purva Phalguni', status: 'Own Sign (Swagrahi)' },
  { planet: 'Chandra (Moon)', rashi: 'Taurus (वृषभ)', degree: '11° 08′', house: '2nd House', nakshatra: 'Rohini (Pada 1)', status: 'Exalted (Uchcha)' },
  { planet: 'Mangal (Mars)', rashi: 'Aries (मेष)', degree: '06° 45′', house: '1st House', nakshatra: 'Ashwini', status: 'Ruchaka Rajyoga' },
  { planet: 'Budh (Mercury)', rashi: 'Virgo (कन्या)', degree: '21° 12′', house: '6th House', nakshatra: 'Hasta', status: 'Bhadra Mahapurusha' },
  { planet: 'Brihaspati (Jupiter)', rashi: 'Sagittarius (धनु)', degree: '14° 50′', house: '9th House', nakshatra: 'Purva Ashadha', status: 'Hamsa Rajyoga' },
  { planet: 'Shukra (Venus)', rashi: 'Libra (तुला)', degree: '09° 30′', house: '7th House', nakshatra: 'Swati', status: 'Malavya Rajyoga' },
  { planet: 'Shani (Saturn)', rashi: 'Aquarius (कुंभ)', degree: '24° 19′', house: '11th House', nakshatra: 'Purva Bhadrapada', status: 'Benefic Labha Bhava' },
  { planet: 'Rahu', rashi: 'Gemini (मिथुन)', degree: '15° 02′', house: '3rd House', nakshatra: 'Ardra', status: 'Parakram Yoga' },
  { planet: 'Ketu', rashi: 'Sagittarius (धनु)', degree: '15° 02′', house: '9th House', nakshatra: 'Purva Ashadha', status: 'Spiritual Moksha' },
]

const ASHTAKOOT_TABLE = [
  { koota: 'Varna (वर्ण)', area: 'Work & Spiritual Ego', max: 1, obtained: 1, result: 'Excellent Compatibility' },
  { koota: 'Vashya (वश्य)', area: 'Mutual Attraction', max: 2, obtained: 2, result: 'Strong Mutual Affection' },
  { koota: 'Tara (तारा)', area: 'Destiny & Longevity', max: 3, obtained: 2.5, result: 'Shubh Nakshatra Harmony' },
  { koota: 'Yoni (योनि)', area: 'Intimacy & Nature', max: 4, obtained: 3, result: 'Friendly Temperament' },
  { koota: 'Graha Maitri (ग्रह मैत्री)', area: 'Mental & Rashi Friendship', max: 5, obtained: 5, result: 'Friendly Rashi Lords' },
  { koota: 'Gana (गण)', area: 'Behavior & Values', max: 6, obtained: 6, result: 'Deva – Deva (Ideal Match)' },
  { koota: 'Bhakoot (भकूट)', area: 'Family Prosperity & Growth', max: 7, obtained: 7, result: 'Shubh Nav-Pancham Yoga' },
  { koota: 'Nadi (नाड़ी)', area: 'Health & Progeny (Santana)', max: 8, obtained: 8, result: 'No Nadi Dosh (Adi – Madhya)' },
]

function NorthIndianChartSVG({ title, subtitle, placements }) {
  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-amber-900/15 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display text-base font-bold text-[#2C1408]">{title}</h4>
          <p className="text-xs text-[#7C5841]">{subtitle}</p>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#6C2E09] text-[10px] font-bold">
          Lahiri Ayanamsa
        </span>
      </div>

      {/* Authentic North Indian Diamond Kundli SVG */}
      <div className="aspect-square w-full max-w-[300px] mx-auto bg-[#FFF9F0] rounded-xl border-2 border-[#D9530F]/60 p-2">
        <svg viewBox="0 0 240 240" className="w-full h-full text-[#2C1408]">
          {/* Outer Square */}
          <rect
            x="4"
            y="4"
            width="232"
            height="232"
            fill="none"
            stroke="#D9530F"
            strokeWidth="2"
          />
          {/* Diagonals */}
          <line x1="4" y1="4" x2="236" y2="236" stroke="#D9530F" strokeWidth="1.5" />
          <line x1="236" y1="4" x2="4" y2="236" stroke="#D9530F" strokeWidth="1.5" />
          {/* Inner Diamond */}
          <polygon
            points="120,4 236,120 120,236 4,120"
            fill="none"
            stroke="#D9530F"
            strokeWidth="1.5"
          />

          {/* House Numbers & Planet Labels */}
          <text x="120" y="75" textAnchor="middle" className="text-[11px] font-bold fill-[#9A3412]">
            1
          </text>
          <text x="120" y="55" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h1}
          </text>

          <text x="62" y="32" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h2}
          </text>

          <text x="28" y="68" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h3}
          </text>

          <text x="65" y="124" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h4}
          </text>

          <text x="28" y="182" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h5}
          </text>

          <text x="62" y="216" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h6}
          </text>

          <text x="120" y="188" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h7}
          </text>

          <text x="178" y="216" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h8}
          </text>

          <text x="208" y="182" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h9}
          </text>

          <text x="175" y="124" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h10}
          </text>

          <text x="208" y="68" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h11}
          </text>

          <text x="178" y="32" textAnchor="middle" className="text-[10px] font-bold fill-[#2C1408]">
            {placements.h12}
          </text>
        </svg>
      </div>
    </div>
  )
}

export default function KundliReportDetail({
  initialMode = 'kundli',
  onBack,
  onTalkToAcharya,
}) {
  const [mode, setMode] = useState(initialMode)

  return (
    <div className="w-full py-8 lg:py-10 bg-[#FFFDF9] min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 space-y-8">
        {/* Top Breadcrumb + Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-amber-900/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FFF7ED] border border-amber-900/15 text-xs sm:text-sm font-bold text-[#2C1408] hover:text-[#D9530F] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#D9530F]" />
              <span>Back to Home</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#7C5841]">
              <span>Home</span>
              <span>/</span>
              <span className="font-bold text-[#2C1408]">
                {mode === 'kundli'
                  ? 'Vedic Janam Kundli Report'
                  : '36 Gun Milan (Ashtakoot Report)'}
              </span>
            </div>
          </div>

          {/* Switch Between Kundli Report & 36 Gun Milan */}
          <div className="inline-flex items-center bg-[#FFF7ED] p-1 rounded-xl border border-orange-200/80">
            <button
              type="button"
              onClick={() => setMode('kundli')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'kundli'
                  ? 'bg-[#D9530F] text-white'
                  : 'text-[#5C3D28] hover:text-[#D9530F]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Janam Kundli Report</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('matching')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'matching'
                  ? 'bg-[#D9530F] text-white'
                  : 'text-[#5C3D28] hover:text-[#D9530F]'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>36 Gun Milan Report</span>
            </button>
          </div>
        </div>

        {mode === 'kundli' ? (
          /* ================= VIEW 1: COMPLETE JANAM KUNDLI REPORT ================= */
          <div className="space-y-7">
            {/* Native Summary Strip */}
            <div className="bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D9530F]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>वैदिक जन्म पत्रिका • VEDIC HOROSCOPE CHART</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1408]">
                  Aarav Sharma — Janam Kundli & Dasha
                </h1>
                <p className="text-xs sm:text-sm text-[#7C5841]">
                  DOB: 14 Aug 1997 • Time: 10:30 AM IST • Place: New Delhi (28.61° N, 77.20° E)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  ✓ 3 Active Rajyogas Found
                </span>
                <button
                  type="button"
                  onClick={onTalkToAcharya}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#B45309] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ask Acharya About Chart</span>
                </button>
              </div>
            </div>

            {/* 6 Quick Avakhada Chakra Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                { label: 'Lagna (Ascendant)', value: 'Mesh (Aries)' },
                { label: 'Janam Rashi (Moon)', value: 'Vrishabh (Taurus)' },
                { label: 'Nakshatra', value: 'Rohini (Pada 1)' },
                { label: 'Mahadasha', value: 'Guru (2022 – 2038)' },
                { label: 'Gana & Nadi', value: 'Deva • Antya Nadi' },
                { label: 'Manglik Status', value: 'Anshik (Cancelled)' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl border border-amber-900/12 p-4"
                >
                  <div className="text-[11px] font-semibold text-[#7C5841]">
                    {item.label}
                  </div>
                  <div className="text-sm font-extrabold text-[#2C1408] mt-1">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Kundli Charts (D1 Lagna + D9 Navamsha) + Dasha Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <NorthIndianChartSVG
                  title="Lagna Kundli (D1 Chart)"
                  subtitle="Main Birth Chart • Mesh Lagna"
                  placements={{
                    h1: 'Asc • Ma',
                    h2: 'Mo',
                    h3: 'Ra',
                    h4: '',
                    h5: 'Su',
                    h6: 'Me',
                    h7: 'Ve',
                    h8: '',
                    h9: 'Ju • Ke',
                    h10: '',
                    h11: 'Sa',
                    h12: '',
                  }}
                />
              </div>

              <div className="lg:col-span-4">
                <NorthIndianChartSVG
                  title="Navamsha Kundli (D9 Chart)"
                  subtitle="Marriage, Spouse & Destiny Strength"
                  placements={{
                    h1: 'Asc • Ju',
                    h2: '',
                    h3: 'Ve',
                    h4: 'Su',
                    h5: 'Ma',
                    h6: '',
                    h7: 'Mo',
                    h8: 'Sa',
                    h9: '',
                    h10: 'Me',
                    h11: 'Ra',
                    h12: 'Ke',
                  }}
                />
              </div>

              {/* Right 4 Cols: Mahadasha & Remedy Card */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-amber-900/12 p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div>
                    <span className="font-serif text-xs font-bold text-[#D9530F]">
                      विंशोत्तरी महादशा फल
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#2C1408]">
                      Active Dasha & Remedies
                    </h3>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-orange-200/80 space-y-1.5">
                    <div className="text-xs font-extrabold text-[#D9530F]">
                      Current: Brihaspati (Jupiter) Mahadasha
                    </div>
                    <p className="text-xs text-[#3B2314] leading-relaxed">
                      Jupiter in the 9th house (Bhagya Bhava) activates Hamsa Mahapurusha Yoga, bringing career elevation, marriage auspiciousness, and financial expansion between 2026 and 2028.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-900/10 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2C1408]">
                      <Flame className="w-4 h-4 text-[#D9530F]" />
                      <span>Recommended Vedic Remedy</span>
                    </div>
                    <p className="text-xs text-[#5C3D28] leading-relaxed">
                      Wear a 5.25 Ratti lab-certified Ceylon Yellow Sapphire (Pukhraj) in gold on the index finger on Thursday morning during Shukla Paksha.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onTalkToAcharya}
                  className="w-full py-3 px-4 rounded-xl bg-[#2C1408] hover:bg-[#D9530F] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Consult Acharya for Detailed Prediction →
                </button>
              </div>
            </div>

            {/* Clean Planetary Degrees (Graha Spashta) Table */}
            <div className="bg-white rounded-3xl border border-amber-900/12 overflow-hidden">
              <div className="px-6 py-5 border-b border-amber-900/10 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#2C1408]">
                    Planetary Positions (ग्रह स्पष्ट तालिका)
                  </h3>
                  <p className="text-xs text-[#7C5841]">
                    Exact sidereal longitudes, Nakshatra placements, and dignity
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FFF9F2] text-[#6C2E09] border-b border-amber-900/10">
                      <th className="py-3.5 px-5 font-bold">Planet (ग्रह)</th>
                      <th className="py-3.5 px-5 font-bold">Rashi (राशि)</th>
                      <th className="py-3.5 px-5 font-bold">Degree (अंश)</th>
                      <th className="py-3.5 px-5 font-bold">House (भाव)</th>
                      <th className="py-3.5 px-5 font-bold">Nakshatra</th>
                      <th className="py-3.5 px-5 font-bold">Avastha / Yoga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/10">
                    {PLANET_TABLE.map((row) => (
                      <tr key={row.planet} className="hover:bg-[#FFFDF9]">
                        <td className="py-3.5 px-5 font-bold text-[#2C1408]">
                          {row.planet}
                        </td>
                        <td className="py-3.5 px-5 text-[#3B2314]">{row.rashi}</td>
                        <td className="py-3.5 px-5 font-semibold text-[#D9530F]">
                          {row.degree}
                        </td>
                        <td className="py-3.5 px-5 text-[#5C3D28]">{row.house}</td>
                        <td className="py-3.5 px-5 text-[#5C3D28]">{row.nakshatra}</td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#6C2E09] text-xs font-semibold">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ================= VIEW 2: 36 GUN MILAN (ASHTAKOOT) REPORT ================= */
          <div className="space-y-7">
            {/* Score Hero Banner */}
            <div className="bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
                  <CheckCircle2 className="w-4 h-4" />
                  Uttam Vivah Milan • Highly Auspicious Match
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1408]">
                  Aarav Sharma &amp; Ananya Verma — 36 Gun Milan
                </h1>
                <p className="text-xs sm:text-sm text-[#7C5841] max-w-2xl">
                  Ashtakoot compatibility shows strong mental harmony (5/5 Graha Maitri), family prosperity (7/7 Bhakoot), and zero Nadi Dosh (8/8 Nadi).
                </p>
              </div>

              <div className="px-7 py-5 rounded-2xl bg-[#FFF9F2] border border-orange-200/80 text-center shrink-0">
                <div className="text-xs font-bold uppercase tracking-wider text-[#9A3412]">
                  Ashtakoot Score
                </div>
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-[#D9530F] mt-1">
                  34.5 <span className="text-lg text-[#7C5841]">/ 36</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                  ✓ Marriage Approved by Shastra
                </div>
              </div>
            </div>

            {/* 8-Koota Breakdown Table */}
            <div className="bg-white rounded-3xl border border-amber-900/12 overflow-hidden">
              <div className="px-6 py-5 border-b border-amber-900/10">
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#2C1408]">
                  Ashtakoot 8-Koota Gun Milan Table (अष्टकूट गुण मिलान)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#FFF9F2] text-[#6C2E09] border-b border-amber-900/10">
                      <th className="py-3.5 px-5 font-bold">Koota (कूट)</th>
                      <th className="py-3.5 px-5 font-bold">Life Aspect</th>
                      <th className="py-3.5 px-5 font-bold">Max Guns</th>
                      <th className="py-3.5 px-5 font-bold">Obtained</th>
                      <th className="py-3.5 px-5 font-bold">Compatibility Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/10">
                    {ASHTAKOOT_TABLE.map((row) => (
                      <tr key={row.koota} className="hover:bg-[#FFFDF9]">
                        <td className="py-3.5 px-5 font-bold text-[#2C1408]">
                          {row.koota}
                        </td>
                        <td className="py-3.5 px-5 text-[#5C3D28]">{row.area}</td>
                        <td className="py-3.5 px-5 font-semibold text-[#7C5841]">
                          {row.max}
                        </td>
                        <td className="py-3.5 px-5 font-extrabold text-[#D9530F]">
                          {row.obtained}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                            {row.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
