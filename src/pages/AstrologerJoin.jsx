import React, { useEffect, useRef, useState } from 'react'
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
  Languages,
  Lock,
  AlertCircle,
  XCircle,
  Upload,
  FileText,
  Landmark,
  Search,
  KeyRound,
  Building2,
  Calendar,
  User,
  Globe,
  Check,
} from 'lucide-react'
import {
  registerAstrologerRequest,
  checkAstrologerStatusRequest,
  fetchPublicOnboardingConfigRequest,
  sendOnboardingOtpRequest,
  verifyOnboardingOtpRequest,
  searchLiveLocationsRequest,
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
  'Ashtakoot Matching',
  'Palmistry & Face Reading',
  'Gemstone & Ratna Shastra',
  'Bhrigu Nandi Nadi',
]

const CONSULTATION_MODES = ['CHAT', 'AUDIO', 'VIDEO']

export default function AstrologerJoin({ onBack }) {
  const [activeTab, setActiveTab] = useState('apply') // 'apply' | 'status'

  // Dynamic OTP & Location Config from Admin Settings
  const [publicConfig, setPublicConfig] = useState({
    otp_verification_mode: 'BOTH',
    enable_email_otp: true,
    enable_mobile_otp: true,
    email_otp_mode: 'TEST',
    mobile_otp_mode: 'TEST',
    test_email_otp: '123456',
    test_mobile_otp: '123456',
    location_api_mode: 'AUTO',
    has_google_console_key: false,
    active_location_provider: 'FREE_LIVE_API',
  })

  // Complete Onboarding Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp_phone: '',
    password: '',
    gender: 'Male',
    dob: '1985-06-15',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '221001',
    full_address: 'Varanasi (Kashi), Uttar Pradesh, India',
    latitude: '25.3176',
    longitude: '83.0062',
    location_provider: 'FREE_LIVE_API',
    specialty: 'Vedic Kundli & Marriage',
    secondary_skills: ['Prashna & Muhurat', 'Ashtakoot Matching'],
    languages: 'Hindi, Sanskrit, English',
    experience_years: '10',
    qualification: 'Jyotish Acharya (BHU)',
    university_gurukul: 'Sampurnanand Sanskrit Vishwavidyalaya / BHU',
    consultation_modes: ['CHAT', 'AUDIO', 'VIDEO'],
    rate_per_min: '30',
    chat_rate: '30',
    audio_rate: '35',
    video_rate: '45',
    bio: '',
    achievements: '',
    aadhar_number: '',
    pan_number: '',
    id_proof_type: 'Aadhaar Card & PAN Card',
    id_proof_document: '',
    certificate_document: '',
    profile_photo: '',
    bank_account_holder: '',
    bank_name: '',
    bank_account_number: '',
    bank_ifsc: '',
    upi_id: '',
  })

  // Email OTP State
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtpInput, setEmailOtpInput] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailOtpLoading, setEmailOtpLoading] = useState(false)
  const [emailOtpHint, setEmailOtpHint] = useState('')
  const [emailOtpMessage, setEmailOtpMessage] = useState('')
  const [emailOtpError, setEmailOtpError] = useState('')

  // Mobile OTP State
  const [mobileOtpSent, setMobileOtpSent] = useState(false)
  const [mobileOtpInput, setMobileOtpInput] = useState('')
  const [mobileVerified, setMobileVerified] = useState(false)
  const [mobileOtpLoading, setMobileOtpLoading] = useState(false)
  const [mobileOtpHint, setMobileOtpHint] = useState('')
  const [mobileOtpMessage, setMobileOtpMessage] = useState('')
  const [mobileOtpError, setMobileOtpError] = useState('')

  // Live Location Search State
  const [locationQuery, setLocationQuery] = useState('Varanasi, Uttar Pradesh')
  const [locationResults, setLocationResults] = useState([])
  const [locationLoading, setLocationLoading] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [locationProviderBadge, setLocationProviderBadge] = useState('FREE_LIVE_API')
  const locationBoxRef = useRef(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submittedApplication, setSubmittedApplication] = useState(null)

  // Check Status State
  const [statusEmail, setStatusEmail] = useState('suryakant@astroveda.in')
  const [statusPassword, setStatusPassword] = useState('Astro@123')
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [astroProfile, setAstroProfile] = useState(null)

  useEffect(() => {
    fetchPublicOnboardingConfigRequest().then((cfg) => {
      if (cfg) {
        setPublicConfig(cfg)
        setLocationProviderBadge(cfg.active_location_provider || 'FREE_LIVE_API')
      }
    })
  }, [])

  // Close location dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationBoxRef.current && !locationBoxRef.current.contains(e.target)) {
        setShowLocationDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced Live Location Search
  useEffect(() => {
    if (!showLocationDropdown) return
    const timer = setTimeout(async () => {
      setLocationLoading(true)
      try {
        const res = await searchLiveLocationsRequest(locationQuery)
        if (res && Array.isArray(res.locations)) {
          setLocationResults(res.locations)
          if (res.providerUsed) {
            setLocationProviderBadge(res.providerUsed)
          }
        }
      } finally {
        setLocationLoading(false)
      }
    }, 280)

    return () => clearTimeout(timer)
  }, [locationQuery, showLocationDropdown])

  const handleSelectLocation = (loc) => {
    setFormData((prev) => ({
      ...prev,
      city: loc.city || prev.city,
      state: loc.state || prev.state,
      country: loc.country || 'India',
      pincode: loc.pincode || prev.pincode,
      full_address: loc.formatted_address || `${loc.city}, ${loc.state}`,
      latitude: loc.latitude || '',
      longitude: loc.longitude || '',
      location_provider: loc.provider || locationProviderBadge,
    }))
    setLocationQuery(loc.formatted_address || `${loc.city}, ${loc.state}`)
    setShowLocationDropdown(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev, [name]: value }
      if (name === 'rate_per_min') {
        const num = Number(value) || 30
        updated.chat_rate = String(num)
        updated.audio_rate = String(num + 5)
        updated.video_rate = String(num + 15)
      }
      return updated
    })

    if (name === 'email') {
      setEmailVerified(false)
      setEmailOtpSent(false)
      setEmailOtpMessage('')
    }
    if (name === 'phone') {
      setMobileVerified(false)
      setMobileOtpSent(false)
      setMobileOtpMessage('')
    }
  }

  const handleToggleSecondarySkill = (skill) => {
    setFormData((prev) => {
      const current = prev.secondary_skills || []
      const exists = current.includes(skill)
      return {
        ...prev,
        secondary_skills: exists
          ? current.filter((s) => s !== skill)
          : [...current, skill],
      }
    })
  }

  const handleToggleConsultationMode = (mode) => {
    setFormData((prev) => {
      const current = prev.consultation_modes || []
      const exists = current.includes(mode)
      if (exists && current.length === 1) return prev
      return {
        ...prev,
        consultation_modes: exists
          ? current.filter((m) => m !== mode)
          : [...current, mode],
      }
    })
  }

  // Convert uploaded file (photo / ID proof / certificate) to Data URL
  const handleFileUpload = (fieldName, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('File size must be under 5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: reader.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  // Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setEmailOtpError('Please enter a valid email address first.')
      return
    }
    setEmailOtpError('')
    setEmailOtpMessage('')
    setEmailOtpLoading(true)

    try {
      const res = await sendOnboardingOtpRequest({
        target: formData.email,
        type: 'EMAIL',
        name: formData.name || 'Acharya',
      })
      setEmailOtpSent(true)
      setEmailOtpMessage(res.message || 'OTP sent to your email!')
      if (res.testOtp || res.generatedOtp) {
        const hintCode = res.testOtp || res.generatedOtp
        setEmailOtpHint(hintCode)
        setEmailOtpInput(hintCode)
      } else {
        setEmailOtpHint('')
      }
    } catch (err) {
      setEmailOtpError(err.message || 'Could not send email OTP.')
    } finally {
      setEmailOtpLoading(false)
    }
  }

  // Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    if (!emailOtpInput.trim()) {
      setEmailOtpError('Please enter the 6-digit email OTP.')
      return
    }
    setEmailOtpError('')
    setEmailOtpLoading(true)

    try {
      const res = await verifyOnboardingOtpRequest({
        target: formData.email,
        type: 'EMAIL',
        otp: emailOtpInput.trim(),
      })
      if (res.verified) {
        setEmailVerified(true)
        setEmailOtpMessage('Email verified successfully!')
      }
    } catch (err) {
      setEmailOtpError(err.message || 'Invalid email OTP.')
    } finally {
      setEmailOtpLoading(false)
    }
  }

  // Send Mobile OTP
  const handleSendMobileOtp = async () => {
    if (!formData.phone || formData.phone.trim().length < 8) {
      setMobileOtpError('Please enter a valid mobile number first.')
      return
    }
    setMobileOtpError('')
    setMobileOtpMessage('')
    setMobileOtpLoading(true)

    try {
      const res = await sendOnboardingOtpRequest({
        target: formData.phone,
        type: 'MOBILE',
        name: formData.name || 'Acharya',
      })
      setMobileOtpSent(true)
      setMobileOtpMessage(res.message || 'OTP sent to your mobile number!')
      if (res.testOtp || res.generatedOtp) {
        const hintCode = res.testOtp || res.generatedOtp
        setMobileOtpHint(hintCode)
        setMobileOtpInput(hintCode)
      } else {
        setMobileOtpHint('')
      }
    } catch (err) {
      setMobileOtpError(err.message || 'Could not send mobile OTP.')
    } finally {
      setMobileOtpLoading(false)
    }
  }

  // Verify Mobile OTP
  const handleVerifyMobileOtp = async () => {
    if (!mobileOtpInput.trim()) {
      setMobileOtpError('Please enter the 6-digit mobile OTP.')
      return
    }
    setMobileOtpError('')
    setMobileOtpLoading(true)

    try {
      const res = await verifyOnboardingOtpRequest({
        target: formData.phone,
        type: 'MOBILE',
        otp: mobileOtpInput.trim(),
      })
      if (res.verified) {
        setMobileVerified(true)
        setMobileOtpMessage('Mobile number verified successfully!')
      }
    } catch (err) {
      setMobileOtpError(err.message || 'Invalid mobile OTP.')
    } finally {
      setMobileOtpLoading(false)
    }
  }

  const handleApplySubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (publicConfig.enable_email_otp && !emailVerified) {
      setSubmitError('Please verify your Email Address with OTP before submitting.')
      return
    }

    if (publicConfig.enable_mobile_otp && !mobileVerified) {
      setSubmitError('Please verify your Mobile Number with OTP before submitting.')
      return
    }

    setSubmitting(true)
    try {
      const res = await registerAstrologerRequest({
        ...formData,
        email_verified: emailVerified ? 1 : 0,
        phone_verified: mobileVerified ? 1 : 0,
      })
      setSubmittedApplication(res.application)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
              1. Complete Acharya Onboarding
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

        {/* 3-Step Onboarding Process Strip + Active Verification Mode Badge */}
        <div className="bg-[#FFF9F2] rounded-2xl border border-amber-900/12 p-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-amber-900/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#2C1408]">
              <ShieldCheck className="w-4 h-4 text-[#D9530F]" />
              <span>Acharya Empanelment &amp; KYC Verification Portal</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-orange-100/80 text-[#D9530F] font-medium">
                OTP Policy:{' '}
                {publicConfig.otp_verification_mode === 'BOTH' &&
                  'Email + Mobile OTP Required'}
                {publicConfig.otp_verification_mode === 'EMAIL_ONLY' &&
                  'Email OTP Required'}
                {publicConfig.otp_verification_mode === 'MOBILE_ONLY' &&
                  'Mobile OTP Required'}
                {publicConfig.otp_verification_mode === 'NONE' &&
                  'Direct Onboarding (OTP Disabled)'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-900 font-medium">
                Location API:{' '}
                {locationProviderBadge === 'GOOGLE_CONSOLE'
                  ? 'Google Console Places API'
                  : 'Free Live Geocoding API'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#D9530F] flex items-center justify-center text-xs font-semibold shrink-0">
                01
              </div>
              <div>
                <div className="text-xs font-semibold text-[#2C1408]">
                  Verify Email &amp; Mobile via OTP
                </div>
                <p className="text-[11px] text-[#7C5841] mt-0.5">
                  Instant OTP verification (Supports both Admin Test OTP &amp; Live Nodemailer/SMS)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-semibold shrink-0">
                02
              </div>
              <div>
                <div className="text-xs font-semibold text-[#2C1408]">
                  Complete Profile, KYC &amp; Bank Details
                </div>
                <p className="text-[11px] text-[#7C5841] mt-0.5">
                  Upload Profile Photo, Aadhaar/PAN, Jyotish Certificate &amp; Live Location
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-semibold shrink-0">
                03
              </div>
              <div>
                <div className="text-xs font-semibold text-[#2C1408]">
                  Super Admin Review &amp; Go Live
                </div>
                <p className="text-[11px] text-[#7C5841] mt-0.5">
                  Super Admin inspects all uploaded details in Admin Panel &amp; approves your profile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: ASTROLOGER REGISTRATION FORM */}
        {activeTab === 'apply' && (
          <div className="bg-white rounded-2xl border border-amber-900/12 p-6 sm:p-8">
            {submittedApplication ? (
              <div className="max-w-2xl mx-auto py-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#2C1408]">
                  Complete Vedic Profile &amp; KYC Uploaded Successfully!
                </h2>

                <p className="text-xs sm:text-sm text-[#6E4F3A] leading-relaxed">
                  Namaste{' '}
                  <span className="font-semibold text-[#2C1408]">
                    {submittedApplication.name}
                  </span>
                  , all your personal, location, qualification, KYC and payout details have been sent to the Super Admin Console with status{' '}
                  <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-medium text-xs">
                    PENDING APPROVAL
                  </span>
                  .
                </p>

                <div className="bg-[#FFF9F2] rounded-xl border border-amber-900/10 p-4 text-left text-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[#7C5841] block">Application ID:</span>
                    <span className="font-semibold text-[#2C1408]">
                      #APP-{submittedApplication.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7C5841] block">Registered Email:</span>
                    <span className="font-semibold text-[#2C1408]">
                      {submittedApplication.email}{' '}
                      {submittedApplication.email_verified ? '✓ Verified' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7C5841] block">Mobile Number:</span>
                    <span className="font-semibold text-[#2C1408]">
                      {submittedApplication.phone}{' '}
                      {submittedApplication.phone_verified ? '✓ Verified' : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7C5841] block">Location:</span>
                    <span className="font-semibold text-[#2C1408]">
                      {submittedApplication.city}, {submittedApplication.state} (
                      {submittedApplication.pincode || 'India'})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7C5841] block">Primary Expertise:</span>
                    <span className="font-semibold text-[#D9530F]">
                      {submittedApplication.specialty}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7C5841] block">Tariff Rates:</span>
                    <span className="font-semibold text-[#2C1408]">
                      Chat ₹{submittedApplication.chat_rate} • Audio ₹
                      {submittedApplication.audio_rate} • Video ₹
                      {submittedApplication.video_rate}/m
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusEmail(submittedApplication.email)
                      setStatusPassword(formData.password || 'Astro@123')
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
                      Acharya Complete Onboarding &amp; KYC Empanelment Form
                    </h1>
                    <p className="text-xs text-[#7C5841] mt-0.5">
                      All details, documents, and OTP verifications are synced directly with the Super Admin Panel
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/70 text-[#D9530F] text-xs font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Jyotish Network
                  </span>
                </div>

                {submitError && (
                  <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleApplySubmit} className="space-y-8">
                  {/* SECTION 1: PERSONAL & CONTACT + OTP VERIFICATION */}
                  <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-900/12 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/10 pb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#D9530F]" />
                        <h2 className="text-sm font-semibold text-[#2C1408]">
                          1. Personal Details &amp; Contact Verification (OTP)
                        </h2>
                      </div>
                      <span className="text-[11px] text-[#7C5841]">
                        * Mandatory Fields
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Full Name */}
                      <div className="sm:col-span-2">
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        >
                          <option value="Male">Male (Acharya / Pandit)</option>
                          <option value="Female">Female (Sadhvi / Jyotishi)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Date of Birth *
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="date"
                            name="dob"
                            required
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Mobile OTP Verification Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
                      {/* Email + Email OTP Box */}
                      <div className="p-4 rounded-xl bg-white border border-amber-900/12 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-[#3B2314] flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#D9530F]" />
                            <span>Email Address *</span>
                          </label>
                          {publicConfig.enable_email_otp ? (
                            emailVerified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Email OTP Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium">
                                {publicConfig.email_otp_mode === 'LIVE'
                                  ? 'Live Nodemailer OTP'
                                  : `Test OTP Mode (${publicConfig.test_email_otp || '123456'})`}
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              OTP Not Required by Admin
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="bhaskar@astroveda.in"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                          />
                          {publicConfig.enable_email_otp && !emailVerified && (
                            <button
                              type="button"
                              disabled={emailOtpLoading}
                              onClick={handleSendEmailOtp}
                              className="px-3.5 py-2 rounded-xl bg-[#D9530F] hover:bg-[#C2410C] disabled:opacity-60 text-white text-xs font-medium shrink-0 cursor-pointer"
                            >
                              {emailOtpLoading
                                ? 'Sending...'
                                : emailOtpSent
                                  ? 'Resend OTP'
                                  : 'Send Email OTP'}
                            </button>
                          )}
                        </div>

                        {publicConfig.enable_email_otp && emailOtpSent && !emailVerified && (
                          <div className="space-y-2 pt-1">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <KeyRound className="w-3.5 h-3.5 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  maxLength={6}
                                  value={emailOtpInput}
                                  onChange={(e) => setEmailOtpInput(e.target.value)}
                                  placeholder="Enter 6-digit Email OTP"
                                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FFF9F2] border border-amber-900/20 text-xs font-semibold tracking-widest text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                                />
                              </div>
                              <button
                                type="button"
                                disabled={emailOtpLoading}
                                onClick={handleVerifyEmailOtp}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer"
                              >
                                Verify OTP
                              </button>
                            </div>
                            {emailOtpHint && (
                              <div className="flex items-center justify-between text-[11px] bg-amber-50/80 border border-amber-200/80 text-amber-900 px-3 py-1.5 rounded-lg">
                                <span>
                                  Testing OTP Code: <strong>{emailOtpHint}</strong>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setEmailOtpInput(emailOtpHint)}
                                  className="text-[#D9530F] font-semibold underline cursor-pointer"
                                >
                                  Fill OTP
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {emailOtpMessage && (
                          <p className="text-[11px] text-emerald-700 font-medium">
                            {emailOtpMessage}
                          </p>
                        )}
                        {emailOtpError && (
                          <p className="text-[11px] text-red-600 font-medium">
                            {emailOtpError}
                          </p>
                        )}
                      </div>

                      {/* Mobile Number + Mobile OTP Box */}
                      <div className="p-4 rounded-xl bg-white border border-amber-900/12 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-[#3B2314] flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#D9530F]" />
                            <span>Mobile Number *</span>
                          </label>
                          {publicConfig.enable_mobile_otp ? (
                            mobileVerified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Mobile OTP Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium">
                                {publicConfig.mobile_otp_mode === 'LIVE'
                                  ? 'Live SMS Gateway'
                                  : `Test OTP Mode (${publicConfig.test_mobile_otp || '123456'})`}
                              </span>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              OTP Not Required by Admin
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                            className="flex-1 px-3.5 py-2 rounded-xl bg-[#FFFDF9] border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                          />
                          {publicConfig.enable_mobile_otp && !mobileVerified && (
                            <button
                              type="button"
                              disabled={mobileOtpLoading}
                              onClick={handleSendMobileOtp}
                              className="px-3.5 py-2 rounded-xl bg-[#D9530F] hover:bg-[#C2410C] disabled:opacity-60 text-white text-xs font-medium shrink-0 cursor-pointer"
                            >
                              {mobileOtpLoading
                                ? 'Sending...'
                                : mobileOtpSent
                                  ? 'Resend OTP'
                                  : 'Send Mobile OTP'}
                            </button>
                          )}
                        </div>

                        {publicConfig.enable_mobile_otp &&
                          mobileOtpSent &&
                          !mobileVerified && (
                            <div className="space-y-2 pt-1">
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <KeyRound className="w-3.5 h-3.5 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                                  <input
                                    type="text"
                                    maxLength={6}
                                    value={mobileOtpInput}
                                    onChange={(e) =>
                                      setMobileOtpInput(e.target.value)
                                    }
                                    placeholder="Enter 6-digit Mobile OTP"
                                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FFF9F2] border border-amber-900/20 text-xs font-semibold tracking-widest text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                                  />
                                </div>
                                <button
                                  type="button"
                                  disabled={mobileOtpLoading}
                                  onClick={handleVerifyMobileOtp}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer"
                                >
                                  Verify OTP
                                </button>
                              </div>
                              {mobileOtpHint && (
                                <div className="flex items-center justify-between text-[11px] bg-amber-50/80 border border-amber-200/80 text-amber-900 px-3 py-1.5 rounded-lg">
                                  <span>
                                    Testing Mobile OTP:{' '}
                                    <strong>{mobileOtpHint}</strong>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setMobileOtpInput(mobileOtpHint)
                                    }
                                    className="text-[#D9530F] font-semibold underline cursor-pointer"
                                  >
                                    Fill OTP
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                        {mobileOtpMessage && (
                          <p className="text-[11px] text-emerald-700 font-medium">
                            {mobileOtpMessage}
                          </p>
                        )}
                        {mobileOtpError && (
                          <p className="text-[11px] text-red-600 font-medium">
                            {mobileOtpError}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp Number, Password & Profile Photo Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          WhatsApp Number (for Consultation Alerts)
                        </label>
                        <input
                          type="text"
                          name="whatsapp_phone"
                          value={formData.whatsapp_phone}
                          onChange={handleChange}
                          placeholder="Same as mobile or +91..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                      </div>

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
                            placeholder="Enter login password"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Acharya Profile Photo Upload
                        </label>
                        <div className="flex items-center gap-3">
                          {formData.profile_photo && (
                            <img
                              src={formData.profile_photo}
                              alt="Preview"
                              className="w-10 h-10 rounded-xl object-cover border border-amber-900/20 shrink-0"
                            />
                          )}
                          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-dashed border-amber-900/25 hover:border-[#D9530F] text-xs text-[#5C3D28] cursor-pointer">
                            <Upload className="w-3.5 h-3.5 text-[#D9530F]" />
                            <span className="truncate">
                              {formData.profile_photo
                                ? 'Change Photo ✓'
                                : 'Upload Photo (JPG/PNG)'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload('profile_photo', e)
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: LIVE LOCATION SEARCH (GOOGLE CONSOLE + FREE LIVE API FALLBACK) */}
                  <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-900/12 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/10 pb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#D9530F]" />
                        <h2 className="text-sm font-semibold text-[#2C1408]">
                          2. Live Location &amp; Sacred Center Address
                        </h2>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-900 text-[11px] font-medium">
                        <Globe className="w-3 h-3 text-[#D9530F]" />
                        {locationProviderBadge === 'GOOGLE_CONSOLE'
                          ? 'Powered by Google Console API'
                          : 'Powered by Free Live Location API (Auto-Fallback)'}
                      </span>
                    </div>

                    {/* Live Search Autocomplete Input */}
                    <div ref={locationBoxRef} className="relative">
                      <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                        Search City / Area / Pincode (Live Location API) *
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 text-[#D9530F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={locationQuery}
                          onFocus={() => setShowLocationDropdown(true)}
                          onChange={(e) => {
                            setLocationQuery(e.target.value)
                            setShowLocationDropdown(true)
                          }}
                          placeholder="Type city name e.g. Varanasi, Ujjain, Jaipur, Delhi, Mumbai..."
                          className="w-full pl-10 pr-28 py-2.5 rounded-xl bg-white border border-amber-900/20 text-xs sm:text-sm text-[#2C1408] focus:outline-none focus:border-[#D9530F]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] px-2 py-0.5 rounded bg-orange-50 text-[#D9530F] font-medium">
                          {locationLoading ? 'Searching...' : 'Live Search'}
                        </span>
                      </div>

                      {showLocationDropdown && locationResults.length > 0 && (
                        <div className="absolute z-30 mt-1.5 w-full bg-white rounded-xl border border-amber-900/15 shadow-xl max-h-64 overflow-y-auto divide-y divide-amber-900/10">
                          {locationResults.map((loc, idx) => (
                            <button
                              key={`${loc.city}-${loc.latitude}-${idx}`}
                              type="button"
                              onClick={() => handleSelectLocation(loc)}
                              className="w-full text-left px-4 py-2.5 hover:bg-orange-50/70 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                            >
                              <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-[#D9530F] shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-xs font-semibold text-[#2C1408]">
                                    {loc.city}
                                    {loc.state ? `, ${loc.state}` : ''}
                                    {loc.pincode ? ` (${loc.pincode})` : ''}
                                  </div>
                                  <div className="text-[11px] text-[#7C5841]">
                                    {loc.formatted_address}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                                {loc.provider === 'GOOGLE_CONSOLE'
                                  ? 'Google API'
                                  : 'Free Live API'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          City / Sacred Center *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          State / Province *
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Uttar Pradesh"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          PIN / Postal Code
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="221001"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Geo Coordinates (Lat / Lng)
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={
                            formData.latitude && formData.longitude
                              ? `${Number(formData.latitude).toFixed(4)}, ${Number(
                                  formData.longitude
                                ).toFixed(4)}`
                              : 'Auto-detected'
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-amber-50/50 border border-amber-900/15 text-xs text-[#6E4F3A]"
                        />
                      </div>

                      <div className="sm:col-span-2 lg:col-span-4">
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Complete Ashram / Chamber / Residential Address
                        </label>
                        <input
                          type="text"
                          name="full_address"
                          value={formData.full_address}
                          onChange={handleChange}
                          placeholder="Full street address, landmark, city, state"
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: VEDIC QUALIFICATIONS, SKILLS & TARIFF */}
                  <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-900/12 space-y-5">
                    <div className="flex items-center gap-2 border-b border-amber-900/10 pb-3">
                      <Award className="w-4 h-4 text-[#D9530F]" />
                      <h2 className="text-sm font-semibold text-[#2C1408]">
                        3. Vedic Qualifications, Specializations &amp; Tariff Rates
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Experience (Years) *
                        </label>
                        <input
                          type="number"
                          name="experience_years"
                          min="1"
                          max="60"
                          required
                          value={formData.experience_years}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Jyotish Degree / Qualification *
                        </label>
                        <input
                          type="text"
                          name="qualification"
                          required
                          value={formData.qualification}
                          onChange={handleChange}
                          placeholder="Jyotish Acharya – BHU"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          University / Gurukul / Board
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            name="university_gurukul"
                            value={formData.university_gurukul}
                            onChange={handleChange}
                            placeholder="BHU / Sampurnanand University"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Languages Spoken *
                        </label>
                        <div className="relative">
                          <Languages className="w-4 h-4 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            name="languages"
                            required
                            value={formData.languages}
                            onChange={handleChange}
                            placeholder="Hindi, Sanskrit, English"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Primary Expertise */}
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
                                : 'bg-white text-[#5C3D28] border-amber-900/15 hover:bg-amber-50/70'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Skills (Multi-select) */}
                    <div>
                      <label className="block text-xs font-medium text-[#3B2314] mb-2">
                        Additional / Secondary Skills (Select multiple)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SKILL_OPTIONS.map((skill) => {
                          const selected = (
                            formData.secondary_skills || []
                          ).includes(skill)
                          return (
                            <button
                              key={`sec-${skill}`}
                              type="button"
                              onClick={() => handleToggleSecondarySkill(skill)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
                                selected
                                  ? 'bg-amber-100 text-amber-950 border-amber-400'
                                  : 'bg-white text-[#6E4F3A] border-amber-900/15 hover:bg-amber-50/50'
                              }`}
                            >
                              {selected && <Check className="w-3 h-3 text-[#D9530F]" />}
                              <span>{skill}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Tariff Rates & Consultation Modes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Chat Tariff (₹ / Min) *
                        </label>
                        <div className="relative">
                          <IndianRupee className="w-3.5 h-3.5 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            name="rate_per_min"
                            min="10"
                            max="500"
                            required
                            value={formData.rate_per_min}
                            onChange={handleChange}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Audio Call Tariff (₹ / Min)
                        </label>
                        <div className="relative">
                          <IndianRupee className="w-3.5 h-3.5 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            name="audio_rate"
                            min="10"
                            max="500"
                            value={formData.audio_rate}
                            onChange={handleChange}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Video Call Tariff (₹ / Min)
                        </label>
                        <div className="relative">
                          <IndianRupee className="w-3.5 h-3.5 text-[#A66E4E] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            name="video_rate"
                            min="10"
                            max="500"
                            value={formData.video_rate}
                            onChange={handleChange}
                            className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Available Channels
                        </label>
                        <div className="flex gap-1.5">
                          {CONSULTATION_MODES.map((m) => {
                            const active = (
                              formData.consultation_modes || []
                            ).includes(m)
                            return (
                              <button
                                key={m}
                                type="button"
                                onClick={() => handleToggleConsultationMode(m)}
                                className={`flex-1 py-2 rounded-xl text-[11px] font-medium border cursor-pointer ${
                                  active
                                    ? 'bg-[#D9530F] text-white border-[#D9530F]'
                                    : 'bg-white text-[#5C3D28] border-amber-900/15'
                                }`}
                              >
                                {m}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Detailed Vedic Bio &amp; Consultation Approach *
                        </label>
                        <textarea
                          rows={3}
                          name="bio"
                          required
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Describe your lineage, Kundli analysis methodology, Dasha readings & remedies..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Key Achievements, Awards &amp; Publications
                        </label>
                        <textarea
                          rows={3}
                          name="achievements"
                          value={formData.achievements}
                          onChange={handleChange}
                          placeholder="e.g. Jyotish Ratna Gold Medalist, 5000+ horoscopes analyzed..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: KYC DOCUMENTS & BANK / UPI PAYOUT DETAILS */}
                  <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-amber-900/12 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-[#D9530F]" />
                        <h2 className="text-sm font-semibold text-[#2C1408]">
                          4. KYC Identity Proof, Certificates &amp; Bank Payout Details
                        </h2>
                      </div>
                      <span className="text-[11px] text-[#7C5841]">
                        Uploaded directly to Super Admin Verification Vault
                      </span>
                    </div>

                    {/* KYC Numbers & Document Uploads */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Aadhaar Card Number *
                        </label>
                        <input
                          type="text"
                          name="aadhar_number"
                          required
                          value={formData.aadhar_number}
                          onChange={handleChange}
                          placeholder="XXXX-XXXX-1234"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          PAN Card Number *
                        </label>
                        <input
                          type="text"
                          name="pan_number"
                          required
                          value={formData.pan_number}
                          onChange={handleChange}
                          placeholder="ABCDE1234F"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-900/15 text-xs sm:text-sm uppercase text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Upload Govt ID Proof (Aadhaar/PAN)
                        </label>
                        <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-dashed border-amber-900/25 hover:border-[#D9530F] text-xs text-[#5C3D28] cursor-pointer">
                          <FileText className="w-3.5 h-3.5 text-[#D9530F]" />
                          <span className="truncate">
                            {formData.id_proof_document
                              ? 'ID Proof Attached ✓'
                              : 'Upload ID Proof'}
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) =>
                              handleFileUpload('id_proof_document', e)
                            }
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Upload Jyotish Degree / Certificate
                        </label>
                        <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-dashed border-amber-900/25 hover:border-[#D9530F] text-xs text-[#5C3D28] cursor-pointer">
                          <Award className="w-3.5 h-3.5 text-[#D9530F]" />
                          <span className="truncate">
                            {formData.certificate_document
                              ? 'Certificate Attached ✓'
                              : 'Upload Certificate'}
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) =>
                              handleFileUpload('certificate_document', e)
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Bank & UPI Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          name="bank_account_holder"
                          value={formData.bank_account_holder}
                          onChange={handleChange}
                          placeholder="As per bank passbook"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          name="bank_name"
                          value={formData.bank_name}
                          onChange={handleChange}
                          placeholder="e.g. State Bank of India"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          Bank Account Number
                        </label>
                        <input
                          type="text"
                          name="bank_account_number"
                          value={formData.bank_account_number}
                          onChange={handleChange}
                          placeholder="000011112222"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          name="bank_ifsc"
                          value={formData.bank_ifsc}
                          onChange={handleChange}
                          placeholder="SBIN0001234"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/15 text-xs uppercase text-[#2C1408]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#3B2314] mb-1.5">
                          UPI ID (for Instant Payout)
                        </label>
                        <input
                          type="text"
                          name="upi_id"
                          value={formData.upi_id}
                          onChange={handleChange}
                          placeholder="acharya@upi"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-900/15 text-xs text-[#2C1408]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Footer */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-xs text-[#7C5841] space-y-0.5">
                      <div>
                        Verification Status:{' '}
                        <strong className="text-[#2C1408]">
                          Email {emailVerified ? '✓ Verified' : 'Pending'} • Mobile{' '}
                          {mobileVerified ? '✓ Verified' : 'Pending'}
                        </strong>
                      </div>
                      <div>
                        All uploaded details &amp; documents will be visible to Super Admin for instant approval.
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 rounded-xl bg-[#D9530F] hover:bg-[#C2410C] disabled:opacity-60 text-white text-xs sm:text-sm font-medium transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {submitting
                          ? 'Uploading Profile & KYC to Admin...'
                          : 'Submit Complete Profile for Admin Approval'}
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
                  {checkingStatus ? 'Checking Status...' : 'Check Status'}
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
                    <div className="flex items-center gap-3">
                      {astroProfile.profile_photo ? (
                        <img
                          src={astroProfile.profile_photo}
                          alt={astroProfile.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-amber-900/15"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#D9530F] flex items-center justify-center font-semibold text-sm">
                          {astroProfile.name?.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="text-[11px] text-[#7C5841]">
                          Application #APP-{astroProfile.id} • {astroProfile.city}
                          {astroProfile.state ? `, ${astroProfile.state}` : ''}
                        </span>
                        <h3 className="font-display text-xl font-semibold text-[#2C1408] mt-0.5">
                          {astroProfile.name}
                        </h3>
                        <p className="text-xs text-[#6E4F3A] mt-0.5">
                          {astroProfile.specialty} • {astroProfile.experience_years}{' '}
                          Years Exp.
                        </p>
                      </div>
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
                        Your complete profile &amp; KYC documents are in the Super Admin Verification Queue.
                      </div>
                      <p className="text-amber-800/90">
                        Super Admin can inspect your full profile and approve it from{' '}
                        <code>/admin</code>.
                      </p>
                    </div>
                  )}

                  {astroProfile.approval_status === 'APPROVED' && (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                      <div className="font-medium">
                        Congratulations! Your profile is verified and live on AstroVeda.
                      </div>
                      <p className="text-emerald-800/90">
                        Approved Consultation Rate:{' '}
                        <strong>₹{astroProfile.rate_per_min}/min</strong> • Live Status:{' '}
                        <strong>{astroProfile.status}</strong>
                      </p>
                    </div>
                  )}

                  {astroProfile.approval_status === 'REJECTED' && (
                    <div className="p-4 rounded-xl bg-red-50/70 border border-red-200/80 text-xs text-red-900 space-y-1">
                      <div className="font-medium">
                        Your application was not approved by Super Admin.
                      </div>
                      <p className="text-red-800/90">
                        Reason:{' '}
                        {astroProfile.rejection_reason ||
                          'Minimum verification criteria not met.'}
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
                      <div className="text-[#7C5841]">Tariff Rates</div>
                      <div className="font-medium text-[#D9530F] mt-0.5">
                        ₹{astroProfile.rate_per_min} / min
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-amber-900/8">
                      <div className="text-[#7C5841]">OTP Verification</div>
                      <div className="font-medium text-emerald-700 mt-0.5">
                        Email {astroProfile.email_verified ? '✓' : '•'} / Mobile{' '}
                        {astroProfile.phone_verified ? '✓' : '•'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-amber-900/8">
                      <div className="text-[#7C5841]">KYC PAN / Aadhaar</div>
                      <div className="font-medium text-[#2C1408] mt-0.5">
                        {astroProfile.pan_number || astroProfile.aadhar_number || 'Submitted'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-amber-900/8">
                      <div className="text-[#7C5841]">Location Address</div>
                      <div className="font-medium text-[#2C1408] mt-0.5 truncate">
                        {astroProfile.full_address || astroProfile.city}
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
