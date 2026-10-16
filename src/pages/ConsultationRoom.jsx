import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  MessageCircle,
  PhoneCall,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Send,
  Sparkles,
  CheckCircle2,
  Star,
  Clock,
  ShieldCheck,
  Compass,
  Flame,
  User,
  Calendar,
  MapPin,
  FileText,
  Wallet,
} from 'lucide-react'
import { ASTROLOGERS } from '../data/astrologyData'

const QUICK_QUESTIONS = [
  '💍 Meri shadi ka shubh yog kab ban raha hai?',
  '💼 Career mein promotion ya nayi job kab milegi?',
  '💎 Mere Lagna ke hisaab se kaun sa Ratna shubh hai?',
  '🪐 Kya meri Kundli mein Mangal ya Rahu dosh hai?',
]

export default function ConsultationRoom({
  astrologer,
  initialMode = 'chat', // 'chat' | 'audio' | 'video'
  onBack,
}) {
  const current = astrologer || ASTROLOGERS[0]

  // Process Stages: 'intake' -> 'connecting' -> 'active' -> 'summary'
  const [stage, setStage] = useState('intake')
  const [mode, setMode] = useState(initialMode)

  // Intake Form State
  const [intake, setIntake] = useState({
    name: 'Aarav Sharma',
    gender: 'Male',
    dob: '1997-08-14',
    tob: '10:30',
    place: 'New Delhi',
    topic: 'Marriage & Career Guidance',
  })

  // Active Session Controls & Timer
  const [seconds, setSeconds] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [cameraOn, setCameraOn] = useState(true)
  const [speakerOn, setSpeakerOn] = useState(true)
  const [rightTab, setRightTab] = useState('kundli') // 'kundli' | 'remedies'
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  // Chat Messages
  const [messages, setMessages] = useState([
    {
      sender: 'acharya',
      text: `प्रणाम ${intake.name} जी! 🙏 Maine aapki Mesh Lagna aur Vrishabh Rashi ki Janam Kundli khol li hai. Aapke 9th house mein Guru Brihaspati baithe hain. Bataiye, aap kis vishay par vistar se janna chahte hain?`,
      time: '00:02',
    },
  ])
  const [inputMsg, setInputMsg] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Stage 2 -> Stage 3 Auto-Connect Transition
  useEffect(() => {
    if (stage !== 'connecting') return
    const timer = setTimeout(() => {
      setStage('active')
    }, 1800)
    return () => clearTimeout(timer)
  }, [stage])

  // Stage 3 Live Session Timer
  useEffect(() => {
    if (stage !== 'active') return
    const interval = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [stage])

  const formatTime = (totalSec) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0')
    const secs = String(totalSec % 60).padStart(2, '0')
    return `${mins}:${secs}`
  }

  const sendMessage = (textToSend) => {
    const clean = (textToSend ?? inputMsg).trim()
    if (!clean) return

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: clean, time: formatTime(seconds) },
    ])
    setInputMsg('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          sender: 'acharya',
          text: `Aapke D1 Lagna aur D9 Navamsha chart ke anusar, abhi Brihaspati ki Mahadasha mein Shukra ka Antardasha chal raha hai. Yeh samay "${clean}" ke liye shubh parinam dega. Maine right side ke 'Remedies' tab mein aapka siddha mantra aur upay likh diya hai.`,
          time: formatTime(seconds + 2),
        },
      ])
    }, 1100)
  }

  return (
    <div className="w-full py-6 lg:py-8 bg-[#FFFDF9] min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 space-y-6">
        {/* Top Navigation & Mode Indicator Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-900/10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FFF7ED] border border-amber-900/15 text-xs sm:text-sm font-bold text-[#2C1408] hover:text-[#D9530F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#D9530F]" />
            <span>Back</span>
          </button>

          {/* 4-Step Progress Pill */}
          <div className="flex items-center gap-2 text-xs font-bold">
            {[
              { id: 'intake', label: '1. Birth Details' },
              { id: 'connecting', label: '2. Kundli & Connect' },
              { id: 'active', label: '3. Live Consultation' },
              { id: 'summary', label: '4. Remedy Summary' },
            ].map((step) => {
              const isCurrent = stage === step.id
              return (
                <span
                  key={step.id}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    isCurrent
                      ? 'bg-[#2C1408] text-amber-200 border-[#2C1408]'
                      : 'bg-white text-[#7C5841] border-amber-900/10 hidden sm:inline-block'
                  }`}
                >
                  {step.label}
                </span>
              )
            })}
          </div>
        </div>

        {/* =====================================================================
            STAGE 1: MODE SELECTION + BIRTH DETAILS INTAKE FORM
           ===================================================================== */}
        {stage === 'intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 4 Cols: Selected Acharya & Consultation Mode Card */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-amber-900/12 p-6 space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-amber-900/10">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/70"
                />
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ● Online &amp; Ready
                  </span>
                  <h2 className="font-display text-lg font-bold text-[#2C1408] mt-1">
                    {current.name}
                  </h2>
                  <p className="text-xs text-[#7C5841]">
                    {current.exp} Exp • ★ {current.rating}
                  </p>
                </div>
              </div>

              {/* Choose Mode: Chat / Audio Call / Video Call */}
              <div className="space-y-2.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#7C5841]">
                  Select Consultation Mode
                </div>

                {[
                  {
                    id: 'chat',
                    title: 'Live Chat Consultation',
                    sub: 'Instant text chat + live Kundli sharing',
                    price: 'First 5 Mins FREE',
                    icon: MessageCircle,
                  },
                  {
                    id: 'audio',
                    title: 'Voice Audio Call',
                    sub: 'Private 1-on-1 HD voice consultation',
                    price: 'First Call FREE',
                    icon: PhoneCall,
                  },
                  {
                    id: 'video',
                    title: 'Live Video Call',
                    sub: 'Face-to-face Kundli, Palm & Vastu session',
                    price: '₹25/min (HD Video)',
                    icon: Video,
                  },
                ].map((m) => {
                  const Icon = m.icon
                  const active = mode === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        active
                          ? 'bg-[#FFF7ED] border-[#D9530F]'
                          : 'bg-[#FFFDF9] hover:bg-white border-amber-900/12'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            active
                              ? 'bg-[#D9530F] text-white'
                              : 'bg-amber-100/70 text-[#D9530F]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-[#2C1408]">
                            {m.title}
                          </div>
                          <div className="text-[11px] text-[#7C5841]">{m.sub}</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                        {m.price}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-orange-200/80 text-xs text-[#5C3D28] flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#D9530F]" />
                  100% Private &amp; Confidential
                </span>
                <span className="font-bold text-[#2C1408]">Wait Time: Instant</span>
              </div>
            </div>

            {/* Right 8 Cols: Birth Details (Janam Kundli) Intake Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 space-y-6">
              <div className="border-b border-amber-900/10 pb-4">
                <span className="font-serif text-xs font-bold text-[#D9530F]">
                  जन्म विवरण • STEP 1 OF 3
                </span>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2C1408] mt-0.5">
                  Enter Birth Details to Generate Your Kundli for {current.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#7C5841] mt-1">
                  Your Lagna chart, Navamsha (D9), and planetary degrees will be automatically shared in the consultation room.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setStage('connecting')
                }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2314] mb-1.5">
                      Full Name (आपका नाम)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7C5841] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={intake.name}
                        onChange={(e) =>
                          setIntake({ ...intake, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2314] mb-1.5">
                      Gender (लिंग)
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {['Male', 'Female'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setIntake({ ...intake, gender: g })}
                          className={`py-3 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                            intake.gender === g
                              ? 'bg-[#2C1408] text-amber-200 border-[#2C1408]'
                              : 'bg-[#FFFDF9] text-[#3B2314] border-amber-900/15'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
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
                        required
                        value={intake.dob}
                        onChange={(e) =>
                          setIntake({ ...intake, dob: e.target.value })
                        }
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
                        required
                        value={intake.tob}
                        onChange={(e) =>
                          setIntake({ ...intake, tob: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
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
                        required
                        value={intake.place}
                        onChange={(e) =>
                          setIntake({ ...intake, place: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2314] mb-1.5">
                      Primary Concern (मुख्य प्रश्न)
                    </label>
                    <select
                      value={intake.topic}
                      onChange={(e) =>
                        setIntake({ ...intake, topic: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                    >
                      <option>Marriage &amp; Love Compatibility</option>
                      <option>Career, Job &amp; Promotion</option>
                      <option>Business, Wealth &amp; Finance</option>
                      <option>Kundli Dosh &amp; Gemstone Remedy</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#7C5841]">
                    🎁 <strong className="text-emerald-700">First 5 Mins FREE</strong> applied to your session
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#B45309] hover:from-[#C2410C] hover:to-[#92400E] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {mode === 'chat' && <MessageCircle className="w-4 h-4" />}
                    {mode === 'audio' && <PhoneCall className="w-4 h-4" />}
                    {mode === 'video' && <Video className="w-4 h-4" />}
                    <span>
                      {mode === 'chat'
                        ? `Start Live Chat with ${current.name} →`
                        : mode === 'audio'
                        ? `Start Voice Call with ${current.name} →`
                        : `Start Video Call with ${current.name} →`}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================================
            STAGE 2: CONNECTING & KUNDLI PREPARATION SCREEN
           ===================================================================== */}
        {stage === 'connecting' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-amber-900/12 p-8 sm:p-10 text-center space-y-6 my-8">
            <div className="relative w-24 h-24 mx-auto">
              <span className="animate-ping absolute inset-0 rounded-full bg-amber-400/30" />
              <img
                src={current.image}
                alt={current.name}
                className="relative w-24 h-24 rounded-full object-cover border-2 border-[#D9530F]"
              />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-[#6C2E09] text-xs font-bold">
                Connecting {mode.toUpperCase()} Session...
              </span>
              <h2 className="font-display text-2xl font-bold text-[#2C1408] pt-1">
                Preparing Your Janam Kundli for {current.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#7C5841]">
                Calculating Lahiri Ayanamsa planetary degrees for {intake.name} ({intake.place})
              </p>
            </div>

            <div className="space-y-2.5 text-left max-w-sm mx-auto bg-[#FFF9F2] p-4 rounded-2xl border border-orange-200/80 text-xs font-semibold text-[#3B2314]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lagna (D1) &amp; Navamsha (D9) Charts Generated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vimshottari Mahadasha Shared with Acharya</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#D9530F] animate-pulse shrink-0" />
                <span>Opening Encrypted {mode.toUpperCase()} Room...</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStage('active')}
              className="px-5 py-2.5 rounded-xl bg-[#FFF7ED] border border-orange-200 text-xs font-bold text-[#D9530F] cursor-pointer"
            >
              Enter Consultation Room Now →
            </button>
          </div>
        )}

        {/* =====================================================================
            STAGE 3: LIVE CONSULTATION ROOM (CHAT / AUDIO CALL / VIDEO CALL)
           ===================================================================== */}
        {stage === 'active' && (
          <div className="space-y-5">
            {/* Top Live Session Control Bar */}
            <div className="bg-[#2C1408] text-white rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
              {/* Left: Acharya + Live Timer */}
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-11 h-11 rounded-xl object-cover border border-amber-400"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border border-[#2C1408]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm sm:text-base font-bold text-white">
                      {current.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                      LIVE {mode.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-amber-200/80 flex items-center gap-2 mt-0.5">
                    <span>Duration: <strong className="text-amber-300">{formatTime(seconds)}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-300 font-semibold">Free Session Active</span>
                  </div>
                </div>
              </div>

              {/* Center: Instant Mode Switcher (Switch between Chat, Audio, Video anytime!) */}
              <div className="inline-flex items-center bg-white/10 p-1 rounded-xl border border-amber-400/20">
                {[
                  { id: 'chat', label: 'Chat', icon: MessageCircle },
                  { id: 'audio', label: 'Audio Call', icon: PhoneCall },
                  { id: 'video', label: 'Video Call', icon: Video },
                ].map((tab) => {
                  const Icon = tab.icon
                  const active = mode === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMode(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        active
                          ? 'bg-[#D9530F] text-white'
                          : 'text-amber-100/80 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Right: End Consultation Button */}
              <button
                type="button"
                onClick={() => setStage('summary')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Session</span>
              </button>
            </div>

            {/* Main Room Split Layout: Left 8 Cols (Chat / Audio / Video), Right 4 Cols (Live Shared Kundli & Remedies) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT 8 COLS: Dynamic Consultation View */}
              <div className="lg:col-span-8">
                {/* ---------------- MODE 1: LIVE CHAT INTERFACE ---------------- */}
                {mode === 'chat' && (
                  <div className="bg-white rounded-3xl border border-amber-900/12 overflow-hidden flex flex-col h-[540px]">
                    {/* Pinned Kundli Context Strip */}
                    <div className="bg-[#FFF9F2] px-5 py-3 border-b border-amber-900/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[#5C3D28]">
                        <strong>Shared Kundli:</strong> {intake.name} ({intake.dob}, {intake.tob}, {intake.place}) • <strong>Mesh Lagna</strong>
                      </span>
                      <span className="text-[#D9530F] font-bold">Topic: {intake.topic}</span>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FFFDF9]">
                      {messages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`flex ${
                            m.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-lg rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                              m.sender === 'user'
                                ? 'bg-[#2C1408] text-white'
                                : 'bg-white text-[#2C1408] border border-amber-900/12'
                            }`}
                          >
                            {m.sender === 'acharya' && (
                              <div className="text-[11px] font-bold text-[#D9530F] mb-1">
                                {current.name}
                              </div>
                            )}
                            <p>{m.text}</p>
                            <div
                              className={`text-[10px] mt-1 text-right ${
                                m.sender === 'user' ? 'text-amber-200/70' : 'text-[#7C5841]'
                              }`}
                            >
                              {m.time}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-amber-900/10 text-xs text-[#7C5841]">
                          <span className="w-2 h-2 rounded-full bg-[#D9530F] animate-ping" />
                          <span>{current.name} is analyzing your Navamsha chart...</span>
                        </div>
                      )}
                    </div>

                    {/* Quick 1-Tap Question Chips */}
                    <div className="px-4 py-2.5 bg-[#FFF9F2] border-t border-amber-900/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                      {QUICK_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => sendMessage(q)}
                          className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FFF7ED] border border-amber-900/12 hover:border-[#D9530F] text-[11px] font-semibold text-[#3B2314] whitespace-nowrap cursor-pointer transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    {/* Bottom Chat Input Bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        sendMessage()
                      }}
                      className="p-3.5 bg-white border-t border-amber-900/10 flex items-center gap-2.5"
                    >
                      <input
                        type="text"
                        placeholder="Ask your question to Acharya ji..."
                        value={inputMsg}
                        onChange={(e) => setInputMsg(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#B45309] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* ---------------- MODE 2: VOICE AUDIO CALL STUDIO ---------------- */}
                {mode === 'audio' && (
                  <div className="bg-gradient-to-b from-[#2A1205] via-[#381808] to-[#1F0C03] text-white rounded-3xl border border-amber-500/25 p-8 sm:p-10 h-[540px] flex flex-col items-center justify-between text-center">
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-200 text-xs font-bold">
                        🔒 HD Encrypted Vedic Voice Call
                      </span>
                      <p className="text-xs text-amber-200/70 pt-1">
                        Kundli Shared: {intake.name} • Mesh Lagna
                      </p>
                    </div>

                    {/* Center Acharya Portrait + Animated Voice Rings */}
                    <div className="space-y-4 flex flex-col items-center">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute w-32 h-32 rounded-full bg-amber-500/20" />
                        <img
                          src={current.image}
                          alt={current.name}
                          className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-amber-400"
                        />
                      </div>

                      <div>
                        <h3 className="font-display text-2xl font-bold text-white">
                          {current.name}
                        </h3>
                        <p className="font-serif text-sm text-amber-300">
                          {current.title}
                        </p>
                        <div className="mt-2 font-display text-lg font-extrabold text-emerald-400">
                          {formatTime(seconds)}
                        </div>
                      </div>

                      {/* Live Audio Caption Box */}
                      <div className="max-w-md px-4 py-2.5 rounded-2xl bg-white/8 border border-amber-400/20 text-xs sm:text-sm text-amber-100">
                        🎙️ <em>“{intake.name} ji, aapke 9th house mein Brihaspati uchcha sthan par hain, is saal vivah aur career dono ka prabal yog hai...”</em>
                      </div>
                    </div>

                    {/* Audio Call Control Dock */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border cursor-pointer transition-all ${
                          isMuted
                            ? 'bg-rose-600/30 border-rose-400 text-rose-200'
                            : 'bg-white/10 hover:bg-white/15 border-amber-400/30 text-white'
                        }`}
                        title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSpeakerOn(!speakerOn)}
                        className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/15 border border-amber-400/30 text-white flex items-center justify-center cursor-pointer"
                        title="Toggle Speaker"
                      >
                        {speakerOn ? (
                          <Volume2 className="w-5 h-5 text-amber-300" />
                        ) : (
                          <VolumeX className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setMode('video')}
                        className="px-4 h-12 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-bold text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Switch to Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMode('chat')}
                        className="px-4 h-12 rounded-2xl bg-white/10 hover:bg-white/15 border border-amber-400/30 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Open Chat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStage('summary')}
                        className="px-5 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <PhoneOff className="w-4 h-4" />
                        <span>End Call</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- MODE 3: 1-ON-1 LIVE VIDEO CALL STUDIO ---------------- */}
                {mode === 'video' && (
                  <div className="relative bg-[#1E0C04] text-white rounded-3xl border border-amber-500/25 overflow-hidden h-[540px] flex flex-col justify-between">
                    {/* Main Acharya Video Feed */}
                    <img
                      src={current.image}
                      alt={current.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0902] via-transparent to-[#1A0902]/70" />

                    {/* Top Video Overlay Bar */}
                    <div className="relative z-10 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 bg-black/45 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/15">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold">{current.name} (HD Video)</span>
                        <span className="text-xs text-amber-300 font-bold">
                          • {formatTime(seconds)}
                        </span>
                      </div>

                      <div className="bg-black/45 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-amber-200">
                        Kundli Overlay: Mesh Lagna
                      </div>
                    </div>

                    {/* Picture-in-Picture (PiP) User Self-View */}
                    <div className="relative z-10 self-end mr-5 w-36 h-28 rounded-2xl bg-[#2A1205] border-2 border-amber-400/70 overflow-hidden flex flex-col items-center justify-center text-center p-2">
                      {cameraOn ? (
                        <div className="space-y-1">
                          <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto font-bold text-xs">
                            YOU
                          </div>
                          <div className="text-[11px] font-bold text-white">
                            {intake.name}
                          </div>
                          <div className="text-[10px] text-emerald-300">● Camera On</div>
                        </div>
                      ) : (
                        <div className="text-xs text-amber-200/70 flex flex-col items-center gap-1">
                          <VideoOff className="w-5 h-5" />
                          <span>Camera Off</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Live Subtitle & Video Controls */}
                    <div className="relative z-10 p-5 space-y-4">
                      <div className="max-w-xl mx-auto px-4 py-2.5 rounded-2xl bg-black/55 backdrop-blur-xs border border-white/15 text-center text-xs sm:text-sm text-amber-100">
                        🎥 <strong>{current.name}:</strong> “Main aapki Kundli ka 7th aur 9th bhav dekh raha hun, Guru ki drishti bahut shubh hai...”
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center border cursor-pointer ${
                            isMuted
                              ? 'bg-rose-600 border-rose-400 text-white'
                              : 'bg-black/50 hover:bg-black/70 border-white/20 text-white'
                          }`}
                          title="Mute / Unmute"
                        >
                          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setCameraOn(!cameraOn)}
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center border cursor-pointer ${
                            !cameraOn
                              ? 'bg-rose-600 border-rose-400 text-white'
                              : 'bg-black/50 hover:bg-black/70 border-white/20 text-white'
                          }`}
                          title="Camera On / Off"
                        >
                          {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setMode('chat')}
                          className="px-4 h-11 rounded-2xl bg-black/50 hover:bg-black/70 border border-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat Box</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setStage('summary')}
                          className="px-5 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                        >
                          <PhoneOff className="w-4 h-4" />
                          <span>End Video Call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT 4 COLS: Live Shared Janam Kundli & Acharya's Remedy Notepad */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-amber-900/12 p-5 sm:p-6 space-y-5">
                {/* 2 Tabs: Live Kundli | Prescribed Remedies */}
                <div className="grid grid-cols-2 gap-1.5 bg-[#FFF7ED] p-1 rounded-xl border border-orange-200/80">
                  <button
                    type="button"
                    onClick={() => setRightTab('kundli')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      rightTab === 'kundli'
                        ? 'bg-[#D9530F] text-white'
                        : 'text-[#5C3D28]'
                    }`}
                  >
                    Live Kundli Chart
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightTab('remedies')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      rightTab === 'remedies'
                        ? 'bg-[#D9530F] text-white'
                        : 'text-[#5C3D28]'
                    }`}
                  >
                    Acharya Remedies (3)
                  </button>
                </div>

                {rightTab === 'kundli' ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-xs font-bold text-[#2C1408]">
                        {intake.name} — Lagna Chart (D1)
                      </div>
                      <div className="text-[11px] text-[#7C5841]">
                        Mesh Lagna • Vrishabh Rashi • Rohini Nakshatra
                      </div>
                    </div>

                    {/* Compact North Indian Diamond Kundli SVG */}
                    <div className="aspect-square w-full max-w-[230px] mx-auto bg-[#FFF9F0] rounded-xl border-2 border-[#D9530F]/60 p-2">
                      <svg viewBox="0 0 240 240" className="w-full h-full">
                        <rect x="4" y="4" width="232" height="232" fill="none" stroke="#D9530F" strokeWidth="2" />
                        <line x1="4" y1="4" x2="236" y2="236" stroke="#D9530F" strokeWidth="1.5" />
                        <line x1="236" y1="4" x2="4" y2="236" stroke="#D9530F" strokeWidth="1.5" />
                        <polygon points="120,4 236,120 120,236 4,120" fill="none" stroke="#D9530F" strokeWidth="1.5" />
                        <text x="120" y="62" textAnchor="middle" className="text-[11px] font-bold fill-[#2C1408]">Asc • Ma</text>
                        <text x="62" y="34" textAnchor="middle" className="text-[11px] font-bold fill-[#2C1408]">Mo</text>
                        <text x="28" y="70" textAnchor="middle" className="text-[11px] font-bold fill-[#2C1408]">Ra</text>
                        <text x="28" y="182" textAnchor="middle" className="text-[11px] font-bold fill-[#2C1408]">Su</text>
                        <text x="62" y="216" textAnchor="middle" className="text-[11px] font-bold fill-[#2C1408]">Me</text>
                        <text x="120" y="186" textAnchor="middle" className="text-[11px] font-bold fill-[#2C1408]">Ve</text>
                        <text x="206" y="182" textAnchor="middle" className="text-[11px] font-bold fill-[#2C1408]">Ju • Ke</text>
                        <text x="206" y="70" textAnchor="middle" className="text-[11px] font-bold fill-[#2C1408]">Sa</text>
                      </svg>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-amber-900/10">
                        <span className="text-[#7C5841]">Running Mahadasha</span>
                        <span className="font-bold text-[#2C1408]">Guru (Jupiter)</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-amber-900/10">
                        <span className="text-[#7C5841]">Antardasha</span>
                        <span className="font-bold text-[#D9530F]">Shukra (Venus)</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-[#7C5841]">Shubh Yoga</span>
                        <span className="font-bold text-emerald-700">Hamsa &amp; Malavya Yoga</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-orange-200/80 space-y-1">
                      <div className="text-xs font-extrabold text-[#D9530F]">
                        1. Vedic Mantra Upay
                      </div>
                      <p className="text-xs text-[#3B2314]">
                        Chant <strong>“ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः”</strong> 108 times every Thursday morning.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-amber-900/10 space-y-1">
                      <div className="text-xs font-extrabold text-[#2C1408]">
                        2. Recommended Ratna
                      </div>
                      <p className="text-xs text-[#5C3D28]">
                        5.25 Ratti Ceylon Yellow Sapphire (Pukhraj) in Gold on Index Finger.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FFFDF9] border border-amber-900/10 space-y-1">
                      <div className="text-xs font-extrabold text-[#2C1408]">
                        3. Sankalp Pooja
                      </div>
                      <p className="text-xs text-[#5C3D28]">
                        Kashi Rudrabhishek &amp; Navagraha Shanti on Somwar Pradosh.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            STAGE 4: POST-CONSULTATION SUMMARY & RATING SCREEN
           ===================================================================== */}
        {stage === 'summary' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 space-y-6 my-4">
            <div className="text-center space-y-2 border-b border-amber-900/10 pb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                Consultation Completed Successfully
              </span>
              <h2 className="font-display text-2xl font-bold text-[#2C1408] pt-1">
                Vedic Session Summary with {current.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#7C5841]">
                Mode: <strong className="uppercase">{mode}</strong> • Duration: <strong>{formatTime(seconds || 185)}</strong> • Fee Charged: <strong className="text-emerald-700">₹0 (Free Session)</strong>
              </p>
            </div>

            {/* Prescribed Remedy Summary Box */}
            <div className="p-5 rounded-2xl bg-[#FFF9F2] border border-orange-200/80 space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#D9530F]">
                Acharya’s Prescribed Vedic Remedies for {intake.name}
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#3B2314]">
                <li>• <strong>Mantra:</strong> Chant “ॐ बृं बृहस्पतये नमः” 108 times on Thursdays.</li>
                <li>• <strong>Ratna:</strong> 5.25 Ratti Ceylon Yellow Sapphire (Pukhraj) in Gold.</li>
                <li>• <strong>Daan:</strong> Donate Chana Dal, Turmeric &amp; Yellow Cloth on Thursday morning.</li>
              </ul>
            </div>

            {/* Rate Acharya */}
            <div className="space-y-3 text-center">
              <div className="text-xs font-bold text-[#2C1408]">
                Rate Your Consultation Experience with {current.name}
              </div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                placeholder="Write a thank you note or review for Acharya ji..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStage('active')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#FFF7ED] border border-orange-200 text-[#9A3412] font-bold text-xs sm:text-sm cursor-pointer"
              >
                Rejoin Session
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#B45309] text-white font-bold text-xs sm:text-sm cursor-pointer"
              >
                Submit Review &amp; Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
