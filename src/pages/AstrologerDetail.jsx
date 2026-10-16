import React, { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Star,
  MessageCircle,
  PhoneCall,
  Award,
  Languages,
  Clock,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Send,
  X,
} from 'lucide-react'
import { ASTROLOGERS } from '../data/astrologyData'

export default function AstrologerDetail({
  astrologer,
  onBack,
  onSelectAstrologer,
  onStartConsultation,
}) {
  const current = astrologer || ASTROLOGERS[0]
  const relatedAcharyas = ASTROLOGERS.filter((a) => a.id !== current.id).slice(0, 3)

  return (
    <div className="w-full py-8 lg:py-10 bg-[#FFFDF9] min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 space-y-8">
        {/* Top Breadcrumb & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-amber-900/10">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#FFF7ED] border border-amber-900/15 text-xs sm:text-sm font-bold text-[#2C1408] hover:text-[#D9530F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#D9530F]" />
            <span>Back to Home</span>
          </button>

          <div className="text-xs text-[#7C5841] flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
            <span>Verified Acharyas</span>
            <span>/</span>
            <span className="font-bold text-[#2C1408]">{current.name}</span>
          </div>
        </div>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 4 COLS: Sticky Profile Summary & Action Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-7 space-y-6">
            {/* Top Status & Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-[#6C2E09] border border-amber-300/60">
                {current.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                {current.status === 'online' ? 'Online Now' : `Busy (${current.waitTime})`}
              </span>
            </div>

            {/* Avatar & Name */}
            <div className="flex flex-col items-center text-center">
              <img
                src={current.image}
                alt={current.name}
                className="w-28 h-28 rounded-3xl object-cover border-2 border-amber-400/70"
              />
              <div className="mt-4 flex items-center gap-1.5">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-[#2C1408]">
                  {current.name}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              </div>
              <p className="font-serif text-sm font-semibold text-[#D9530F] mt-0.5">
                {current.title}
              </p>

              {/* Rating Pill */}
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9F2] border border-orange-200/80 text-xs font-bold text-[#2C1408]">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{current.rating} Rating</span>
                <span className="text-[#7C5841]">({current.reviews} consultations)</span>
              </div>
            </div>

            {/* Quick Info Rows */}
            <div className="space-y-3 pt-4 border-t border-amber-900/10 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#7C5841] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#D9530F]" />
                  Experience
                </span>
                <span className="font-bold text-[#2C1408]">{current.exp}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7C5841] flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#D9530F]" />
                  Languages
                </span>
                <span className="font-bold text-[#2C1408]">{current.languages}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7C5841] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D9530F]" />
                  Total Chat Time
                </span>
                <span className="font-bold text-[#2C1408]">{current.chatMins}</span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-orange-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs text-[#7C5841]">Consultation Fee</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-extrabold text-emerald-700">
                    {current.price}
                  </span>
                  <span className="text-xs line-through text-stone-400">
                    {current.originalPrice}
                  </span>
                </div>
                <div className="text-[11px] text-[#7C5841]">{current.perMinRate}</div>
              </div>
              <ShieldCheck className="w-7 h-7 text-[#D9530F]" />
            </div>

            {/* 3 Consultation Mode Buttons: Chat, Audio Call, Video Call */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() =>
                  onStartConsultation && onStartConsultation(current, 'chat')
                }
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#B45309] hover:from-[#C2410C] hover:to-[#92400E] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Live Chat ({current.price})</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    onStartConsultation && onStartConsultation(current, 'audio')
                  }
                  className="py-3 px-3 rounded-2xl bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#9A3412] border border-[#FDBA74] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-[#EA580C]" />
                  <span>Audio Call</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onStartConsultation && onStartConsultation(current, 'video')
                  }
                  className="py-3 px-3 rounded-2xl bg-[#2C1408] hover:bg-[#3D1A08] text-amber-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>🎥 Video Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 8 COLS: Bio, Expertise & Client Reviews */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. About Acharya Card */}
            <div className="bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
                <div>
                  <span className="font-serif text-xs font-bold text-[#D9530F]">
                    आचार्य परिचय • VEDIC LINEAGE
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#2C1408]">
                    About {current.name}
                  </h2>
                </div>
                <GraduationCap className="w-6 h-6 text-[#D9530F]" />
              </div>

              <div className="px-4 py-3 rounded-2xl bg-[#FFF9F2] border border-orange-200/70 text-xs sm:text-sm font-semibold text-[#5C3D28]">
                🎓 Qualification: <span className="text-[#2C1408]">{current.education}</span>
              </div>

              <p className="text-sm sm:text-base text-[#3B2314] leading-relaxed">
                {current.about}
              </p>

              {/* Skills Chips */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#7C5841]">
                  Core Specializations
                </div>
                <div className="flex flex-wrap gap-2">
                  {current.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 rounded-xl bg-[#FFF7ED] border border-orange-200 text-xs font-bold text-[#9A3412]"
                    >
                      ✦ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2.5 pt-3 border-t border-amber-900/10">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#7C5841]">
                  Why Consult {current.name}
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {current.highlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-xs sm:text-sm text-[#2C1408]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Verified User Reviews Card */}
            <div className="bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
                <div>
                  <span className="font-serif text-xs font-bold text-[#D9530F]">
                    भक्तों की राय • CLIENT FEEDBACK
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#2C1408]">
                    Verified Consultation Reviews ({current.reviews})
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#6C2E09] text-xs font-extrabold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{current.rating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-3.5">
                {(current.clientReviews.length > 0
                  ? current.clientReviews
                  : ASTROLOGERS[0].clientReviews
                ).map((rev, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-900/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#2C1408]">
                          {rev.user}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-[11px] text-[#7C5841]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-amber-500 text-amber-500"
                        />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C3D28] leading-relaxed">
                      “{rev.comment}”
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Other Online Acharyas Quick Switcher */}
            <div className="bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 space-y-4">
              <h3 className="font-display text-lg font-bold text-[#2C1408]">
                Other Similar Verified Acharyas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedAcharyas.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectAstrologer(item)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="p-4 rounded-2xl bg-[#FFFDF9] hover:bg-[#FFF7ED] border border-amber-900/12 hover:border-[#D9530F] text-left transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-[#2C1408] truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-[#7C5841] truncate">
                        {item.exp} • ★ {item.rating}
                      </div>
                      <div className="text-xs font-extrabold text-emerald-700 mt-0.5">
                        {item.price}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
