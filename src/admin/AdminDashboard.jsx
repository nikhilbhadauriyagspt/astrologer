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
} from 'lucide-react'
import {
  fetchDashboardStatsRequest,
  updateAstrologerApprovalRequest,
  updateAstrologerStatusRequest,
  clearAdminSession,
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
    city: 'Varanasi (Kashi)',
    specialty: 'Vedic Kundli, Marriage & Muhurat',
    languages: 'Hindi, Sanskrit, English',
    experience_years: 18,
    qualification: 'Gold Medalist – Sampurnanand Sanskrit University',
    bio: '18+ years guiding families on Kundli Milan, Mangal Dosh Shanti & auspicious Vivah Muhurat.',
    rating: 4.95,
    rate_per_min: 35,
    status: 'ONLINE',
    approval_status: 'APPROVED',
    total_orders: 14200,
  },
  {
    id: 2,
    name: 'Pt. Raghavendra Joshi',
    email: 'raghavendra@astroveda.in',
    phone: '+91 9822033442',
    city: 'Ujjain',
    specialty: 'KP Astrology, Career & Business',
    languages: 'Hindi, English, Marathi',
    experience_years: 15,
    qualification: 'KP Jyotish Visharad',
    bio: 'Specialist in Krishnamurti Paddhati (KP) for accurate corporate career & business timing.',
    rating: 4.9,
    rate_per_min: 40,
    status: 'ONLINE',
    approval_status: 'APPROVED',
    total_orders: 11850,
  },
  {
    id: 3,
    name: 'Dr. Maitreyi Deshmukh',
    email: 'maitreyi@astroveda.in',
    phone: '+91 9833044553',
    city: 'Pune',
    specialty: 'Nadi Jyotish, Tarot & Relationship',
    languages: 'English, Hindi, Marathi',
    experience_years: 12,
    qualification: 'Ph.D. in Mystic Sciences & Intuitive Tarot',
    bio: 'Compassionate guidance on relationship harmony, emotional clarity & Nadi astrology.',
    rating: 4.88,
    rate_per_min: 30,
    status: 'BUSY',
    approval_status: 'APPROVED',
    total_orders: 9640,
  },
  {
    id: 4,
    name: 'Acharya Vishwanath Tiwari',
    email: 'vishwanath@astroveda.in',
    phone: '+91 9844055664',
    city: 'Prayagraj',
    specialty: 'Prashna Kundli, Vastu & Gemstone',
    languages: 'Hindi, Sanskrit',
    experience_years: 22,
    qualification: 'Shastri in Vastu & Ratna Shastra',
    bio: 'Senior Vastu and Gemstone consultant offering authentic Vedic remedies.',
    rating: 4.97,
    rate_per_min: 50,
    status: 'ONLINE',
    approval_status: 'APPROVED',
    total_orders: 19400,
  },
  {
    id: 5,
    name: 'Sadhvi Gauri Nandini',
    email: 'gauri@astroveda.in',
    phone: '+91 9855066775',
    city: 'Haridwar',
    specialty: 'Lal Kitab, Numerology & Remedies',
    languages: 'Hindi, English, Punjabi',
    experience_years: 10,
    qualification: 'Lal Kitab & Vedic Numerology Expert',
    bio: 'Simple, practical household Lal Kitab remedies and business numerology.',
    rating: 4.85,
    rate_per_min: 25,
    status: 'ONLINE',
    approval_status: 'APPROVED',
    total_orders: 7420,
  },
  {
    id: 6,
    name: 'Acharya Somnath Mishra',
    email: 'somnath@astroveda.in',
    phone: '+91 9866077886',
    city: 'Ayodhya',
    specialty: 'Ashtakoot Matching & Horary',
    languages: 'Hindi, Sanskrit, English',
    experience_years: 16,
    qualification: 'Acharya in Siddhanta Jyotish',
    bio: 'Dedicated to deep Ashtakoot & Dashakoot Gun Milan and Santana Gopala guidance.',
    rating: 4.92,
    rate_per_min: 38,
    status: 'ONLINE',
    approval_status: 'APPROVED',
    total_orders: 12310,
  },
  {
    id: 7,
    name: 'Acharya Suryakant Tripathi',
    email: 'suryakant@astroveda.in',
    phone: '+91 9877088991',
    city: 'Varanasi',
    specialty: 'Parashari Jyotish, Dasha & Muhurat',
    languages: 'Hindi, Sanskrit, English',
    experience_years: 14,
    qualification: 'M.A. Jyotish – BHU Varanasi',
    bio: '14 years experience in Parashari Kundli analysis, Mahadasha predictions & Graha Shanti.',
    rating: 4.85,
    rate_per_min: 32,
    status: 'OFFLINE',
    approval_status: 'PENDING',
    total_orders: 0,
  },
  {
    id: 8,
    name: 'Dr. Kavita Sharma',
    email: 'kavita@astroveda.in',
    phone: '+91 9888099112',
    city: 'Jaipur',
    specialty: 'Vedic Numerology, Tarot & Palmistry',
    languages: 'Hindi, English',
    experience_years: 9,
    qualification: 'Ph.D. Astrology & Certified Tarot Master',
    bio: 'Specializes in relationship counseling, career tarot spreads & Chaldean numerology.',
    rating: 4.8,
    rate_per_min: 28,
    status: 'OFFLINE',
    approval_status: 'PENDING',
    total_orders: 0,
  },
  {
    id: 9,
    name: 'Pt. Harshvardhan Vyas',
    email: 'harshvardhan@astroveda.in',
    phone: '+91 9899011223',
    city: 'Ujjain',
    specialty: 'Bhrigu Nandi Nadi & Vastu Shastra',
    languages: 'Hindi, Gujarati, English',
    experience_years: 19,
    qualification: 'Jyotish Martand – Ujjain Gurukul',
    bio: 'Traditional Bhrigu Nandi Nadi snapshot predictions and commercial Vastu consultation.',
    rating: 4.9,
    rate_per_min: 45,
    status: 'OFFLINE',
    approval_status: 'PENDING',
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
  {
    id: 4,
    user_name: 'Saurabh Kulkarni',
    astrologer_name: 'Acharya Vishwanath Tiwari',
    mode: 'CHAT',
    duration_mins: 10,
    amount: 500,
    status: 'ACTIVE',
  },
  {
    id: 5,
    user_name: 'Meenakshi Iyer',
    astrologer_name: 'Sadhvi Gauri Nandini',
    mode: 'AUDIO',
    duration_mins: 8,
    amount: 205,
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
  const [activeSection, setActiveSection] = useState('overview')
  const [chartRange, setChartRange] = useState('7D')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [processingId, setProcessingId] = useState(null)
  const [actionBanner, setActionBanner] = useState('')

  const loadDashboard = async () => {
    setLoading(true)
    try {
      const data = await fetchDashboardStatsRequest(token)
      setDbConnected(Boolean(data.dbConnected))
      if (data.stats) setStats(data.stats)
      if (data.astrologers) setAstrologers(data.astrologers)
      if (data.recentConsultations) setConsultations(data.recentConsultations)
    } catch {
      // Keep fallback data if backend is offline
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [token])

  const handleApprovalAction = async (astro, decision) => {
    setProcessingId(astro.id)
    setActionBanner('')
    try {
      await updateAstrologerApprovalRequest(token, astro.id, {
        approval_status: decision,
        rate_per_min: astro.rate_per_min,
        rejection_reason:
          decision === 'REJECTED' ? 'Experience or verification criteria not met' : null,
      })
    } catch {
      // Fallback local state update
    }

    setAstrologers((prev) =>
      prev.map((item) => {
        if (item.id !== astro.id) return item
        return {
          ...item,
          approval_status: decision,
          status: decision === 'APPROVED' ? 'ONLINE' : 'OFFLINE',
        }
      })
    )

    setActionBanner(
      decision === 'APPROVED'
        ? `${astro.name} has been APPROVED and is now LIVE on the public website!`
        : `${astro.name}'s application has been marked as REJECTED.`
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
      astro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      astro.specialty.toLowerCase().includes(searchQuery.toLowerCase())
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
            </nav>

            {/* Quick System Health Card inside Sidebar */}
            <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#D9530F]" />
                  Database
                </span>
                <span className="text-emerald-600 font-medium text-[11px]">
                  {dbConnected ? 'MySQL Active' : 'Seeded'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-emerald-500 rounded-full" />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>astroveda_db</span>
                <span>Port 3306</span>
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
              {activeSection === 'approvals' && 'Pending Astrologer Onboarding Approvals'}
              {activeSection === 'astrologers' && 'Verified Astrologers Directory'}
              {activeSection === 'consultations' && 'Consultation Logs & Billing'}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Real-time MySQL onboarding approvals, Acharya status &amp; consultation telemetry
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
            </div>

            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                dbConnected
                  ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200/80'
                  : 'bg-amber-50/80 text-amber-700 border-amber-200/80'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              {dbConnected ? 'MySQL Connected' : 'Seeded Mode'}
            </span>

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

          {/* Row 1: 4 Full-Width KPI Metric Cards */}
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
                  Click to review &amp; approve
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
                <svg className="w-20 h-6 text-[#D9530F]" viewBox="0 0 80 24" fill="none">
                  <path
                    d="M2 20L16 15L30 17L45 9L60 12L78 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* SECTION: PENDING ASTROLOGER APPROVALS QUEUE */}
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
                      Verify qualifications &amp; approve Acharyas to publish them live on AstroVeda
                    </p>
                  </div>
                </div>

                <span className="text-xs text-slate-400">
                  New applications from "Join as Astrologer" appear here automatically
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
                      className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                    >
                      <div className="space-y-2 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            PENDING VERIFICATION
                          </span>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {astro.name}
                          </h3>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-[#D9530F]">
                            {astro.specialty}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {astro.bio || 'Applied via AstroVeda Acharya Onboarding portal.'}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="inline-flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-slate-400" />
                            {astro.qualification || 'Jyotish Acharya'}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {astro.experience_years} Yrs Exp.
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {astro.city || 'Varanasi'}
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
                      </div>

                      {/* Right Action Controls: Tariff Rate + Approve / Reject Buttons */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                        <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                          <span className="text-slate-400 block text-[10px]">
                            Requested Tariff
                          </span>
                          <span className="font-semibold text-slate-800">
                            ₹{astro.rate_per_min}/min
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={processingId === astro.id}
                          onClick={() => handleApprovalAction(astro, 'APPROVED')}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve &amp; Go Live</span>
                        </button>

                        <button
                          type="button"
                          disabled={processingId === astro.id}
                          onClick={() => handleApprovalAction(astro, 'REJECTED')}
                          className="px-3.5 py-2 rounded-lg border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
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

                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-5">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#D9530F]" />
                      <span>Gross Wallet Billing</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Peak Muhurat Hours: 6:00 PM – 10:30 PM</span>
                    </span>
                  </div>
                  <span className="text-emerald-600 font-medium">
                    Avg. Session Value: ₹459
                  </span>
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

                <div className="my-6 flex items-center justify-center relative">
                  <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="transparent"
                      stroke="#F1F5F9"
                      strokeWidth="14"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="transparent"
                      stroke="#D9530F"
                      strokeWidth="14"
                      strokeDasharray="139 289"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="transparent"
                      stroke="#F59E0B"
                      strokeWidth="14"
                      strokeDasharray="98 289"
                      strokeDashoffset="-143"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="14"
                      strokeDasharray="48 289"
                      strokeDashoffset="-245"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-semibold text-slate-900">100%</span>
                    <span className="text-[11px] text-slate-400">Encrypted</span>
                  </div>
                </div>

                <div className="space-y-3">
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
                    All approved Acharyas live on the public website ({rejectedAstrologers.length} rejected)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Acharya or skill..."
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
                      <th className="py-3 px-6">Acharya</th>
                      <th className="py-3 px-6">Vedic Specialization</th>
                      <th className="py-3 px-6">Experience</th>
                      <th className="py-3 px-6">Rating</th>
                      <th className="py-3 px-6">Per-Min Tariff</th>
                      <th className="py-3 px-6">Total Orders</th>
                      <th className="py-3 px-6 text-right">Live Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredApprovedAstrologers.map((astro) => {
                      const initials = astro.name
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
                              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/60 text-[#D9530F] flex items-center justify-center text-xs font-medium shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">
                                  {astro.name}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {astro.city || 'Varanasi'} • Approved
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-slate-600">
                            {astro.specialty}
                          </td>
                          <td className="py-3.5 px-6 text-slate-600">
                            {astro.experience_years} Years
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {astro.rating}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 font-medium text-slate-800">
                            ₹{astro.rate_per_min}/min
                          </td>
                          <td className="py-3.5 px-6 text-slate-600">
                            {Number(astro.total_orders || 0).toLocaleString('en-IN')}
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
                    Real-time log of Chat, Voice &amp; Video consultations from MySQL
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
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'COMPLETED'
                                  ? 'bg-emerald-500'
                                  : 'bg-[#D9530F] animate-ping'
                              }`}
                            />
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
    </div>
  )
}
