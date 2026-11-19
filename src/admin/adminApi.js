const API_BASE_URL = 'http://localhost:5000/api/admin'

const TOKEN_KEY = 'astroveda_admin_token'
const ADMIN_USER_KEY = 'astroveda_admin_user'
const LOCAL_SETTINGS_CACHE_KEY = 'astroveda_platform_settings_cache'

export const SEEDED_ADMIN_DEFAULT = {
  email: 'admin@astroveda.in',
  password: 'Admin@123',
}

export const DEFAULT_PLATFORM_SETTINGS = {
  otp_verification_mode: 'BOTH', // 'BOTH' | 'EMAIL_ONLY' | 'MOBILE_ONLY' | 'NONE'
  enable_email_otp: true,
  enable_mobile_otp: true,

  email_otp_mode: 'TEST', // 'TEST' | 'LIVE'
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: '',
  smtp_pass: '',
  smtp_from_name: 'AstroVeda Jyotish Board',
  smtp_from_email: 'noreply@astroveda.in',
  test_email_otp: '123456',

  mobile_otp_mode: 'TEST', // 'TEST' | 'LIVE'
  sms_provider: 'FAST2SMS', // 'FAST2SMS' | 'MSG91' | 'TWILIO' | 'CUSTOM'
  sms_api_key: '',
  sms_sender_id: 'ASTVED',
  sms_template_id: '',
  sms_custom_url: '',
  test_mobile_otp: '123456',

  location_api_mode: 'AUTO', // 'AUTO' | 'GOOGLE_CONSOLE' | 'FREE_API'
  google_maps_api_key: '',
  location_country_bias: 'IN',
}

export function getSavedAdminSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const rawUser = localStorage.getItem(ADMIN_USER_KEY)
    if (!token || !rawUser) return null
    return {
      token,
      admin: JSON.parse(rawUser),
    }
  } catch {
    return null
  }
}

export function saveAdminSession(admin, token) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin))
}

export function clearAdminSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
}

export function getCachedPlatformSettings() {
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_CACHE_KEY)
    if (!raw) return { ...DEFAULT_PLATFORM_SETTINGS }
    return { ...DEFAULT_PLATFORM_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_PLATFORM_SETTINGS }
  }
}

export function saveCachedPlatformSettings(settings) {
  try {
    const merged = { ...getCachedPlatformSettings(), ...settings }
    localStorage.setItem(LOCAL_SETTINGS_CACHE_KEY, JSON.stringify(merged))
    return merged
  } catch {
    return settings
  }
}

export async function loginAdminRequest(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.trim(), password }),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Invalid admin email or password.')
  }
  return data
}

export async function fetchDashboardStatsRequest(token) {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to load dashboard data.')
  }
  if (data.settings) {
    saveCachedPlatformSettings(data.settings)
  }
  return data
}

export async function fetchPlatformSettingsRequest(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to load settings.')
    }
    saveCachedPlatformSettings(data.settings)
    return data
  } catch {
    return {
      success: true,
      settings: getCachedPlatformSettings(),
    }
  }
}

export async function updatePlatformSettingsRequest(token, payload) {
  saveCachedPlatformSettings(payload)
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update settings.')
  }
  if (data.settings) {
    saveCachedPlatformSettings(data.settings)
  }
  return data
}

export async function testNodemailerRequest(token, payload) {
  const response = await fetch(`${API_BASE_URL}/settings/test-email`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to send test email via SMTP.')
  }
  return data
}

export async function fetchPublicOnboardingConfigRequest() {
  try {
    const response = await fetch(`${API_BASE_URL}/public-config`, {
      method: 'GET',
    })
    const data = await response.json()
    if (response.ok && data.success) {
      return data.config
    }
  } catch {
    // Fallback to cached settings if backend is unreachable
  }
  const cached = getCachedPlatformSettings()
  const mode = cached.otp_verification_mode || 'BOTH'
  return {
    otp_verification_mode: mode,
    enable_email_otp: mode === 'BOTH' || mode === 'EMAIL_ONLY',
    enable_mobile_otp: mode === 'BOTH' || mode === 'MOBILE_ONLY',
    email_otp_mode:
      cached.email_otp_mode === 'LIVE' && cached.smtp_user && cached.smtp_pass
        ? 'LIVE'
        : 'TEST',
    mobile_otp_mode:
      cached.mobile_otp_mode === 'LIVE' && cached.sms_api_key ? 'LIVE' : 'TEST',
    test_email_otp: cached.test_email_otp || '123456',
    test_mobile_otp: cached.test_mobile_otp || '123456',
    location_api_mode: cached.location_api_mode || 'AUTO',
    has_google_console_key: Boolean(
      cached.google_maps_api_key && cached.google_maps_api_key.trim()
    ),
    active_location_provider:
      cached.location_api_mode === 'FREE_API'
        ? 'FREE_LIVE_API'
        : cached.google_maps_api_key
          ? 'GOOGLE_CONSOLE'
          : 'FREE_LIVE_API',
  }
}

export async function sendOnboardingOtpRequest({ target, type, name }) {
  try {
    const response = await fetch(`${API_BASE_URL}/otp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target, type, name }),
    })
    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to send OTP.')
    }
    return data
  } catch {
    // Client-side Test Mode fallback if backend is not reachable
    const cached = getCachedPlatformSettings()
    const testOtp =
      type === 'EMAIL'
        ? cached.test_email_otp || '123456'
        : cached.test_mobile_otp || '123456'
    return {
      success: true,
      deliveryMode: 'TEST',
      testOtp,
      generatedOtp: testOtp,
      message: `Testing Mode OTP Active! Enter Test OTP: ${testOtp}`,
    }
  }
}

export async function verifyOnboardingOtpRequest({ target, type, otp }) {
  try {
    const response = await fetch(`${API_BASE_URL}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target, type, otp }),
    })
    const data = await response.json()
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Invalid OTP.')
    }
    return data
  } catch (err) {
    // If network error, check against cached test OTP
    if (err.message && err.message.includes('Invalid')) {
      throw err
    }
    const cached = getCachedPlatformSettings()
    const testOtp =
      type === 'EMAIL'
        ? cached.test_email_otp || '123456'
        : cached.test_mobile_otp || '123456'
    if (String(otp).trim() === String(testOtp).trim()) {
      return {
        success: true,
        verified: true,
        type,
        target,
        message: `${type === 'EMAIL' ? 'Email' : 'Mobile number'} verified via Test OTP!`,
      }
    }
    throw new Error(`Invalid OTP. (In Test Mode, use ${testOtp})`)
  }
}

export async function searchLiveLocationsRequest(query) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/location/search?q=${encodeURIComponent(query || '')}`,
      {
        method: 'GET',
      }
    )
    const data = await response.json()
    if (response.ok && data.success) {
      return data
    }
  } catch {
    // Direct browser fallback to Open-Meteo Free Geocoding API if backend is offline
  }

  try {
    if (query && query.trim().length >= 2) {
      const meteoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query.trim()
        )}&count=8&language=en&format=json`
      )
      const meteoData = await meteoRes.json()
      if (Array.isArray(meteoData.results) && meteoData.results.length > 0) {
        return {
          success: true,
          providerUsed: 'FREE_LIVE_API',
          locations: meteoData.results.map((item) => ({
            city: item.name || query,
            state: item.admin1 || '',
            country: item.country || 'India',
            pincode: item.postcodes?.[0] || '',
            formatted_address: [item.name, item.admin2, item.admin1, item.country]
              .filter(Boolean)
              .join(', '),
            latitude: item.latitude ? String(item.latitude) : '',
            longitude: item.longitude ? String(item.longitude) : '',
            provider: 'FREE_LIVE_API',
          })),
        }
      }
    }
  } catch {
    // Ignore network error
  }

  return {
    success: true,
    providerUsed: 'FREE_LIVE_API',
    locations: [],
  }
}

export async function updateAstrologerApprovalRequest(token, id, payload) {
  const response = await fetch(`${API_BASE_URL}/astrologers/${id}/approval`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update approval status.')
  }
  return data
}

export async function updateAstrologerStatusRequest(token, id, status) {
  const response = await fetch(`${API_BASE_URL}/astrologers/${id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to update live status.')
  }
  return data
}

export async function registerAstrologerRequest(payload) {
  const response = await fetch(`${API_BASE_URL}/astrologers/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to submit astrologer application.')
  }
  return data
}

export async function checkAstrologerStatusRequest(email, password) {
  const response = await fetch(`${API_BASE_URL}/astrologers/check-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'No matching astrologer application found.')
  }
  return data
}

export async function fetchApprovedAstrologersRequest() {
  const response = await fetch(`${API_BASE_URL}/astrologers/approved`, {
    method: 'GET',
  })
  const data = await response.json()
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to load approved astrologers.')
  }
  return data
}
