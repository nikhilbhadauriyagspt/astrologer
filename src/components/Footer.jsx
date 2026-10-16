import React from 'react'
import {
  PhoneCall,
  Mail,
  ShieldCheck,
  Lock,
  Award,
  MessageCircle,
} from 'lucide-react'

const RASHI_LINKS = [
  'Aries (मेष)',
  'Taurus (वृषभ)',
  'Gemini (मिथुन)',
  'Cancer (कर्क)',
  'Leo (सिंह)',
  'Virgo (कन्या)',
  'Libra (तुला)',
  'Scorpio (वृश्चिक)',
  'Sagittarius (धनु)',
  'Capricorn (मकर)',
  'Aquarius (कुंभ)',
  'Pisces (मीन)',
]

export default function Footer({ onOpenAstrologerJoin }) {
  return (
    <footer className="w-full bg-[#220E04] text-[#FDEBD0] border-t border-amber-500/20">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 py-12 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-amber-500/15">
          {/* Column 1 (4 Cols): Brand Identity & Support */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#B45309] flex items-center justify-center text-white font-display font-bold text-lg">
                ॐ
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-wide text-white">
                  ASTRO<span className="text-amber-400">VEDA</span>
                </span>
                <p className="font-serif text-xs text-amber-200/80">
                  वैदिक ज्योतिष एवं कुंडली परामर्श मंच
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#FDEBD0]/75 leading-relaxed max-w-sm">
              India’s trusted platform for authentic Vedic Jyotish, Janam Kundli, 36 Gun Milan, Live Sankalp E-Pooja, and lab-certified spiritual remedies.
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-amber-200/90">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>24×7 Support: +91 1800-202-8332 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>care@astroveda.in</span>
              </div>
            </div>
          </div>

          {/* Column 2 (2 Cols): Consultation & Free Tools */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Vedic Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#FDEBD0]/75">
              <li>
                <a href="#chat" className="hover:text-amber-300 transition-colors">
                  Chat with Astrologer
                </a>
              </li>
              <li>
                <a href="#talk" className="hover:text-amber-300 transition-colors">
                  Talk to Astrologer
                </a>
              </li>
              <li>
                <a href="#kundli" className="hover:text-amber-300 transition-colors">
                  Free Janam Kundli
                </a>
              </li>
              <li>
                <a href="#kundli" className="hover:text-amber-300 transition-colors">
                  Kundli Matching (36 Gun)
                </a>
              </li>
              <li>
                <a href="#kundli" className="hover:text-amber-300 transition-colors">
                  Today’s Shubh Panchang
                </a>
              </li>
              <li>
                <a href="#pooja" className="hover:text-amber-300 transition-colors">
                  Book Online E-Pooja
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 (4 Cols): 12 Daily Horoscopes */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Daily Horoscope (राशिफल)
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-[13px] text-[#FDEBD0]/75">
              {RASHI_LINKS.map((rashi) => (
                <a
                  key={rashi}
                  href="#horoscope"
                  className="hover:text-amber-300 transition-colors truncate"
                >
                  {rashi}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4 (2 Cols): AstroMall & Trust */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              AstroMall & Info
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-[#FDEBD0]/75">
              <li>
                <a href="#pooja" className="hover:text-amber-300 transition-colors">
                  Certified Gemstones
                </a>
              </li>
              <li>
                <a href="#pooja" className="hover:text-amber-300 transition-colors">
                  Nepali Rudraksha
                </a>
              </li>
              <li>
                <a href="#pooja" className="hover:text-amber-300 transition-colors">
                  Siddha Shree Yantra
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenAstrologerJoin && onOpenAstrologerJoin()}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Join as an Acharya
                </button>
              </li>
              <li>
                <a href="#privacy" className="hover:text-amber-300 transition-colors">
                  100% Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-amber-300 transition-colors">
                  Terms & Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Trust Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FDEBD0]/65">
          <p>© {new Date().getFullYear()} AstroVeda Jyotish Sansad. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 text-amber-200/85">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              100% Private & Confidential
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Vedic Acharyas
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
