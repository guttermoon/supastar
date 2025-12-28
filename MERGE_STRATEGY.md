# MERGE STRATEGY DOCUMENT
## Manifestation Vision Board → SaaS Kit Supabase Integration

**Date:** December 28, 2024  
**Analysis Status:** Phase 1 Complete

---

## 🔍 BASE REPO ANALYSIS: Saas-Kit-supabase-main

### Tech Stack
- **Framework:** Next.js 14.1.0 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth Provider:** Supabase Auth (`@supabase/auth-helpers-nextjs`)
- **UI Library:** Radix UI + Tailwind CSS 3.3.3
- **Payment:** Stripe integration
- **State Management:** SWR (stale-while-revalidate)
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS + tailwindcss-animate

### File Structure
```
src/
├── app/
│   ├── (marketing)/          # Public landing pages
│   ├── auth/                 # Auth flows (login, signup, magic-link)
│   ├── dashboard/            # Protected dashboard area
│   │   ├── main/            # Dashboard home
│   │   ├── settings/        # Profile, billing, subscription
│   │   └── todos/           # Example CRUD feature
│   └── api/                 # API routes
│       ├── auth-callback/
│       └── stripe/webhook/
├── components/
│   └── ui/                  # Shadcn UI components
├── lib/
│   ├── API/
│   │   ├── Database/        # DB queries/mutations
│   │   └── Services/        # Supabase & Stripe clients
│   ├── config/              # Site, dashboard, auth configs
│   ├── types/               # TypeScript types
│   └── utils/               # Helpers & hooks
└── styles/
    ├── globals.css
    └── ThemeProvider.tsx
```

### Database Schema (Supabase)
```sql
-- Core tables
profiles:
  - id (uuid, FK to auth.users)
  - stripe_customer_id
  - display_name
  - subscription_id (FK to subscriptions)

subscriptions:
  - id (text)
  - price_id
  - status
  - period_starts_at
  - period_ends_at

todos:
  - id (uuid)
  - title
  - description
  - user_id (FK to profiles)
  - author
```

### Auth System
- Supabase Auth with email/password
- Magic link authentication
- Password reset flow
- Protected routes via middleware
- User profile creation trigger

### Key Features Working
✅ User authentication (email/password, magic link)  
✅ Stripe subscription management  
✅ Dashboard with analytics/charts  
✅ Settings (profile, billing, subscription)  
✅ Todo CRUD example  
✅ Dark mode theme toggle  
✅ Responsive mobile navigation  

---

## 🎨 FEATURE REPO ANALYSIS: manifestation-vision-board-main

### Tech Stack
- **Framework:** Vite + React 19 (SPA with Wouter routing)
- **Database:** Drizzle ORM + MySQL
- **Auth:** Custom JWT auth with Jose
- **API:** tRPC (type-safe API)
- **UI Library:** Radix UI + Tailwind CSS 4.1.14
- **Payment:** Stripe integration
- **Storage:** AWS S3 (photos, videos, music)
- **State Management:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation
- **Styling:** Tailwind CSS 4 + tailwindcss-animate
- **Media Processing:** html2canvas, jsPDF, react-easy-crop

### File Structure
```
client/src/
├── pages/
│   ├── VisionBoards.tsx       # Main board management
│   ├── VisionBoardEditor.tsx  # Board editing interface
│   ├── PhotoLibrary.tsx       # Photo upload/management
│   ├── Montage.tsx            # Video generation
│   ├── Intentions.tsx         # Manifestation tracking
│   ├── Notifications.tsx      # Reminder schedules
│   ├── Templates.tsx          # Pre-built board templates
│   ├── Settings.tsx           # User settings
│   └── Onboarding.tsx         # First-time setup
├── components/
│   ├── ui/                    # Shadcn components
│   ├── DashboardLayout.tsx
│   ├── MoonPhase.tsx
│   └── FeatureLock.tsx
└── lib/
    └── trpc.ts

server/
├── routers.ts                 # tRPC API routes
├── db.ts                      # Database connection
├── storage.ts                 # S3 upload logic
└── templates.ts               # Board templates

drizzle/
└── schema.ts                  # MySQL schema
```

### Database Schema (MySQL via Drizzle)
```typescript
// Core tables
users:
  - id, openId, name, email
  - stripeCustomerId, stripeSubscriptionId
  - subscriptionTier (free/pro/premium)
  - onboardingCompleted, timezone

vision_boards:
  - id, userId, title, description
  - coverImageUrl
  - montageVideoUrl, montageVideoKey
  - montageGeneratedAt

photos:
  - id, userId, visionBoardId
  - originalUrl, originalFileKey
  - croppedUrl, croppedFileKey
  - cropData (JSON: crop coordinates)
  - textOverlay (JSON: text styling)
  - displayOrder

montage_settings:
  - visionBoardId
  - photoDuration, musicUrl, musicFileKey
  - timingMode (fixed/matchMusic)
  - musicBehavior (fadeOut/loop)

notification_schedules:
  - userId, visionBoardId
  - scheduleTime, daysOfWeek
  - isActive

intentions:
  - userId, visionBoardId, intention
  - moonPhase, manifestedAt

board_templates:
  - name, category, thumbnailUrl
  - suggestedColors, suggestedCrystals
  - affirmations

// Mystical features
healing_frequencies (music library)
moon_phases (ritual timing)
crystals (energy associations)
vision_board_crystals (board-crystal links)
```

### Vision Board Features
🎯 **Core Features:**
- Photo upload to S3
- Image cropping (react-easy-crop)
- Text overlay editor
- Drag-and-drop photo ordering
- Vision board CRUD
- Template-based creation

🎬 **Video Montage:**
- Generate video from photos
- Background music selection (healing frequencies)
- Customizable timing modes
- Music sync or fixed duration

🌙 **Mystical Features:**
- Moon phase tracking
- Crystal energy associations
- Intention/spell tracking
- Affirmation suggestions

🔔 **Engagement:**
- Daily notification schedules
- Reminder system (viewing boards)
- Timezone-aware scheduling

📸 **Photo Management:**
- Photo library
- Crop editor
- Text overlay system
- S3 storage integration

---

## 🎯 MERGE STRATEGY

### KEEP FROM BASE (Saas-Kit-supabase)
✅ **Infrastructure:**
- Next.js 14 App Router structure
- Supabase authentication system
- Supabase database connection
- Stripe integration (existing webhook)
- `/src/app` folder structure
- Marketing pages
- Settings pages (profile, billing)

✅ **UI Foundation:**
- Radix UI components in `/src/components/ui`
- Tailwind configuration
- Theme provider (dark mode)
- Dashboard layout structure

✅ **Core Services:**
- `/src/lib/API/Services/supabase/` (auth, user)
- `/src/lib/API/Services/stripe/` (customer, session, webhook)
- `/src/lib/config/` (all configs)
- `/src/lib/utils/` (helpers, hooks)

### EXTRACT FROM FEATURE (manifestation-vision-board)
🎨 **Vision Board Logic:**
- Photo upload/management (`PhotoLibrary.tsx`)
- Vision board CRUD (`VisionBoards.tsx`, `VisionBoardEditor.tsx`)
- Image cropping functionality
- Text overlay editor
- Video montage generation (`Montage.tsx`)
- Intention tracking (`Intentions.tsx`)
- Notification scheduling (`Notifications.tsx`)
- Template system (`Templates.tsx`)
- Onboarding flow (`Onboarding.tsx`)

🎨 **Special Components:**
- `MoonPhase.tsx` (mystical UI)
- `FeatureLock.tsx` (premium gating)
- Photo editor components
- Montage preview player

🎨 **API Logic (tRPC → Next.js API Routes):**
- Vision board CRUD operations
- Photo upload to S3
- Montage generation
- Notification scheduling
- Template fetching
- Intention tracking

---

## 📋 FILE MAPPING PLAN

### Phase 2 Copy Operations

#### 1. **Pages → App Routes**
Copy these files and convert to Next.js App Router:

```bash
FROM: client/src/pages/VisionBoards.tsx
TO:   src/app/dashboard/boards/page.tsx

FROM: client/src/pages/VisionBoardEditor.tsx
TO:   src/app/dashboard/boards/[id]/page.tsx

FROM: client/src/pages/PhotoLibrary.tsx
TO:   src/app/dashboard/photos/page.tsx

FROM: client/src/pages/Montage.tsx
TO:   src/app/dashboard/montage/page.tsx

FROM: client/src/pages/Intentions.tsx
TO:   src/app/dashboard/intentions/page.tsx

FROM: client/src/pages/Notifications.tsx
TO:   src/app/dashboard/notifications/page.tsx

FROM: client/src/pages/Templates.tsx
TO:   src/app/dashboard/templates/page.tsx

FROM: client/src/pages/Onboarding.tsx
TO:   src/app/dashboard/onboarding/page.tsx
```

#### 2. **Components**
```bash
FROM: client/src/components/MoonPhase.tsx
TO:   src/components/MoonPhase.tsx

FROM: client/src/components/FeatureLock.tsx
TO:   src/components/FeatureLock.tsx

# Any photo editor components (TBD after deeper inspection)
```

#### 3. **API Routes (Convert tRPC → Next.js)**
Create new API routes in `src/app/api/`:

```bash
NEW: src/app/api/boards/route.ts          # Vision board CRUD
NEW: src/app/api/boards/[id]/route.ts     # Single board ops
NEW: src/app/api/photos/upload/route.ts   # S3 upload
NEW: src/app/api/photos/[id]/route.ts     # Photo CRUD
NEW: src/app/api/montage/generate/route.ts # Video generation
NEW: src/app/api/intentions/route.ts      # Intention tracking
NEW: src/app/api/notifications/route.ts   # Notification schedules
NEW: src/app/api/templates/route.ts       # Template fetching
```

#### 4. **Database Layer**
```bash
FROM: server/storage.ts (S3 logic)
TO:   src/lib/API/Services/s3/storage.ts

NEW: src/lib/API/Database/boards/queries.ts
NEW: src/lib/API/Database/boards/mutations.ts
NEW: src/lib/API/Database/photos/queries.ts
NEW: src/lib/API/Database/photos/mutations.ts
NEW: src/lib/API/Database/intentions/queries.ts
NEW: src/lib/API/Database/intentions/mutations.ts
NEW: src/lib/API/Database/notifications/queries.ts
NEW: src/lib/API/Database/notifications/mutations.ts
```

#### 5. **Types**
```bash
NEW: src/lib/types/boards.ts
NEW: src/lib/types/photos.ts
NEW: src/lib/types/montage.ts
NEW: src/lib/types/intentions.ts
```

---

## 🗃️ DATABASE MIGRATION PLAN

### Supabase Schema Additions
Create new migration: `supabase/migrations/[timestamp]_vision_boards.sql`

```sql
-- Vision boards table
CREATE TABLE vision_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  montage_video_url TEXT,
  montage_video_key VARCHAR(500),
  montage_generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vision_board_id UUID REFERENCES vision_boards(id) ON DELETE SET NULL,
  original_url TEXT NOT NULL,
  original_file_key VARCHAR(500) NOT NULL,
  cropped_url TEXT,
  cropped_file_key VARCHAR(500),
  crop_data JSONB,
  text_overlay JSONB,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Montage settings table
CREATE TABLE montage_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_board_id UUID UNIQUE NOT NULL REFERENCES vision_boards(id) ON DELETE CASCADE,
  photo_duration INT DEFAULT 3000,
  music_url TEXT,
  music_file_key VARCHAR(500),
  music_source VARCHAR(50) DEFAULT 'public',
  timing_mode VARCHAR(50) DEFAULT 'fixed',
  music_behavior VARCHAR(50) DEFAULT 'fadeOut',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification schedules
CREATE TABLE notification_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vision_board_id UUID REFERENCES vision_boards(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  schedule_time VARCHAR(10) NOT NULL,
  days_of_week VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intentions
CREATE TABLE intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vision_board_id UUID REFERENCES vision_boards(id) ON DELETE SET NULL,
  intention TEXT NOT NULL,
  moon_phase VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  manifested_at TIMESTAMPTZ
);

-- Board templates
CREATE TABLE board_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  thumbnail_url TEXT,
  suggested_colors TEXT,
  suggested_crystals TEXT,
  affirmations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Healing frequencies
CREATE TABLE healing_frequencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  frequency VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  file_key VARCHAR(500) NOT NULL,
  duration INT,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vision_boards_user ON vision_boards(user_id);
CREATE INDEX idx_photos_user ON photos(user_id);
CREATE INDEX idx_photos_board ON photos(vision_board_id);
CREATE INDEX idx_intentions_user ON intentions(user_id);
CREATE INDEX idx_notifications_user ON notification_schedules(user_id);

-- Row Level Security (RLS)
ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE montage_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE intentions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own vision boards" ON vision_boards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vision boards" ON vision_boards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision boards" ON vision_boards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vision boards" ON vision_boards
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for photos, intentions, notifications...
```

---

## ⚙️ IMPLEMENTATION STEPS (Phase 2)

### Step 1: Database Setup
1. Create Supabase migration file
2. Add vision board tables
3. Set up RLS policies
4. Test migration locally

### Step 2: S3 Integration
1. Copy S3 storage logic to `src/lib/API/Services/s3/`
2. Add AWS SDK dependencies
3. Create environment variables for S3 config
4. Test upload functionality

### Step 3: Core API Routes
1. Create Next.js API routes for boards
2. Implement photo upload endpoint
3. Add database query/mutation functions
4. Test all CRUD operations

### Step 4: Page Migration
1. Copy VisionBoards.tsx → convert to App Router
2. Strip ALL Tailwind classes
3. Fix imports (wouter → next/navigation)
4. Replace tRPC → fetch/SWR
5. Test routing and navigation

### Step 5: Component Integration
1. Copy MoonPhase component
2. Copy FeatureLock component
3. Strip Tailwind classes
4. Integrate with base UI components

### Step 6: Feature Completion
1. Implement montage generation
2. Add notification scheduling
3. Integrate template system
4. Test end-to-end workflow

---

## 🚨 CRITICAL CONSTRAINTS

### DO NOT MODIFY
❌ Base repo's auth system  
❌ Base repo's database structure (profiles, subscriptions)  
❌ Base repo's Stripe integration  
❌ Base repo's UI library setup  
❌ Base repo's Next.js configuration  

### MUST STRIP
⚠️ ALL `className="..."` attributes  
⚠️ ALL CSS imports (`import './styles.css'`)  
⚠️ Tailwind-specific utility classes  
⚠️ Framer Motion animations (optional: keep logic, remove classes)  

### MUST CONVERT
🔄 tRPC calls → fetch/SWR  
🔄 Wouter routing → Next.js navigation  
🔄 MySQL Drizzle queries → Supabase PostgreSQL  
🔄 Vite imports → Next.js imports  
🔄 Custom auth → Supabase auth  

---

## 📦 NEW DEPENDENCIES NEEDED

Add to `package.json`:
```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.693.0",
    "@aws-sdk/s3-request-presigner": "^3.693.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.4",
    "react-easy-crop": "^5.5.6",
    "nanoid": "^5.1.5"
  }
}
```

---

## 🎯 SUCCESS CRITERIA

Phase 2 is complete when:
- ✅ All vision board pages render in Next.js
- ✅ Photo upload works with S3
- ✅ Vision board CRUD functional
- ✅ Database migrations applied
- ✅ No Tailwind classes in copied files
- ✅ All imports resolved
- ✅ Base repo auth still works
- ✅ No duplicate components

---

## 🔮 NEXT STEPS

**Awaiting Your Approval to Proceed with Phase 2**

Once approved, I will:
1. Create database migrations
2. Set up S3 service layer
3. Create API routes
4. Copy and convert pages
5. Strip all styling
6. Fix all imports
7. Test integration

**Estimated Time:** 2-3 hours of systematic execution

---

**Questions for you before proceeding:**

1. Do you have AWS S3 credentials ready, or should we use Supabase Storage instead?
2. Do you want to keep the mystical features (moon phases, crystals) or focus on core vision board only?
3. Should I preserve the onboarding flow or skip it for now?
4. Any specific pages you want prioritized first?
