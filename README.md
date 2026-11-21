# Blood Bank — Donate Blood, Save Lives.

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: Web & Mobile](https://img.shields.io/badge/Platform-Web%20%26%20Mobile%20PWA-red.svg)](#)

> **"Donate Blood, Save Lives."** / **"রক্ত দিন, জীবন বাঁচান।"**  
> **Lead Developer:** Rakin Ashab  
> **Direct Phone:** 01936106621  
> **Email:** mohammadrakinashab@gmail.com  
> **Default Donation Interval:** Exactly 90 Days

---

## 🩸 Project Overview

**Blood Bank** is a modern, production-grade, humanitarian healthcare web platform built specifically to help people in Bangladesh find voluntary blood donors quickly and easily during life-threatening medical emergencies.

The platform provides a public, zero-login emergency blood donor directory coupled with an enterprise-grade administrative management system.

---

## 🌟 Key Architecture & Features

### 1. ⏱️ Dynamic 90-Day Blood Donation Availability Engine
* **Formula:** `Next Eligible Donation Date = Last Donation Date + 90 Calendar Days`.
* **Dynamic Recalculation:** Donor eligibility status is **never statically stored** as a fragile boolean. Instead, it is computed on every read against Bangladesh Standard Time (`Asia/Dhaka`, UTC+6).
* **Timezone & Date-Only Math:** Uses pure date UTC math to completely prevent timezone off-by-one errors. Accurately handles leap years (e.g., 2028 with 29 days in February) and month boundaries (28, 29, 30, 31 days).
* **Live Status Display:**
  * **AVAILABLE:** Emerald badge + "Available" / "রক্তদানে প্রস্তুত".
  * **UNAVAILABLE:** Rose badge + "Unavailable" / "অপেক্ষারত" + Remaining days countdown (e.g., *"Available in 25 days"* / *"আর ২৫ দিন পর রক্ত দিতে পারবেন"*).
* **Administrative Setting:** The 90-day interval is configurable via the `app_settings` table and admin dashboard.
* **Medical Disclaimer:** Explicitly stated in both English and Bengali per medical ethics.

### 2. 🌐 Complete Bilingual Language System (English & বাংলা)
* Instant seamless switching between English and বাংলা with persistent language preference.
* Rendered with dedicated Bengali typography using **Hind Siliguri** and **Noto Sans Bengali** fonts.
* Fully localized navigation, buttons, forms, status pills, awareness cards, error alerts, and notifications.

### 3. 📱 Mobile-First Responsive Healthcare Design
* Medical platform design language: Deep Blood Red (`#b91c1c`), Clean White, Charcoal typography, and subtle healthcare shadows.
* Avoids generic AI aesthetics, oversized headings, or unnecessary animations.
* Ergonomic phone dialer integration (`tel:019XXXXXXXX`) for immediate direct dialing on smartphones.
* Compact cards on mobile and clean table/card layout switcher on desktop.

### 4. 🔒 10 Predefined Administrator Accounts & Security
* **Predefined Accounts:** `admin1` through `admin10`.
* **Initial Default Password:** `admin1234`.
* **Equal Permissions:** Add donor, edit donor, delete donor (with confirmation modal), update last donation date, edit notes, view live statistics, export CSV, and change password.
* **Security Architecture:** Supabase PostgreSQL with **Row Level Security (RLS)** and `security definer` role verification. Never exposes service-role keys to client.
* **Zero-Config Local Fallback:** Runs seamlessly in local mode out of the box for immediate demonstration, and switches to Supabase automatically when environment variables are configured.

### 5. 📚 Blood Donation Awareness Section
* Medically responsible educational content covering:
  * Why Blood Donation Matters
  * Health Benefits of Voluntary Blood Donation
  * Preparation Before Donating
  * Post-Donation Care
  * Eligibility Criteria
  * Medical Consultation Advice

### 6. 📞 Report a Problem & Developer Contact
* Displays full developer credentials for Rakin Ashab.
* One-click functional `tel:01936106621` and `mailto:mohammadrakinashab@gmail.com` buttons.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18+ with TypeScript |
| **Build Tool & Bundler** | Vite |
| **Styling & Design System** | Tailwind CSS (Custom Medical Palette) |
| **Icons** | Lucide React |
| **Routing** | React Router DOM v6 |
| **Backend & Database** | Supabase (PostgreSQL with RLS) |
| **Hosting & CI/CD** | Vercel (Free Tier Compatible) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** or **pnpm**

### Installation & Run

1. Clone or navigate to the project directory:
   ```bash
   cd "Blood bank"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Test Admin Login locally:
   * Navigate to `Admin Login` in navigation or `http://localhost:5173/admin/login`
   * Username: `admin1` (or any from `admin1` to `admin10`)
   * Password: `admin1234`

5. Run Production Build:
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase Free Tier Setup Instructions

Follow these steps to connect your own Supabase project:

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, choose an organization, set a project name (e.g. `blood-bank-bd`), set a strong database password, and choose **Singapore (ap-southeast-1)** for the lowest latency in Bangladesh.

### Step 2: Run Database Schema & Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor** on the left menu.
2. Open `supabase/migrations/001_init.sql` (or `001_init.sql` in the project root).
3. Copy the entire contents, paste them into the SQL Editor, and click **Run**.
4. This creates:
   * `app_settings` (with default 90-day donation interval)
   * `admin_profiles`
   * `donors` (with Bangladesh phone number validation regex)
   * `donors_public` (dynamic availability view)
   * RLS policies and the `is_admin()` helper function.

### Step 3: Seed the 10 Administrator Accounts
1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. In Supabase Dashboard, go to **Project Settings** -> **API**:
   * Copy `Project URL` to `VITE_SUPABASE_URL` and `SUPABASE_URL`.
   * Copy `anon` `public` key to `VITE_SUPABASE_ANON_KEY`.
   * Copy `service_role` `secret` key to `SUPABASE_SERVICE_ROLE_KEY`.
3. Run the admin seeding script:
   ```bash
   npm run seed
   ```
   This initializes `admin1` through `admin10` with default password `admin1234` inside Supabase Auth and `admin_profiles`.

---

## 🌐 Deploy to Vercel (100% Free Tier)

1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Blood Bank platform"
   git remote add origin https://github.com/your-username/blood-bank.git
   git push -u origin main
   ```

2. Open [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
3. Import your `blood-bank` repository.
4. Set the Framework Preset to **Vite**.
5. Under **Environment Variables**, add:
   * `VITE_SUPABASE_URL`: Your Supabase Project URL
   * `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key
6. Click **Deploy**. Vercel will build and deploy the application with global CDN coverage.

*Note on SPA Routing:* The included `vercel.json` rewrite configuration handles client-side routing automatically so deep URLs like `/directory`, `/awareness`, `/report`, and `/admin/dashboard` reload without 404 errors.

---

## 🧪 Verification & Testing Checklist

- [x] **90-Day Calculation:** Formula verified. `2026-11-01 + 90 days = 2027-01-30`. On `2026-11-21`, exactly 70 days remaining.
- [x] **Leap Year & Month Boundaries:** Tested with 2028 leap year (Feb 29) and varying month lengths.
- [x] **Timezone:** Calculated against Bangladesh Standard Time (`Asia/Dhaka`).
- [x] **Donor Directory:** Search by name/phone, filter by 8 blood groups, filter by availability, sort options, and reset.
- [x] **Direct Call Links:** Fully functional `tel:019XXXXXXXX` links.
- [x] **Bilingual Support:** Complete English and বাংলা translations across the entire application.
- [x] **10 Admin Accounts:** Predefined `admin1` to `admin10` with initial password `admin1234` and password change support.
- [x] **Admin Donor Management:** Add donor, edit donor, delete with confirmation, and CSV export.
- [x] **Configurable Interval:** Change interval from 90 days to any custom value in admin settings.
- [x] **Developer Credit:** Visible credit to **Rakin Ashab** with working phone and email contacts.

---

**Developed with ❤️ by Rakin Ashab for the people of Bangladesh.**
