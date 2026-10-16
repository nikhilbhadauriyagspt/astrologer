const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
}

const dbName = process.env.DB_NAME || 'astroveda_db'

let pool = null

async function getPool() {
  if (pool) return pool
  pool = mysql.createPool({
    ...dbConfig,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  return pool
}

async function initializeAndSeedDatabase() {
  try {
    // 1. Create database if not exists
    const connection = await mysql.createConnection(dbConfig)
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    await connection.end()

    const db = await getPool()

    // 2. Create admins table
    await db.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'SUPER_ADMIN',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 3. Check if astrologers table has the new approval_status column; if not, recreate with full onboarding schema
    const [columns] = await db.query(`SHOW COLUMNS FROM astrologers LIKE 'approval_status'`).catch(() => [[]])
    if (!columns || columns.length === 0) {
      await db.query(`DROP TABLE IF EXISTS astrologers`)
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS astrologers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(150) UNIQUE,
        phone VARCHAR(30),
        password_hash VARCHAR(255),
        city VARCHAR(100) DEFAULT 'Varanasi',
        specialty VARCHAR(220) NOT NULL,
        languages VARCHAR(180) DEFAULT 'Hindi, English, Sanskrit',
        experience_years INT DEFAULT 10,
        qualification VARCHAR(200) DEFAULT 'Jyotish Acharya (BHU)',
        bio TEXT,
        rate_per_min INT DEFAULT 30,
        rating DECIMAL(3,2) DEFAULT 4.90,
        status ENUM('ONLINE', 'BUSY', 'OFFLINE') DEFAULT 'ONLINE',
        approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
        rejection_reason VARCHAR(255) DEFAULT NULL,
        total_orders INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 4. Check consultations schema
    const [consultCols] = await db.query(`SHOW COLUMNS FROM consultations LIKE 'user_name'`).catch(() => [[]])
    if (!consultCols || consultCols.length === 0) {
      await db.query(`DROP TABLE IF EXISTS consultations`)
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(120) NOT NULL,
        astrologer_name VARCHAR(120) NOT NULL,
        mode ENUM('CHAT', 'AUDIO', 'VIDEO') DEFAULT 'CHAT',
        duration_mins INT DEFAULT 10,
        amount INT DEFAULT 0,
        status ENUM('COMPLETED', 'ACTIVE', 'CANCELLED') DEFAULT 'COMPLETED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 5. Auto-seed default Super Admin if not exists
    const [existingAdmins] = await db.query(
      'SELECT id FROM admins WHERE email = ?',
      ['admin@astroveda.in']
    )

    if (existingAdmins.length === 0) {
      const passwordHash = await bcrypt.hash('Admin@123', 10)
      await db.query(
        'INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Acharya Super Admin', 'admin@astroveda.in', passwordHash, 'SUPER_ADMIN']
      )
      console.log('✅ Default Admin seeded: admin@astroveda.in / Admin@123')
    }

    // 6. Auto-seed Approved + Pending Astrologers if table is empty
    const [existingAstros] = await db.query('SELECT COUNT(*) AS cnt FROM astrologers')
    if (existingAstros[0].cnt === 0) {
      const defaultPass = await bcrypt.hash('Astro@123', 10)
      await db.query(
        `
        INSERT INTO astrologers 
          (name, email, phone, password_hash, city, specialty, languages, experience_years, qualification, bio, rate_per_min, rating, status, approval_status, total_orders)
        VALUES
          ('Acharya Devvrat Shastri', 'devvrat@astroveda.in', '+91 9811022331', ?, 'Varanasi (Kashi)', 'Vedic Kundli, Marriage & Muhurat', 'Hindi, Sanskrit, English', 18, 'Gold Medalist – Sampurnanand Sanskrit University', '18+ years guiding families on Kundli Milan, Mangal Dosh Shanti & auspicious Vivah Muhurat.', 35, 4.95, 'ONLINE', 'APPROVED', 14200),
          ('Pt. Raghavendra Joshi', 'raghavendra@astroveda.in', '+91 9822033442', ?, 'Ujjain', 'KP Astrology, Career & Business', 'Hindi, English, Marathi', 15, 'KP Jyotish Visharad', 'Specialist in Krishnamurti Paddhati (KP) for accurate corporate career, foreign settlement & business timing.', 40, 4.90, 'ONLINE', 'APPROVED', 11850),
          ('Dr. Maitreyi Deshmukh', 'maitreyi@astroveda.in', '+91 9833044553', ?, 'Pune', 'Nadi Jyotish, Tarot & Relationship', 'English, Hindi, Marathi', 12, 'Ph.D. in Mystic Sciences & Intuitive Tarot', 'Compassionate guidance on relationship harmony, emotional clarity, Nadi astrology & spiritual healing.', 30, 4.88, 'BUSY', 'APPROVED', 9640),
          ('Acharya Vishwanath Tiwari', 'vishwanath@astroveda.in', '+91 9844055664', ?, 'Prayagraj', 'Prashna Kundli, Vastu & Gemstone', 'Hindi, Sanskrit', 22, 'Shastri in Vastu & Ratna Shastra', 'Senior Vastu and Gemstone consultant offering authentic Vedic remedies without heavy rituals.', 50, 4.97, 'ONLINE', 'APPROVED', 19400),
          ('Sadhvi Gauri Nandini', 'gauri@astroveda.in', '+91 9855066775', ?, 'Haridwar', 'Lal Kitab, Numerology & Remedies', 'Hindi, English, Punjabi', 10, 'Lal Kitab & Vedic Numerology Expert', 'Simple, practical household Lal Kitab remedies and name/business numerology alignment.', 25, 4.85, 'ONLINE', 'APPROVED', 7420),
          ('Acharya Somnath Mishra', 'somnath@astroveda.in', '+91 9866077886', ?, 'Ayodhya', 'Ashtakoot Matching & Horary', 'Hindi, Sanskrit, English', 16, 'Acharya in Siddhanta Jyotish', 'Dedicated to deep Ashtakoot & Dashakoot Gun Milan, Nadi Dosha cancellation & Santana Gopala guidance.', 38, 4.92, 'ONLINE', 'APPROVED', 12310),
          ('Acharya Suryakant Tripathi', 'suryakant@astroveda.in', '+91 9877088991', ?, 'Varanasi', 'Parashari Jyotish, Dasha & Muhurat', 'Hindi, Sanskrit, English', 14, 'M.A. Jyotish – BHU Varanasi', 'Applied for onboarding: 14 years experience in Parashari Kundli analysis, Mahadasha predictions & Graha Shanti.', 32, 4.85, 'OFFLINE', 'PENDING', 0),
          ('Dr. Kavita Sharma', 'kavita@astroveda.in', '+91 9888099112', ?, 'Jaipur', 'Vedic Numerology, Tarot & Palmistry', 'Hindi, English', 9, 'Ph.D. Astrology & Certified Tarot Master', 'Applied for onboarding: Specializes in relationship counseling, career tarot spreads & Chaldean numerology.', 28, 4.80, 'OFFLINE', 'PENDING', 0),
          ('Pt. Harshvardhan Vyas', 'harshvardhan@astroveda.in', '+91 9899011223', ?, 'Ujjain', 'Bhrigu Nandi Nadi & Vastu Shastra', 'Hindi, Gujarati, English', 19, 'Jyotish Martand – Ujjain Gurukul', 'Applied for onboarding: Traditional Bhrigu Nandi Nadi snapshot predictions and commercial Vastu consultation.', 45, 4.90, 'OFFLINE', 'PENDING', 0)
        `,
        [
          defaultPass,
          defaultPass,
          defaultPass,
          defaultPass,
          defaultPass,
          defaultPass,
          defaultPass,
          defaultPass,
          defaultPass,
        ]
      )
      console.log('✅ Approved & Pending Astrologers seeded in MySQL')
    }

    // 7. Auto-seed sample Consultations if table is empty
    const [existingConsults] = await db.query('SELECT COUNT(*) AS cnt FROM consultations')
    if (existingConsults[0].cnt === 0) {
      await db.query(`
        INSERT INTO consultations (user_name, astrologer_name, mode, duration_mins, amount, status)
        VALUES
          ('Rohit & Neha Sharma', 'Acharya Devvrat Shastri', 'VIDEO', 18, 630, 'COMPLETED'),
          ('Vikramaditya Singhania', 'Pt. Raghavendra Joshi', 'AUDIO', 15, 600, 'COMPLETED'),
          ('Anjali Deshmukh', 'Dr. Maitreyi Deshmukh', 'CHAT', 12, 360, 'COMPLETED'),
          ('Saurabh Kulkarni', 'Acharya Vishwanath Tiwari', 'CHAT', 10, 500, 'ACTIVE'),
          ('Meenakshi Iyer', 'Sadhvi Gauri Nandini', 'AUDIO', 8, 205, 'COMPLETED')
      `)
      console.log('✅ Sample Consultations seeded in MySQL')
    }

    return true
  } catch (err) {
    console.error('⚠️ MySQL Initialization Error:', err.message)
    return false
  }
}

module.exports = {
  getPool,
  initializeAndSeedDatabase,
}
