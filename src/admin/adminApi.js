const API_BASE_URL = 'http://localhost:5000/api/admin'

const TOKEN_KEY = 'astroveda_admin_token'
const ADMIN_USER_KEY = 'astroveda_admin_user'

export const SEEDED_ADMIN_DEFAULT = {
  email: 'admin@astroveda.in',
  password: 'Admin@123',
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
  return data
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
