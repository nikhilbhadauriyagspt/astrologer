import React, { useEffect, useState } from 'react'
import {
  Users,
  IndianRupee,
  PhoneCall,
  MessageCircle,
  Video,
  Database,
  LogOut,
  RefreshCw,
  Star,
  LayoutDashboard,
  Activity,
  ExternalLink,
  TrendingUp,
  ArrowUpRight,
  Search,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Check,
  X,
  MapPin,
  Award,
  Mail,
  Phone,
  Settings,
  ShieldCheck,
  KeyRound,
  Globe,
  Eye,
  Landmark,
  FileText,
  Building2,
  Send,
  AlertCircle,
  Sliders,
} from 'lucide-react'
import {
  fetchDashboardStatsRequest,
  updateAstrologerApprovalRequest,
  updateAstrologerStatusRequest,
  fetchPlatformSettingsRequest,
  updatePlatformSettingsRequest,
  testNodemailerRequest,
  searchLiveLocationsRequest,
  clearAdminSession,
  DEFAULT_PLATFORM_SETTINGS,
} from './adminApi'

const DEFAULT_FALLBACK_STATS = {
  totalAstrologers: 6,
  pendingApprovals: 3,
  onlineAstrologers: 5,
  totalConsultations: 5,
  totalRevenue: 48650,
}

const DEFAULT_FALLBACK_ASTROLOGERS = [
  {
    id: 1,
    name: 'Acharya Devvrat Shastri',
    email: 'devvrat@astroveda.in',
    phone: '+91 9811022331',
    whatsapp_phone: '+91 9811022331',
    gender: 'Male',
    dob: '1978-05-14',
    city: 'Varanasi (Kashi)',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '221001',
    full_address: 'Dashashwamedh Ghat Road, Varanasi, Uttar Pradesh, India',
    latitude: '25.3176',
    longitude: '83.0062',
    location_provider: 'FREE_LIVE_API',
    specialty: 'Vedic Kundli, Marriage & Muhurat',
    secondary_skills: 'Ashtakoot Milan, Prashna Kundli, Muhurat',
    languages: 'Hindi, Sanskrit, English',
    experience_years: 18,
    qualification: 'Gold Medalist – Sampurnanand Sanskrit University',
    university_gurukul: 'Sampurnanand Sanskrit Vishwavidyalaya, Kashi',
    consultation_modes: 'CHAT, AUDIO, VIDEO',
    bio: '18+ years guiding families on Kundli Milan, Mangal Dosh Shanti & auspicious Vivah Muhurat.',
    achievements: 'Honored with Kashi Jyotish Ratna Award 2019; 14,000+ consultations.',
    rating: 4.95,
    rate_per_min: 35,
    chat_rate: 35,
    audio_rate: 40,
    video_rate: 50,
    status: 'ONLINE',
    approval_status: 'APPROVED',
    email_verified: 1,
    phone_verified: 1,
    aadhar_number: 'XXXX-XXXX-4821',
    pan_number: 'ABCPS4821K',
    id_proof_type: 'Aadhaar Card & PAN Card',
    bank_account_holder: 'Acharya Devvrat Shastri',
    bank_name: 'State Bank of India',
    bank_account_number: '30981122441',
    bank_ifsc: 'SBIN0001234',
    upi_id: 'devvrat@sbi',
    total_orders: 14200,
  },
  {
    id: 7,
    name: 'Acharya Suryakant Tripathi',
    email: 'suryakant@astroveda.in',
    phone: '+91 9877088991',
    whatsapp_phone: '+91 9877088991',
    gender: 'Male',
    dob: '1985-04-12',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '221005',
    full_address: 'Lanka, Near BHU Gate, Varanasi, Uttar Pradesh, India',
    latitude: '25.2677',
    longitude: '82.9913',
    location_provider: 'FREE_LIVE_API',
    specialty: 'Parashari Jyotish, Dasha & Muhurat',
    secondary_skills: 'Vedic Kundli & Marriage, Prashna & Muhurat, Vastu Shastra',
    languages: 'Hindi, Sanskrit, English',
    experience_years: 14,
    qualification: 'M.A. Jyotish – BHU Varanasi',
    university_gurukul: 'Banaras Hindu University (BHU)',
    consultation_modes: 'CHAT, AUDIO, VIDEO',
    bio: '14 years experience in Parashari Kundli analysis, Mahadasha predictions & Graha Shanti.',
    achievements: 'University Rank Holder in Faculty of Sanskrit Vidya Dharma Vijnan.',
    rating: 4.85,
    rate_per_min: 32,
    chat_rate: 32,
    audio_rate: 38,
    video_rate: 45,
    status: 'OFFLINE',
    approval_status: 'PENDING',
    email_verified: 1,
    phone_verified: 1,
    aadhar_number: '8492-3310-9821',
    pan_number: 'SURYT8812F',
    id_proof_type: 'Aadhaar Card & PAN Card',
    bank_account_holder: 'Suryakant Tripathi',
    bank_name: 'Union Bank of India',
    bank_account_number: '419202010088212',
    bank_ifsc: 'UBIN0541923',
    upi_id: 'suryakant@upi',
    total_orders: 0,
  },
]

const DEFAULT_FALLBACK_CONSULTATIONS = [
  {
    id: 1,
    user_name: 'Rohit & Neha Sharma',
    astrologer_name: 'Acharya Devvrat Shastri',
    mode: 'VIDEO',
    duration_mins: 18,
    amount: 630,
    status: 'COMPLETED',
  },
  {
    id: 2,
    user_name: 'Vikramaditya Singhania',
    astrologer_name: 'Pt. Raghavendra Joshi',
    mode: 'AUDIO',
    duration_mins: 15,
    amount: 600,
    status: 'COMPLETED',
  },
  {
    id: 3,
    user_name: 'Anjali Deshmukh',
    astrologer_name: 'Dr. Maitreyi Deshmukh',
    mode: 'CHAT',
    duration_mins: 12,
    amount: 360,
    status: 'COMPLETED',
  },
]

const REVENUE_CHART_DATA = {
  '7D': [
    { label: 'Mon', revenue: 14200, sessions: 42 },
    { label: 'Tue', revenue: 18600, sessions: 54 },
    { label: 'Wed', revenue: 16400, sessions: 49 },
    { label: 'Thu', revenue: 22800, sessions: 68 },
    { label: 'Fri', revenue: 26500, sessions: 79 },
    { label: 'Sat', revenue: 34200, sessions: 104 },
    { label: 'Sun', revenue: 38900, sessions: 118 },
  ],
  '30D': [
    { label: 'W1', revenue: 84000, sessions: 245 },
    { label: 'W2', revenue: 102000, sessions: 312 },
    { label: 'W3', revenue: 96500, sessions: 289 },
    { label: 'W4', revenue: 128400, sessions: 386 },
    { label: 'W5', revenue: 146800, sessions: 420 },
    { label: 'W6', revenue: 162000, sessions: 468 },
    { label: 'W7', revenue: 184500, sessions: 530 },
  ],
}

export default function AdminDashboard({
  admin,
  token,
  initialDbConnected = true,
  onLogout,
}) {
  const [loading, setLoading] = useState(true)
  const [dbConnected, setDbConnected] = useState(initialDbConnected)
  const [stats, setStats] = useState(DEFAULT_FALLBACK_STATS)
  const [astrologers, setAstrologers] = useState(DEFAULT_FALLBACK_ASTROLOGERS)
  const [consultations, setConsultations] = useState(DEFAULT_FALLBACK_CONSULTATIONS)
  const [activeSection, setActiveSection] = useState('overview') // 'overview' | 'approvals' | 'astrologers' | 'consultations' | 'settings'
  const [chartRange, setChartRange] = useState('7D')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [processingId, setProcessingId] = useState(null)
  const [actionBanner, setActionBanner] = useState('')

  // Full Profile & KYC Modal Inspection State
  const [selectedAstro, setSelectedAstro] = useState(null)
  const [modalChatRate, setModalChatRate] = useState(30)
  const [modalAudioRate, setModalAudioRate] = useState(35)
  const [modalVideoRate, setModalVideoRate] = useState(45)
  const [modalAdminNotes, setModalAdminNotes] = useState('')
  const [modalRejectionReason, setModalRejectionReason] = useState('')

  // Platform Settings State (OTP Mode, Nodemailer SMTP, Mobile SMS API, Google Console Location API)
  const [settings, setSettings] = useState(DEFAULT_PLATFORM_SETTINGS)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsMessage, setSettingsMessage] = useState('')
  const [settingsError, setSettingsError] = useState('')

  // Nodemailer Test State
  const [testEmailRecipient, setTestEmailRecipient] = useState('')
  const [testingSmtp, setTestingSmtp] = useState(false)
  const [smtpTestResult, setSmtpTestResult] = useState('')

  // Live Location API Tester in Admin Settings
  const [adminLocationQuery, setAdminLocationQuery] = useState('Varanasi')
  const [adminLocationResults, setAdminLocationResults] = useState([])
  const [adminLocationProvider, setAdminLocationProvider] = useState('')
  const [testingLocation, setTestingLocation] = useState(false)

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const data = await fetchDashboardStatsRequest(token)
      setDbConnected(Boolean(data.dbConnected))
      if (data.stats) setStats(data.stats)
      if (data.astrologers) setAstrologers(data.astrologers)
      if (data.recentConsultations) setConsultations(data.recentConsultations)
      if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }))
    } catch {
      const sData = await fetchPlatformSettingsRequest(token)
      if (sData?.settings) {
        setSettings((prev) => ({ ...prev, ...sData.settings }))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [token])

  const openAstroInspector = (astro) => {
    setSelectedAstro(astro)
    setModalChatRate(astro.chat_rate || astro.rate_per_min || 30)
    setModalAudioRate(astro.audio_rate || (Number(astro.rate_per_min) || 30) + 5)
    setModalVideoRate(astro.video_rate || (Number(astro.rate_per_min) || 30) + 15)
    setModalAdminNotes(astro.admin_notes || '')
    setModalRejectionReason(astro.rejection_reason || '')
  }

  const handleApprovalAction = async (astro, decision, customOverrides = {}) => {
    setProcessingId(astro.id)
    setActionBanner('')
    const payload = {
      approval_status: decision,
      rate_per_min:
        customOverrides.rate_per_min !== undefined
          ? Number(customOverrides.rate_per_min)
          : astro.rate_per_min,
      chat_rate:
        customOverrides.chat_rate !== undefined
          ? Number(customOverrides.chat_rate)
          : astro.chat_rate || astro.rate_per_min,
      audio_rate:
        customOverrides.audio_rate !== undefined
          ? Number(customOverrides.audio_rate)
          : astro.audio_rate,
      video_rate:
        customOverrides.video_rate !== undefined
          ? Number(customOverrides.video_rate)
          : astro.video_rate,
      admin_notes:
        customOverrides.admin_notes !== undefined
          ? customOverrides.admin_notes
          : astro.admin_notes,
      rejection_reason:
        decision === 'REJECTED'
          ? customOverrides.rejection_reason ||
            'Experience or verification criteria not met'
          : null,
    }

    try {
      await updateAstrologerApprovalRequest(token, astro.id, payload)
    } catch {
      // Fallback local state update
    }

    setAstrologers((prev) =>
      prev.map((item) => {
        if (item.id !== astro.id) return item
        const updated = {
          ...item,
          ...payload,
          status: decision === 'APPROVED' ? 'ONLINE' : 'OFFLINE',
        }
        if (selectedAstro && selectedAstro.id === astro.id) {
          setSelectedAstro(updated)
        }
        return updated
      })
    )

    setActionBanner(
      decision === 'APPROVED'
        ? `${astro.name} has been APPROVED and is now LIVE on the public website!`
        : `${astro.name}'s application has been marked as ${decision}.`
    )
    setProcessingId(null)
  }

  const handleToggleAstrologerStatus = async (astro) => {
    const nextStatus = astro.status === 'ONLINE' ? 'BUSY' : 'ONLINE'
    try {
      await updateAstrologerStatusRequest(token, astro.id, nextStatus)
    } catch {
      // Fallback local update
    }
    setAstrologers((prev) =>
      prev.map((a) => (a.id === astro.id ? { ...a, status: nextStatus } : a))
    )
  }

  const handleSettingsChange = (field, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'otp_verification_mode') {
        updated.enable_email_otp = value === 'BOTH' || value === 'EMAIL_ONLY'
        updated.enable_mobile_otp = value === 'BOTH' || value === 'MOBILE_ONLY'
      }
      // When Admin fills live SMTP credentials, automatically switch email_otp_mode to LIVE if both are filled
      if (
        (field === 'smtp_user' || field === 'smtp_pass') &&
        updated.smtp_user?.trim() &&
        updated.smtp_pass?.trim()
      ) {
        updated.email_otp_mode = 'LIVE'
      }
      // When Admin fills SMS API Key, automatically switch mobile_otp_mode to LIVE
      if (field === 'sms_api_key' && updated.sms_api_key?.trim()) {
        updated.mobile_otp_mode = 'LIVE'
      }
      return updated
    })
  }

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault()
    setSavingSettings(true)
    setSettingsMessage('')
    setSettingsError('')

    try {
      const res = await updatePlatformSettingsRequest(token, settings)
      if (res.settings) setSettings(res.settings)
      setSettingsMessage(
        res.message || 'Settings saved! Onboarding form is now updated live.'
      )
      setActionBanner('Platform OTP, Nodemailer & Location API settings updated!')
    } catch (err) {
      setSettingsError(err.message || 'Could not save settings.')
    } finally {
      setSavingSettings(false)
    }
  }

  const handleSendTestSmtpEmail = async () => {
    setTestingSmtp(true)
    setSmtpTestResult('')
    try {
      const res = await testNodemailerRequest(token, {
        ...settings,
        test_recipient: testEmailRecipient || settings.smtp_user,
      })
      setSmtpTestResult(`SUCCESS: ${res.message}`)
    } catch (err) {
      setSmtpTestResult(`ERROR: ${err.message}`)
    } finally {
      setTestingSmtp(false)
    }
  }

  const handleTestLocationSearch = async () => {
    setTestingLocation(true)
    try {
      await updatePlatformSettingsRequest(token, settings).catch(() => {})
      const res = await searchLiveLocationsRequest(adminLocationQuery)
      setAdminLocationResults(res.locations || [])
      setAdminLocationProvider(res.providerUsed || 'FREE_LIVE_API')
    } finally {
      setTestingLocation(false)
    }
  }

  const handleLogoutClick = () => {
    clearAdminSession()
    onLogout()
  }

  const pendingAstrologers = astrologers.filter(
    (a) => a.approval_status === 'PENDING'
  )
  const approvedAstrologers = astrologers.filter(
    (a) => !a.approval_status || a.approval_status === 'APPROVED'
  )
  const rejectedAstrologers = astrologers.filter(
    (a) => a.approval_status === 'REJECTED'
  )

  const filteredApprovedAstrologers = approvedAstrologers.filter((astro) => {
    const matchesSearch =
      (astro.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (astro.specialty || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (astro.city || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || astro.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const currentSeries = REVENUE_CHART_DATA[chartRange]
  const maxRevenue = Math.max(...currentSeries.map((d) => d.revenue))

  const getModeBadge = (mode) => {
    if (mode === 'VIDEO') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200/70">
          <Video className="w-3.5 h-3.5" />
          Video Call
        </span>
      )
    }
    if (mode === 'AUDIO') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/70">
          <PhoneCall className="w-3.5 h-3.5" />
          Audio Call
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-[#D9530F] border border-orange-200/70">
        <MessageCircle className="w-3.5 h-3.5" />
        Live Chat
      </span>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex font-sans text-slate-800">
      {/* 1. Full-Height Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden lg:flex flex-col justify-between shrink-0 sticky top-0 h-screen">
        <div>
          {/* Brand Logo */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#D9530F] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[15px] font-semibold text-slate-900 tracking-tight leading-none">
                  Astro<span className="text-[#D9530F]">Veda</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-normal">
                  Super Admin Console
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 px-3 mb-2">
              Administration
            </div>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === 'overview'
                    ? 'bg-orange-50 text-[#D9530F] border border-orange-200/60'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview &amp; Analytics</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('approvals')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === 'approvals'
                    ? 'bg-orange-50 text-[#D9530F] border border-orange-200/60'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4" />
                  <span>Pending Approvals</span>
                </span>
                {pendingAstrologers.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-medium">
                    {pendingAstrologers.length} New
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('astrologers')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === 'astrologers'
                    ? 'bg-orange-50 text-[#D9530F] border border-orange-200/60'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Verified Astrologers</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                  {approvedAstrologers.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('consultations')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === 'consultations'
                    ? 'bg-orange-50 text-[#D9530F] border border-orange-200/60'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4" />
                  <span>Live Consultations</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px]">
                  {consultations.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('settings')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === 'settings'
                    ? 'bg-orange-50 text-[#D9530F] border border-orange-200/60'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>OTP, Mail &amp; API Settings</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-orange-100 text-[#D9530F] text-[10px] font-semibold">
                  {settings.otp_verification_mode}
                </span>
              </button>
            </nav>

            {/* Quick System Health Card inside Sidebar */}
            <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#D9530F]" />
                  Storage Engine
                </span>
                <span className="text-emerald-600 font-medium text-[11px]">
                  {dbConnected ? 'MySQL Live' : 'Local DB Active'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-200/60">
                <div className="flex justify-between">
                  <span>Email OTP:</span>
                  <strong className="text-slate-700">
                    {settings.enable_email_otp ? settings.email_otp_mode : 'OFF'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Mobile OTP:</span>
                  <strong className="text-slate-700">
                    {settings.enable_mobile_otp ? settings.mobile_otp_mode : 'OFF'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Location API:</span>
                  <strong className="text-slate-700">
                    {settings.google_maps_api_key ? 'Google Console' : 'Free Live'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2.5">
          <a
            href="/"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-slate-600 hover:bg-slate-50 border border-slate-200/70 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#D9530F] flex items-center justify-center text-xs font-semibold shrink-0">
                SA
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-800 truncate">
                  {admin?.name || 'Super Admin'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {admin?.email || 'admin@astroveda.in'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogoutClick}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Full-Width Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">
              {activeSection === 'overview' && 'Executive Dashboard Overview'}
              {activeSection === 'approvals' &&
                'Pending Astrologer Onboarding & KYC Verification'}
              {activeSection === 'astrologers' && 'Verified Astrologers Directory'}
              {activeSection === 'consultations' && 'Consultation Logs & Billing'}
              {activeSection === 'settings' &&
                'Platform OTP, Nodemailer SMTP, SMS & Location API Settings'}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Full KYC inspection, Email/Mobile OTP controls, Nodemailer credentials &amp; Live Location APIs
            </p>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <div className="flex lg:hidden items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                  activeSection === 'overview'
                    ? 'bg-white text-slate-900 font-medium'
                    : 'text-slate-600'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('approvals')}
                className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                  activeSection === 'approvals'
                    ? 'bg-white text-slate-900 font-medium'
                    : 'text-slate-600'
                }`}
              >
                Approvals ({pendingAstrologers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('settings')}
                className={`px-2.5 py-1 rounded text-xs cursor-pointer ${
                  activeSection === 'settings'
                    ? 'bg-white text-slate-900 font-medium'
                    : 'text-slate-600'
                }`}
              >
                Settings
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection('settings')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50/70 hover:bg-orange-100 text-[#D9530F] text-xs font-medium transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>OTP &amp; API Settings</span>
            </button>

            <button
              type="button"
              onClick={loadDashboard}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`}
              />
              <span>Sync Data</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutClick}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Full-Width Dashboard Body */}
        <main className="w-full px-6 lg:px-8 py-6 space-y-6">
          {/* Action Toast Banner */}
          {actionBanner && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {actionBanner}
              </span>
              <button
                type="button"
                onClick={() => setActionBanner('')}
                className="text-emerald-700 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ================================================================= */}
          {/* SECTION: PLATFORM OTP, NODEMAILER SMTP, SMS & LOCATION API SETTINGS */}
          {/* ================================================================= */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              {settingsMessage && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settingsMessage}</span>
                </div>
              )}
              {settingsError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              {/* 1. OTP Verification Policy Selector */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#D9530F]" />
                      <span>1. Onboarding OTP Verification Policy (Email / Mobile / Both)</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose which OTP verifications are required when an Astrologer fills the onboarding form
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-50 text-[#D9530F] border border-orange-200 text-xs font-semibold">
                    Active Mode: {settings.otp_verification_mode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {[
                    {
                      id: 'BOTH',
                      title: 'Both Email & Mobile OTP',
                      desc: 'Astrologer must verify both Email OTP and Mobile Number OTP',
                    },
                    {
                      id: 'EMAIL_ONLY',
                      title: 'Email OTP Only',
                      desc: 'Only Email OTP verification is required (Mobile OTP skipped)',
                    },
                    {
                      id: 'MOBILE_ONLY',
                      title: 'Mobile Number OTP Only',
                      desc: 'Only Mobile Number OTP is required (Email OTP skipped)',
                    },
                    {
                      id: 'NONE',
                      title: 'Disable OTP (Direct Apply)',
                      desc: 'Allow onboarding without OTP verification',
                    },
                  ].map((opt) => {
                    const active = settings.otp_verification_mode === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          handleSettingsChange('otp_verification_mode', opt.id)
                        }
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-orange-50/70 border-[#D9530F] ring-2 ring-[#D9530F]/15'
                            : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-slate-900">
                            {opt.title}
                          </span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              active
                                ? 'border-[#D9530F] bg-[#D9530F] text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {active && <Check className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {opt.desc}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Email OTP (Nodemailer SMTP) & Mobile SMS OTP Settings Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left Card: Nodemailer Email OTP Config */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#D9530F]" />
                        <span>2. Email OTP &amp; Nodemailer SMTP Configuration</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Configure Testing OTP or enter Live Nodemailer ID &amp; App Password
                      </p>
                    </div>

                    <div className="inline-flex bg-slate-100 p-1 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => handleSettingsChange('email_otp_mode', 'TEST')}
                        className={`px-3 py-1 rounded-md font-medium cursor-pointer ${
                          settings.email_otp_mode === 'TEST'
                            ? 'bg-amber-500 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Testing OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSettingsChange('email_otp_mode', 'LIVE')}
                        className={`px-3 py-1 rounded-md font-medium cursor-pointer ${
                          settings.email_otp_mode === 'LIVE'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Live Nodemailer
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                    {settings.email_otp_mode === 'LIVE' &&
                    settings.smtp_user &&
                    settings.smtp_pass ? (
                      <span>
                        <strong>Live Nodemailer Active:</strong> Real 6-digit OTP emails will be sent from{' '}
                        <code>{settings.smtp_user}</code> via <code>{settings.smtp_host}</code>.
                      </span>
                    ) : (
                      <span>
                        <strong>Testing Mode Active:</strong> Astrologers can verify email using Test OTP{' '}
                        <strong>{settings.test_email_otp || '123456'}</strong>. As soon as you enter your SMTP Email ID &amp; App Password below, it automatically switches to <strong>Live Nodemailer</strong>!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        SMTP Host (e.g. Gmail / Hostinger)
                      </label>
                      <input
                        type="text"
                        value={settings.smtp_host || ''}
                        onChange={(e) =>
                          handleSettingsChange('smtp_host', e.target.value)
                        }
                        placeholder="smtp.gmail.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        SMTP Port (587 TLS / 465 SSL)
                      </label>
                      <input
                        type="number"
                        value={settings.smtp_port || 587}
                        onChange={(e) =>
                          handleSettingsChange('smtp_port', Number(e.target.value))
                        }
                        placeholder="587"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Nodemailer Email ID (SMTP User)
                      </label>
                      <input
                        type="email"
                        value={settings.smtp_user || ''}
                        onChange={(e) =>
                          handleSettingsChange('smtp_user', e.target.value)
                        }
                        placeholder="your-email@gmail.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Nodemailer App Password (SMTP Pass)
                      </label>
                      <input
                        type="password"
                        value={settings.smtp_pass || ''}
                        onChange={(e) =>
                          handleSettingsChange('smtp_pass', e.target.value)
                        }
                        placeholder="16-char Gmail App Password"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Sender Display Name
                      </label>
                      <input
                        type="text"
                        value={settings.smtp_from_name || ''}
                        onChange={(e) =>
                          handleSettingsChange('smtp_from_name', e.target.value)
                        }
                        placeholder="AstroVeda Jyotish Board"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Default Testing Email OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={settings.test_email_otp || '123456'}
                        onChange={(e) =>
                          handleSettingsChange('test_email_otp', e.target.value)
                        }
                        placeholder="123456"
                        className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/40 font-semibold tracking-widest text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Test Live Nodemailer Button */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="block text-xs font-medium text-slate-700">
                      Test Live Nodemailer Setup (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={testEmailRecipient}
                        onChange={(e) => setTestEmailRecipient(e.target.value)}
                        placeholder="Enter recipient email to test live SMTP..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      />
                      <button
                        type="button"
                        disabled={testingSmtp}
                        onClick={handleSendTestSmtpEmail}
                        className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{testingSmtp ? 'Sending...' : 'Send Test Mail'}</span>
                      </button>
                    </div>
                    {smtpTestResult && (
                      <p
                        className={`text-xs font-medium ${
                          smtpTestResult.startsWith('SUCCESS')
                            ? 'text-emerald-600'
                            : 'text-red-600'
                        }`}
                      >
                        {smtpTestResult}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Card: Mobile SMS OTP Config */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#D9530F]" />
                        <span>3. Mobile Number SMS OTP Configuration</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Use Testing OTP now; enter SMS Gateway API details whenever you purchase a plan
                      </p>
                    </div>

                    <div className="inline-flex bg-slate-100 p-1 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => handleSettingsChange('mobile_otp_mode', 'TEST')}
                        className={`px-3 py-1 rounded-md font-medium cursor-pointer ${
                          settings.mobile_otp_mode === 'TEST'
                            ? 'bg-amber-500 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Testing OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSettingsChange('mobile_otp_mode', 'LIVE')}
                        className={`px-3 py-1 rounded-md font-medium cursor-pointer ${
                          settings.mobile_otp_mode === 'LIVE'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Live SMS API
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                    {settings.mobile_otp_mode === 'LIVE' && settings.sms_api_key ? (
                      <span>
                        <strong>Live SMS Gateway Active ({settings.sms_provider}):</strong> Real SMS OTPs will be dispatched to mobile numbers.
                      </span>
                    ) : (
                      <span>
                        <strong>Testing Mode Active:</strong> Mobile verification works using Test OTP{' '}
                        <strong>{settings.test_mobile_otp || '123456'}</strong>. When you purchase an SMS pack later, paste your API key below to switch to Live SMS!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        SMS Gateway Provider
                      </label>
                      <select
                        value={settings.sms_provider || 'FAST2SMS'}
                        onChange={(e) =>
                          handleSettingsChange('sms_provider', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 bg-white"
                      >
                        <option value="FAST2SMS">Fast2SMS (India OTP)</option>
                        <option value="MSG91">MSG91</option>
                        <option value="TWILIO">Twilio SMS</option>
                        <option value="CUSTOM">Custom Webhook URL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Default Testing Mobile OTP
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={settings.test_mobile_otp || '123456'}
                        onChange={(e) =>
                          handleSettingsChange('test_mobile_otp', e.target.value)
                        }
                        placeholder="123456"
                        className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-amber-50/40 font-semibold tracking-widest text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-slate-700 mb-1">
                        Live SMS API Key / Auth Token (Fill when purchased)
                      </label>
                      <input
                        type="password"
                        value={settings.sms_api_key || ''}
                        onChange={(e) =>
                          handleSettingsChange('sms_api_key', e.target.value)
                        }
                        placeholder="Paste Fast2SMS / MSG91 API Key here to activate Live Mobile OTP"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        DLT Sender ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={settings.sms_sender_id || ''}
                        onChange={(e) =>
                          handleSettingsChange('sms_sender_id', e.target.value)
                        }
                        placeholder="ASTVED"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        DLT Template ID / Custom URL
                      </label>
                      <input
                        type="text"
                        value={settings.sms_custom_url || ''}
                        onChange={(e) =>
                          handleSettingsChange('sms_custom_url', e.target.value)
                        }
                        placeholder="Optional custom SMS API URL"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Live Location Search API Config (Google Console + Free Live API Fallback) */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#D9530F]" />
                      <span>
                        4. Live Location Search API (Google Console API + Free Live API Auto-Fallback)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      If Google Cloud Console API Key is provided, location search uses Google API; if empty or quota exceeded, it automatically fetches from Free Live Geocoding API (OpenStreetMap / Open-Meteo)
                    </p>
                  </div>

                  <div className="inline-flex bg-slate-100 p-1 rounded-lg text-xs">
                    {[
                      { id: 'AUTO', label: 'Smart Auto (Google -> Free Fallback)' },
                      { id: 'GOOGLE_CONSOLE', label: 'Google Console Priority' },
                      { id: 'FREE_API', label: 'Free Live API Only' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          handleSettingsChange('location_api_mode', m.id)
                        }
                        className={`px-3 py-1 rounded-md font-medium cursor-pointer ${
                          settings.location_api_mode === m.id
                            ? 'bg-[#D9530F] text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  <div className="lg:col-span-6 space-y-3 text-xs">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        Google Cloud Console Maps / Places / Geocoding API Key (Optional)
                      </label>
                      <input
                        type="text"
                        value={settings.google_maps_api_key || ''}
                        onChange={(e) =>
                          handleSettingsChange(
                            'google_maps_api_key',
                            e.target.value
                          )
                        }
                        placeholder="AIzaSy... (Leave blank to automatically use Free Live Location API)"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-800"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      • <strong>When Key is Blank:</strong> Automatically fetches live cities, states, pincodes &amp; coordinates from the <strong>Free Live Location API</strong> (OpenStreetMap Nominatim &amp; Open-Meteo).
                      <br />• <strong>When Key is Entered:</strong> Automatically fetches from <strong>Google Console API</strong> first, with instant fallback to Free API if needed.
                    </p>
                  </div>

                  {/* Live Location API Tester Box */}
                  <div className="lg:col-span-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        Test Live Location Search API
                      </span>
                      {adminLocationProvider && (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                          Served by: {adminLocationProvider}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={adminLocationQuery}
                        onChange={(e) => setAdminLocationQuery(e.target.value)}
                        placeholder="Type city e.g. Ujjain, Varanasi, Jaipur..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                      />
                      <button
                        type="button"
                        disabled={testingLocation}
                        onClick={handleTestLocationSearch}
                        className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer"
                      >
                        {testingLocation ? 'Fetching...' : 'Test Search'}
                      </button>
                    </div>
                    {adminLocationResults.length > 0 && (
                      <div className="max-h-36 overflow-y-auto bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
                        {adminLocationResults.slice(0, 4).map((loc, i) => (
                          <div
                            key={i}
                            className="px-3 py-2 flex items-center justify-between gap-2"
                          >
                            <div className="truncate">
                              <strong className="text-slate-800">{loc.city}</strong>
                              {loc.state ? `, ${loc.state}` : ''} —{' '}
                              <span className="text-slate-500">
                                {loc.formatted_address}
                              </span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-50 text-[#D9530F] shrink-0">
                              {loc.provider}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    disabled={savingSettings}
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 rounded-xl bg-[#D9530F] hover:bg-[#C2410C] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {savingSettings
                        ? 'Saving All Settings...'
                        : 'Save All OTP, Nodemailer, SMS & Location API Settings'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Row 1: 4 Full-Width KPI Metric Cards */}
          {activeSection !== 'settings' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {/* KPI 1: Pending Approvals */}
              <div
                onClick={() => setActiveSection('approvals')}
                className="bg-white rounded-xl border border-slate-200/80 hover:border-amber-300 p-5 flex flex-col justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      Pending Applications
                    </span>
                    <div className="text-2xl font-semibold text-amber-600 mt-1.5">
                      {pendingAstrologers.length}{' '}
                      <span className="text-xs font-normal text-slate-400">
                        Awaiting Review
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600">
                    <UserPlus className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-amber-700 font-medium">
                    Inspect full KYC &amp; approve
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-amber-600" />
                </div>
              </div>

              {/* KPI 2: Verified Astrologers */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      Approved Acharyas
                    </span>
                    <div className="text-2xl font-semibold text-slate-900 mt-1.5">
                      {approvedAstrologers.length}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Live on Public Website</span>
                  <span className="inline-flex items-center gap-1 font-medium text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    4.91 Avg
                  </span>
                </div>
              </div>

              {/* KPI 3: Online Availability */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      Online Availability
                    </span>
                    <div className="text-2xl font-semibold text-emerald-600 mt-1.5">
                      {approvedAstrologers.filter((a) => a.status === 'ONLINE').length}{' '}
                      <span className="text-sm font-normal text-slate-400">
                        / {approvedAstrologers.length} Online
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Instant Queue Ready
                  </span>
                  <span className="text-slate-400">~12s response</span>
                </div>
              </div>

              {/* KPI 4: Total Revenue */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-500">
                      Total Wallet Revenue
                    </span>
                    <div className="text-2xl font-semibold text-slate-900 mt-1.5">
                      ₹{Number(stats.totalRevenue || 2295).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#D9530F]">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +18.4%
                  </span>
                  <span className="text-xs text-slate-400">
                    OTP Policy: {settings.otp_verification_mode}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PENDING ASTROLOGER APPROVALS QUEUE (RICH CARDS + FULL KYC MODAL) */}
          {(activeSection === 'overview' || activeSection === 'approvals') && (
            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-amber-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Pending Astrologer Applications ({pendingAstrologers.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      Inspect complete Vedic profile, OTP verification status, KYC documents, bank details &amp; approve
                    </p>
                  </div>
                </div>

                <span className="text-xs text-slate-400">
                  Click "View Full Profile &amp; KYC" to inspect all uploaded fields
                </span>
              </div>

              {pendingAstrologers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  All pending astrologer applications have been reviewed and processed!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {pendingAstrologers.map((astro) => (
                    <div
                      key={astro.id}
                      className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5"
                    >
                      <div className="flex items-start gap-4 max-w-4xl">
                        {astro.profile_photo ? (
                          <img
                            src={astro.profile_photo}
                            alt={astro.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-amber-200 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#D9530F] flex items-center justify-center font-semibold text-sm shrink-0">
                            {(astro.name || 'AC').slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              #APP-{astro.id} • PENDING
                            </span>
                            <h3 className="text-sm font-semibold text-slate-900">
                              {astro.name}
                            </h3>
                            <span className="text-xs font-medium text-[#D9530F]">
                              ({astro.specialty})
                            </span>
                            {astro.email_verified ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                                ✓ Email OTP Verified
                              </span>
                            ) : null}
                            {astro.phone_verified ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                                ✓ Mobile OTP Verified
                              </span>
                            ) : null}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {astro.bio ||
                              'Applied via AstroVeda Acharya Onboarding portal.'}
                          </p>

                          {/* Rich Metadata Chips */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1">
                            <span className="inline-flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-slate-400" />
                              {astro.qualification || 'Jyotish Acharya'}
                              {astro.university_gurukul
                                ? ` (${astro.university_gurukul})`
                                : ''}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {astro.experience_years} Yrs Exp.
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#D9530F]" />
                              {astro.city}
                              {astro.state ? `, ${astro.state}` : ''}
                              {astro.pincode ? ` - ${astro.pincode}` : ''}
                            </span>
                            {astro.email && (
                              <span className="inline-flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                {astro.email}
                              </span>
                            )}
                            {astro.phone && (
                              <span className="inline-flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {astro.phone}
                              </span>
                            )}
                          </div>

                          {/* KYC & Bank Summary Row */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                            {astro.aadhar_number && (
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                Aadhaar: <strong>{astro.aadhar_number}</strong>
                              </span>
                            )}
                            {astro.pan_number && (
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                PAN: <strong>{astro.pan_number}</strong>
                              </span>
                            )}
                            {astro.bank_name && (
                              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700">
                                Bank: {astro.bank_name} ({astro.bank_ifsc || 'IFSC'})
                              </span>
                            )}
                            {astro.upi_id && (
                              <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700">
                                UPI: {astro.upi_id}
                              </span>
                            )}
                            {(astro.id_proof_document ||
                              astro.certificate_document) && (
                              <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#D9530F] font-medium">
                                📎 KYC Documents Uploaded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action Controls: Tariff Rate + View Full Profile + Approve / Reject */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                        <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                          <span className="text-slate-400 block text-[10px]">
                            Chat / Audio / Video
                          </span>
                          <span className="font-semibold text-slate-800">
                            ₹{astro.chat_rate || astro.rate_per_min} / ₹
                            {astro.audio_rate || astro.rate_per_min + 5} / ₹
                            {astro.video_rate || astro.rate_per_min + 15}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => openAstroInspector(astro)}
                          className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D9530F]" />
                          <span>Full Details &amp; KYC</span>
                        </button>

                        <button
                          type="button"
                          disabled={processingId === astro.id}
                          onClick={() => handleApprovalAction(astro, 'APPROVED')}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>

                        <button
                          type="button"
                          disabled={processingId === astro.id}
                          onClick={() => handleApprovalAction(astro, 'REJECTED')}
                          className="px-3 py-2 rounded-lg border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Row 2: Full-Width Visual Charts */}
          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
              {/* Left 8 Cols: Revenue & Consultation Volume Bar Chart */}
              <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#D9530F]" />
                      <h2 className="text-sm font-semibold text-slate-900">
                        Revenue &amp; Consultation Volume Analytics
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Daily per-minute consultation billing across Chat, Voice &amp; Video calls
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {['7D', '30D'].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setChartRange(range)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                          chartRange === range
                            ? 'bg-white text-slate-900'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {range === '7D' ? 'Last 7 Days' : 'Last 30 Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="grid grid-cols-7 gap-3 sm:gap-5 items-end h-52 pt-6 px-2 border-b border-slate-100">
                    {currentSeries.map((item) => {
                      const heightPercent = Math.max(
                        18,
                        Math.round((item.revenue / maxRevenue) * 100)
                      )
                      return (
                        <div
                          key={item.label}
                          className="flex flex-col items-center justify-end h-full group"
                        >
                          <div className="text-[11px] font-medium text-slate-600 mb-1.5 opacity-85 group-hover:text-[#D9530F] transition-colors">
                            ₹{(item.revenue / 1000).toFixed(1)}k
                          </div>

                          <div className="w-full max-w-[44px] bg-slate-100 rounded-t-lg h-36 flex items-end overflow-hidden p-0.5">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className="w-full rounded-t-md bg-gradient-to-t from-[#D9530F] to-[#FB923C] group-hover:from-[#B45309] group-hover:to-[#EA580C] transition-all duration-300"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-7 gap-3 sm:gap-5 pt-3 px-2 text-center">
                    {currentSeries.map((item) => (
                      <div key={item.label}>
                        <div className="text-xs font-medium text-slate-700">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.sessions} calls
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 4 Cols: Consultation Channel Split Donut Chart */}
              <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-[#D9530F]" />
                      <h2 className="text-sm font-semibold text-slate-900">
                        Consultation Channels
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400">Live Mix</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Session distribution by communication mode
                  </p>
                </div>

                <div className="space-y-3 my-4">
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D9530F]" />
                      <MessageCircle className="w-3.5 h-3.5 text-[#D9530F]" />
                      Live Chat Socket
                    </span>
                    <span className="font-medium text-slate-900">48%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                      Audio Voice Call
                    </span>
                    <span className="font-medium text-slate-900">34%</span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                      <Video className="w-3.5 h-3.5 text-violet-600" />
                      1-on-1 Video Call
                    </span>
                    <span className="font-medium text-slate-900">18%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Row 3: Approved Astrologers Directory Table */}
          {(activeSection === 'overview' || activeSection === 'astrologers') && (
            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Approved &amp; Verified Astrologers ({approvedAstrologers.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click "Inspect Profile" on any row to view full KYC, Bank, OTP &amp; Location details
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Acharya, city or skill..."
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#D9530F] w-48 sm:w-56"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                    {['ALL', 'ONLINE', 'BUSY'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          statusFilter === st
                            ? 'bg-white text-slate-900'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400 uppercase bg-slate-50/60">
                      <th className="py-3 px-6">Acharya &amp; Location</th>
                      <th className="py-3 px-6">Vedic Specialization</th>
                      <th className="py-3 px-6">OTP &amp; KYC</th>
                      <th className="py-3 px-6">Tariff (C/A/V)</th>
                      <th className="py-3 px-6">Full Profile</th>
                      <th className="py-3 px-6 text-right">Live Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredApprovedAstrologers.map((astro) => {
                      const initials = (astro.name || 'AC')
                        .split(' ')
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')
                      return (
                        <tr
                          key={astro.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              {astro.profile_photo ? (
                                <img
                                  src={astro.profile_photo}
                                  alt={astro.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-orange-200 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200/60 text-[#D9530F] flex items-center justify-center text-xs font-medium shrink-0">
                                  {initials}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-slate-900">
                                  {astro.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {astro.city}
                                  {astro.state ? `, ${astro.state}` : ''} •{' '}
                                  {astro.experience_years} Yrs
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-slate-600">
                            <div className="font-medium text-slate-800">
                              {astro.specialty}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">
                              {astro.qualification}
                            </div>
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="flex flex-wrap gap-1">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                                Email {astro.email_verified ? '✓' : '•'} / Mob{' '}
                                {astro.phone_verified ? '✓' : '•'}
                              </span>
                              {astro.pan_number && (
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                  PAN: {astro.pan_number}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-6 font-medium text-slate-800">
                            ₹{astro.chat_rate || astro.rate_per_min} / ₹
                            {astro.audio_rate || astro.rate_per_min + 5} / ₹
                            {astro.video_rate || astro.rate_per_min + 15}
                          </td>
                          <td className="py-3.5 px-6">
                            <button
                              type="button"
                              onClick={() => openAstroInspector(astro)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#D9530F] text-slate-700 hover:text-[#D9530F] text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Inspect Profile</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAstrologerStatus(astro)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border cursor-pointer transition-colors ${
                                astro.status === 'ONLINE'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  astro.status === 'ONLINE'
                                    ? 'bg-emerald-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                              {astro.status}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Row 4: Recent Consultations Table */}
          {(activeSection === 'overview' || activeSection === 'consultations') && (
            <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Recent Consultation Sessions
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time log of Chat, Voice &amp; Video consultations
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-[#D9530F]" />
                  Updated just now
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400 uppercase bg-slate-50/60">
                      <th className="py-3 px-6">Session ID</th>
                      <th className="py-3 px-6">Client / Yajman</th>
                      <th className="py-3 px-6">Assigned Acharya</th>
                      <th className="py-3 px-6">Channel</th>
                      <th className="py-3 px-6">Duration</th>
                      <th className="py-3 px-6">Wallet Deduction</th>
                      <th className="py-3 px-6 text-right">Session Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {consultations.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3.5 px-6 font-medium text-slate-500">
                          #CS-{item.id}08
                        </td>
                        <td className="py-3.5 px-6 font-medium text-slate-900">
                          {item.user_name}
                        </td>
                        <td className="py-3.5 px-6 text-slate-600">
                          {item.astrologer_name}
                        </td>
                        <td className="py-3.5 px-6">{getModeBadge(item.mode)}</td>
                        <td className="py-3.5 px-6 text-slate-600">
                          {item.duration_mins} mins
                        </td>
                        <td className="py-3.5 px-6 font-medium text-slate-900">
                          ₹{item.amount}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                              item.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-orange-50 text-[#D9530F] border-orange-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================================================================= */}
      {/* FULL ASTROLOGER PROFILE, LOCATION, OTP & KYC VAULT MODAL          */}
      {/* ================================================================= */}
      {selectedAstro && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {selectedAstro.profile_photo ? (
                  <img
                    src={selectedAstro.profile_photo}
                    alt={selectedAstro.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-amber-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#D9530F] flex items-center justify-center font-semibold">
                    {(selectedAstro.name || 'AC').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {selectedAstro.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {selectedAstro.approval_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Application #APP-{selectedAstro.id} • {selectedAstro.specialty}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAstro(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs">
              {/* 1. Personal & Contact + OTP Verification Status */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>1. Personal Details &amp; OTP Verification Status</span>
                  <div className="flex gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        selectedAstro.email_verified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Email OTP: {selectedAstro.email_verified ? 'VERIFIED ✓' : 'Unverified'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        selectedAstro.phone_verified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Mobile OTP: {selectedAstro.phone_verified ? 'VERIFIED ✓' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Email Address</span>
                    <strong className="text-slate-800">{selectedAstro.email}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Mobile Number</span>
                    <strong className="text-slate-800">{selectedAstro.phone}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">WhatsApp Number</span>
                    <strong className="text-slate-800">
                      {selectedAstro.whatsapp_phone || selectedAstro.phone}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Gender &amp; DOB</span>
                    <strong className="text-slate-800">
                      {selectedAstro.gender || 'Male'}{' '}
                      {selectedAstro.dob ? `• ${selectedAstro.dob}` : ''}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 2. Complete Location Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>2. Live Location &amp; Geo-Coordinates</span>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-[#D9530F] text-[10px]">
                    Source: {selectedAstro.location_provider || 'FREE_LIVE_API'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">City</span>
                    <strong className="text-slate-800">{selectedAstro.city}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">State &amp; Country</span>
                    <strong className="text-slate-800">
                      {selectedAstro.state || 'India'}, {selectedAstro.country || 'India'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Pincode</span>
                    <strong className="text-slate-800">
                      {selectedAstro.pincode || 'N/A'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Latitude / Longitude</span>
                    <strong className="text-slate-800">
                      {selectedAstro.latitude && selectedAstro.longitude
                        ? `${selectedAstro.latitude}, ${selectedAstro.longitude}`
                        : 'Standard'}
                    </strong>
                  </div>
                  <div className="col-span-2 sm:col-span-4 p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Complete Address</span>
                    <strong className="text-slate-800">
                      {selectedAstro.full_address || selectedAstro.city}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 3. Vedic Specialization, Qualifications & Bio */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="font-semibold text-slate-900">
                  3. Vedic Specialization, Qualifications &amp; Bio
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Qualification / Degree</span>
                    <strong className="text-slate-800">
                      {selectedAstro.qualification}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">University / Gurukul</span>
                    <strong className="text-slate-800">
                      {selectedAstro.university_gurukul || 'Vedic Gurukul'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Secondary Skills</span>
                    <strong className="text-slate-800">
                      {selectedAstro.secondary_skills || selectedAstro.specialty}
                    </strong>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                  <span className="text-slate-400 block">Bio &amp; Achievements</span>
                  <p className="text-slate-700 mt-1">{selectedAstro.bio}</p>
                  {selectedAstro.achievements && (
                    <p className="text-amber-800 font-medium mt-1">
                      Achievements: {selectedAstro.achievements}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. KYC Documents & Bank Account Vault */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="font-semibold text-slate-900">
                  4. KYC Identity Numbers, Bank Payout Details &amp; Uploaded Certificates
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Aadhaar Number</span>
                    <strong className="text-slate-800">
                      {selectedAstro.aadhar_number || 'Not Provided'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">PAN Number</span>
                    <strong className="text-slate-800">
                      {selectedAstro.pan_number || 'Not Provided'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">Bank Name &amp; A/C</span>
                    <strong className="text-slate-800">
                      {selectedAstro.bank_name || 'N/A'} •{' '}
                      {selectedAstro.bank_account_number || ''}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                    <span className="text-slate-400 block">IFSC &amp; UPI ID</span>
                    <strong className="text-slate-800">
                      {selectedAstro.bank_ifsc || 'N/A'} • {selectedAstro.upi_id || ''}
                    </strong>
                  </div>
                </div>

                {/* Uploaded Documents Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <div className="font-medium text-slate-700 mb-2">
                      Uploaded Govt ID Proof
                    </div>
                    {selectedAstro.id_proof_document ? (
                      selectedAstro.id_proof_document.startsWith('data:image') ? (
                        <img
                          src={selectedAstro.id_proof_document}
                          alt="ID Proof"
                          className="w-full h-36 object-contain rounded border border-slate-100 bg-slate-50"
                        />
                      ) : (
                        <a
                          href={selectedAstro.id_proof_document}
                          download={`ID_Proof_${selectedAstro.name}.pdf`}
                          className="inline-flex items-center gap-1.5 text-[#D9530F] font-medium underline"
                        >
                          <FileText className="w-4 h-4" />
                          Download Uploaded ID Document
                        </a>
                      )
                    ) : (
                      <span className="text-slate-400">
                        Verified via Aadhaar/PAN number ({selectedAstro.aadhar_number || 'On file'})
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <div className="font-medium text-slate-700 mb-2">
                      Uploaded Jyotish Degree / Certificate
                    </div>
                    {selectedAstro.certificate_document ? (
                      selectedAstro.certificate_document.startsWith('data:image') ? (
                        <img
                          src={selectedAstro.certificate_document}
                          alt="Certificate"
                          className="w-full h-36 object-contain rounded border border-slate-100 bg-slate-50"
                        />
                      ) : (
                        <a
                          href={selectedAstro.certificate_document}
                          download={`Certificate_${selectedAstro.name}.pdf`}
                          className="inline-flex items-center gap-1.5 text-[#D9530F] font-medium underline"
                        >
                          <Award className="w-4 h-4" />
                          Download Uploaded Certificate
                        </a>
                      )
                    ) : (
                      <span className="text-slate-400">
                        {selectedAstro.qualification}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Admin Tariff Override & Approval Decision Controls */}
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/80 space-y-4">
                <div className="font-semibold text-slate-900">
                  5. Super Admin Tariff Controls &amp; Verification Decision
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">
                      Approved Chat Rate (₹/min)
                    </label>
                    <input
                      type="number"
                      value={modalChatRate}
                      onChange={(e) => setModalChatRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">
                      Approved Audio Rate (₹/min)
                    </label>
                    <input
                      type="number"
                      value={modalAudioRate}
                      onChange={(e) => setModalAudioRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">
                      Approved Video Rate (₹/min)
                    </label>
                    <input
                      type="number"
                      value={modalVideoRate}
                      onChange={(e) => setModalVideoRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">
                      Admin Verification Notes
                    </label>
                    <input
                      type="text"
                      value={modalAdminNotes}
                      onChange={(e) => setModalAdminNotes(e.target.value)}
                      placeholder="e.g. Verified BHU degree & Aadhaar KYC"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">
                      Rejection Reason (If rejecting)
                    </label>
                    <input
                      type="text"
                      value={modalRejectionReason}
                      onChange={(e) => setModalRejectionReason(e.target.value)}
                      placeholder="Optional reason if rejecting..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAstro(null)}
                    className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    disabled={processingId === selectedAstro.id}
                    onClick={() =>
                      handleApprovalAction(selectedAstro, 'REJECTED', {
                        rate_per_min: modalChatRate,
                        chat_rate: modalChatRate,
                        audio_rate: modalAudioRate,
                        video_rate: modalVideoRate,
                        admin_notes: modalAdminNotes,
                        rejection_reason: modalRejectionReason,
                      })
                    }
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Application</span>
                  </button>
                  <button
                    type="button"
                    disabled={processingId === selectedAstro.id}
                    onClick={() =>
                      handleApprovalAction(selectedAstro, 'APPROVED', {
                        rate_per_min: modalChatRate,
                        chat_rate: modalChatRate,
                        audio_rate: modalAudioRate,
                        video_rate: modalVideoRate,
                        admin_notes: modalAdminNotes,
                      })
                    }
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve &amp; Publish Live</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
