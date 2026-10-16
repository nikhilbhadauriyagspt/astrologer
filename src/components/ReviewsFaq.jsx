import React, { useState, useEffect } from 'react'
import {
  Star,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react'

const REVIEWS = [
  {
    id: 1,
    name: 'Rohit & Neha Sharma',
    city: 'New Delhi',
    service: 'Kundli Matching & Marriage',
    rating: 5,
    text: 'Acharya Devvrat Shastri ji predicted our marriage योग with exact month accuracy and suggested a simple Mangal Shanti remedy. Everything went smoothly!',
  },
  {
    id: 2,
    name: 'Vikramaditya Singhania',
    city: 'Mumbai',
    service: 'Career & Business Consultation',
    rating: 5,
    text: 'Pt. Raghavendra Joshi ji’s KP astrology analysis helped me choose the right business mahadasha timing. Very genuine and practical Vedic guidance.',
  },
  {
    id: 3,
    name: 'Anjali Deshmukh',
    city: 'Pune',
    service: 'Tarot & Relationship Guidance',
    rating: 5,
    text: 'My first free chat with Dr. Maitreyi gave me so much mental clarity during a tough phase. 100% private and compassionate consultation.',
  },
  {
    id: 4,
    name: 'Saurabh & Kriti Verma',
    city: 'Jaipur',
    service: 'Online Rudrabhishek Pooja',
    rating: 5,
    text: 'Booked Kashi Rudrabhishek Sankalp Pooja for family peace. Pandit ji performed the entireVidhi live on video call with our Gotra and sent Prasad home.',
  },
  {
    id: 5,
    name: 'Meenakshi Iyer',
    city: 'Bengaluru',
    service: 'Janam Kundli & Gemstone Remedy',
    rating: 5,
    text: 'Ordered a lab-certified Ceylon Yellow Sapphire after consulting Acharya Siddharth. Within 2 months I received my long-awaited promotion!',
  },
]

const FAQS = [
  {
    q: 'How do I get my First Free Chat with an Acharya?',
    a: 'Simply click on "Chat with Astrologer", choose any online verified Acharya marked with the FREE badge, and start your first consultation at ₹0/min.',
  },
  {
    q: 'Are the Astrologers on AstroVeda genuinely verified?',
    a: 'Yes, every Jyotishacharya undergoes a strict 3-stage Vedic astrology, Kundli analysis, and background verification process before joining AstroVeda.',
  },
  {
    q: 'Is my personal birth detail and chat conversation private?',
    a: '100% confidential. Your birth chart, phone number, and chat/call conversations are encrypted and never shared with any third party.',
  },
  {
    q: 'How does Online Sankalp E-Pooja work?',
    a: 'Once booked, our Kashi/Ujjain Pandit ji takes your Name and Gotra Sankalp on a live video call and sends the consecrated Prasad to your home address.',
  },
]

// Height of one card (164px) + gap (14px) = 178px per step
const CARD_STEP_PX = 178

export default function ReviewsFaq() {
  const [openFaq, setOpenFaq] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // Duplicate list so bottom-to-top sliding loops infinitely without jumping back
  const extendedReviews = [...REVIEWS, ...REVIEWS]

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setCurrentIndex((prev) => prev + 1)
    }, 2800)

    return () => clearInterval(timer)
  }, [isPaused])

  // Seamless reset when reaching the duplicated half
  useEffect(() => {
    if (currentIndex === REVIEWS.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(0)
      }, 600)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex])

  const handleNextUp = () => {
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length)
  }

  const handlePrevDown = () => {
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)
  }

  return (
    <section className="w-full py-12 lg:py-16 bg-[#FFF9F2] border-t border-amber-900/10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 COLS: Bottom-to-Top One-by-One Vertical Card Slider */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9530F]" />
                  <span className="font-serif text-xs font-bold text-[#6C2E09]">
                    भक्तों के अनुभव • VERIFIED STORIES
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1408] ">
                  Trusted by <span className="text-[#D9530F]">Millions of Families</span>
                </h2>
              </div>

              {/* Manual Up / Down Controls + Active Dot Indicators */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 mr-2">
                  {REVIEWS.map((r, i) => {
                    const active = currentIndex % REVIEWS.length === i
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setIsTransitioning(true)
                          setCurrentIndex(i)
                        }}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          active ? 'w-6 bg-[#D9530F]' : 'w-2 bg-amber-900/20'
                        }`}
                        aria-label={`Go to review ${i + 1}`}
                      />
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={handlePrevDown}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-[#FFF7ED] border border-amber-900/15 text-[#2C1408] hover:text-[#D9530F] flex items-center justify-center transition-colors cursor-pointer"
                  title="Previous Card"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextUp}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-[#FFF7ED] border border-amber-900/15 text-[#2C1408] hover:text-[#D9530F] flex items-center justify-center transition-colors cursor-pointer"
                  title="Slide Next Card Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Vertical Viewport Container (Shows 2 cards at a time, slides bottom-to-top one card at a time) */}
            <div
              className="relative h-[348px] overflow-hidden rounded-2xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className={`space-y-[14px] ${
                  isTransitioning
                    ? 'transition-transform duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]'
                    : ''
                }`}
                style={{
                  transform: `translateY(-${currentIndex * CARD_STEP_PX}px)`,
                }}
              >
                {extendedReviews.map((review, index) => (
                  <div
                    key={`${review.id}-${index}`}
                    className="h-[164px] bg-white rounded-2xl border border-amber-900/12 p-5 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: review.rating }).map((_, idx) => (
                            <Star
                              key={idx}
                              className="w-4 h-4 fill-amber-500 text-amber-500"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#9A3412] border border-orange-200/80">
                          {review.service}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#3B2314] leading-relaxed line-clamp-2">
                        “{review.text}”
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-amber-900/8 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#2C1408]">
                        <span>{review.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-[#7C5841]">{review.city}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: 4 Clean Accordion FAQs */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60">
                <span className="font-serif text-xs font-bold text-[#6C2E09]">
                  सामान्य प्रश्न • QUICK FAQ
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2C1408] ">
                Frequently Asked <span className="text-[#D9530F]">Questions</span>
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((item, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={item.q}
                    className="bg-white rounded-2xl border border-amber-900/12 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="font-display text-sm sm:text-[15px] font-bold text-[#2C1408]">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#D9530F] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#5C3D28] leading-relaxed border-t border-amber-900/8">
                        <p className="pt-3">{item.a}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
