-- ============================================================
-- Migration 0003: Grants + RLS policies for API access
-- Run this in the Supabase SQL Editor AFTER 0001 and 0002.
-- ============================================================

-- Allow the API roles to use the public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Give API roles full access to all tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Make sure future tables get the same grants
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO anon, authenticated, service_role;

-- Row Level Security: enabled with permissive demo policies
-- (adjust these later for real authentication)
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log     ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "demo_all_users"         ON users;
DROP POLICY IF EXISTS "demo_all_drivers"       ON drivers;
DROP POLICY IF EXISTS "demo_all_categories"    ON categories;
DROP POLICY IF EXISTS "demo_all_locations"     ON locations;
DROP POLICY IF EXISTS "demo_all_rides"         ON rides;
DROP POLICY IF EXISTS "demo_all_payments"      ON payments;
DROP POLICY IF EXISTS "demo_all_route_metrics" ON route_metrics;
DROP POLICY IF EXISTS "demo_all_audit_log"     ON audit_log;

CREATE POLICY "demo_all_users"         ON users         FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "demo_all_drivers"       ON drivers       FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "demo_all_categories"    ON categories    FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "demo_all_locations"     ON locations     FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "demo_all_rides"         ON rides         FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "demo_all_payments"      ON payments      FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "demo_all_route_metrics" ON route_metrics FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "demo_all_audit_log"     ON audit_log     FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- ============================================================
-- Done. API requests should now work.
-- ============================================================
