-- Migration: Add file_url column to study_materials
-- Adds a dedicated column to store uploaded file URLs

ALTER TABLE study_materials
  ADD COLUMN IF NOT EXISTS file_url text DEFAULT '';

-- Add an index for faster lookups by file_url if needed
CREATE INDEX IF NOT EXISTS idx_study_materials_file_url ON study_materials USING btree (file_url);
