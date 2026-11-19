const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
}

const dbName = process.env.DB_NAME || 'astroveda_db'
const LOCAL_DB_PATH = path.join(__dirname, '..', 'data', 'local_db.json')

let pool = null
let isMysqlConnected = false

const DEFAULT_PLATFORM_SETTINGS = {
  otp_verification_mode: 'BOTH', // 'BOTH' | 'EMAIL_ONLY' | 'MOBILE_ONLY' | 'NONE'
  enable_email_otp: true,
  enable_mobile_otp: true,

  // Email OTP (Nodemailer) Settings
  email_otp_mode: 'TEST', // 'TEST' | 'LIVE'
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: '',
  smtp_pass: '',
  smtp_from_name: 'AstroVeda Jyotish Board',
  smtp_from_email: 'noreply@astroveda.in',
  test_email_otp: '123456',

  // Mobile OTP (SMS Gateway) Settings
  mobile_otp_mode: 'TEST', // 'TEST' | 'LIVE'
  sms_provider: 'FAST2SMS', // 'FAST2SMS' | 'MSG91' | 'TWILIO' | 'CUSTOM'
  sms_api_key: '',
  sms_sender_id: 'ASTVED',
  sms_template_id: '',
  sms_custom_url: '',
  test_mobile_otp: '123456',

  // Location Search API Settings
  location_api_mode: 'AUTO', // 'AUTO' (Google Console if key exists, else Free API) | 'GOOGLE_CONSOLE' | 'FREE_API'
  google_maps_api_key: '',
  location_country_bias: 'IN',
}

function getInitialSeededAstrologers(defaultPassHash) {
  return [
    {
      id: 1,
      name: 'Acharya Devvrat Shastri',
      email: 'devvrat@astroveda.in',
      phone: '+91 9811022331',
      whatsapp_phone: '+91 9811022331',
      password_hash: defaultPassHash,
      gender: 'Male',
      dob: '1978-05-14',
      city: 'Varanasi (Kashi)',
      state: 'Uttar Pradesh',
      country: 'India',
      pincode: '221001',
      full_address: 'Dashashwamedh Ghat Road, Varanasi, Uttar Pradesh, India',
      latitude: '25.3176',
      longitude: '83.0062',
      location_provider: 'FREE_LIVE_API',
      specialty: 'Vedic Kundli, Marriage & Muhurat',
      secondary_skills: 'Ashtakoot Milan, Prashna Kundli, Muhurat',
      languages: 'Hindi, Sanskrit, English',
      experience_years: 18,
      qualification: 'Gold Medalist – Sampurnanand Sanskrit University',
      university_gurukul: 'Sampurnanand Sanskrit Vishwavidyalaya, Kashi',
      consultation_modes: 'CHAT, AUDIO, VIDEO',
      bio: '18+ years guiding families on Kundli Milan, Mangal Dosh Shanti & auspicious Vivah Muhurat.',
      achievements: 'Honored with Kashi Jyotish Ratna Award 2019; 14,000+ successful consultations.',
      rate_per_min: 35,
      chat_rate: 35,
      audio_rate: 40,
      video_rate: 50,
      rating: 4.95,
      status: 'ONLINE',
      approval_status: 'APPROVED',
      rejection_reason: null,
      admin_notes: 'Verified degree and identity documents.',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: 'XXXX-XXXX-4821',
      pan_number: 'ABCPS4821K',
      id_proof_type: 'Aadhaar Card & PAN Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Acharya Devvrat Shastri',
      bank_name: 'State Bank of India',
      bank_account_number: '30981122441',
      bank_ifsc: 'SBIN0001234',
      upi_id: 'devvrat@sbi',
      total_orders: 14200,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Pt. Raghavendra Joshi',
      email: 'raghavendra@astroveda.in',
      phone: '+91 9822033442',
      whatsapp_phone: '+91 9822033442',
      password_hash: defaultPassHash,
      gender: 'Male',
      dob: '1982-11-22',
      city: 'Ujjain',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '456001',
      full_address: 'Mahakal Lok Marg, Ujjain, Madhya Pradesh, India',
      latitude: '23.1765',
      longitude: '75.7885',
      location_provider: 'FREE_LIVE_API',
      specialty: 'KP Astrology, Career & Business',
      secondary_skills: 'Corporate Astrology, Foreign Settlement, Horary',
      languages: 'Hindi, English, Marathi',
      experience_years: 15,
      qualification: 'KP Jyotish Visharad',
      university_gurukul: 'Maharshi Sandipani Rashtriya Veda Vidya Pratishthan',
      consultation_modes: 'CHAT, AUDIO, VIDEO',
      bio: 'Specialist in Krishnamurti Paddhati (KP) for accurate corporate career, foreign settlement & business timing.',
      achievements: 'Published author on KP Sub-Lord Theory & Career Timing.',
      rate_per_min: 40,
      chat_rate: 40,
      audio_rate: 45,
      video_rate: 55,
      rating: 4.9,
      status: 'ONLINE',
      approval_status: 'APPROVED',
      rejection_reason: null,
      admin_notes: 'Verified KP Institute credentials.',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: 'XXXX-XXXX-7732',
      pan_number: 'BGHJ9921L',
      id_proof_type: 'Aadhaar Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Raghavendra Joshi',
      bank_name: 'HDFC Bank',
      bank_account_number: '501002399182',
      bank_ifsc: 'HDFC0000412',
      upi_id: 'raghavendra@hdfcbank',
      total_orders: 11850,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Dr. Maitreyi Deshmukh',
      email: 'maitreyi@astroveda.in',
      phone: '+91 9833044553',
      whatsapp_phone: '+91 9833044553',
      password_hash: defaultPassHash,
      gender: 'Female',
      dob: '1986-03-09',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411004',
      full_address: 'Deccan Gymkhana, Pune, Maharashtra, India',
      latitude: '18.5204',
      longitude: '73.8567',
      location_provider: 'FREE_LIVE_API',
      specialty: 'Nadi Jyotish, Tarot & Relationship',
      secondary_skills: 'Relationship Healing, Psychic Tarot, Chakra Alignment',
      languages: 'English, Hindi, Marathi',
      experience_years: 12,
      qualification: 'Ph.D. in Mystic Sciences & Intuitive Tarot',
      university_gurukul: 'Kavikulaguru Kalidas Sanskrit University',
      consultation_modes: 'CHAT, AUDIO, VIDEO',
      bio: 'Compassionate guidance on relationship harmony, emotional clarity, Nadi astrology & spiritual healing.',
      achievements: 'Featured Relationship & Tarot Columnist.',
      rate_per_min: 30,
      chat_rate: 30,
      audio_rate: 35,
      video_rate: 45,
      rating: 4.88,
      status: 'BUSY',
      approval_status: 'APPROVED',
      rejection_reason: null,
      admin_notes: 'Verified doctorate certificate.',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: 'XXXX-XXXX-1290',
      pan_number: 'KLMND1290P',
      id_proof_type: 'PAN Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Dr. Maitreyi Deshmukh',
      bank_name: 'ICICI Bank',
      bank_account_number: '003901552810',
      bank_ifsc: 'ICIC0000039',
      upi_id: 'maitreyi@icici',
      total_orders: 9640,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: 'Acharya Vishwanath Tiwari',
      email: 'vishwanath@astroveda.in',
      phone: '+91 9844055664',
      whatsapp_phone: '+91 9844055664',
      password_hash: defaultPassHash,
      gender: 'Male',
      dob: '1974-08-19',
      city: 'Prayagraj',
      state: 'Uttar Pradesh',
      country: 'India',
      pincode: '211001',
      full_address: 'Civil Lines, Prayagraj, Uttar Pradesh, India',
      latitude: '25.4358',
      longitude: '81.8463',
      location_provider: 'FREE_LIVE_API',
      specialty: 'Prashna Kundli, Vastu & Gemstone',
      secondary_skills: 'Industrial Vastu, Ratna Shastra, Rudraksha Therapy',
      languages: 'Hindi, Sanskrit',
      experience_years: 22,
      qualification: 'Shastri in Vastu & Ratna Shastra',
      university_gurukul: 'Prayagraj Veda Gurukulam',
      consultation_modes: 'CHAT, AUDIO, VIDEO',
      bio: 'Senior Vastu and Gemstone consultant offering authentic Vedic remedies without heavy rituals.',
      achievements: '22+ years advising residential & commercial Vastu projects across India.',
      rate_per_min: 50,
      chat_rate: 50,
      audio_rate: 55,
      video_rate: 65,
      rating: 4.97,
      status: 'ONLINE',
      approval_status: 'APPROVED',
      rejection_reason: null,
      admin_notes: 'Senior verified Acharya.',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: 'XXXX-XXXX-6610',
      pan_number: 'PRSTV6610M',
      id_proof_type: 'Aadhaar Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Vishwanath Tiwari',
      bank_name: 'Bank of Baroda',
      bank_account_number: '2910010004512',
      bank_ifsc: 'BARB0PRAYAG',
      upi_id: 'vishwanath@bob',
      total_orders: 19400,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: 'Sadhvi Gauri Nandini',
      email: 'gauri@astroveda.in',
      phone: '+91 9855066775',
      whatsapp_phone: '+91 9855066775',
      password_hash: defaultPassHash,
      gender: 'Female',
      dob: '1989-12-03',
      city: 'Haridwar',
      state: 'Uttarakhand',
      country: 'India',
      pincode: '249401',
      full_address: 'Kankhal Ashram Road, Haridwar, Uttarakhand, India',
      latitude: '29.9457',
      longitude: '78.1642',
      location_provider: 'FREE_LIVE_API',
      specialty: 'Lal Kitab, Numerology & Remedies',
      secondary_skills: 'Vedic Numerology, Name Correction, Family Harmony',
      languages: 'Hindi, English, Punjabi',
      experience_years: 10,
      qualification: 'Lal Kitab & Vedic Numerology Expert',
      university_gurukul: 'Dev Sanskriti Vishwavidyalaya, Haridwar',
      consultation_modes: 'CHAT, AUDIO',
      bio: 'Simple, practical household Lal Kitab remedies and name/business numerology alignment.',
      achievements: '10+ years of household Lal Kitab consultation.',
      rate_per_min: 25,
      chat_rate: 25,
      audio_rate: 30,
      video_rate: 35,
      rating: 4.85,
      status: 'ONLINE',
      approval_status: 'APPROVED',
      rejection_reason: null,
      admin_notes: 'Verified.',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: 'XXXX-XXXX-8840',
      pan_number: 'GAURI8840D',
      id_proof_type: 'Aadhaar Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Gauri Nandini',
      bank_name: 'Punjab National Bank',
      bank_account_number: '04120001092831',
      bank_ifsc: 'PUNB0041200',
      upi_id: 'gauri@pnb',
      total_orders: 7420,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: 'Acharya Somnath Mishra',
      email: 'somnath@astroveda.in',
      phone: '+91 9866077886',
      whatsapp_phone: '+91 9866077886',
      password_hash: defaultPassHash,
      gender: 'Male',
      dob: '1981-07-25',
      city: 'Ayodhya',
      state: 'Uttar Pradesh',
      country: 'India',
      pincode: '224123',
      full_address: 'Ram Path, Hanuman Garhi, Ayodhya, Uttar Pradesh, India',
      latitude: '26.7922',
      longitude: '82.1998',
      location_provider: 'FREE_LIVE_API',
      specialty: 'Ashtakoot Matching & Horary',
      secondary_skills: 'Nadi Dosha Cancellation, Santana Gopala Muhurat',
      languages: 'Hindi, Sanskrit, English',
      experience_years: 16,
      qualification: 'Acharya in Siddhanta Jyotish',
      university_gurukul: 'Awadh Sanskrit Vidyapeeth',
      consultation_modes: 'CHAT, AUDIO, VIDEO',
      bio: 'Dedicated to deep Ashtakoot & Dashakoot Gun Milan, Nadi Dosha cancellation & Santana Gopala guidance.',
      achievements: '16 years of specialized marriage compatibility practice.',
      rate_per_min: 38,
      chat_rate: 38,
      audio_rate: 42,
      video_rate: 50,
      rating: 4.92,
      status: 'ONLINE',
      approval_status: 'APPROVED',
      rejection_reason: null,
      admin_notes: 'Verified.',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: 'XXXX-XXXX-5519',
      pan_number: 'SOMNM5519Q',
      id_proof_type: 'Aadhaar Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Somnath Mishra',
      bank_name: 'State Bank of India',
      bank_account_number: '31129884721',
      bank_ifsc: 'SBIN0002510',
      upi_id: 'somnath@sbi',
      total_orders: 12310,
      created_at: new Date().toISOString(),
    },
    {
      id: 7,
      name: 'Acharya Suryakant Tripathi',
      email: 'suryakant@astroveda.in',
      phone: '+91 9877088991',
      whatsapp_phone: '+91 9877088991',
      password_hash: defaultPassHash,
      gender: 'Male',
      dob: '1985-04-12',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      country: 'India',
      pincode: '221005',
      full_address: 'Lanka, Near BHU Gate, Varanasi, Uttar Pradesh, India',
      latitude: '25.2677',
      longitude: '82.9913',
      location_provider: 'FREE_LIVE_API',
      specialty: 'Parashari Jyotish, Dasha & Muhurat',
      secondary_skills: 'Vedic Kundli & Marriage, Prashna & Muhurat, Vastu Shastra',
      languages: 'Hindi, Sanskrit, English',
      experience_years: 14,
      qualification: 'M.A. Jyotish – BHU Varanasi',
      university_gurukul: 'Banaras Hindu University (BHU)',
      consultation_modes: 'CHAT, AUDIO, VIDEO',
      bio: 'Applied for onboarding: 14 years experience in Parashari Kundli analysis, Mahadasha predictions & Graha Shanti.',
      achievements: 'University Rank Holder in Faculty of Sanskrit Vidya Dharma Vijnan.',
      rate_per_min: 32,
      chat_rate: 32,
      audio_rate: 38,
      video_rate: 45,
      rating: 4.85,
      status: 'OFFLINE',
      approval_status: 'PENDING',
      rejection_reason: null,
      admin_notes: '',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: '8492-3310-9821',
      pan_number: 'SURYT8812F',
      id_proof_type: 'Aadhaar Card & PAN Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Suryakant Tripathi',
      bank_name: 'Union Bank of India',
      bank_account_number: '419202010088212',
      bank_ifsc: 'UBIN0541923',
      upi_id: 'suryakant@upi',
      total_orders: 0,
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      name: 'Dr. Kavita Sharma',
      email: 'kavita@astroveda.in',
      phone: '+91 9888099112',
      whatsapp_phone: '+91 9888099112',
      password_hash: defaultPassHash,
      gender: 'Female',
      dob: '1990-09-18',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      pincode: '302001',
      full_address: 'MI Road, Pink City, Jaipur, Rajasthan, India',
      latitude: '26.9124',
      longitude: '75.7873',
      location_provider: 'FREE_LIVE_API',
      specialty: 'Vedic Numerology, Tarot & Palmistry',
      secondary_skills: 'Tarot & Relationship, Vedic Numerology, Name Alignment',
      languages: 'Hindi, English',
      experience_years: 9,
      qualification: 'Ph.D. Astrology & Certified Tarot Master',
      university_gurukul: 'Jagadguru Ramanandacharya Rajasthan Sanskrit University',
      consultation_modes: 'CHAT, AUDIO, VIDEO',
      bio: 'Applied for onboarding: Specializes in relationship counseling, career tarot spreads & Chaldean numerology.',
      achievements: 'Conducted 50+ workshops on Vedic Numerology & Tarot.',
      rate_per_min: 28,
      chat_rate: 28,
      audio_rate: 32,
      video_rate: 40,
      rating: 4.8,
      status: 'OFFLINE',
      approval_status: 'PENDING',
      rejection_reason: null,
      admin_notes: '',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: '6721-9012-4410',
      pan_number: 'KAVIS4410B',
      id_proof_type: 'Aadhaar Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Dr. Kavita Sharma',
      bank_name: 'Axis Bank',
      bank_account_number: '91801004492811',
      bank_ifsc: 'UTIB0000120',
      upi_id: 'kavitasharma@okaxis',
      total_orders: 0,
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      name: 'Pt. Harshvardhan Vyas',
      email: 'harshvardhan@astroveda.in',
      phone: '+91 9899011223',
      whatsapp_phone: '+91 9899011223',
      password_hash: defaultPassHash,
      gender: 'Male',
      dob: '1979-01-30',
      city: 'Ujjain',
      state: 'Madhya Pradesh',
      country: 'India',
      pincode: '456010',
      full_address: 'Freeganj, Ujjain, Madhya Pradesh, India',
      latitude: '23.1815',
      longitude: '75.7772',
      location_provider: 'FREE_LIVE_API',
      specialty: 'Bhrigu Nandi Nadi & Vastu Shastra',
      secondary_skills: 'Nadi Jyotish, Vastu Shastra, Commercial Vastu',
      languages: 'Hindi, Gujarati, English',
      experience_years: 19,
      qualification: 'Jyotish Martand – Ujjain Gurukul',
      university_gurukul: 'Avantika Veda Vidya Gurukul, Ujjain',
      consultation_modes: 'CHAT, AUDIO, VIDEO',
      bio: 'Applied for onboarding: Traditional Bhrigu Nandi Nadi snapshot predictions and commercial Vastu consultation.',
      achievements: '19 years of lineage practice in Bhrigu Samhita & Nadi Jyotish.',
      rate_per_min: 45,
      chat_rate: 45,
      audio_rate: 50,
      video_rate: 60,
      rating: 4.9,
      status: 'OFFLINE',
      approval_status: 'PENDING',
      rejection_reason: null,
      admin_notes: '',
      email_verified: 1,
      phone_verified: 1,
      aadhar_number: '5512-7789-3301',
      pan_number: 'HARSV3301N',
      id_proof_type: 'Aadhaar Card & PAN Card',
      id_proof_document: '',
      certificate_document: '',
      profile_photo: '',
      bank_account_holder: 'Harshvardhan Vyas',
      bank_name: 'Kotak Mahindra Bank',
      bank_account_number: '7411892301',
      bank_ifsc: 'KKBK0005912',
      upi_id: 'harshvardhan@kotak',
      total_orders: 0,
      created_at: new Date().toISOString(),
    },
  ]
}

const DEFAULT_CONSULTATIONS = [
  {
    id: 1,
    user_name: 'Rohit & Neha Sharma',
    astrologer_name: 'Acharya Devvrat Shastri',
    mode: 'VIDEO',
    duration_mins: 18,
    amount: 630,
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_name: 'Vikramaditya Singhania',
    astrologer_name: 'Pt. Raghavendra Joshi',
    mode: 'AUDIO',
    duration_mins: 15,
    amount: 600,
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_name: 'Anjali Deshmukh',
    astrologer_name: 'Dr. Maitreyi Deshmukh',
    mode: 'CHAT',
    duration_mins: 12,
    amount: 360,
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    user_name: 'Saurabh Kulkarni',
    astrologer_name: 'Acharya Vishwanath Tiwari',
    mode: 'CHAT',
    duration_mins: 10,
    amount: 500,
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    user_name: 'Meenakshi Iyer',
    astrologer_name: 'Sadhvi Gauri Nandini',
    mode: 'AUDIO',
    duration_mins: 8,
    amount: 205,
    status: 'COMPLETED',
    created_at: new Date().toISOString(),
  },
]

// Local JSON store helper so everything persists even if MySQL is not running
function ensureLocalDb() {
  const dir = path.dirname(LOCAL_DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const adminHash = bcrypt.hashSync('Admin@123', 10)
    const astroHash = bcrypt.hashSync('Astro@123', 10)
    const initialData = {
      admins: [
        {
          id: 1,
          name: 'Acharya Super Admin',
          email: 'admin@astroveda.in',
          password_hash: adminHash,
          role: 'SUPER_ADMIN',
          created_at: new Date().toISOString(),
        },
      ],
      astrologers: getInitialSeededAstrologers(astroHash),
      consultations: DEFAULT_CONSULTATIONS,
      settings: { ...DEFAULT_PLATFORM_SETTINGS },
      otps: [],
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2), 'utf8')
  }
}

function readLocalDb() {
  ensureLocalDb()
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    parsed.settings = { ...DEFAULT_PLATFORM_SETTINGS, ...(parsed.settings || {}) }
    parsed.otps = parsed.otps || []
    return parsed
  } catch {
    ensureLocalDb()
    return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'))
  }
}

function writeLocalDb(data) {
  ensureLocalDb()
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8')
}

async function getPool() {
  if (pool && isMysqlConnected) return pool
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
  ensureLocalDb()
  try {
    const connection = await mysql.createConnection(dbConfig)
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    await connection.end()

    const db = await getPool()

    // 1. Admins table
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

    // 2. Check if astrologers table has extended onboarding columns
    const [columns] = await db
      .query(`SHOW COLUMNS FROM astrologers LIKE 'aadhar_number'`)
      .catch(() => [[]])
    if (!columns || columns.length === 0) {
      await db.query(`DROP TABLE IF EXISTS astrologers`)
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS astrologers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(150) UNIQUE,
        phone VARCHAR(30),
        whatsapp_phone VARCHAR(30),
        password_hash VARCHAR(255),
        gender VARCHAR(30) DEFAULT 'Male',
        dob VARCHAR(30) DEFAULT '',
        city VARCHAR(120) DEFAULT 'Varanasi',
        state VARCHAR(120) DEFAULT 'Uttar Pradesh',
        country VARCHAR(120) DEFAULT 'India',
        pincode VARCHAR(20) DEFAULT '',
        full_address TEXT,
        latitude VARCHAR(40) DEFAULT '',
        longitude VARCHAR(40) DEFAULT '',
        location_provider VARCHAR(50) DEFAULT 'FREE_LIVE_API',
        specialty VARCHAR(220) NOT NULL,
        secondary_skills TEXT,
        languages VARCHAR(220) DEFAULT 'Hindi, English, Sanskrit',
        experience_years INT DEFAULT 10,
        qualification VARCHAR(250) DEFAULT 'Jyotish Acharya (BHU)',
        university_gurukul VARCHAR(250) DEFAULT '',
        consultation_modes VARCHAR(120) DEFAULT 'CHAT, AUDIO, VIDEO',
        bio TEXT,
        achievements TEXT,
        rate_per_min INT DEFAULT 30,
        chat_rate INT DEFAULT 30,
        audio_rate INT DEFAULT 35,
        video_rate INT DEFAULT 45,
        rating DECIMAL(3,2) DEFAULT 4.90,
        status ENUM('ONLINE', 'BUSY', 'OFFLINE') DEFAULT 'ONLINE',
        approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
        rejection_reason VARCHAR(255) DEFAULT NULL,
        admin_notes TEXT,
        email_verified TINYINT(1) DEFAULT 0,
        phone_verified TINYINT(1) DEFAULT 0,
        aadhar_number VARCHAR(50) DEFAULT '',
        pan_number VARCHAR(50) DEFAULT '',
        id_proof_type VARCHAR(100) DEFAULT 'Aadhaar Card',
        id_proof_document LONGTEXT,
        certificate_document LONGTEXT,
        profile_photo LONGTEXT,
        bank_account_holder VARCHAR(150) DEFAULT '',
        bank_name VARCHAR(150) DEFAULT '',
        bank_account_number VARCHAR(80) DEFAULT '',
        bank_ifsc VARCHAR(40) DEFAULT '',
        upi_id VARCHAR(100) DEFAULT '',
        total_orders INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 3. Consultations table
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

    // 4. Platform Settings table (stores JSON config for OTP, Nodemailer, SMS, Google Console Location API)
    await db.query(`
      CREATE TABLE IF NOT EXISTS platform_settings (
        id INT PRIMARY KEY DEFAULT 1,
        config_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    const [existingSettings] = await db.query(
      'SELECT id FROM platform_settings WHERE id = 1'
    )
    if (existingSettings.length === 0) {
      await db.query(
        'INSERT INTO platform_settings (id, config_json) VALUES (1, ?)',
        [JSON.stringify(DEFAULT_PLATFORM_SETTINGS)]
      )
    }

    // 5. Seed Super Admin
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
    }

    // 6. Seed Astrologers if empty
    const [existingAstros] = await db.query(
      'SELECT COUNT(*) AS cnt FROM astrologers'
    )
    if (existingAstros[0].cnt === 0) {
      const defaultPass = await bcrypt.hash('Astro@123', 10)
      const seedAstros = getInitialSeededAstrologers(defaultPass)
      for (const a of seedAstros) {
        await db.query(
          `INSERT INTO astrologers (
            name, email, phone, whatsapp_phone, password_hash, gender, dob,
            city, state, country, pincode, full_address, latitude, longitude, location_provider,
            specialty, secondary_skills, languages, experience_years, qualification, university_gurukul,
            consultation_modes, bio, achievements, rate_per_min, chat_rate, audio_rate, video_rate,
            rating, status, approval_status, admin_notes, email_verified, phone_verified,
            aadhar_number, pan_number, id_proof_type, bank_account_holder, bank_name,
            bank_account_number, bank_ifsc, upi_id, total_orders
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            a.name,
            a.email,
            a.phone,
            a.whatsapp_phone,
            a.password_hash,
            a.gender,
            a.dob,
            a.city,
            a.state,
            a.country,
            a.pincode,
            a.full_address,
            a.latitude,
            a.longitude,
            a.location_provider,
            a.specialty,
            a.secondary_skills,
            a.languages,
            a.experience_years,
            a.qualification,
            a.university_gurukul,
            a.consultation_modes,
            a.bio,
            a.achievements,
            a.rate_per_min,
            a.chat_rate,
            a.audio_rate,
            a.video_rate,
            a.rating,
            a.status,
            a.approval_status,
            a.admin_notes,
            a.email_verified,
            a.phone_verified,
            a.aadhar_number,
            a.pan_number,
            a.id_proof_type,
            a.bank_account_holder,
            a.bank_name,
            a.bank_account_number,
            a.bank_ifsc,
            a.upi_id,
            a.total_orders,
          ]
        )
      }
    }

    // 7. Seed Consultations if empty
    const [existingConsults] = await db.query(
      'SELECT COUNT(*) AS cnt FROM consultations'
    )
    if (existingConsults[0].cnt === 0) {
      for (const c of DEFAULT_CONSULTATIONS) {
        await db.query(
          `INSERT INTO consultations (user_name, astrologer_name, mode, duration_mins, amount, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [c.user_name, c.astrologer_name, c.mode, c.duration_mins, c.amount, c.status]
        )
      }
    }

    isMysqlConnected = true
    return true
  } catch (err) {
    isMysqlConnected = false
    console.log(
      'ℹ️ MySQL not reachable (' +
        (err.code || err.message || 'offline') +
        ') — Using persistent Local JSON DB (backend/data/local_db.json)'
    )
    return false
  }
}

function getMysqlStatus() {
  return isMysqlConnected
}

module.exports = {
  getPool,
  initializeAndSeedDatabase,
  getMysqlStatus,
  readLocalDb,
  writeLocalDb,
  DEFAULT_PLATFORM_SETTINGS,
}
