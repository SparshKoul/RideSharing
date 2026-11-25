-- ============================================================
-- Migration 0004: Server-side app state (replaces browser localStorage)
-- Run this in the Supabase SQL Editor after 0001-0003.
-- ============================================================

CREATE TABLE IF NOT EXISTS user_state (
  user_id    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  draft      JSONB,
  profile    JSONB,
  favorites  JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL PRIVILEGES ON user_state TO anon, authenticated, service_role;

ALTER TABLE user_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo_all_user_state" ON user_state;
CREATE POLICY "demo_all_user_state" ON user_state
  FOR ALL TO anon, authenticated, service_role
  USING (true) WITH CHECK (true);

-- ============================================================
-- Done.
-- ============================================================
