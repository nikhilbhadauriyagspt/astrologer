const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { initializeAndSeedDatabase } = require('./config/db')
const adminRoutes = require('./routes/adminRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AstroVeda Node.js + MySQL Backend',
    timestamp: new Date().toISOString(),
  })
})

// Admin Auth & Dashboard Routes
app.use('/api/admin', adminRoutes)

// Initialize MySQL tables & seed Admin on server start
initializeAndSeedDatabase().then((connected) => {
  app.listen(PORT, () => {
    console.log(`🚀 AstroVeda Backend running on http://localhost:${PORT}`)
    console.log(
      `🔑 Seeded Admin Credentials -> Email: admin@astroveda.in | Password: Admin@123`
    )
    if (connected) {
      console.log(`🗄️  MySQL Database (${process.env.DB_NAME}) Connected & Ready!`)
    }
  })
})
