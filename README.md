# FounderFit Score™ v2.1

**The 6 Execution Forces Framework**
Longitudinal Founder Assessment Tool

---

## Overview

FounderFit Score™ is a comprehensive psychometric assessment platform designed to measure founder execution capacity across six validated dimensions. This tool enables longitudinal tracking of founder performance, linking assessments to venture outcomes for correlation analysis.

### The 6 Execution Forces

1. **Force A — Thesis Integrity**: Form, hold, and revise a thesis without delusion or drift
2. **Force B — Learning Velocity**: Signal → model update → new behavior speed
3. **Force C — Decision Quality Under Load**: Decide with incomplete data and high stakes
4. **Force D — Talent Gravity**: Attract, align, and retain high-quality people
5. **Force E — Delivery Control**: Systems, follow-through, operational closure
6. **Force F — Resilience Economics**: Manage energy without burnout

---

## Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Routing**: React Router v6
- **Styling**: CSS Modules with CSS Custom Properties

### Project Structure

```
founderfit-vercel/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Database schema with 6 Execution Forces
├── src/
│   ├── types/
│   │   ├── database.types.ts         # Supabase types
│   │   ├── assessment.types.ts       # Assessment framework types
│   │   └── index.ts
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client
│   │   ├── auth.ts                   # Authentication utilities
│   │   └── database.ts               # Database access layer
│   ├── utils/
│   │   └── scoring.ts                # Score calculation logic
│   ├── data/
│   │   └── questions.ts              # Question bank (placeholder)
│   ├── contexts/
│   │   └── AuthContext.tsx           # Auth state management
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── SurveyPage.tsx            # Survey interface (scaffold)
│   │   ├── ResultsPage.tsx
│   │   ├── DashboardPage.tsx         # Founder dashboard
│   │   └── AdminPage.tsx             # Admin analytics
│   ├── styles/
│   │   ├── variables.css             # Design tokens
│   │   └── global.css                # Global styles
│   ├── main.tsx                      # Entry point
│   └── App.tsx                       # Root component with routing
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env.example
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Git

### Step 1: Clone and Install Dependencies

```bash
cd founderfit-vercel
npm install
```

### Step 2: Set Up Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (2-3 minutes)
3. Note your project URL and anon key from Settings > API

### Step 3: Run Database Migration

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

#### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open `supabase/migrations/001_initial_schema.sql`
4. Copy the entire contents
5. Paste into SQL Editor and click **Run**

### Step 4: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_VERSION=2.1.0
```

### Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### Step 6: Create Admin User (Optional)

1. Sign up through the app with your admin email
2. Go to Supabase Dashboard > Authentication > Users
3. Find your user and note the `id`
4. Go to SQL Editor and run:

```sql
UPDATE founders
SET role = 'admin'
WHERE auth_user_id = 'your-user-id-here';
```

Now you can access `/admin` route

---

## Database Schema

### Tables

#### `founders`
- Founder profiles linked to Supabase Auth
- Fields: id, email, name, role, auth_user_id, timestamps

#### `assessments`
- Assessment records with overall and force scores (0-100)
- Fields: id, founder_id, venture_id, overall_score, 6 force scores, **integrity tracking**, version, metadata, timestamps
- **Integrity fields**:
  - `integrity_score` (0-100): Validity score for the assessment
  - `integrity_flags` (JSONB): Array of detected validity issues
  - `integrity_checks` (JSONB): Detailed check results
  - `started_at`: When assessment began
  - `duration_seconds`: Time to complete

#### `assessment_responses`
- Individual question responses for detailed analysis
- Fields: id, assessment_id, question_id, force, value, question_text, timestamp

#### `ventures`
- Venture tracking for outcome correlation
- Fields: id, founder_id, name, stage, outcome, dates, metadata, timestamps

### Views

#### `founder_assessment_history`
- Pre-joined view of assessments with venture context
- Used for founder dashboards

#### `cohort_analysis`
- Aggregated statistics grouped by outcome and stage
- Used for admin analytics

### Row Level Security (RLS)

- Founders can only view/edit their own data
- Admins can view all data
- Automatic profile creation on signup via trigger

---

## Scoring Algorithm

### Normalization

**Binary Questions (0 or 1)**:
```
normalized_value = value × 100
// 0 → 0 points
// 1 → 100 points
```

Binary questions are normalized to the full 0-100 scale to ensure equal weight with Likert questions.

**Likert Questions (1-5)**:
```
normalized_value = ((value - 1) / 4) × 100
// 1 → 0 points
// 2 → 25 points
// 3 → 50 points
// 4 → 75 points
// 5 → 100 points
```

### Force Scores

All responses for a force are normalized, then averaged:

```
force_score = ROUND(AVG(normalized_values))
// Range: 0-100 for each force
```

### Overall Score

Average of all 6 force scores:

```
overall_score = ROUND(AVG(all_force_scores))
// Range: 0-100
```

### Interpretation Bands

- **80-100**: Exceptional Execution Capacity
- **65-79**: Strong Execution Profile
- **50-64**: Solid Foundational Profile
- **0-49**: Developing Execution Capacity

### Signal Integrity Index

Every assessment includes a validity check that produces an **Integrity Score (0-100)**:

**Checks Performed**:
1. **Time to Complete**: Flags suspiciously fast (<60s) or slow (>30min) completion
2. **Inconsistent Pairs**: Detects contradictory answers to related questions
3. **Straightlining**: Identifies repeated use of same answer (>70% threshold)
4. **Extreme Patterns**: Flags excessive use of extreme values only (>80% threshold)

**Integrity Score Interpretation**:
- **90-100**: Excellent integrity (no concerns)
- **70-89**: Good integrity (minor patterns)
- **50-69**: Questionable integrity (interpret with caution)
- **0-49**: Poor integrity (results may not be reliable)

Flags include severity (low/medium/high) and detailed diagnostic information. Admins can use integrity scores to filter or weight assessment results in cohort analysis.

---

## Development Roadmap

### ✅ Phase 1: Architecture & Foundation (Complete)

- [x] Database schema with 6 Execution Forces
- [x] TypeScript types and interfaces
- [x] Supabase client and auth
- [x] Scoring utilities
- [x] CSS design system
- [x] Authentication flow
- [x] Page scaffolding

### 🚧 Phase 2: Survey Implementation (Pending Questions)

The survey interface is scaffolded and ready. Implementation blocked waiting for:

- [ ] Final question set from product team
- [ ] Mapping of questions to the 6 Execution Forces
- [ ] Question types (binary vs. Likert) for each item

**What's Ready**:
- Question rendering components
- Progress tracking
- Response validation
- Database persistence layer

**What's Needed**:
- Replace placeholder questions in `src/data/questions.ts`
- Update question types map
- Test scoring calculations with real questions

### 📋 Phase 3: Full Feature Implementation

- [ ] Complete survey flow with real questions
- [ ] Results page with force-specific insights
- [ ] Assessment history on dashboard
- [ ] Venture management interface
- [ ] Admin cohort analysis views
- [ ] Data export functionality
- [ ] Shareable results feature

### 🚀 Phase 4: Production Readiness

- [ ] Comprehensive error handling
- [ ] Loading states and skeletons
- [ ] Mobile optimization
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Analytics integration
- [ ] Email notifications

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

### Build for Production

```bash
npm run build
# Output: dist/
```

---

## API Reference

### Authentication

```typescript
import { signUp, signIn, signOut, getCurrentUser, getCurrentFounder } from '@/lib/auth';

// Sign up
await signUp({ email, password, name });

// Sign in
await signIn({ email, password });

// Get current user
const user = await getCurrentUser();
const founder = await getCurrentFounder();
```

### Database Operations

```typescript
import {
  createAssessment,
  getFounderAssessments,
  createAssessmentResponses,
  getHighIntegrityAssessments,
  getAssessmentsByIntegrityThreshold
} from '@/lib/database';

// Create assessment with integrity tracking
const assessment = await createAssessment({
  founder_id: founderId,
  venture_id: ventureId,
  overall_score: 75,
  force_thesis_integrity: 78,
  force_learning_velocity: 82,
  force_decision_quality: 70,
  force_talent_gravity: 68,
  force_delivery_control: 72,
  force_resilience_economics: 80,

  // Signal Integrity tracking
  integrity_score: integrityResult.integrityScore,
  integrity_flags: integrityResult.flags,
  integrity_checks: integrityResult.checks,
  started_at: startTime.toISOString(),
  duration_seconds: Math.round((endTime.getTime() - startTime.getTime()) / 1000),

  assessment_version: 'v2.1',
  completed_at: endTime.toISOString()
});

// Save responses
await createAssessmentResponses(responses);

// Get only high-integrity assessments (score >= 70)
const reliableAssessments = await getHighIntegrityAssessments();

// Filter by custom integrity threshold
const minScore = 80; // Only excellent integrity
const excellentAssessments = await getAssessmentsByIntegrityThreshold(minScore);
```

### Scoring

```typescript
import {
  calculateAssessmentScores,
  getScoreInterpretation,
  calculateSignalIntegrity,
  getIntegrityAssessment
} from '@/utils/scoring';

// Calculate scores from responses
const scores = calculateAssessmentScores(responses, questionTypes);

// Get interpretation
const interpretation = getScoreInterpretation(scores.overallScore);

// Calculate integrity (validity check)
const integrity = calculateSignalIntegrity(
  responses,
  startTime,  // Date when survey started
  endTime     // Date when survey completed
);

// Get human-readable integrity assessment
const integrityAssessment = getIntegrityAssessment(integrity.integrityScore);
// Returns: { level: 'excellent' | 'good' | 'questionable' | 'poor', message: string }
```

### Health Check

```typescript
import { runHealthCheck, runHealthCheckWithTimeout, HealthStatus } from '@/lib/healthCheck';

// Run health check with default 10s timeout
const result = await runHealthCheckWithTimeout();

// Check result
if (result.status === HealthStatus.HEALTHY) {
  // All good, proceed
} else if (result.status === HealthStatus.CONFIG_ERROR) {
  // Missing or invalid env vars
  console.error(result.error);
} else if (result.status === HealthStatus.CONNECTION_ERROR) {
  // Cannot reach Supabase
  console.error(result.error, result.details);
}
```

---

## Security Considerations

### Row Level Security (RLS)

All database tables have RLS enabled:
- Founders can only access their own assessments and ventures
- Admin role can access all data for analytics
- All policies enforced at database level

### Authentication

- Email/password auth via Supabase
- Secure session management with auto-refresh
- Password requirements: minimum 8 characters

### Environment Variables

Never commit `.env` files. All sensitive keys should be:
- Stored in Vercel environment variables (production)
- Stored in `.env` locally (never committed)
- Rotated regularly

---

## Contributing

When the product team provides the final question set:

1. Update `src/data/questions.ts` with real questions
2. Verify force mappings are correct
3. Test scoring calculations
4. Update this README if needed

---

## Support

For questions or issues:
- Technical: Review this README and architecture docs
- Questions: Check `src/data/questions.ts` placeholder comments
- Database: Review `supabase/migrations/001_initial_schema.sql` comments

---

## License

© 2026 FounderFit Score™. All rights reserved.

