const jwt = require('jsonwebtoken')

const JWT_SECRET =
  process.env.JWT_SECRET || 'astroveda_super_secret_jwt_key_2026'

function protectAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid token',
    })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please login again.',
    })
  }
}

module.exports = { protectAdmin, JWT_SECRET }
