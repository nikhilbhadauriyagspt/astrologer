import React, { useState } from 'react'
import {
  PhoneCall,
  MessageCircle,
  Sparkles,
  ChevronDown,
  Globe,
  Wallet,
  User,
  Menu,
  X,
  Sun,
  ShieldCheck,
  Flame,
  Star,
  Compass,
  ShoppingBag,
  BookOpen,
  HeartHandshake,
  Calendar,
} from 'lucide-react'

const HOROSCOPE_LINKS = [
  {
    title: "Today's Horoscope (दैनिक राशिफल)",
    desc: 'Accurate daily predictions for all 12 Rashis',
    badge: 'Live',
    icon: Sun,
  },
  {
    title: 'Kundli Matching (गुण मिलान)',
    desc: '36 Gun Milan & Ashtakoot marriage compatibility',
    badge: 'Popular',
    icon: HeartHandshake,
  },
  {
    title: 'Free Janam Kundli',
    desc: 'Detailed Vedic birth chart, Dashas & planetary remedies',
    icon: Compass,
  },
  {
    title: "Today's Panchang & Muhurat",
    desc: 'Choghadiya, Rahu Kaal, Tithi & Abhijit Muhurat',
    icon: Calendar,
  },
]

const ASTROMALL_LINKS = [
  {
    title: 'Certified Gemstones (रत्न)',
    desc: 'Lab-tested Neelam, Pukhraj, Moti & Panna',
    badge: '100% Natural',
  },
  {
    title: 'Original Nepali Rudraksha',
    desc: '1 to 14 Mukhi Abhimantrit Rudraksha beads',
    badge: 'Energized',
  },
  {
    title: 'Online E-Pooja & Anushthan',
    desc: 'Live sankalp pooja by Kashi & Ujjain Pandits',
    badge: 'New',
  },
  {
    title: 'Siddha Yantras & Bracelets',
    desc: 'Shree Yantra, Vastu remedies & crystal bracelets',
  },
]

export default function Header({ onGoHome, onOpenKundli, onOpenAstrologer }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [lang, setLang] = useState('EN')

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* 1. Top Sacred Panchang & Trust Utility Bar */}
      <div className="bg-gradient-to-r from-[#2C1408] via-[#3B1B0B] to-[#2C1408] text-[#FDEBD0] border-b border-amber-500/20">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-9 flex items-center justify-between text-xs">
          {/* Left: Live Panchang & Verified Astrologers Status */}
          <div className="flex items-center gap-4 overflow-hidden whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium whitespace-nowrap">
              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-[spin_18s_linear_infinite]" />
              <span className="font-serif tracking-wide text-sm text-amber-200">
                ॐ शुभ मुहूर्त:
              </span>
              <span className="text-[#FDEBD0]/90">
                Shukla Saptami • Abhijit: 11:43 AM – 12:29 PM
              </span>
            </div>

            <span className="hidden md:inline-block text-amber-500/40">|</span>

            <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 font-semibold">148+ Verified Acharyas</span>
              <span className="text-[#FDEBD0]/75">Online for Instant Consultation</span>
            </div>
          </div>

          {/* Right: Offer Pill, Wallet, Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 whitespace-nowrap">
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/15 border border-amber-400/30 text-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>First Chat 100% FREE</span>
            </div>

            {/* Wallet Quick Chip */}
            <button
              type="button"
              className="hidden lg:flex items-center gap-1.5 text-[#FDEBD0]/90 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-amber-400" />
              <span>Wallet:</span>
              <span className="font-bold text-amber-300">₹0</span>
              <span className="text-[10px] bg-amber-500/25 text-amber-200 px-1.5 py-0.2 rounded font-semibold">
                + Recharge
              </span>
            </button>

            <span className="hidden sm:inline-block text-amber-500/30">|</span>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
              className="flex items-center gap-1 text-[#FDEBD0]/90 hover:text-amber-300 transition-colors font-medium cursor-pointer"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'EN' ? 'EN / हिंदी' : 'हिंदी / EN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Full Width, No Wrapping) */}
      <div className="bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-900/10">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => onGoHome && onGoHome()}
            className="flex items-center gap-3 group shrink-0 whitespace-nowrap text-left cursor-pointer"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF6B00] via-[#EA580C] to-[#B45309] p-0.5 transition-all shrink-0">
              <div className="w-full h-full bg-[#FFFDF9] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/15" />
                {/* Sacred Surya/Chakra SVG */}
                <svg
                  className="w-7 h-7 text-[#D9530F] group-hover:rotate-45 transition-transform duration-500"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="18" cy="18" r="7" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="18" r="3" fill="currentColor" />
                  <path
                    d="M18 3V8M18 28V33M3 18H8M28 18H33M7.39 7.39L10.93 10.93M25.07 25.07L28.61 28.61M28.61 7.39L25.07 10.93M10.93 25.07L7.39 28.61"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-[#2C1408]">
                  ASTRO<span className="text-[#D9530F]">VEDA</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 rounded border border-amber-300/60">
                  Verified
                </span>
              </div>
              <span className="font-serif text-xs sm:text-[13px] font-semibold tracking-wide text-[#7C5841] -mt-0.5">
                {lang === 'EN'
                  ? 'Vedic Jyotish & Spiritual Guidance'
                  : 'वैदिक ज्योतिष एवं कुंडली परामर्श'}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 whitespace-nowrap shrink-0">
            <button
              type="button"
              onClick={() => {
                if (onOpenKundli) {
                  onOpenKundli('kundli')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="px-3 py-2 rounded-lg text-[14px] font-semibold text-[#3B2314] hover:text-[#D9530F] hover:bg-amber-500/8 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>{lang === 'EN' ? 'Free Kundli' : 'फ्री कुंडली'}</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-orange-100 text-[#D9530F] rounded-full">
                FREE
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenKundli) {
                  onOpenKundli('matching')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="px-3 py-2 rounded-lg text-[14px] font-semibold text-[#3B2314] hover:text-[#D9530F] hover:bg-amber-500/8 transition-all whitespace-nowrap cursor-pointer"
            >
              {lang === 'EN' ? 'Kundli Matching' : 'कुंडली मिलान'}
            </button>

            {/* Horoscopes Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('horoscope')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-[14px] font-semibold text-[#3B2314] hover:text-[#D9530F] hover:bg-amber-500/8 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'EN' ? 'Horoscopes' : 'राशिफल'}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7C5841] transition-transform duration-200 ${
                    activeDropdown === 'horoscope' ? 'rotate-180 text-[#D9530F]' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'horoscope' && (
                <div className="absolute left-0 top-full pt-2 w-80 z-50 whitespace-normal">
                  <div className="bg-[#FFFDF9] rounded-2xl border border-amber-900/12 shadow-xl shadow-amber-950/10 p-2.5 space-y-1">
                    {HOROSCOPE_LINKS.map((item) => {
                      const Icon = item.icon
                      return (
                        <a
                          key={item.title}
                          href="#horoscope"
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/90 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#D9530F] shrink-0 group-hover:bg-[#D9530F] group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-bold text-[#2C1408] group-hover:text-[#D9530F]">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#7C5841] mt-0.5 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Book a Pooja */}
            <a
              href="#pooja"
              className="px-3 py-2 rounded-lg text-[14px] font-semibold text-[#3B2314] hover:text-[#D9530F] hover:bg-amber-500/8 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Flame className="w-4 h-4 text-[#D9530F] shrink-0" />
              <span>{lang === 'EN' ? 'Book a Pooja' : 'ऑनलाइन पूजा'}</span>
            </a>

            {/* AstroMall Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('astromall')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-[14px] font-semibold text-[#3B2314] hover:text-[#D9530F] hover:bg-amber-500/8 transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'EN' ? 'AstroMall' : 'एस्ट्रो मॉल'}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#7C5841] transition-transform duration-200 ${
                    activeDropdown === 'astromall' ? 'rotate-180 text-[#D9530F]' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'astromall' && (
                <div className="absolute left-0 top-full pt-2 w-80 z-50 whitespace-normal">
                  <div className="bg-[#FFFDF9] rounded-2xl border border-amber-900/12 shadow-xl shadow-amber-950/10 p-2.5 space-y-1">
                    {ASTROMALL_LINKS.map((item) => (
                      <a
                        key={item.title}
                        href="#astromall"
                        className="flex items-start justify-between gap-2 p-2.5 rounded-xl hover:bg-amber-50/90 transition-colors group"
                      >
                        <div>
                          <div className="text-[13px] font-bold text-[#2C1408] group-hover:text-[#D9530F]">
                            {item.title}
                          </div>
                          <p className="text-xs text-[#7C5841] mt-0.5">{item.desc}</p>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#D9530F] shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action CTAs (Astrotalk / InstaAstro signature high-conversion buttons) */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            {/* CTA 1: Chat with Astrologer */}
            <a
              href="#chat"
              className="relative group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#9A3412] border border-[#FDBA74] font-bold text-[13px] transition-all whitespace-nowrap"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <MessageCircle className="w-4 h-4 text-[#EA580C] shrink-0" />
              <span>{lang === 'EN' ? 'Chat with Astrologer' : 'ज्योतिषी से चैट करें'}</span>
            </a>

            {/* CTA 2: Talk to Astrologer */}
            <a
              href="#talk"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#EA580C] via-[#D9530F] to-[#B45309] hover:from-[#C2410C] hover:to-[#92400E] text-white font-bold text-[13px] transition-all whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>{lang === 'EN' ? 'Talk to Astrologer' : 'ज्योतिषी से बात करें'}</span>
            </a>

            {/* Sign In / User Button */}
            <button
              type="button"
              className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border border-amber-900/15 bg-white hover:bg-amber-50/60 text-[#2C1408] font-semibold text-[13px] transition-colors cursor-pointer whitespace-nowrap"
            >
              <User className="w-4 h-4 text-[#D9530F] shrink-0" />
              <span>{lang === 'EN' ? 'Sign In' : 'लॉगिन'}</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="#chat"
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#EA580C] to-[#B45309] text-white font-bold text-xs shadow-sm whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Free Chat</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-amber-900/15 bg-amber-50/50 text-[#2C1408] hover:bg-amber-100/60 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-amber-900/15 shadow-2xl px-4 pt-3 pb-6 space-y-4">
          {/* Mobile Quick CTAs */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href="#chat"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] text-[#9A3412] font-bold text-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#EA580C]" />
              <span>Chat with Astrologer</span>
            </a>
            <a
              href="#talk"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#B45309] text-white font-bold text-xs shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Talk to Astrologer</span>
            </a>
          </div>

          {/* Mobile Nav Links */}
          <div className="divide-y divide-amber-900/10 text-sm font-semibold text-[#2C1408]">
            <a href="#kundli" className="py-2.5 flex items-center justify-between">
              <span>Free Kundli (जनम कुंडली)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#D9530F]">
                FREE
              </span>
            </a>
            <a href="#matching" className="py-2.5 flex items-center justify-between">
              <span>Kundli Matching (गुण मिलान)</span>
              <span className="text-xs text-[#7C5841]">36 Gun Milan</span>
            </a>
            <a href="#horoscope" className="py-2.5 flex items-center justify-between">
              <span>Daily Horoscope (दैनिक राशिफल)</span>
              <span className="text-xs text-[#7C5841]">All 12 Rashis</span>
            </a>
            <a href="#pooja" className="py-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#D9530F]" />
                Book Online Pooja
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                LIVE
              </span>
            </a>
            <a href="#astromall" className="py-2.5 flex items-center justify-between">
              <span>AstroMall Shop (रत्न एवं रुद्राक्ष)</span>
              <ShoppingBag className="w-4 h-4 text-[#7C5841]" />
            </a>
          </div>

          {/* Bottom Wallet & Login Row */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5C3D28] bg-amber-50 px-3 py-2 rounded-xl border border-amber-200/70">
              <Wallet className="w-4 h-4 text-[#D9530F]" />
              <span>Wallet: ₹0</span>
              <span className="text-[#D9530F] underline ml-1">+ Add</span>
            </div>

            <button
              type="button"
              className="flex-1 py-2 px-4 rounded-xl bg-[#2C1408] text-amber-100 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Sign In / Register</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
