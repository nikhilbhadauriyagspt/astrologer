const { initializeAndSeedDatabase } = require('./config/db')

async function runSeed() {
  console.log('🌱 Starting MySQL Database & Admin Seeder...')
  const ok = await initializeAndSeedDatabase()
  if (ok) {
    console.log('🎉 MySQL Seeding Completed Successfully!')
    console.log('👉 Admin Email:    admin@astroveda.in')
    console.log('👉 Admin Password: Admin@123')
    process.exit(0)
  } else {
    console.log('⚠️ Could not connect to MySQL. Check DB_PASSWORD in backend/.env')
    process.exit(1)
  }
}

runSeed()
