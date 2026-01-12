# FounderFit Score™ v2.1 - Quick Setup Guide

This guide will get you from zero to running the FounderFit application in ~10 minutes.

---

## Prerequisites Check

Before starting, ensure you have:

- [ ] Node.js 18 or higher installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] A Supabase account (sign up free at [supabase.com](https://supabase.com))
- [ ] A code editor (VS Code recommended)

---

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
cd founderfit-vercel
npm install
```

You should see packages installing. Wait for completion.

### 2. Create Supabase Project (3 minutes)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: FounderFit
   - **Database Password**: (choose a strong password and save it)
   - **Region**: (choose closest to you)
   - **Pricing Plan**: Free
4. Click "Create new project"
5. **Wait 2-3 minutes** for provisioning to complete

### 3. Get Your Supabase Credentials (1 minute)

1. In your Supabase project dashboard, click "Settings" (gear icon) in sidebar
2. Click "API" under Project Settings
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon public**: `eyJhb...` (long key)
4. Keep this tab open for the next step

### 4. Configure Environment Variables (1 minute)

```bash
# Copy the example file
cp .env.example .env
```

Open `.env` in your editor and replace with your values:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_VERSION=2.1.0
```

**Important**: Replace `xxxxx` and the key with YOUR actual values from Step 3.

### 5. Run Database Migrations (3 minutes)

#### Option A: Using Supabase Dashboard (Easiest)

**Migration 1: Initial Schema (Required)**

1. In Supabase dashboard, click "SQL Editor" in sidebar
2. Click "New query"
3. Open `supabase/migrations/001_initial_schema.sql` in your code editor
4. Copy **all** the contents (it's a long file, ~600 lines)
5. Paste into the SQL Editor in Supabase
6. Click "Run" button
7. You should see "Success. No rows returned"

**Migration 2: Integrity Tracking (Required)**

1. Click "New query" again
2. Open `supabase/migrations/002_add_integrity_tracking.sql` in your code editor
3. Copy **all** the contents
4. Paste into the SQL Editor in Supabase
5. Click "Run" button
6. You should see "Success. No rows returned"

#### Option B: Using Supabase CLI (If you're comfortable with CLI)

```bash
# Install CLI globally
npm install -g supabase

# Login (opens browser)
supabase login

# Link your project (get ref from Project Settings > General)
supabase link --project-ref your-project-ref

# Push migration
supabase db push
```

### 6. Verify Database Setup (30 seconds)

1. In Supabase dashboard, click "Table Editor"
2. You should see 4 tables: `founders`, `assessments`, `assessment_responses`, `ventures`
3. If you see these tables, you're good! ✅

### 7. Start the Development Server (1 minute)

```bash
npm run dev
```

You should see:

```
VITE v5.0.11  ready in 543 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Open [http://localhost:3000](http://localhost:3000) in your browser**

---

## Verify Everything Works

### Test 1: Home Page Loads

- [ ] You should see "FounderFit Score™ v2.1" with gradient header
- [ ] You should see 6 force cards (Thesis Integrity, Learning Velocity, etc.)
- [ ] Clicking "Sign Up" button takes you to signup page

### Test 2: Create Account

1. Click "Sign Up" button
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: testpassword123
3. Click "Sign Up"
4. You should be redirected to `/dashboard`
5. You should see "Welcome back, Test User"

### Test 3: Authentication Works

- [ ] Dashboard shows your name
- [ ] "Sign Out" button is visible
- [ ] Clicking "Sign Out" redirects to home page
- [ ] After signing out, trying to visit `/dashboard` redirects to login

### Test 4: Check Database

1. Go to Supabase Dashboard > Authentication > Users
2. You should see your test user listed
3. Go to Table Editor > `founders` table
4. You should see one row with your user's name and email ✅

---

## Create an Admin User (Optional)

If you want to access the admin panel at `/admin`:

### Method 1: Through Supabase Dashboard

1. Go to Authentication > Users in Supabase
2. Find your user, click to expand
3. Copy the `id` value
4. Go to SQL Editor
5. Run this query:

```sql
UPDATE founders
SET role = 'admin'
WHERE auth_user_id = 'paste-your-user-id-here';
```

6. Go back to your app, refresh the page
7. You should now see "Admin Panel" button on dashboard
8. Click it to access `/admin` route

### Method 2: Through Table Editor

1. Go to Table Editor > `founders` table
2. Find your row
3. Double-click the `role` cell
4. Change from `founder` to `admin`
5. Save (checkmark icon or Enter)

---

## Troubleshooting

### "Missing Supabase environment variables"

- Check that `.env` file exists in project root
- Check that variables start with `VITE_` (required by Vite)
- Restart the dev server after editing `.env`

### "Failed to create account" or Auth Errors

- Verify your Supabase URL and anon key are correct
- Check Supabase project is fully provisioned (not still loading)
- Ensure you ran the database migration successfully

### Database Migration Failed

- Make sure you copied the **entire** SQL file
- Look for error messages in SQL Editor
- Try dropping all tables and running migration again:

```sql
DROP TABLE IF EXISTS assessment_responses CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS ventures CASCADE;
DROP TABLE IF EXISTS founders CASCADE;
DROP TYPE IF EXISTS execution_force CASCADE;
DROP TYPE IF EXISTS venture_outcome CASCADE;
DROP TYPE IF EXISTS venture_stage CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Then run the full migration again
```

### Port 3000 Already in Use

```bash
# Use a different port
npm run dev -- --port 3001
```

### TypeScript Errors in Editor

```bash
# Run type check
npm run type-check

# Most errors will be in placeholder components
# They'll be resolved when implementing real features
```

---

## What to Do Next

### You're Now Ready For:

1. **Product team to provide questions**: Once you receive the final question set:
   - Replace placeholder questions in `src/data/questions.ts`
   - Questions should map to the 6 Execution Forces
   - Follow the format in the placeholder file

2. **Implement survey flow**: The infrastructure is ready:
   - Database tables exist
   - Scoring functions work
   - Authentication is wired up
   - Just need to connect the pieces with real questions

3. **Deploy to production**:
   ```bash
   npm run build
   vercel
   ```

---

## Architecture Overview

Now that it's running, here's what you have:

```
Frontend (React)
├── Landing page with Force descriptions
├── Auth pages (login/signup)
├── Dashboard (assessment history)
├── Survey page (scaffold, needs questions)
├── Results page (force breakdown)
└── Admin panel (cohort analysis)

Backend (Supabase)
├── PostgreSQL database
│   ├── founders (user profiles)
│   ├── assessments (scores)
│   ├── assessment_responses (individual answers)
│   └── ventures (outcome tracking)
├── Row Level Security (RLS enabled)
├── Auth (email/password)
└── Real-time subscriptions (ready to use)

Scoring Engine
├── Binary normalization (0/1 → 0-100)
├── Likert normalization (1-5 → 0-100)
├── Force score calculation
└── Overall score aggregation
```

---

## Next Steps

- [ ] Confirm everything is working with the tests above
- [ ] Create a test admin account
- [ ] Familiarize yourself with the codebase structure
- [ ] Wait for question set from product team
- [ ] Implement full survey when ready

---

## Getting Help

- **Setup issues**: Review this guide step-by-step
- **Supabase questions**: Check [Supabase docs](https://supabase.com/docs)
- **Architecture questions**: See `README.md`
- **Code questions**: All files have detailed comments

---

**You're all set! 🎉**

The architecture is solid, the database is ready, and you're waiting on questions from the product team to complete the survey implementation.
