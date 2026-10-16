import React, { useState } from 'react'
import {
  ArrowLeft,
  Flame,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Clock,
  User,
  Phone,
} from 'lucide-react'
import { POOJA_LIST, ASTROMALL_ITEMS } from '../data/astrologyData'

export default function RemedyDetail({ item, onBack, onSelectItem }) {
  const [booked, setBooked] = useState(false)
  const [form, setForm] = useState({
    name: '',
    gotra: '',
    phone: '',
    city: '',
  })

  const current = item || POOJA_LIST[0]
  const isPooja = current.type === 'pooja'
  const allItems = isPooja ? POOJA_LIST : ASTROMALL_ITEMS
  const related = allItems.filter((i) => i.id !== current.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    setBooked(true)
  }

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
            <span>{isPooja ? 'Online E-Pooja' : 'AstroMall Store'}</span>
            <span>/</span>
            <span className="font-bold text-[#2C1408]">{current.title}</span>
          </div>
        </div>

        {/* Main Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 5 COLS: Visual Image, Badges & Vidhi Steps */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-3xl border border-amber-900/12 overflow-hidden">
              <div className="relative h-72 sm:h-80 w-full bg-amber-50">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#2C1408] text-amber-200 text-xs font-bold">
                  {current.tag}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#D9530F]">
                  {isPooja
                    ? 'Sacred Sankalp Vidhi Process'
                    : 'Authenticity & Energization Process'}
                </div>

                <div className="space-y-3">
                  {current.steps.map((step, i) => (
                    <div key={step} className="flex items-start gap-3 text-xs sm:text-sm text-[#3B2314]">
                      <span className="w-6 h-6 rounded-full bg-[#FFF7ED] border border-orange-200 text-[#D9530F] font-extrabold text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-snug pt-0.5">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: Full Info + Sankalp / Order Booking Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-amber-900/12 p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="space-y-2 border-b border-amber-900/10 pb-5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9530F]">
                  {isPooja ? (
                    <Flame className="w-4 h-4" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )}
                  <span>
                    {isPooja
                      ? 'LIVE TEMPLE SANKALP ANUSHTHAN'
                      : 'ABHIMANTRIT VEDIC REMEDY'}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1408]">
                  {current.title}
                </h1>
                <p className="font-serif text-base font-semibold text-[#D9530F]">
                  {current.hi}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#7C5841]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D9530F]" />
                    <strong className="text-[#2C1408]">{current.location}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D9530F]" />
                    <span>{current.duration}</span>
                  </span>
                </div>
              </div>

              {/* Description & Benefit */}
              <div className="space-y-3">
                <p className="text-sm sm:text-base text-[#3B2314] leading-relaxed">
                  {current.description}
                </p>

                <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-orange-200/80 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-[#7C5841]">
                      {isPooja ? 'Dakshina & Sankalp Fee' : 'Abhimantrit Ratna Price'}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-display text-2xl font-extrabold text-[#2C1408]">
                        {current.price}
                      </span>
                      <span className="text-xs line-through text-stone-400">
                        {current.originalPrice}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                        Inclusive of Prasad / Shipping
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-8 h-8 text-[#D9530F] shrink-0" />
                </div>
              </div>

              {/* Sankalp / Order Booking Form */}
              {booked ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-display text-lg font-bold text-emerald-950">
                    {isPooja
                      ? 'Sankalp Booking Confirmed! 🙏'
                      : 'Order Placed Successfully! 🙏'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto">
                    Our Kashi Acharya coordinator will share the live Sankalp video link & tracking details on your WhatsApp shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBooked(false)}
                    className="mt-2 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-900 cursor-pointer"
                  >
                    Book Another Sankalp
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="pt-4 border-t border-amber-900/10 space-y-4"
                >
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#2C1408]">
                    {isPooja
                      ? 'Enter Devotee Details for Gotra Sankalp'
                      : 'Enter Details for Mantra Energization & Delivery'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3B2314] mb-1">
                        Devotee Full Name (नाम)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2314] mb-1">
                        Gotra / Janam Rashi (गोत्र या राशि)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kashyap Gotra / Simha Rashi"
                        value={form.gotra}
                        onChange={(e) => setForm({ ...form, gotra: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2314] mb-1">
                        WhatsApp Number (मोबाइल नंबर)
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2314] mb-1">
                        City & Delivery Address (पता)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="City & Pin Code for Prasad / Delivery"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#EA580C] to-[#B45309] hover:from-[#C2410C] hover:to-[#92400E] text-white font-bold text-sm cursor-pointer transition-all"
                  >
                    {isPooja
                      ? `Confirm Sankalp Booking (${current.price}) →`
                      : `Order Energized ${current.title} (${current.price}) →`}
                  </button>
                </form>
              )}
            </div>

            {/* Related Poojas / Remedies Switcher */}
            <div className="bg-white rounded-3xl border border-amber-900/12 p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-[#2C1408]">
                Other {isPooja ? 'Sacred E-Poojas' : 'Certified AstroMall Remedies'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {related.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => {
                      setBooked(false)
                      onSelectItem(rel)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="p-3.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#FFF7ED] border border-amber-900/12 hover:border-[#D9530F] text-left transition-all cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#2C1408] truncate">
                        {rel.title}
                      </div>
                      <div className="text-xs font-extrabold text-[#D9530F] mt-0.5">
                        {rel.price}
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
