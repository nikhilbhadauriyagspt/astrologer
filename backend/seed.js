const { initializeAndSeedDatabase } = require('./config/db')

async function runSeed() {
  console.log('🌱 Starting Database & Admin Seeder...')
  const ok = await initializeAndSeedDatabase()
  if (ok) {
    console.log('🎉 MySQL Seeding Completed Successfully!')
  } else {
    console.log('✅ Local Persistent JSON DB (backend/data/local_db.json) Seeded & Ready!')
  }
  console.log('👉 Admin Email:    admin@astroveda.in')
  console.log('👉 Admin Password: Admin@123')
  process.exit(0)
}

runSeed()
