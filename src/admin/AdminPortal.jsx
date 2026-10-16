import React, { useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import { getSavedAdminSession } from './adminApi'

export default function AdminPortal() {
  const initialSession = getSavedAdminSession()
  const [adminUser, setAdminUser] = useState(initialSession?.admin || null)
  const [adminToken, setAdminToken] = useState(initialSession?.token || '')
  const [dbConnected, setDbConnected] = useState(true)

  const handleLoginSuccess = (admin, token, isDbConnected = true) => {
    setAdminUser(admin)
    setAdminToken(token)
    setDbConnected(Boolean(isDbConnected))
    if (window.location.pathname.startsWith('/admin')) {
      window.history.replaceState({}, '', '/admin/dashboard')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    setAdminUser(null)
    setAdminToken('')
    if (window.location.pathname.startsWith('/admin')) {
      window.history.replaceState({}, '', '/admin')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!adminUser || !adminToken) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <AdminDashboard
      admin={adminUser}
      token={adminToken}
      initialDbConnected={dbConnected}
      onLogout={handleLogout}
    />
  )
}
