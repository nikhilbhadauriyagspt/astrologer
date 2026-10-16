# astrologer

**AstroVeda** — Full-Stack Multi-Astrologer Consultation Platform (React + Vite + Tailwind CSS v4 + Node.js + Express + MySQL).

## Project Structure

- `/` — Frontend Application (React 19 + Vite + Tailwind CSS v4)
- `/src/admin` — Standalone Super Admin Portal (`/admin` route with Login & Full-Width Analytics/Approval Dashboard)
- `/src/pages` — Public Pages (Astrologer Profile Detail, Kundli & 36 Gun Milan Report, E-Pooja & AstroMall Detail, Live Chat/Audio/Video Consultation Room, Join as Astrologer Onboarding)
- `/backend` — Node.js + Express + MySQL Backend (`astroveda_db` auto-migration & seeder)

## Quick Start

### 1. Backend (Node.js + MySQL)
```bash
cd backend
npm install
npm run seed
npm start
```
- **Super Admin URL**: `http://localhost:5173/admin`
- **Seeded Admin Email**: `admin@astroveda.in`
- **Seeded Admin Password**: `Admin@123`

### 2. Frontend (React + Vite)
```bash
npm install
npm run dev
```
