-- ============================================================
-- Migration 0001: Initial schema setup for RideFlow
-- Run with: supabase db push --file migrations/0001_init.sql
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('rider', 'driver', 'admin')),
  account_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Rides table
CREATE TABLE IF NOT EXISTS rides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id        UUID NOT NULL REFERENCES users(id),
  driver_id       UUID REFERENCES users(id),
  pickup_location_id UUID NOT NULL REFERENCES locations(id),
  destination_location_id UUID NOT NULL REFERENCES locations(id),
  category_id     UUID NOT NULL REFERENCES categories(id),
  status          TEXT NOT NULL DEFAULT 'searching' CHECK (status IN (
    'searching', 'driver_assigned', 'driver_arriving', 'in_progress',
    'completed', 'cancelled'
  )),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,
  final_fare      NUMERIC,
  driver_earnings NUMERIC,
  cancellation_reason TEXT,
  created_by      UUID NOT NULL DEFAULT gen_random_uuid(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rides_rider ON rides(rider_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id       UUID NOT NULL REFERENCES rides(id),
  amount        NUMERIC NOT NULL,
  currency      TEXT NOT NULL DEFAULT 'INR',
  method        TEXT NOT NULL CHECK (method IN ('upi', 'card', 'cash')),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_ride ON payments(ride_id);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  email           TEXT UNIQUE NOT NULL,
  phone           TEXT,
  rating          NUMERIC,
  vehicle_jsonb   JSONB,
  trips_completed INT DEFAULT 0,
  last_login      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_drivers_email ON drivers(email);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  base_fare   NUMERIC NOT NULL,
  rate_per_km NUMERIC NOT NULL,
  rate_per_min NUMERIC NOT NULL,
  capacity    INT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  tag         TEXT,
  popular    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id           BIGSERIAL PRIMARY KEY,
  event_type   TEXT NOT NULL,
  table_name   TEXT NOT NULL,
  record_id    UUID,
  payload      JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Route metrics table
CREATE TABLE IF NOT EXISTS route_metrics (
  pickup_id     UUID NOT NULL REFERENCES locations(id),
  destination_id UUID NOT NULL REFERENCES locations(id),
  distance_km   NUMERIC,
  duration_mins NUMERIC,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed data: initial rides
INSERT INTO rides (id, rider_id, driver_id, pickup_location_id, destination_location_id, category_id, status, created_by, final_fare, driver_earnings, cancellation_reason)
SELECT
  gen_random_uuid(),
  'CUST-8820'::UUID,
  'driver-1'::UUID,
  'loc-1'::UUID,
  'loc-4'::UUID,
  'comfort'::UUID,
  'completed',
  '9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b',
  605,
  496,
  NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO rides (id, rider_id, driver_id, pickup_location_id, destination_location_id, category_id, status, created_by, final_fare, driver_earnings, cancellation_reason)
SELECT
  gen_random_uuid(),
  'CUST-8820'::UUID,
  'driver-1'::UUID,
  'loc-2'::UUID,
  'loc-1'::UUID,
  'economy'::UUID,
  'completed',
  '9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b',
  162,
  133,
  NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO rides (id, rider_id, driver_id, pickup_location_id, destination_location_id, category_id, status, created_by, final_fare, driver_earnings, cancellation_reason)
SELECT
  gen_random_uuid(),
  'CUST-8820'::UUID,
  'driver-1'::UUID,
  'loc-5'::UUID,
  'loc-6'::UUID,
  'xl'::UUID,
  'completed',
  '9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b',
  440,
  361,
  NULL
ON CONFLICT (id) DO NOTHING;

INSERT INTO rides (id, rider_id, driver_id, pickup_location_id, destination_location_id, category_id, status, created_by, final_fare, driver_earnings, cancellation_reason)
SELECT
  gen_random_uuid(),
  'CUST-8820'::UUID,
  'driver-1'::UUID,
  'loc-1'::UUID,
  'loc-3'::UUID,
  'economy'::UUID,
  'cancelled',
  '9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b',
  NULL,
  0,
  'Driver was taking too long'
ON CONFLICT (id) DO NOTHING;