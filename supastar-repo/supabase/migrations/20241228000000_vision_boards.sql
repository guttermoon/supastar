-- Vision Boards Migration
-- Created: 2024-12-28
-- Description: Add vision board, photos, intentions, and mystical features

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vision boards table
CREATE TABLE IF NOT EXISTS "public"."vision_boards" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "cover_image_url" TEXT,
  "montage_video_url" TEXT,
  "montage_video_key" VARCHAR(500),
  "montage_generated_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Photos table
CREATE TABLE IF NOT EXISTS "public"."photos" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
  "vision_board_id" UUID REFERENCES "public"."vision_boards"("id") ON DELETE SET NULL,
  "original_url" TEXT NOT NULL,
  "original_file_key" VARCHAR(500) NOT NULL,
  "cropped_url" TEXT,
  "cropped_file_key" VARCHAR(500),
  "crop_data" JSONB,
  "text_overlay" JSONB,
  "display_order" INT DEFAULT 0 NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Montage settings table
CREATE TABLE IF NOT EXISTS "public"."montage_settings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "vision_board_id" UUID UNIQUE NOT NULL REFERENCES "public"."vision_boards"("id") ON DELETE CASCADE,
  "photo_duration" INT DEFAULT 3000 NOT NULL,
  "music_url" TEXT,
  "music_file_key" VARCHAR(500),
  "music_source" VARCHAR(50) DEFAULT 'public',
  "timing_mode" VARCHAR(50) DEFAULT 'fixed' NOT NULL,
  "music_behavior" VARCHAR(50) DEFAULT 'fadeOut' NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Notification schedules
CREATE TABLE IF NOT EXISTS "public"."notification_schedules" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
  "vision_board_id" UUID REFERENCES "public"."vision_boards"("id") ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "message" TEXT,
  "schedule_time" VARCHAR(10) NOT NULL,
  "days_of_week" VARCHAR(50) NOT NULL,
  "is_active" BOOLEAN DEFAULT TRUE NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Intentions
CREATE TABLE IF NOT EXISTS "public"."intentions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "public"."profiles"("id") ON DELETE CASCADE,
  "vision_board_id" UUID REFERENCES "public"."vision_boards"("id") ON DELETE SET NULL,
  "intention" TEXT NOT NULL,
  "moon_phase" VARCHAR(50),
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "manifested_at" TIMESTAMPTZ
);

-- Board templates
CREATE TABLE IF NOT EXISTS "public"."board_templates" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "category" VARCHAR(100) NOT NULL,
  "thumbnail_url" TEXT,
  "suggested_colors" TEXT,
  "suggested_crystals" TEXT,
  "affirmations" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Healing frequencies (music library)
CREATE TABLE IF NOT EXISTS "public"."healing_frequencies" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "frequency" VARCHAR(50) NOT NULL,
  "url" TEXT NOT NULL,
  "file_key" VARCHAR(500) NOT NULL,
  "duration" INT,
  "category" VARCHAR(100),
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Moon phases
CREATE TABLE IF NOT EXISTS "public"."moon_phases" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "phase" VARCHAR(50) NOT NULL,
  "date" TIMESTAMPTZ NOT NULL,
  "manifestation_type" VARCHAR(255),
  "ritual_suggestion" TEXT
);

-- Crystals
CREATE TABLE IF NOT EXISTS "public"."crystals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) NOT NULL,
  "color" VARCHAR(50),
  "energy" VARCHAR(255),
  "description" TEXT,
  "image_url" TEXT
);

-- Vision board crystals (many-to-many)
CREATE TABLE IF NOT EXISTS "public"."vision_board_crystals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "vision_board_id" UUID NOT NULL REFERENCES "public"."vision_boards"("id") ON DELETE CASCADE,
  "crystal_id" UUID NOT NULL REFERENCES "public"."crystals"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_vision_boards_user" ON "public"."vision_boards"("user_id");
CREATE INDEX IF NOT EXISTS "idx_vision_boards_created" ON "public"."vision_boards"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_photos_user" ON "public"."photos"("user_id");
CREATE INDEX IF NOT EXISTS "idx_photos_board" ON "public"."photos"("vision_board_id");
CREATE INDEX IF NOT EXISTS "idx_photos_order" ON "public"."photos"("vision_board_id", "display_order");
CREATE INDEX IF NOT EXISTS "idx_intentions_user" ON "public"."intentions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_notifications_user" ON "public"."notification_schedules"("user_id");
CREATE INDEX IF NOT EXISTS "idx_moon_phases_date" ON "public"."moon_phases"("date");

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."vision_boards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."photos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."montage_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."notification_schedules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."intentions" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vision_boards
CREATE POLICY "Users can view own vision boards" ON "public"."vision_boards"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vision boards" ON "public"."vision_boards"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision boards" ON "public"."vision_boards"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vision boards" ON "public"."vision_boards"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for photos
CREATE POLICY "Users can view own photos" ON "public"."photos"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own photos" ON "public"."photos"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos" ON "public"."photos"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" ON "public"."photos"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for montage_settings
CREATE POLICY "Users can view own montage settings" ON "public"."montage_settings"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "public"."vision_boards" 
      WHERE "vision_boards"."id" = "montage_settings"."vision_board_id" 
      AND "vision_boards"."user_id" = auth.uid()
    )
  );

CREATE POLICY "Users can manage own montage settings" ON "public"."montage_settings"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "public"."vision_boards" 
      WHERE "vision_boards"."id" = "montage_settings"."vision_board_id" 
      AND "vision_boards"."user_id" = auth.uid()
    )
  );

-- RLS Policies for notification_schedules
CREATE POLICY "Users can view own notification schedules" ON "public"."notification_schedules"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own notification schedules" ON "public"."notification_schedules"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification schedules" ON "public"."notification_schedules"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notification schedules" ON "public"."notification_schedules"
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for intentions
CREATE POLICY "Users can view own intentions" ON "public"."intentions"
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own intentions" ON "public"."intentions"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own intentions" ON "public"."intentions"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own intentions" ON "public"."intentions"
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for templates, frequencies, moon phases, crystals
CREATE POLICY "Anyone can view board templates" ON "public"."board_templates"
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can view healing frequencies" ON "public"."healing_frequencies"
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can view moon phases" ON "public"."moon_phases"
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can view crystals" ON "public"."crystals"
  FOR SELECT USING (TRUE);

ALTER TABLE "public"."board_templates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."healing_frequencies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."moon_phases" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."crystals" ENABLE ROW LEVEL SECURITY;
