const express = require('express')
const router = express.Router()
const {
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
} = require('../controllers/adminController')
const { protectAdmin } = require('../middleware/authMiddleware')

// Public Routes: Admin Login, Public Config, OTP Send/Verify, Live Location Search, Astrologer Onboarding
router.post('/login', loginAdmin)
router.get('/public-config', getPublicOnboardingConfig)
router.post('/otp/send', sendOnboardingOtp)
router.post('/otp/verify', verifyOnboardingOtp)
router.get('/location/search', searchLocations)
router.post('/astrologers/register', registerAstrologerApplication)
router.post('/astrologers/check-status', checkAstrologerStatus)
router.get('/astrologers/approved', getApprovedAstrologers)

// Protected Routes: Require Super Admin JWT Token
router.get('/me', protectAdmin, getAdminMe)
router.get('/dashboard', protectAdmin, getDashboardStats)
router.get('/settings', protectAdmin, getPlatformSettings)
router.put('/settings', protectAdmin, updatePlatformSettings)
router.post('/settings/test-email', protectAdmin, testNodemailerConfig)
router.patch('/astrologers/:id/approval', protectAdmin, updateAstrologerApproval)
router.patch('/astrologers/:id/status', protectAdmin, updateAstrologerLiveStatus)

module.exports = router
