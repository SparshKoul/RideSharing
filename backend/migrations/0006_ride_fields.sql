-- ============================================================
-- Migration 0006: Real fare, driver assignment and rating fields
-- Run this in the Supabase SQL Editor after 0001-0005.
-- ============================================================

-- Estimated fare is set at booking time; final_fare only on completion
ALTER TABLE rides ADD COLUMN IF NOT EXISTS estimated_fare NUMERIC;
UPDATE rides SET estimated_fare = final_fare
WHERE estimated_fare IS NULL AND final_fare IS NOT NULL;

-- Ratings persisted instead of being local-only
ALTER TABLE rides ADD COLUMN IF NOT EXISTS rating INT CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE rides ADD COLUMN IF NOT EXISTS rating_feedback TEXT;

-- ============================================================
-- Done.
-- ============================================================
