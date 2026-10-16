import React, { useState } from 'react'
import {
  Sun,
  Heart,
  Briefcase,
  Coins,
  Activity,
  MessageCircle,
  Flame,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import ZodiacIcon from './ZodiacIcon'

const RASHI_LIST = [
  {
    id: 'aries',
    name: 'Aries',
    hi: 'मेष राशि',
    dates: 'Mar 21 – Apr 19',
    ruler: 'Mangal (Mars)',
    element: 'Fire (अग्नि)',
    luckyNumber: '9, 18',
    luckyColor: 'Vermilion Red',
    luckyTime: '10:30 AM – 12:15 PM',
    compatible: 'Leo, Sagittarius',
    prediction:
      'Mangal’s favorable aspect brings strong momentum in pending career decisions and leadership roles. Avoid hasty financial commitments before noon; evening brings harmony in family and marriage discussions.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Sincere conversation resolves past misunderstandings.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Senior officials recognize your initiative today.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Stuck payments clear up; avoid short-term speculation.' },
      { icon: Activity, title: 'Health & Energy', text: 'High vitality; morning Pranayama is beneficial.' },
    ],
    remedy: 'Offer water with red sandalwood to Lord Surya at sunrise and chant "ॐ भौमाय नमः".',
  },
  {
    id: 'taurus',
    name: 'Taurus',
    hi: 'वृषभ राशि',
    dates: 'Apr 20 – May 20',
    ruler: 'Shukra (Venus)',
    element: 'Earth (पृथ्वी)',
    luckyNumber: '6, 15',
    luckyColor: 'Cream White',
    luckyTime: '02:00 PM – 03:45 PM',
    compatible: 'Virgo, Capricorn',
    prediction:
      'Shukra blesses your Rashi with financial stability and domestic peace. An auspicious day for property investments, purchasing vehicles, or finalizing marriage alliances.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Deep emotional bonding & auspicious marriage news.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Steady progress; creative & commercial work shines.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Favorable yoga for gold or land investment.' },
      { icon: Activity, title: 'Health & Energy', text: 'Prefer warm homemade food; avoid cold drinks.' },
    ],
    remedy: 'Light a cow-ghee lamp near Tulsi in the evening and offer white sweets on Friday.',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    hi: 'मिथुन राशि',
    dates: 'May 21 – Jun 20',
    ruler: 'Budh (Mercury)',
    element: 'Air (वायु)',
    luckyNumber: '5, 14',
    luckyColor: 'Emerald Green',
    luckyTime: '11:00 AM – 12:40 PM',
    compatible: 'Libra, Aquarius',
    prediction:
      'Budh strengthens your communication and intellect today. Business negotiations, interviews, and client meetings will yield immediate positive outcomes.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Express your feelings clearly without overthinking.' },
      { icon: Briefcase, title: 'Career & Job', text: 'IT, media, trading & consulting deals succeed.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Smart budgeting brings surplus savings & profit.' },
      { icon: Activity, title: 'Health & Energy', text: 'Give rest to your eyes; practice evening meditation.' },
    ],
    remedy: 'Feed green fodder (हरा चारा) to गौ माता (Cow) and chant "ॐ बुं बुधाय नमः".',
  },
  {
    id: 'cancer',
    name: 'Cancer',
    hi: 'कर्क राशि',
    dates: 'Jun 21 – Jul 22',
    ruler: 'Chandra (Moon)',
    element: 'Water (जल)',
    luckyNumber: '2, 7',
    luckyColor: 'Pearl White',
    luckyTime: '09:15 AM – 11:00 AM',
    compatible: 'Scorpio, Pisces',
    prediction:
      'Chandra’s transit brings emotional clarity, maternal blessings, and peace at home. Long-standing mental confusion regarding career or family will settle harmoniously.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Warmth and mutual respect grow stronger at home.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Support from colleagues helps finish key tasks.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Ancestral property & family matters move in your favor.' },
      { icon: Activity, title: 'Health & Energy', text: 'Stay hydrated and maintain a calm routine.' },
    ],
    remedy: 'Offer raw milk mixed with Gangajal on Shivling and chant "ॐ नमः शिवाय".',
  },
  {
    id: 'leo',
    name: 'Leo',
    hi: 'सिंह राशि',
    dates: 'Jul 23 – Aug 22',
    ruler: 'Surya (Sun)',
    element: 'Fire (अग्नि)',
    luckyNumber: '1, 10',
    luckyColor: 'Saffron Gold',
    luckyTime: '11:45 AM – 01:30 PM',
    compatible: 'Aries, Sagittarius',
    prediction:
      'Surya Dev’s strong placement brings royal authority, social prestige, and breakthrough success in government or administrative works. Your confidence will inspire everyone around you.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Mutual admiration and joyful family celebration.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Promotion, leadership recognition & authority yoga.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Strong financial inflow & profitable long-term decisions.' },
      { icon: Activity, title: 'Health & Energy', text: 'Excellent stamina and radiant immunity all day.' },
    ],
    remedy: 'Offer Arghya (water in a copper vessel with Roli & Akshat) to rising Surya Dev every morning.',
  },
  {
    id: 'virgo',
    name: 'Virgo',
    hi: 'कन्या राशि',
    dates: 'Aug 23 – Sep 22',
    ruler: 'Budh (Mercury)',
    element: 'Earth (पृथ्वी)',
    luckyNumber: '5, 23',
    luckyColor: 'Pastel Green',
    luckyTime: '03:15 PM – 05:00 PM',
    compatible: 'Taurus, Capricorn',
    prediction:
      'Your analytical discipline solves a long-pending professional or legal matter today. Financial planning and systematic execution will put you ahead of competitors.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Thoughtful gestures win your partner’s trust.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Finance, education & management professionals excel.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Ideal day to review investments and clear old dues.' },
      { icon: Activity, title: 'Health & Energy', text: 'Focus on digestive balance and light evening walks.' },
    ],
    remedy: 'Offer Durva grass to Lord Ganesha and recite Ganesh Atharvashirsha.',
  },
  {
    id: 'libra',
    name: 'Libra',
    hi: 'तुला राशि',
    dates: 'Sep 23 – Oct 22',
    ruler: 'Shukra (Venus)',
    element: 'Air (वायु)',
    luckyNumber: '6, 24',
    luckyColor: 'Ivory & Rose',
    luckyTime: '01:00 PM – 02:45 PM',
    compatible: 'Gemini, Aquarius',
    prediction:
      'Balance, diplomacy, and artistic fortune favor you today. Partnerships—both in business and marriage—receive positive planetary blessings.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Romantic harmony peaks; ideal for marriage talks.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Collaborative ventures & business partnerships thrive.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Steady commercial profits & auspicious purchases.' },
      { icon: Activity, title: 'Health & Energy', text: 'Balanced energy levels and mental peace.' },
    ],
    remedy: 'Chant Mahalakshmi Ashtakam and keep a silver coin in your locker.',
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    hi: 'वृश्चिक राशि',
    dates: 'Oct 23 – Nov 21',
    ruler: 'Mangal (Mars)',
    element: 'Water (जल)',
    luckyNumber: '9, 27',
    luckyColor: 'Deep Maroon',
    luckyTime: '10:00 AM – 11:30 AM',
    compatible: 'Cancer, Pisces',
    prediction:
      'Hidden opportunities surface in your favor. Research, strategy, and decisive action bring sudden gains and victory over workplace obstacles.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Loyal, deep emotional connection with your partner.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Breakthrough in a complex project or contract.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Recovery of blocked funds or sudden financial gain.' },
      { icon: Activity, title: 'Health & Energy', text: 'Strong inner resilience; avoid late-night spicy food.' },
    ],
    remedy: 'Recite Hanuman Chalisa in the evening and light a lamp at Hanuman temple.',
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    hi: 'धनु राशि',
    dates: 'Nov 22 – Dec 21',
    ruler: 'Brihaspati (Jupiter)',
    element: 'Fire (अग्नि)',
    luckyNumber: '3, 12',
    luckyColor: 'Turmeric Yellow',
    luckyTime: '09:30 AM – 11:15 AM',
    compatible: 'Aries, Leo',
    prediction:
      'Devguru Brihaspati’s grace activates Bhagyodaya (rise of fortune). Higher education, foreign travel, spiritual growth, and mentorship bring auspicious news.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Elders’ blessings bring joy and unity in family.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Guidance from a mentor opens doors to promotion.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Dharma-aligned earnings and long-term prosperity.' },
      { icon: Activity, title: 'Health & Energy', text: 'Optimistic mindset and vibrant physical energy.' },
    ],
    remedy: 'Apply Kesar/Haldi Tilak on your forehead and offer Chana Dal at Vishnu temple.',
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    hi: 'मकर राशि',
    dates: 'Dec 22 – Jan 19',
    ruler: 'Shani Dev (Saturn)',
    element: 'Earth (पृथ्वी)',
    luckyNumber: '8, 17',
    luckyColor: 'Earth Brown',
    luckyTime: '04:00 PM – 05:45 PM',
    compatible: 'Taurus, Virgo',
    prediction:
      'Shani Dev rewards your perseverance and karma today. Long-term infrastructure, real estate, engineering, or corporate efforts bear solid fruit.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Dependable commitment brings security in marriage.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Hard work pays off with authority & career stability.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Real estate and fixed assets yield solid returns.' },
      { icon: Activity, title: 'Health & Energy', text: 'Take care of joints; light stretching is helpful.' },
    ],
    remedy: 'Light a sesame/mustard oil lamp under a Peepal tree on Saturday evening.',
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    hi: 'कुंभ राशि',
    dates: 'Jan 20 – Feb 18',
    ruler: 'Shani Dev (Saturn)',
    element: 'Air (वायु)',
    luckyNumber: '8, 11',
    luckyColor: 'Sky Blue',
    luckyTime: '01:30 PM – 03:00 PM',
    compatible: 'Gemini, Libra',
    prediction:
      'Innovative ideas and networking bring new alliances today. Social recognition and tech/modern business ventures move forward rapidly.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Friendly understanding deepens romantic bonds.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Startup, tech & modern business initiatives gain speed.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Professional network introduces a new income stream.' },
      { icon: Activity, title: 'Health & Energy', text: 'Maintain a restful sleep schedule for mental clarity.' },
    ],
    remedy: 'Chant "ॐ शं शनैश्चराय नमः" 21 times and donate food to the needy.',
  },
  {
    id: 'pisces',
    name: 'Pisces',
    hi: 'मीन राशि',
    dates: 'Feb 19 – Mar 20',
    ruler: 'Brihaspati (Jupiter)',
    element: 'Water (जल)',
    luckyNumber: '3, 9',
    luckyColor: 'Golden Yellow',
    luckyTime: '10:15 AM – 12:00 PM',
    compatible: 'Cancer, Scorpio',
    prediction:
      'Spiritual intuition and creative inspiration guide your decisions accurately. Auspicious ceremonies at home and financial growth bring inner contentment.',
    highlights: [
      { icon: Heart, title: 'Love & Marriage', text: 'Soulful, affectionate moments bring harmony at home.' },
      { icon: Briefcase, title: 'Career & Job', text: 'Advisory, medical, creative & teaching fields shine.' },
      { icon: Coins, title: 'Wealth & Finance', text: 'Abundant inflow and auspicious family celebrations.' },
      { icon: Activity, title: 'Health & Energy', text: 'Peaceful mind and sound sleep rejuvenate energy.' },
    ],
    remedy: 'Chant "ॐ नमो भगवते वासुदेवाय" and apply a saffron tilak every morning.',
  },
]

const TIMEFRAMES = [
  { id: 'today', label: "Today's Horoscope" },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'yearly', label: 'Yearly 2026' },
]

export default function DailyHoroscope() {
  const [selectedRashi, setSelectedRashi] = useState(RASHI_LIST[4]) // Default Leo
  const [timeframe, setTimeframe] = useState('today')

  return (
    <section
      id="horoscope"
      className="w-full py-12 lg:py-16 bg-[#FFFDF9] border-t border-amber-900/10"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* 1. Clean Section Header + Timeframe Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-amber-900/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60">
              <Sun className="w-3.5 h-3.5 text-[#D9530F]" />
              <span className="font-serif text-xs font-bold text-[#6C2E09]">
                दैनिक राशिफल • VEDIC HOROSCOPE
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1408] ">
              Daily <span className="text-[#D9530F]">Horoscope</span> Predictions
            </h2>
            <p className="text-sm sm:text-base text-[#7C5841]">
              Choose your zodiac sign below to read your accurate daily Vedic Rashifal.
            </p>
          </div>

          {/* Clean Pill Tabs */}
          <div className="inline-flex items-center bg-[#FFF7ED] p-1 rounded-xl border border-orange-200/80 self-start md:self-auto">
            {TIMEFRAMES.map((tf) => {
              const active = timeframe === tf.id
              return (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setTimeframe(tf.id)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#D9530F] text-white'
                      : 'text-[#5C3D28] hover:text-[#D9530F]'
                  }`}
                >
                  {tf.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2. Clean 6x2 Rashi Cards Grid (With Custom Vector SVG Icons - No Purple Emojis) */}
        <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {RASHI_LIST.map((rashi) => {
            const isSelected = selectedRashi.id === rashi.id
            return (
              <button
                key={rashi.id}
                type="button"
                onClick={() => setSelectedRashi(rashi)}
                className={`group p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-[#FFF7ED] border-[#D9530F] ring-1 ring-[#D9530F]/30'
                    : 'bg-white hover:bg-[#FFFBF5] border-amber-900/12 hover:border-[#D9530F]/40'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#FF6B00] to-[#B45309] text-white'
                      : 'bg-[#FFF4E6] text-[#D9530F] group-hover:bg-[#D9530F] group-hover:text-white'
                  }`}
                >
                  <ZodiacIcon id={rashi.id} className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                  <div className="font-display text-sm sm:text-[15px] font-bold text-[#2C1408] group-hover:text-[#D9530F] transition-colors truncate">
                    {rashi.name}
                  </div>
                  <div className="font-serif text-xs font-semibold text-[#7C5841] truncate">
                    {rashi.hi}
                  </div>
                  <div className="text-[10px] text-[#9A7B65] mt-0.5 truncate">
                    {rashi.dates}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* 3. Clean Light Reading Spotlight Card (Below the 6x2 Grid) */}
        <div className="mt-6 bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Rashi Title, Prediction & 4 Aspect Cards */}
            <div className="lg:col-span-8 space-y-6">
              {/* Top Rashi Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-amber-900/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#B45309] text-white flex items-center justify-center shrink-0">
                    <ZodiacIcon id={selectedRashi.id} className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2C1408]">
                        {selectedRashi.name} Horoscope
                      </h3>
                      <span className="font-serif text-sm font-bold text-[#D9530F] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-orange-200">
                        {selectedRashi.hi}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#7C5841] mt-0.5">
                      Ruling Planet: <strong className="text-[#2C1408]">{selectedRashi.ruler}</strong> •{' '}
                      Element: <strong className="text-[#2C1408]">{selectedRashi.element}</strong>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#7C5841] bg-[#FFFDF9] px-3 py-1.5 rounded-xl border border-amber-900/10">
                  {selectedRashi.dates}
                </span>
              </div>

              {/* Prediction Text */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#D9530F]">
                  {timeframe === 'today'
                    ? "Today's Planetary Prediction"
                    : timeframe === 'tomorrow'
                    ? "Tomorrow's Planetary Prediction"
                    : timeframe === 'weekly'
                    ? 'Weekly Planetary Prediction'
                    : '2026 Yearly Prediction'}
                </span>
                <p className="text-sm sm:text-base text-[#3B2314] leading-relaxed">
                  {selectedRashi.prediction}
                </p>
              </div>

              {/* 4 Clean Aspect Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {selectedRashi.highlights.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-900/10 flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#FFF4E6] text-[#D9530F] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-[#2C1408]">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#7C5841] mt-0.5 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right 4 Cols: Soft Cream Shubh Sanket & Upay Box */}
            <div className="lg:col-span-4 bg-[#FFF9F2] rounded-2xl border border-orange-200/80 p-5 sm:p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                  <div>
                    <span className="font-serif text-xs font-bold text-[#D9530F]">
                      आज के शुभ संकेत
                    </span>
                    <h4 className="font-display text-base font-bold text-[#2C1408]">
                      Today’s Auspicious Factors
                    </h4>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#D9530F]" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-amber-900/10">
                    <div className="text-[11px] text-[#7C5841]">Lucky Number</div>
                    <div className="text-sm font-extrabold text-[#2C1408] mt-0.5">
                      {selectedRashi.luckyNumber}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-900/10">
                    <div className="text-[11px] text-[#7C5841]">Lucky Color</div>
                    <div className="text-xs sm:text-sm font-bold text-[#2C1408] mt-0.5">
                      {selectedRashi.luckyColor}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-900/10">
                    <div className="text-[11px] text-[#7C5841]">Shubh Muhurat</div>
                    <div className="text-xs font-bold text-[#2C1408] mt-0.5">
                      {selectedRashi.luckyTime}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-900/10">
                    <div className="text-[11px] text-[#7C5841]">Compatible Sign</div>
                    <div className="text-xs sm:text-sm font-bold text-[#D9530F] mt-0.5">
                      {selectedRashi.compatible}
                    </div>
                  </div>
                </div>

                {/* Vedic Remedy Box */}
                <div className="p-3.5 rounded-xl bg-white border border-orange-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9530F]">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Vedic Upay (आज का उपाय)</span>
                  </div>
                  <p className="text-xs text-[#3B2314] leading-relaxed">
                    {selectedRashi.remedy}
                  </p>
                </div>
              </div>

              <a
                href="#chat"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#B45309] hover:from-[#C2410C] hover:to-[#92400E] text-white font-bold text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Talk to Acharya for {selectedRashi.name}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
