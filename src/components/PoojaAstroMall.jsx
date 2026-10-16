import React, { useState } from 'react'
import {
  Flame,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { POOJA_LIST, ASTROMALL_ITEMS } from '../data/astrologyData'

export default function PoojaAstroMall({ onSelectRemedy }) {
  const [activeTab, setActiveTab] = useState('pooja')
  const items = activeTab === 'pooja' ? POOJA_LIST : ASTROMALL_ITEMS

  const handleOpenItem = (item) => {
    if (onSelectRemedy) {
      onSelectRemedy(item)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="pooja"
      className="w-full py-12 lg:py-16 bg-[#FFFDF9] border-t border-amber-900/10"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Clean Header + 2-Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-7 border-b border-amber-900/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60">
              <Sparkles className="w-3.5 h-3.5 text-[#D9530F]" />
              <span className="font-serif text-xs font-bold text-[#6C2E09]">
                वैदिक उपाय एवं अनुष्ठान • SACRED REMEDIES
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1408] tracking-tight">
              Online <span className="text-[#D9530F]">E-Pooja</span> & AstroMall Store
            </h2>
            <p className="text-sm sm:text-base text-[#7C5841]">
              Click on any Pooja or AstroMall remedy to view full Vidhi details & book your Sankalp.
            </p>
          </div>

          {/* 2 Clean Tabs: Online Pooja | AstroMall Store */}
          <div className="inline-flex items-center bg-[#FFF7ED] p-1 rounded-xl border border-orange-200/80 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('pooja')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'pooja'
                  ? 'bg-[#D9530F] text-white'
                  : 'text-[#5C3D28] hover:text-[#D9530F]'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Online E-Pooja</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('astromall')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'astromall'
                  ? 'bg-[#D9530F] text-white'
                  : 'text-[#5C3D28] hover:text-[#D9530F]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>AstroMall Remedies</span>
            </button>
          </div>
        </div>

        {/* Clean 4-Column Cards Row */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="group bg-white hover:bg-[#FFFBF5] rounded-2xl border border-amber-900/12 hover:border-[#D9530F]/50 overflow-hidden transition-all flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-44 w-full overflow-hidden bg-amber-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#2C1408]/90 text-amber-200 text-[10px] font-bold tracking-wide">
                    {item.tag}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-2.5">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#2C1408] group-hover:text-[#D9530F] transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="font-serif text-xs font-semibold text-[#D9530F] truncate">
                      {item.hi}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#7C5841]">
                    {activeTab === 'pooja' ? (
                      <MapPin className="w-3.5 h-3.5 text-[#D9530F] shrink-0" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    <span className="truncate font-medium">{item.location}</span>
                  </div>

                  <p className="text-xs text-[#5C3D28] leading-relaxed line-clamp-2">
                    {item.benefit}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 border-t border-amber-900/10 flex items-center justify-between gap-2 bg-[#FFFDF9]">
                <div>
                  <span className="text-[11px] text-stone-400 line-through mr-1.5">
                    {item.originalPrice}
                  </span>
                  <span className="text-base font-extrabold text-[#2C1408]">
                    {item.price}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenItem(item)
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#B45309] hover:from-[#C2410C] hover:to-[#92400E] text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>{activeTab === 'pooja' ? 'Book Pooja' : 'Order Now'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
