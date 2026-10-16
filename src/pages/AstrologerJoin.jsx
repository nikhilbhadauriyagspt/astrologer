import React, { useState } from 'react'
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
  IndianRupee,
  BookOpen,
  Languages,
  Lock,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import {
  registerAstrologerRequest,
  checkAstrologerStatusRequest,
} from '../admin/adminApi'

const SKILL_OPTIONS = [
  'Vedic Kundli & Marriage',
  'KP Astrology & Career',
  'Nadi Jyotish',
  'Tarot & Relationship',
  'Vastu Shastra',
  'Lal Kitab & Remedies',
  'Vedic Numerology',
  'Prashna & Muhurat',
]

export default function AstrologerJoin({ onBack }) {
  const [activeTab, setActiveTab] = useState('apply') // 'apply' | 'status'

  // Onboarding Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: 'Varanasi',
    specialty: 'Vedic Kundli & Marriage',
    languages: 'Hindi, Sanskrit, English',
    experience_years: '10',
    qualification: 'Jyotish Acharya (BHU)',
    rate_per_min: '30',
    bio: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submittedApplication, setSubmittedApplication] = useState(null)

  // Check Status State
  const [statusEmail, setStatusEmail] = useState('suryakant@astroveda.in')
  const [statusPassword, setStatusPassword] = useState('Astro@123')
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [astroProfile, setAstroProfile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    try {
      const res = await registerAstrologerRequest(formData)
      setSubmittedApplication(res.application)
    } catch (err) {
      setSubmitError(err.message || 'Could not submit application.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCheckStatus = async (e) => {
    e.preventDefault()
    setStatusError('')
    setCheckingStatus(true)

    try {
      const res = await checkAstrologerStatusRequest(statusEmail, statusPassword)
      setAstroProfile(res.astrologer)
    } catch (err) {
      setAstroProfile(null)
      setStatusError(err.message || 'No application found with this email.')
    } finally {
      setCheckingStatus(false)
    }
  }

  return (
    <section className="w-full min-h-[calc(100vh-80px)] bg-[#FFFDF9] py-8 px-4 sm:px-6 lg:px-10 xl:px-14 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* Top Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#7C5841] hover:text-[#D9530F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {/* Switch Tabs: Apply vs Check Status */}
          <div className="inline-flex items-center bg-[#FFF9F2] p-1 rounded-xl border border-amber-900/12">
            <button
              type="button"
              onClick={() => setActiveTab('apply')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'apply'
                  ? 'bg-[#D9530F] text-white'
                  : 'text-[#5C3D28] hover:text-[#D9530F]'
              }`}
            >
              1. Join as Astrologer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'status'
                  ? 'bg-[#D9530F] text-white'
                  : 'text-[#5C3D28] hover:text-[#D9530F]'
              }`}
            >
              2. Check Approval Status
            </button>
          </div>
        </div>

        {/* 3-Step Onboarding Process Strip */}
        <div className="bg-[#FFF9F2] rounded-2xl border border-amber-900/12 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#D9530F] flex items-center justify-center text-xs font-semibold shrink-0">
                01
              </div>
              <div>
                <div className="text-xs font-semibold text-[#2C1408]">
                  Submit Vedic Profile
                </div>
                <p className="text-[11px] text-[#7C5841] mt-0.5">
                  Fill in your Jyotish qualification, experience &amp; per-minute tariff
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold shrink-0">
                02
              </div>
              <div>
                <div className="text-xs font-semibold text-[#2C1408]">
                  Super Admin Verification
                </div>
                <p className="text-[11px] text-[#7C5841] mt-0.5">
                  Application saved as PENDING in MySQL until Super Admin approves
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-semibold shrink-0">
                03
              </div>
              <div>
                <div className="text-xs font-semibold text-[#2C1408]">
                  Go Live for Consultations
                </div>
                <p className="text-[11px] text-[#7C5841] mt-0.5">
                  Once APPROVED, your profile immediately appears on the website
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: ASTROLOGER REGISTRATION FORM */}
        {activeTab === 'apply' && (
          <div className="bg-white rounded-2xl border border-amber-900/12 p-6 sm:p-8">
            {submittedApplication ? (
              <div className="max-w-xl mx-auto py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#2C1408]">
                  Application Submitted for Verification!
                </h2>

                <p className="text-xs sm:text-sm text-[#6E4F3A] leading-relaxed">
                  Namaste <span className="font-semibold text-[#2C1408]">{submittedApplication.name}</span>, your profile has been saved in our MySQL database with status{' '}
                  <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-medium text-xs">
                    PENDING APPROVAL
                  </span>
                  . Once the Super Admin approves your request in the Admin Console, your profile will automatically go live on AstroVeda.
                </p>

                <div className="bg-[#FFF9F2] rounded-xl border border-amber-900/10 p-4 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C5841]">Application ID:</span>
                    <span className="font-medium text-[#2C1408]">#APP-{submittedApplication.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C5841]">Registered Email:</span>
                    <span className="font-medium text-[#2C1408]">{submittedApplication.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C5841]">Primary Expertise:</span>
                    <span className="font-medium text-[#2C1408]">{submittedApplication.specialty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7C5841]">Current Status:</span>
                    <span className="text-amber-700 font-medium">Waiting for Super Admin Approval</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusEmail(submittedApplication.email)
                      setActiveTab('status')
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#D9530F] hover:bg-[#C2410C] text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Track Application Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmittedApplication(null)}
                    className="px-4 py-2.5 rounded-xl border border-amber-900/15 text-[#5C3D28] text-xs font-medium hover:bg-amber-50/60 transition-colors cursor-pointer"
                  >
                    Submit Another Profile
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 pb-4 border-b border-amber-900/10 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h1 className="font-display text-lg sm:text-xl font-semibold text-[#2C1408]">
                      Acharya Onboarding &amp; Empanelment Form
                    </h1>
                    <p className="text-xs text-[#7C5841] mt-0.5">
                      Complete your Vedic profile for Super Admin review and verification
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-[#D9530F] text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Jyotish Network
                  </span>
                </div>

                {submitError && (
                  <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleApplySubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Acharya Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Acharya Bhaskar Mishra"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="bhaskar@astroveda.in"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Mobile / WhatsApp Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 9876543210"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        City / Sacred Center
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Varanasi / Ujjain / Haridwar"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Experience (in Years) *
                      </label>
                      <input
                        type="number"
                        name="experience_years"
                        min="1"
                        max="60"
                        required
                        value={formData.experience_years}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                      />
                    </div>

                    {/* Per Minute Rate */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Consultation Tariff (₹ / Min) *
                      </label>
                      <div className="relative">
                        <IndianRupee className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          name="rate_per_min"
                          min="10"
                          max="250"
                          required
                          value={formData.rate_per_min}
                          onChange={handleChange}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Jyotish Degree / Qualification
                      </label>
                      <div className="relative">
                        <Award className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                          placeholder="Jyotish Acharya – BHU"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Languages Spoken
                      </label>
                      <div className="relative">
                        <Languages className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="languages"
                          value={formData.languages}
                          onChange={handleChange}
                          placeholder="Hindi, Sanskrit, English"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Create Login Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Expertise Pill Selector */}
                  <div>
                    <label className="block text-xs font-medium text-[#3B2314] mb-2">
                      Select Primary Vedic Specialization *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_OPTIONS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, specialty: skill }))
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                            formData.specialty === skill
                              ? 'bg-[#D9530F] text-white border-[#D9530F]'
                              : 'bg-[#FFFDF9] text-[#5C3D28] border-amber-900/15 hover:bg-amber-50/70'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Short Bio */}
                  <div>
                    <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                      Brief Vedic Bio &amp; Consultation Approach
                    </label>
                    <textarea
                      rows={3}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Describe your experience in Kundli reading, Dasha analysis, and remedies..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                    />
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs text-[#7C5841]">
                      Note: Profile goes live on the platform once Super Admin approves your application.
                    </span>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-[#D9530F] hover:bg-[#C2410C] disabled:opacity-60 text-white text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {submitting
                          ? 'Submitting Application...'
                          : 'Submit Application for Approval'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHECK APPROVAL STATUS / ASTROLOGER LOGIN */}
        {activeTab === 'status' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Check Status Form */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-amber-900/12 p-6">
              <h2 className="font-display text-lg font-semibold text-[#2C1408]">
                Check Application Status
              </h2>
              <p className="text-xs text-[#7C5841] mt-1 mb-5">
                Enter your registered email to check if Super Admin has approved your profile
              </p>

              {statusError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{statusError}</span>
                </div>
              )}

              <form onSubmit={handleCheckStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={statusEmail}
                    onChange={(e) => setStatusEmail(e.target.value)}
                    placeholder="suryakant@astroveda.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={statusPassword}
                    onChange={(e) => setStatusPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={checkingStatus}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#D9530F] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  {checkingStatus ? 'Checking MySQL Status...' : 'Check Status'}
                </button>
              </form>

              {/* Quick Demo Profiles */}
              <div className="mt-6 pt-4 border-t border-amber-900/10">
                <div className="text-[11px] font-medium text-[#7C5841] mb-2">
                  Seeded Test Profiles (Click to test):
                </div>
                <div className="space-y-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusEmail('suryakant@astroveda.in')
                      setStatusPassword('Astro@123')
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg bg-[#FFF9F2] hover:bg-amber-50 border border-amber-900/10 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-[#2C1408]">suryakant@astroveda.in</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      PENDING
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusEmail('devvrat@astroveda.in')
                      setStatusPassword('Astro@123')
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg bg-[#FFF9F2] hover:bg-amber-50 border border-amber-900/10 flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-[#2C1408]">devvrat@astroveda.in</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      APPROVED
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Live Application Status Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-amber-900/12 p-6 flex flex-col justify-center">
              {!astroProfile ? (
                <div className="text-center py-12 px-4">
                  <UserCheck className="w-10 h-10 text-amber-700/40 mx-auto mb-3" />
                  <div className="text-sm font-medium text-[#2C1408]">
                    Select or enter an email to view live approval status
                  </div>
                  <p className="text-xs text-[#7C5841] mt-1">
                    Real-time verification status synced with Super Admin Dashboard
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-amber-900/10">
                    <div>
                      <span className="text-[11px] text-[#7C5841]">
                        Application #APP-{astroProfile.id} • {astroProfile.city}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-[#2C1408] mt-0.5">
                        {astroProfile.name}
                      </h3>
                      <p className="text-xs text-[#6E4F3A] mt-0.5">
                        {astroProfile.specialty} • {astroProfile.experience_years} Years Exp.
                      </p>
                    </div>

                    {/* Approval Badge */}
                    {astroProfile.approval_status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        APPROVED &amp; LIVE
                      </span>
                    )}
                    {astroProfile.approval_status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                        <Clock className="w-4 h-4" />
                        PENDING ADMIN APPROVAL
                      </span>
                    )}
                    {astroProfile.approval_status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        <XCircle className="w-4 h-4" />
                        APPLICATION REJECTED
                      </span>
                    )}
                  </div>

                  {/* Status Message Banner */}
                  {astroProfile.approval_status === 'PENDING' && (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                      <div className="font-medium">
                        Your profile is currently in the Super Admin Verification Queue.
                      </div>
                      <p className="text-amber-800/90">
                        Super Admin can approve your profile from <code>/admin</code> under the "Pending Approvals" section. Once approved, your profile will immediately appear on the website.
                      </p>
                    </div>
                  )}

                  {astroProfile.approval_status === 'APPROVED' && (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                      <div className="font-medium">
                        Congratulations! Your profile is verified and live on AstroVeda.
                      </div>
                      <p className="text-emerald-800/90">
                        Approved Consultation Rate: <strong>₹{astroProfile.rate_per_min}/min</strong> • Live Status: <strong>{astroProfile.status}</strong>
                      </p>
                    </div>
                  )}

                  {astroProfile.approval_status === 'REJECTED' && (
                    <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/80 text-xs text-red-900 space-y-1">
                      <div className="font-medium">
                        Your application was not approved by Super Admin.
                      </div>
                      <p className="text-red-800/90">
                        Reason: {astroProfile.rejection_reason || 'Minimum verification criteria not met.'}
                      </p>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-amber-900/8">
                      <div className="text-[#7C5841]">Qualification</div>
                      <div className="font-medium text-[#2C1408] mt-0.5">
                        {astroProfile.qualification}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-amber-900/8">
                      <div className="text-[#7C5841]">Languages</div>
                      <div className="font-medium text-[#2C1408] mt-0.5">
                        {astroProfile.languages}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-amber-900/8">
                      <div className="text-[#7C5841]">Tariff Rate</div>
                      <div className="font-medium text-[#D9530F] mt-0.5">
                        ₹{astroProfile.rate_per_min} / min
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
