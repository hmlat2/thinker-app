/*
  # Add Automatic Profile Creation Trigger

  ## Purpose
  This migration adds a trigger to automatically create a profile in the `profiles` table
  when a new user signs up through Supabase Auth.

  ## Changes
  1. Creates a function `handle_new_user()` that inserts a profile record
  2. Creates a trigger on `auth.users` table to call this function
  3. Ensures every authenticated user has a corresponding profile

  ## Security
  - Function runs with SECURITY DEFINER to allow inserting into profiles table
  - Only creates profile, doesn't modify auth.users
*/

-- Function to create profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
