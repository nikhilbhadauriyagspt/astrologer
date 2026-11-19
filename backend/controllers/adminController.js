const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const {
  getPool,
  getMysqlStatus,
  readLocalDb,
  writeLocalDb,
  DEFAULT_PLATFORM_SETTINGS,
} = require('../config/db')
const { JWT_SECRET } = require('../middleware/authMiddleware')

// In-memory OTP store (also persisted in local_db.json)
const otpMemoryStore = new Map()

// Helper: Get current platform settings (from MySQL or local JSON fallback)
async function loadSettings() {
  const localData = readLocalDb()
  let settings = { ...DEFAULT_PLATFORM_SETTINGS, ...(localData.settings || {}) }

  if (getMysqlStatus()) {
    try {
      const db = await getPool()
      const [rows] = await db.query(
        'SELECT config_json FROM platform_settings WHERE id = 1'
      )
      if (rows.length > 0 && rows[0].config_json) {
        const parsed = JSON.parse(rows[0].config_json)
        settings = { ...DEFAULT_PLATFORM_SETTINGS, ...parsed }
      }
    } catch (err) {
      console.error('Load settings MySQL fallback:', err.message)
    }
  }

  // Keep boolean flags synced with otp_verification_mode
  const mode = settings.otp_verification_mode || 'BOTH'
  settings.enable_email_otp = mode === 'BOTH' || mode === 'EMAIL_ONLY'
  settings.enable_mobile_otp = mode === 'BOTH' || mode === 'MOBILE_ONLY'

  return settings
}

async function saveSettings(newSettings) {
  const current = await loadSettings()
  const merged = { ...current, ...newSettings }

  // Sync otp_verification_mode and individual flags
  if (newSettings.otp_verification_mode) {
    merged.enable_email_otp =
      merged.otp_verification_mode === 'BOTH' ||
      merged.otp_verification_mode === 'EMAIL_ONLY'
    merged.enable_mobile_otp =
      merged.otp_verification_mode === 'BOTH' ||
      merged.otp_verification_mode === 'MOBILE_ONLY'
  } else if (
    newSettings.enable_email_otp !== undefined ||
    newSettings.enable_mobile_otp !== undefined
  ) {
    if (merged.enable_email_otp && merged.enable_mobile_otp) {
      merged.otp_verification_mode = 'BOTH'
    } else if (merged.enable_email_otp) {
      merged.otp_verification_mode = 'EMAIL_ONLY'
    } else if (merged.enable_mobile_otp) {
      merged.otp_verification_mode = 'MOBILE_ONLY'
    } else {
      merged.otp_verification_mode = 'NONE'
    }
  }

  // Save to local JSON
  const localData = readLocalDb()
  localData.settings = merged
  writeLocalDb(localData)

  // Save to MySQL if connected
  if (getMysqlStatus()) {
    try {
      const db = await getPool()
      await db.query(
        'INSERT INTO platform_settings (id, config_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE config_json = VALUES(config_json)',
        [JSON.stringify(merged)]
      )
    } catch (err) {
      console.error('Save settings MySQL error:', err.message)
    }
  }

  return merged
}

// 1. POST /api/admin/login (Super Admin Login)
async function loginAdmin(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    })
  }

  const cleanEmail = email.trim().toLowerCase()

  try {
    if (getMysqlStatus()) {
      const db = await getPool()
      const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [
        cleanEmail,
      ])

      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid admin email or password.',
        })
      }

      const admin = rows[0]
      const isMatch = await bcrypt.compare(password, admin.password_hash)

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid admin email or password.',
        })
      }

      const token = jwt.sign(
        {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      return res.json({
        success: true,
        dbConnected: true,
        message: 'Admin login successful!',
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      })
    }
  } catch (err) {
    console.error('MySQL Login Query Error:', err.message)
  }

  // Fallback to local persistent DB
  const localData = readLocalDb()
  const admin = (localData.admins || []).find(
    (a) => a.email.toLowerCase() === cleanEmail
  )

  if (admin && (await bcrypt.compare(password, admin.password_hash))) {
    const token = jwt.sign(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    return res.json({
      success: true,
      dbConnected: getMysqlStatus(),
      message: 'Admin login successful!',
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid admin email or password.',
  })
}

// 2. GET /api/admin/me
async function getAdminMe(req, res) {
  return res.json({
    success: true,
    admin: req.admin,
  })
}

// 3. GET /api/admin/dashboard (Super Admin Full Dashboard Data)
async function getDashboardStats(req, res) {
  const settings = await loadSettings()

  if (getMysqlStatus()) {
    try {
      const db = await getPool()
      const [astrologers] = await db.query(
        'SELECT * FROM astrologers ORDER BY id DESC'
      )
      const [consultations] = await db.query(
        'SELECT * FROM consultations ORDER BY id DESC LIMIT 15'
      )
      const [revenueRow] = await db.query(
        "SELECT COALESCE(SUM(amount), 0) AS totalRevenue FROM consultations WHERE status = 'COMPLETED'"
      )

      const sanitizedAstrologers = astrologers.map((a) => {
        const copy = { ...a }
        delete copy.password_hash
        return copy
      })

      const approvedList = sanitizedAstrologers.filter(
        (a) => a.approval_status === 'APPROVED'
      )
      const pendingList = sanitizedAstrologers.filter(
        (a) => a.approval_status === 'PENDING'
      )
      const onlineList = approvedList.filter((a) => a.status === 'ONLINE')

      return res.json({
        success: true,
        dbConnected: true,
        stats: {
          totalRevenue: Number(revenueRow[0].totalRevenue) || 2295,
          totalAstrologers: approvedList.length,
          pendingApprovals: pendingList.length,
          onlineAstrologers: onlineList.length,
          totalConsultations: consultations.length,
        },
        astrologers: sanitizedAstrologers,
        recentConsultations: consultations,
        settings,
      })
    } catch (err) {
      console.error('MySQL Dashboard Query Error:', err.message)
    }
  }

  // Fallback to Local Persistent DB
  const localData = readLocalDb()
  const astrologers = [...(localData.astrologers || [])]
    .sort((a, b) => b.id - a.id)
    .map((a) => {
      const copy = { ...a }
      delete copy.password_hash
      return copy
    })
  const consultations = [...(localData.consultations || [])].sort(
    (a, b) => b.id - a.id
  )
  const totalRevenue = consultations
    .filter((c) => c.status === 'COMPLETED')
    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0)

  const approvedList = astrologers.filter(
    (a) => a.approval_status === 'APPROVED'
  )
  const pendingList = astrologers.filter((a) => a.approval_status === 'PENDING')
  const onlineList = approvedList.filter((a) => a.status === 'ONLINE')

  return res.json({
    success: true,
    dbConnected: getMysqlStatus(),
    stats: {
      totalRevenue: totalRevenue || 2295,
      totalAstrologers: approvedList.length,
      pendingApprovals: pendingList.length,
      onlineAstrologers: onlineList.length,
      totalConsultations: consultations.length,
    },
    astrologers,
    recentConsultations: consultations,
    settings,
  })
}

// 4. PATCH /api/admin/astrologers/:id/approval (Approve or Reject Astrologer Application)
async function updateAstrologerApproval(req, res) {
  const { id } = req.params
  const {
    approval_status,
    rate_per_min,
    chat_rate,
    audio_rate,
    video_rate,
    rejection_reason,
    admin_notes,
  } = req.body

  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(approval_status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid approval_status. Use APPROVED, REJECTED, or PENDING.',
    })
  }

  const newLiveStatus = approval_status === 'APPROVED' ? 'ONLINE' : 'OFFLINE'
  const finalReason =
    approval_status === 'REJECTED'
      ? rejection_reason || 'Profile criteria not met'
      : null

  // Update Local DB
  const localData = readLocalDb()
  let updatedAstro = null
  localData.astrologers = (localData.astrologers || []).map((a) => {
    if (Number(a.id) !== Number(id)) return a
    const updated = {
      ...a,
      approval_status,
      status: newLiveStatus,
      rate_per_min:
        rate_per_min !== undefined ? Number(rate_per_min) : a.rate_per_min,
      chat_rate: chat_rate !== undefined ? Number(chat_rate) : a.chat_rate,
      audio_rate: audio_rate !== undefined ? Number(audio_rate) : a.audio_rate,
      video_rate: video_rate !== undefined ? Number(video_rate) : a.video_rate,
      rejection_reason: finalReason,
      admin_notes: admin_notes !== undefined ? admin_notes : a.admin_notes,
    }
    updatedAstro = { ...updated }
    delete updatedAstro.password_hash
    return updated
  })
  writeLocalDb(localData)

  if (getMysqlStatus()) {
    try {
      const db = await getPool()
      await db.query(
        `UPDATE astrologers 
         SET approval_status = ?, status = ?, rate_per_min = COALESCE(?, rate_per_min),
             chat_rate = COALESCE(?, chat_rate), audio_rate = COALESCE(?, audio_rate),
             video_rate = COALESCE(?, video_rate), rejection_reason = ?, admin_notes = COALESCE(?, admin_notes)
         WHERE id = ?`,
        [
          approval_status,
          newLiveStatus,
          rate_per_min !== undefined ? Number(rate_per_min) : null,
          chat_rate !== undefined ? Number(chat_rate) : null,
          audio_rate !== undefined ? Number(audio_rate) : null,
          video_rate !== undefined ? Number(video_rate) : null,
          finalReason,
          admin_notes !== undefined ? admin_notes : null,
          id,
        ]
      )
      const [rows] = await db.query('SELECT * FROM astrologers WHERE id = ?', [
        id,
      ])
      if (rows[0]) {
        updatedAstro = { ...rows[0] }
        delete updatedAstro.password_hash
      }
    } catch (err) {
      console.error('Update Approval MySQL Error:', err.message)
    }
  }

  return res.json({
    success: true,
    message: `Astrologer application ${approval_status.toLowerCase()} successfully.`,
    astrologer: updatedAstro,
  })
}

// 5. PATCH /api/admin/astrologers/:id/status (Toggle ONLINE / BUSY / OFFLINE)
async function updateAstrologerLiveStatus(req, res) {
  const { id } = req.params
  const { status } = req.body

  if (!['ONLINE', 'BUSY', 'OFFLINE'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Use ONLINE, BUSY, or OFFLINE.',
    })
  }

  const localData = readLocalDb()
  localData.astrologers = (localData.astrologers || []).map((a) =>
    Number(a.id) === Number(id) ? { ...a, status } : a
  )
  writeLocalDb(localData)

  if (getMysqlStatus()) {
    try {
      const db = await getPool()
      await db.query('UPDATE astrologers SET status = ? WHERE id = ?', [
        status,
        id,
      ])
    } catch (err) {
      console.error('Status update MySQL error:', err.message)
    }
  }

  return res.json({
    success: true,
    message: 'Astrologer status updated.',
    status,
  })
}

// 6. GET /api/admin/settings & GET /api/admin/public-config
async function getPlatformSettings(req, res) {
  const settings = await loadSettings()
  return res.json({
    success: true,
    settings,
  })
}

async function getPublicOnboardingConfig(req, res) {
  const settings = await loadSettings()
  const isEmailLive =
    settings.email_otp_mode === 'LIVE' &&
    Boolean(settings.smtp_user && settings.smtp_pass)
  const isMobileLive =
    settings.mobile_otp_mode === 'LIVE' && Boolean(settings.sms_api_key)
  const hasGoogleConsoleKey = Boolean(
    settings.google_maps_api_key && settings.google_maps_api_key.trim()
  )

  return res.json({
    success: true,
    config: {
      otp_verification_mode: settings.otp_verification_mode || 'BOTH',
      enable_email_otp: Boolean(settings.enable_email_otp),
      enable_mobile_otp: Boolean(settings.enable_mobile_otp),
      email_otp_mode: isEmailLive ? 'LIVE' : 'TEST',
      mobile_otp_mode: isMobileLive ? 'LIVE' : 'TEST',
      test_email_otp: isEmailLive ? null : settings.test_email_otp || '123456',
      test_mobile_otp: isMobileLive
        ? null
        : settings.test_mobile_otp || '123456',
      location_api_mode: settings.location_api_mode || 'AUTO',
      has_google_console_key: hasGoogleConsoleKey,
      active_location_provider:
        settings.location_api_mode === 'FREE_API'
          ? 'FREE_LIVE_API'
          : hasGoogleConsoleKey
            ? 'GOOGLE_CONSOLE'
            : 'FREE_LIVE_API',
    },
  })
}

// 7. PUT /api/admin/settings (Save Admin Settings for OTP, Nodemailer, SMS & Location API)
async function updatePlatformSettings(req, res) {
  try {
    const incoming = req.body || {}

    // If Admin enters live SMTP credentials and didn't explicitly force TEST, auto-enable LIVE email mode if requested
    if (incoming.auto_switch_email_live && incoming.smtp_user && incoming.smtp_pass) {
      incoming.email_otp_mode = 'LIVE'
    }
    if (incoming.auto_switch_mobile_live && incoming.sms_api_key) {
      incoming.mobile_otp_mode = 'LIVE'
    }

    const updated = await saveSettings(incoming)
    return res.json({
      success: true,
      message: 'Platform OTP, Nodemailer & Location API settings saved successfully!',
      settings: updated,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save settings: ' + err.message,
    })
  }
}

// 8. POST /api/admin/settings/test-email (Test Nodemailer SMTP connection from Admin Panel)
async function testNodemailerConfig(req, res) {
  const {
    smtp_host,
    smtp_port,
    smtp_secure,
    smtp_user,
    smtp_pass,
    smtp_from_name,
    smtp_from_email,
    test_recipient,
  } = req.body

  if (!smtp_user || !smtp_pass) {
    return res.status(400).json({
      success: false,
      message: 'Please enter both SMTP Email ID (Username) and App Password to test Live Email.',
    })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp_host || 'smtp.gmail.com',
      port: Number(smtp_port) || 587,
      secure: Boolean(smtp_secure) || Number(smtp_port) === 465,
      auth: {
        user: smtp_user.trim(),
        pass: smtp_pass.trim(),
      },
    })

    const targetEmail = (test_recipient || smtp_user).trim()
    const sampleOtp = Math.floor(100000 + Math.random() * 900000).toString()

    await transporter.sendMail({
      from: `"${smtp_from_name || 'AstroVeda Admin'}" <${smtp_from_email || smtp_user}>`,
      to: targetEmail,
      subject: `${sampleOtp} is your AstroVeda SMTP Test OTP`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #f3d2b3; border-radius: 14px; background: #fffdf9;">
          <h2 style="color: #D9530F; margin-top: 0;">AstroVeda Nodemailer Live Test</h2>
          <p style="color: #3B2314; font-size: 14px;">Namaste Admin, your Nodemailer SMTP configuration is working properly!</p>
          <div style="background: #FFF4E6; border: 1px dashed #D9530F; padding: 16px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <span style="font-size: 26px; font-weight: bold; letter-spacing: 6px; color: #2C1408;">${sampleOtp}</span>
          </div>
          <p style="color: #7C5841; font-size: 12px;">You can now switch Email OTP Mode to <strong>LIVE</strong> in Super Admin Settings.</p>
        </div>
      `,
    })

    return res.json({
      success: true,
      message: `Live test email sent successfully to ${targetEmail}!`,
    })
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `SMTP Error: ${err.message}. Check your Email ID / Gmail App Password.`,
    })
  }
}

// 9. POST /api/admin/otp/send (Public: Send OTP for Email or Mobile during Astrologer Onboarding)
async function sendOnboardingOtp(req, res) {
  const { target, type, name } = req.body // type: 'EMAIL' | 'MOBILE'

  if (!target || !type) {
    return res.status(400).json({
      success: false,
      message: 'Target (email or mobile number) and OTP type are required.',
    })
  }

  const cleanTarget = target.trim().toLowerCase()
  const upperType = type.toUpperCase()
  const settings = await loadSettings()

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
  const key = `${upperType}:${cleanTarget}`

  otpMemoryStore.set(key, {
    target: cleanTarget,
    type: upperType,
    otp: generatedOtp,
    verified: false,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
  })

  // Handle EMAIL OTP
  if (upperType === 'EMAIL') {
    const canSendLiveEmail =
      settings.email_otp_mode === 'LIVE' &&
      settings.smtp_user &&
      settings.smtp_pass

    if (canSendLiveEmail) {
      try {
        const transporter = nodemailer.createTransport({
          host: settings.smtp_host || 'smtp.gmail.com',
          port: Number(settings.smtp_port) || 587,
          secure:
            Boolean(settings.smtp_secure) ||
            Number(settings.smtp_port) === 465,
          auth: {
            user: settings.smtp_user.trim(),
            pass: settings.smtp_pass.trim(),
          },
        })

        await transporter.sendMail({
          from: `"${settings.smtp_from_name || 'AstroVeda Jyotish Board'}" <${
            settings.smtp_from_email || settings.smtp_user
          }>`,
          to: cleanTarget,
          subject: `${generatedOtp} is your AstroVeda Acharya Verification OTP`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #f3d2b3; border-radius: 14px; background: #fffdf9;">
              <h2 style="color: #D9530F; margin-top: 0;">AstroVeda Acharya Onboarding</h2>
              <p style="color: #3B2314; font-size: 14px;">Namaste <strong>${
                name || 'Acharya Ji'
              }</strong>,</p>
              <p style="color: #5C3D28; font-size: 14px;">Please use the following 6-digit OTP to verify your email address for AstroVeda onboarding:</p>
              <div style="background: #FFF4E6; border: 1px dashed #D9530F; padding: 16px; text-align: center; border-radius: 10px; margin: 20px 0;">
                <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2C1408;">${generatedOtp}</span>
              </div>
              <p style="color: #7C5841; font-size: 12px;">Valid for 10 minutes. Do not share this code with anyone.</p>
            </div>
          `,
        })

        return res.json({
          success: true,
          deliveryMode: 'LIVE',
          message: `Verification OTP sent to ${cleanTarget} via Live Email!`,
        })
      } catch (smtpErr) {
        console.error('Live Nodemailer error, falling back to Test OTP:', smtpErr.message)
        return res.json({
          success: true,
          deliveryMode: 'TEST_FALLBACK',
          testOtp: settings.test_email_otp || '123456',
          generatedOtp,
          smtpWarning: smtpErr.message,
          message: `Live SMTP failed (${smtpErr.message}). Testing OTP Active: Use ${
            settings.test_email_otp || '123456'
          } or ${generatedOtp}`,
        })
      }
    }

    // TEST MODE for Email OTP
    const defaultTestOtp = settings.test_email_otp || '123456'
    return res.json({
      success: true,
      deliveryMode: 'TEST',
      testOtp: defaultTestOtp,
      generatedOtp,
      message: `Testing Mode Email OTP generated! Enter Test OTP: ${defaultTestOtp} (or ${generatedOtp})`,
    })
  }

  // Handle MOBILE OTP
  if (upperType === 'MOBILE') {
    const canSendLiveSms =
      settings.mobile_otp_mode === 'LIVE' && settings.sms_api_key

    if (canSendLiveSms) {
      try {
        const cleanDigits = cleanTarget.replace(/\D/g, '').slice(-10)
        if (settings.sms_provider === 'FAST2SMS') {
          const smsRes = await fetch(
            `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(
              settings.sms_api_key
            )}&route=otp&variables_values=${generatedOtp}&flash=0&numbers=${cleanDigits}`
          )
          const smsData = await smsRes.json()
          if (smsData.return) {
            return res.json({
              success: true,
              deliveryMode: 'LIVE',
              message: `Live SMS OTP sent to ${target}!`,
            })
          }
          throw new Error(smsData.message || 'Fast2SMS gateway error')
        } else if (settings.sms_custom_url) {
          const customUrl = settings.sms_custom_url
            .replace('{PHONE}', encodeURIComponent(cleanDigits))
            .replace('{OTP}', encodeURIComponent(generatedOtp))
            .replace('{API_KEY}', encodeURIComponent(settings.sms_api_key))
          await fetch(customUrl)
          return res.json({
            success: true,
            deliveryMode: 'LIVE',
            message: `Live SMS OTP sent to ${target}!`,
          })
        }
      } catch (smsErr) {
        console.error('Live SMS error, falling back to Test OTP:', smsErr.message)
        return res.json({
          success: true,
          deliveryMode: 'TEST_FALLBACK',
          testOtp: settings.test_mobile_otp || '123456',
          generatedOtp,
          message: `SMS Gateway fallback — Use Testing OTP: ${
            settings.test_mobile_otp || '123456'
          } or ${generatedOtp}`,
        })
      }
    }

    // TEST MODE for Mobile OTP
    const defaultMobileTestOtp = settings.test_mobile_otp || '123456'
    return res.json({
      success: true,
      deliveryMode: 'TEST',
      testOtp: defaultMobileTestOtp,
      generatedOtp,
      message: `Testing Mode Mobile OTP ready! Enter Test OTP: ${defaultMobileTestOtp} (or ${generatedOtp})`,
    })
  }

  return res.status(400).json({
    success: false,
    message: 'Invalid OTP type. Use EMAIL or MOBILE.',
  })
}

// 10. POST /api/admin/otp/verify (Public: Verify Email or Mobile OTP)
async function verifyOnboardingOtp(req, res) {
  const { target, type, otp } = req.body

  if (!target || !type || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Target, type, and OTP code are required.',
    })
  }

  const cleanTarget = target.trim().toLowerCase()
  const upperType = type.toUpperCase()
  const enteredOtp = String(otp).trim()
  const key = `${upperType}:${cleanTarget}`

  const settings = await loadSettings()
  const record = otpMemoryStore.get(key)

  const isEmailLive =
    settings.email_otp_mode === 'LIVE' &&
    Boolean(settings.smtp_user && settings.smtp_pass)
  const isMobileLive =
    settings.mobile_otp_mode === 'LIVE' && Boolean(settings.sms_api_key)

  const allowedTestOtp =
    upperType === 'EMAIL'
      ? settings.test_email_otp || '123456'
      : settings.test_mobile_otp || '123456'

  const isTestModeForChannel =
    upperType === 'EMAIL' ? !isEmailLive : !isMobileLive

  const matchesStoredOtp =
    record && record.otp === enteredOtp && record.expiresAt > Date.now()
  const matchesTestOtp = isTestModeForChannel && enteredOtp === allowedTestOtp

  if (!matchesStoredOtp && !matchesTestOtp) {
    return res.status(400).json({
      success: false,
      message: `Invalid or expired ${upperType.toLowerCase()} OTP. ${
        isTestModeForChannel ? `(Hint: Test OTP is ${allowedTestOtp})` : ''
      }`,
    })
  }

  otpMemoryStore.set(key, {
    target: cleanTarget,
    type: upperType,
    otp: enteredOtp,
    verified: true,
    verifiedAt: new Date().toISOString(),
    expiresAt: Date.now() + 30 * 60 * 1000,
  })

  return res.json({
    success: true,
    verified: true,
    type: upperType,
    target: cleanTarget,
    message: `${
      upperType === 'EMAIL' ? 'Email address' : 'Mobile number'
    } verified successfully!`,
  })
}

// Curated fallback sacred & major Indian cities if internet is offline
const FALLBACK_INDIAN_LOCATIONS = [
  {
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '221001',
    formatted_address: 'Varanasi (Kashi), Uttar Pradesh 221001, India',
    latitude: '25.3176',
    longitude: '83.0062',
  },
  {
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    country: 'India',
    pincode: '456001',
    formatted_address: 'Ujjain, Madhya Pradesh 456001, India',
    latitude: '23.1765',
    longitude: '75.7885',
  },
  {
    city: 'Haridwar',
    state: 'Uttarakhand',
    country: 'India',
    pincode: '249401',
    formatted_address: 'Haridwar, Uttarakhand 249401, India',
    latitude: '29.9457',
    longitude: '78.1642',
  },
  {
    city: 'Ayodhya',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '224123',
    formatted_address: 'Ayodhya, Uttar Pradesh 224123, India',
    latitude: '26.7922',
    longitude: '82.1998',
  },
  {
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '211001',
    formatted_address: 'Prayagraj (Allahabad), Uttar Pradesh 211001, India',
    latitude: '25.4358',
    longitude: '81.8463',
  },
  {
    city: 'Mathura',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '281001',
    formatted_address: 'Mathura & Vrindavan, Uttar Pradesh 281001, India',
    latitude: '27.4924',
    longitude: '77.6737',
  },
  {
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    pincode: '302001',
    formatted_address: 'Jaipur, Rajasthan 302001, India',
    latitude: '26.9124',
    longitude: '75.7873',
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411001',
    formatted_address: 'Pune, Maharashtra 411001, India',
    latitude: '18.5204',
    longitude: '73.8567',
  },
  {
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    pincode: '110001',
    formatted_address: 'New Delhi, Delhi 110001, India',
    latitude: '28.6139',
    longitude: '77.2090',
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
    formatted_address: 'Mumbai, Maharashtra 400001, India',
    latitude: '19.0760',
    longitude: '72.8777',
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560001',
    formatted_address: 'Bengaluru, Karnataka 560001, India',
    latitude: '12.9716',
    longitude: '77.5946',
  },
  {
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    pincode: '380001',
    formatted_address: 'Ahmedabad, Gujarat 380001, India',
    latitude: '23.0225',
    longitude: '72.5714',
  },
  {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '226001',
    formatted_address: 'Lucknow, Uttar Pradesh 226001, India',
    latitude: '26.8467',
    longitude: '80.9462',
  },
  {
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    pincode: '452001',
    formatted_address: 'Indore, Madhya Pradesh 452001, India',
    latitude: '22.7196',
    longitude: '75.8577',
  },
  {
    city: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    pincode: '249201',
    formatted_address: 'Rishikesh, Uttarakhand 249201, India',
    latitude: '30.0869',
    longitude: '78.2676',
  },
]

// 11. GET /api/admin/location/search?q=... (Public: Live Location Search — Google Console API if configured, else Free Live API)
async function searchLocations(req, res) {
  const query = (req.query.q || '').trim()
  const settings = await loadSettings()
  const googleKey = (settings.google_maps_api_key || '').trim()
  const mode = settings.location_api_mode || 'AUTO' // 'AUTO' | 'GOOGLE_CONSOLE' | 'FREE_API'

  if (!query) {
    return res.json({
      success: true,
      providerUsed: googleKey && mode !== 'FREE_API' ? 'GOOGLE_CONSOLE' : 'FREE_LIVE_API',
      locations: FALLBACK_INDIAN_LOCATIONS.slice(0, 8).map((loc) => ({
        ...loc,
        provider: 'FREE_LIVE_API',
      })),
    })
  }

  let googleError = null

  // 1. Try Google Console Maps / Geocoding API first if key is present and mode !== 'FREE_API'
  if (googleKey && mode !== 'FREE_API') {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query
      )}&region=in&key=${encodeURIComponent(googleKey)}`
      const gRes = await fetch(googleUrl)
      const gData = await gRes.json()

      if (gData.status === 'OK' && Array.isArray(gData.results) && gData.results.length > 0) {
        const mappedGoogle = gData.results.slice(0, 8).map((item) => {
          const comps = item.address_components || []
          const findComp = (type) =>
            (comps.find((c) => (c.types || []).includes(type)) || {}).long_name || ''

          const city =
            findComp('locality') ||
            findComp('administrative_area_level_2') ||
            findComp('sublocality') ||
            query
          const state = findComp('administrative_area_level_1') || ''
          const country = findComp('country') || 'India'
          const pincode = findComp('postal_code') || ''
          const lat = item.geometry?.location?.lat
            ? String(item.geometry.location.lat)
            : ''
          const lng = item.geometry?.location?.lng
            ? String(item.geometry.location.lng)
            : ''

          return {
            city,
            state,
            country,
            pincode,
            formatted_address: item.formatted_address || `${city}, ${state}, ${country}`,
            latitude: lat,
            longitude: lng,
            provider: 'GOOGLE_CONSOLE',
          }
        })

        return res.json({
          success: true,
          providerUsed: 'GOOGLE_CONSOLE',
          hasConsoleKey: true,
          locations: mappedGoogle,
        })
      } else {
        googleError = gData.error_message || gData.status || 'No results from Google API'
      }
    } catch (err) {
      googleError = err.message
    }
  }

  // 2. Free Live Location API (OpenStreetMap Nominatim + Open-Meteo Geocoding fallback)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(
      query
    )}`
    const osmRes = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'AstroVedaPlatform/1.0 (contact@astroveda.in)',
        'Accept-Language': 'en',
      },
    })

    if (osmRes.ok) {
      const osmData = await osmRes.json()
      if (Array.isArray(osmData) && osmData.length > 0) {
        const mappedOsm = osmData.map((item) => {
          const addr = item.address || {}
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.municipality ||
            addr.county ||
            addr.state_district ||
            item.name ||
            query
          const state = addr.state || ''
          const country = addr.country || 'India'
          const pincode = addr.postcode || ''

          return {
            city,
            state,
            country,
            pincode,
            formatted_address:
              item.display_name ||
              [city, state, pincode, country].filter(Boolean).join(', '),
            latitude: item.lat ? String(item.lat) : '',
            longitude: item.lon ? String(item.lon) : '',
            provider: 'FREE_LIVE_API',
          }
        })

        return res.json({
          success: true,
          providerUsed: 'FREE_LIVE_API',
          hasConsoleKey: Boolean(googleKey),
          googleFallbackReason: googleError,
          locations: mappedOsm,
        })
      }
    }
  } catch (osmErr) {
    console.error('OSM Nominatim error, trying Open-Meteo free geocoding:', osmErr.message)
  }

  // 3. Secondary Free Live API: Open-Meteo Geocoding API
  try {
    const meteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=8&language=en&format=json`
    const mRes = await fetch(meteoUrl)
    if (mRes.ok) {
      const mData = await mRes.json()
      if (Array.isArray(mData.results) && mData.results.length > 0) {
        const mappedMeteo = mData.results.map((item) => ({
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
        }))

        return res.json({
          success: true,
          providerUsed: 'FREE_LIVE_API',
          hasConsoleKey: Boolean(googleKey),
          googleFallbackReason: googleError,
          locations: mappedMeteo,
        })
      }
    }
  } catch (meteoErr) {
    console.error('Open-Meteo fallback error:', meteoErr.message)
  }

  // 4. Offline Fallback Filter
  const lowerQ = query.toLowerCase()
  const filteredFallback = FALLBACK_INDIAN_LOCATIONS.filter(
    (loc) =>
      loc.city.toLowerCase().includes(lowerQ) ||
      loc.state.toLowerCase().includes(lowerQ) ||
      loc.formatted_address.toLowerCase().includes(lowerQ)
  ).map((loc) => ({ ...loc, provider: 'FREE_LIVE_API' }))

  return res.json({
    success: true,
    providerUsed: 'FREE_LIVE_API',
    hasConsoleKey: Boolean(googleKey),
    locations:
      filteredFallback.length > 0
        ? filteredFallback
        : [
            {
              city: query,
              state: '',
              country: 'India',
              pincode: '',
              formatted_address: `${query}, India`,
              latitude: '',
              longitude: '',
              provider: 'FREE_LIVE_API',
            },
          ],
  })
}

// 12. POST /api/admin/astrologers/register (Public: Complete Astrologer Onboarding Application)
async function registerAstrologerApplication(req, res) {
  const {
    name,
    email,
    phone,
    whatsapp_phone,
    password,
    gender,
    dob,
    city,
    state,
    country,
    pincode,
    full_address,
    latitude,
    longitude,
    location_provider,
    specialty,
    secondary_skills,
    languages,
    experience_years,
    qualification,
    university_gurukul,
    consultation_modes,
    bio,
    achievements,
    rate_per_min,
    chat_rate,
    audio_rate,
    video_rate,
    aadhar_number,
    pan_number,
    id_proof_type,
    id_proof_document,
    certificate_document,
    profile_photo,
    bank_account_holder,
    bank_name,
    bank_account_number,
    bank_ifsc,
    upi_id,
    email_verified,
    phone_verified,
  } = req.body

  if (!name || !email || !phone || !specialty) {
    return res.status(400).json({
      success: false,
      message: 'Full Name, Email, Mobile Number, and Primary Specialization are required.',
    })
  }

  const cleanEmail = email.trim().toLowerCase()
  const cleanPhone = phone.trim()
  const settings = await loadSettings()

  // Check OTP verification requirements configured by Admin
  const otpMode = settings.otp_verification_mode || 'BOTH'
  const emailOtpRecord = otpMemoryStore.get(`EMAIL:${cleanEmail}`)
  const mobileOtpRecord = otpMemoryStore.get(`MOBILE:${cleanPhone.toLowerCase()}`)

  const isEmailVerified =
    Boolean(email_verified) || Boolean(emailOtpRecord && emailOtpRecord.verified)
  const isPhoneVerified =
    Boolean(phone_verified) || Boolean(mobileOtpRecord && mobileOtpRecord.verified)

  if ((otpMode === 'BOTH' || otpMode === 'EMAIL_ONLY') && !isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Please verify your Email Address via OTP before submitting.',
    })
  }

  if ((otpMode === 'BOTH' || otpMode === 'MOBILE_ONLY') && !isPhoneVerified) {
    return res.status(400).json({
      success: false,
      message: 'Please verify your Mobile Number via OTP before submitting.',
    })
  }

  // Check duplicate email in Local DB
  const localData = readLocalDb()
  const existingLocal = (localData.astrologers || []).find(
    (a) => (a.email || '').toLowerCase() === cleanEmail
  )
  if (existingLocal) {
    return res.status(400).json({
      success: false,
      message: `An application with this email already exists (Status: ${existingLocal.approval_status}).`,
    })
  }

  const passwordHash = await bcrypt.hash(password || 'Astro@123', 10)
  const secondarySkillsStr = Array.isArray(secondary_skills)
    ? secondary_skills.join(', ')
    : secondary_skills || ''
  const modesStr = Array.isArray(consultation_modes)
    ? consultation_modes.join(', ')
    : consultation_modes || 'CHAT, AUDIO, VIDEO'

  const baseRate = Number(rate_per_min) || Number(chat_rate) || 30

  const newAstroRecord = {
    id:
      (localData.astrologers || []).reduce(
        (max, item) => Math.max(max, Number(item.id) || 0),
        0
      ) + 1,
    name: name.trim(),
    email: cleanEmail,
    phone: cleanPhone,
    whatsapp_phone: (whatsapp_phone || cleanPhone).trim(),
    password_hash: passwordHash,
    gender: gender || 'Male',
    dob: dob || '',
    city: (city || 'Varanasi').trim(),
    state: (state || '').trim(),
    country: (country || 'India').trim(),
    pincode: (pincode || '').trim(),
    full_address: (full_address || `${city || 'Varanasi'}, ${state || 'India'}`).trim(),
    latitude: String(latitude || ''),
    longitude: String(longitude || ''),
    location_provider: location_provider || 'FREE_LIVE_API',
    specialty: specialty.trim(),
    secondary_skills: secondarySkillsStr,
    languages: (languages || 'Hindi, English').trim(),
    experience_years: Number(experience_years) || 5,
    qualification: (qualification || 'Jyotish Acharya').trim(),
    university_gurukul: (university_gurukul || '').trim(),
    consultation_modes: modesStr,
    bio: (bio || 'Experienced Vedic Astrologer').trim(),
    achievements: (achievements || '').trim(),
    rate_per_min: baseRate,
    chat_rate: Number(chat_rate) || baseRate,
    audio_rate: Number(audio_rate) || baseRate + 5,
    video_rate: Number(video_rate) || baseRate + 15,
    rating: 4.85,
    status: 'OFFLINE',
    approval_status: 'PENDING',
    rejection_reason: null,
    admin_notes: '',
    email_verified: isEmailVerified ? 1 : 0,
    phone_verified: isPhoneVerified ? 1 : 0,
    aadhar_number: (aadhar_number || '').trim(),
    pan_number: (pan_number || '').trim().toUpperCase(),
    id_proof_type: id_proof_type || 'Aadhaar Card',
    id_proof_document: id_proof_document || '',
    certificate_document: certificate_document || '',
    profile_photo: profile_photo || '',
    bank_account_holder: (bank_account_holder || name).trim(),
    bank_name: (bank_name || '').trim(),
    bank_account_number: (bank_account_number || '').trim(),
    bank_ifsc: (bank_ifsc || '').trim().toUpperCase(),
    upi_id: (upi_id || '').trim(),
    total_orders: 0,
    created_at: new Date().toISOString(),
  }

  // Save in MySQL if connected
  if (getMysqlStatus()) {
    try {
      const db = await getPool()
      const [existingMysql] = await db.query(
        'SELECT id, approval_status FROM astrologers WHERE email = ?',
        [cleanEmail]
      )
      if (existingMysql.length > 0) {
        return res.status(400).json({
          success: false,
          message: `An application with this email already exists (Status: ${existingMysql[0].approval_status}).`,
        })
      }

      const [result] = await db.query(
        `INSERT INTO astrologers (
          name, email, phone, whatsapp_phone, password_hash, gender, dob,
          city, state, country, pincode, full_address, latitude, longitude, location_provider,
          specialty, secondary_skills, languages, experience_years, qualification, university_gurukul,
          consultation_modes, bio, achievements, rate_per_min, chat_rate, audio_rate, video_rate,
          rating, status, approval_status, email_verified, phone_verified,
          aadhar_number, pan_number, id_proof_type, id_proof_document, certificate_document, profile_photo,
          bank_account_holder, bank_name, bank_account_number, bank_ifsc, upi_id, total_orders
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 4.85, 'OFFLINE', 'PENDING', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
        [
          newAstroRecord.name,
          newAstroRecord.email,
          newAstroRecord.phone,
          newAstroRecord.whatsapp_phone,
          newAstroRecord.password_hash,
          newAstroRecord.gender,
          newAstroRecord.dob,
          newAstroRecord.city,
          newAstroRecord.state,
          newAstroRecord.country,
          newAstroRecord.pincode,
          newAstroRecord.full_address,
          newAstroRecord.latitude,
          newAstroRecord.longitude,
          newAstroRecord.location_provider,
          newAstroRecord.specialty,
          newAstroRecord.secondary_skills,
          newAstroRecord.languages,
          newAstroRecord.experience_years,
          newAstroRecord.qualification,
          newAstroRecord.university_gurukul,
          newAstroRecord.consultation_modes,
          newAstroRecord.bio,
          newAstroRecord.achievements,
          newAstroRecord.rate_per_min,
          newAstroRecord.chat_rate,
          newAstroRecord.audio_rate,
          newAstroRecord.video_rate,
          newAstroRecord.email_verified,
          newAstroRecord.phone_verified,
          newAstroRecord.aadhar_number,
          newAstroRecord.pan_number,
          newAstroRecord.id_proof_type,
          newAstroRecord.id_proof_document,
          newAstroRecord.certificate_document,
          newAstroRecord.profile_photo,
          newAstroRecord.bank_account_holder,
          newAstroRecord.bank_name,
          newAstroRecord.bank_account_number,
          newAstroRecord.bank_ifsc,
          newAstroRecord.upi_id,
        ]
      )
      newAstroRecord.id = result.insertId
    } catch (err) {
      console.error('Register Astrologer MySQL Error:', err.message)
    }
  }

  localData.astrologers = [...(localData.astrologers || []), newAstroRecord]
  writeLocalDb(localData)

  const responseCopy = { ...newAstroRecord }
  delete responseCopy.password_hash

  return res.status(201).json({
    success: true,
    message:
      'Complete Vedic Profile & KYC Application submitted! Super Admin will verify and approve your profile.',
    application: responseCopy,
  })
}

// 13. POST /api/admin/astrologers/check-status (Public: Astrologer Login / Check Approval Status)
async function checkAstrologerStatus(req, res) {
  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please enter your registered email address.',
    })
  }

  const cleanEmail = email.trim().toLowerCase()

  if (getMysqlStatus()) {
    try {
      const db = await getPool()
      const [rows] = await db.query(
        'SELECT * FROM astrologers WHERE email = ?',
        [cleanEmail]
      )

      if (rows.length > 0) {
        const astro = rows[0]
        if (password && astro.password_hash) {
          const valid = await bcrypt.compare(password, astro.password_hash)
          if (!valid) {
            return res.status(401).json({
              success: false,
              message: 'Invalid password for this astrologer account.',
            })
          }
        }
        delete astro.password_hash
        return res.json({
          success: true,
          astrologer: astro,
        })
      }
    } catch (err) {
      console.error('Check status MySQL error:', err.message)
    }
  }

  // Fallback to Local DB
  const localData = readLocalDb()
  const astro = (localData.astrologers || []).find(
    (a) => (a.email || '').toLowerCase() === cleanEmail
  )

  if (!astro) {
    return res.status(404).json({
      success: false,
      message: 'No astrologer application found with this email.',
    })
  }

  if (password && astro.password_hash) {
    const valid = await bcrypt.compare(password, astro.password_hash)
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password for this astrologer account.',
      })
    }
  }

  const copy = { ...astro }
  delete copy.password_hash
  return res.json({
    success: true,
    astrologer: copy,
  })
}

// 14. GET /api/admin/astrologers/approved (Public: Fetch Approved Astrologers for Main Website)
async function getApprovedAstrologers(req, res) {
  if (getMysqlStatus()) {
    try {
      const db = await getPool()
      const [rows] = await db.query(
        "SELECT * FROM astrologers WHERE approval_status = 'APPROVED' ORDER BY id DESC"
      )
      const sanitized = rows.map((r) => {
        const copy = { ...r }
        delete copy.password_hash
        return copy
      })
      return res.json({
        success: true,
        astrologers: sanitized,
      })
    } catch (err) {
      console.error('Get approved MySQL error:', err.message)
    }
  }

  const localData = readLocalDb()
  const approved = (localData.astrologers || [])
    .filter((a) => a.approval_status === 'APPROVED')
    .sort((a, b) => b.id - a.id)
    .map((a) => {
      const copy = { ...a }
      delete copy.password_hash
      return copy
    })

  return res.json({
    success: true,
    astrologers: approved,
  })
}

module.exports = {
  loginAdmin,
  getAdminMe,
  getDashboardStats,
  updateAstrologerApproval,
  updateAstrologerLiveStatus,
  getPlatformSettings,
  getPublicOnboardingConfig,
  updatePlatformSettings,
  testNodemailerConfig,
  sendOnboardingOtp,
  verifyOnboardingOtp,
  searchLocations,
  registerAstrologerApplication,
  checkAstrologerStatus,
  getApprovedAstrologers,
}
