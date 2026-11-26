-- ============================================================
-- Migration 0005: Store the user's display name in the database
-- Run this in the Supabase SQL Editor after 0001-0004.
-- ============================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Give the seeded demo account a real name (not the frontend's hardcoded one)
UPDATE users
SET full_name = 'Demo Rider'
WHERE email = 'demo.rider@rideezz.demo'
  AND (full_name IS NULL OR full_name = '');

-- Fallback for any existing users without a name
UPDATE users
SET full_name = split_part(email, '@', 1)
WHERE full_name IS NULL OR full_name = '';

-- ============================================================
-- Done.
-- ============================================================
