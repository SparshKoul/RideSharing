-- ============================================================
-- Migration 0001: Initial schema setup for RideEzz / RideFlow
-- Run this FIRST in the Supabase SQL Editor.
-- Tables are created in dependency order (referenced tables first).
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'rider' CHECK (role IN ('rider', 'driver', 'admin')),
  account_type  TEXT NOT NULL DEFAULT 'regular',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Drivers table (no dependencies)
CREATE TABLE IF NOT EXISTS drivers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  phone           TEXT,
  rating          NUMERIC DEFAULT 5.0,
  vehicle_jsonb   JSONB,
  trips_completed INT DEFAULT 0,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drivers_email ON drivers(email);

-- Categories table (no dependencies)
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  base_fare   NUMERIC NOT NULL DEFAULT 0,
  rate_per_km NUMERIC NOT NULL DEFAULT 0,
  rate_per_min NUMERIC NOT NULL DEFAULT 0,
  capacity    INT DEFAULT 4,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Locations table (no dependencies)
CREATE TABLE IF NOT EXISTS locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  address     TEXT NOT NULL DEFAULT '',
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  tag         TEXT,
  popular     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);

-- Rides table (depends on users, drivers, categories, locations — all created above)
CREATE TABLE IF NOT EXISTS rides (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id                UUID NOT NULL REFERENCES users(id),
  driver_id               UUID REFERENCES drivers(id),
  pickup_location_id      UUID NOT NULL REFERENCES locations(id),
  destination_location_id UUID NOT NULL REFERENCES locations(id),
  category_id             UUID NOT NULL REFERENCES categories(id),
  status                  TEXT NOT NULL DEFAULT 'searching' CHECK (status IN (
    'searching', 'driver_assigned', 'driver_arriving', 'in_progress',
    'completed', 'cancelled'
  )),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at            TIMESTAMPTZ,
  final_fare              NUMERIC,
  driver_earnings         NUMERIC,
  cancellation_reason     TEXT,
  created_by              UUID NOT NULL DEFAULT gen_random_uuid(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rides_rider ON rides(rider_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at);

-- Payments table (depends on rides)
CREATE TABLE IF NOT EXISTS payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id     UUID NOT NULL REFERENCES rides(id),
  amount      NUMERIC NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'INR',
  method      TEXT NOT NULL CHECK (method IN ('upi', 'card', 'cash')),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_ride ON payments(ride_id);

-- Route metrics (depends on locations)
CREATE TABLE IF NOT EXISTS route_metrics (
  pickup_id      UUID NOT NULL REFERENCES locations(id),
  destination_id UUID NOT NULL REFERENCES locations(id),
  distance_km    NUMERIC,
  duration_mins  NUMERIC,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (pickup_id, destination_id)
);

-- Audit log (no dependencies)
CREATE TABLE IF NOT EXISTS audit_log (
  id          BIGSERIAL PRIMARY KEY,
  event_type  TEXT NOT NULL,
  table_name  TEXT NOT NULL,
  record_id   UUID,
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Grants so the API (anon / service_role) can read & write
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO anon, authenticated, service_role;

-- Row Level Security (permissive demo policies)
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log     ENABLE ROW LEVEL SECURITY;

CREATE POLICY demo_all_users         ON users         FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY demo_all_drivers       ON drivers       FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY demo_all_categories    ON categories    FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY demo_all_locations     ON locations     FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY demo_all_rides         ON rides         FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY demo_all_payments      ON payments      FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY demo_all_route_metrics ON route_metrics FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY demo_all_audit_log     ON audit_log     FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- ============================================================
-- Schema complete. Run 0002_seed_data.sql next.
-- ============================================================
