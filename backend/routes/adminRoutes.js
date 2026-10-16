const express = require('express')
const router = express.Router()
const {
  loginAdmin,
  getAdminMe,
  getDashboardStats,
  updateAstrologerApproval,
  updateAstrologerLiveStatus,
  registerAstrologerApplication,
  checkAstrologerStatus,
  getApprovedAstrologers,
} = require('../controllers/adminController')
const { protectAdmin } = require('../middleware/authMiddleware')

// Public Routes: Admin Login & Astrologer Onboarding / Status Check / Approved Directory
router.post('/login', loginAdmin)
router.post('/astrologers/register', registerAstrologerApplication)
router.post('/astrologers/check-status', checkAstrologerStatus)
router.get('/astrologers/approved', getApprovedAstrologers)

// Protected Routes: Require Super Admin JWT Token
router.get('/me', protectAdmin, getAdminMe)
router.get('/dashboard', protectAdmin, getDashboardStats)
router.patch('/astrologers/:id/approval', protectAdmin, updateAstrologerApproval)
router.patch('/astrologers/:id/status', protectAdmin, updateAstrologerLiveStatus)

module.exports = router
