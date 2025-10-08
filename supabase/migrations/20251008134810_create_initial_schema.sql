/*
  # Study Platform Database Schema

  ## Overview
  This migration creates the complete database schema for a comprehensive study platform
  with authentication, subjects/classes, study materials, sessions, flashcards, and user settings.

  ## New Tables

  ### 1. `profiles`
  - Extends auth.users with additional user information
  - `id` (uuid, FK to auth.users) - Primary key
  - `username` (text) - User's display name
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `study_classes`
  - Represents subjects/classes that users are studying
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Owner of the class
  - `name` (text) - Class name
  - `description` (text) - Optional description
  - `color` (text) - UI color for the class
  - `icon` (text) - Icon identifier
  - `total_study_time` (integer) - Total minutes studied
  - `mastery_level` (integer) - Progress percentage (0-100)
  - `last_studied` (timestamptz) - Last study session timestamp
  - `created_at`, `updated_at` (timestamptz)

  ### 3. `study_materials`
  - Content for studying (notes, PDFs, videos, etc.)
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Owner
  - `class_id` (uuid, FK) - Associated class
  - `title` (text) - Material title
  - `content` (text) - Material content/body
  - `type` (text) - Type: text, pdf, video, image, note, summary, quiz
  - `difficulty` (text) - easy, medium, hard
  - `tags` (text[]) - Array of tag strings
  - `last_reviewed` (timestamptz) - Last review timestamp
  - `created_at`, `updated_at` (timestamptz)

  ### 4. `study_sessions`
  - Records of individual study sessions
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - User who studied
  - `class_id` (uuid, FK) - Subject studied
  - `material_id` (uuid, FK, optional) - Specific material studied
  - `title` (text) - Session title
  - `method` (text) - Study method used (sq3r, flashcards, etc.)
  - `start_time` (timestamptz) - When session started
  - `end_time` (timestamptz) - When session ended
  - `duration` (integer) - Duration in minutes
  - `score` (integer) - Performance score (0-100)
  - `notes` (text) - Optional session notes
  - `completed` (boolean) - Whether session was completed
  - `session_type` (text) - review, practice, reading, assignment
  - `priority` (text) - low, medium, high
  - `scheduled_date` (date) - For scheduled sessions
  - `scheduled_time` (time) - For scheduled sessions
  - `created_at` (timestamptz)

  ### 5. `flashcards`
  - Flashcard study aids with spaced repetition data
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Owner
  - `material_id` (uuid, FK) - Associated material
  - `front` (text) - Question/prompt side
  - `back` (text) - Answer side
  - `difficulty` (text) - easy, medium, hard
  - `review_count` (integer) - Times reviewed
  - `correct_count` (integer) - Times answered correctly
  - `ease_factor` (numeric) - Spaced repetition ease factor
  - `interval` (integer) - Days until next review
  - `last_reviewed` (timestamptz) - Last review timestamp
  - `next_review` (timestamptz) - Next scheduled review
  - `created_at`, `updated_at` (timestamptz)

  ### 6. `study_goals`
  - User-defined study goals
  - `id` (uuid) - Primary key
  - `user_id` (uuid, FK) - Goal owner
  - `title` (text) - Goal title
  - `description` (text) - Goal description
  - `target_date` (date) - Goal deadline
  - `progress` (integer) - Progress percentage (0-100)
  - `completed` (boolean) - Whether goal is achieved
  - `created_at`, `updated_at` (timestamptz)

  ### 7. `user_settings`
  - User preferences and settings
  - `id` (uuid, FK to profiles) - Primary key
  - `preferred_methods` (text[]) - Favorite study methods
  - `daily_goal` (integer) - Daily study goal in minutes
  - `theme` (text) - light or dark
  - `notifications` (boolean) - Notification preference
  - `reminder_enabled` (boolean) - Daily reminder toggle
  - `reminder_time` (time) - Time for reminders
  - `reminder_before_sleep` (boolean) - Sleep reminder toggle
  - `reminder_methods` (text[]) - Methods to be reminded about
  - `reminder_subjects` (uuid[]) - Classes to be reminded about
  - `created_at`, `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies ensure users can only access their own data
  - Authenticated users required for all operations
  - Ownership verified through user_id checks
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create study_classes table
CREATE TABLE IF NOT EXISTS study_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#3b82f6',
  icon text DEFAULT 'BookOpen',
  total_study_time integer DEFAULT 0,
  mastery_level integer DEFAULT 0,
  last_studied timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE study_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own classes"
  ON study_classes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own classes"
  ON study_classes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own classes"
  ON study_classes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own classes"
  ON study_classes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create study_materials table
CREATE TABLE IF NOT EXISTS study_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  class_id uuid REFERENCES study_classes(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text DEFAULT '',
  type text DEFAULT 'text',
  difficulty text DEFAULT 'medium',
  tags text[] DEFAULT '{}',
  last_reviewed timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own materials"
  ON study_materials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own materials"
  ON study_materials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own materials"
  ON study_materials FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own materials"
  ON study_materials FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  class_id uuid REFERENCES study_classes(id) ON DELETE CASCADE NOT NULL,
  material_id uuid REFERENCES study_materials(id) ON DELETE SET NULL,
  title text DEFAULT '',
  method text DEFAULT 'review',
  start_time timestamptz DEFAULT now() NOT NULL,
  end_time timestamptz,
  duration integer DEFAULT 0,
  score integer,
  notes text DEFAULT '',
  completed boolean DEFAULT false,
  session_type text DEFAULT 'review',
  priority text DEFAULT 'medium',
  scheduled_date date,
  scheduled_time time,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON study_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON study_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON study_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  material_id uuid REFERENCES study_materials(id) ON DELETE CASCADE NOT NULL,
  front text NOT NULL,
  back text NOT NULL,
  difficulty text DEFAULT 'medium',
  review_count integer DEFAULT 0,
  correct_count integer DEFAULT 0,
  ease_factor numeric DEFAULT 2.5,
  interval integer DEFAULT 1,
  last_reviewed timestamptz,
  next_review timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own flashcards"
  ON flashcards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcards"
  ON flashcards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcards"
  ON flashcards FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcards"
  ON flashcards FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create study_goals table
CREATE TABLE IF NOT EXISTS study_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  target_date date NOT NULL,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE study_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals"
  ON study_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON study_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON study_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON study_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_methods text[] DEFAULT '{}',
  daily_goal integer DEFAULT 60,
  theme text DEFAULT 'light',
  notifications boolean DEFAULT true,
  reminder_enabled boolean DEFAULT false,
  reminder_time time DEFAULT '09:00:00',
  reminder_before_sleep boolean DEFAULT false,
  reminder_methods text[] DEFAULT '{}',
  reminder_subjects uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_study_classes_user_id ON study_classes(user_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_user_id ON study_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_study_materials_class_id ON study_materials(class_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_class_id ON study_sessions(class_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_material_id ON flashcards(material_id);
CREATE INDEX IF NOT EXISTS idx_study_goals_user_id ON study_goals(user_id);

-- Create function to automatically create user settings on profile creation
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_settings();