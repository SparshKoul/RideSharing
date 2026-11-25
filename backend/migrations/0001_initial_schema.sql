-- ============================================================
-- Migration 0001: Initial schema setup
-- Run with: supabase db push --file supabase/schema.sql
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('rider', 'driver', 'admin')),
  account_type TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
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

-- Seed: ride history
INSERT INTO rides (id, rider_id, driver_id, pickup_location_id, destination_location_id, category_id, status, created_by, final_fare, driver_earnings, cancellation_reason) VALUES
  ('9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b', 'CUST-8820', 'driver-1', 'loc-1', 'loc-4', 'comfort', 'completed', '9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b', 605, 496, NULL),
  ('9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b', 'CUST-8820', 'driver-1', 'loc-2', 'loc-1', 'economy', 'completed', '9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b', 162, 133, NULL),
  ('9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b', 'CUST-8820', 'driver-1', 'loc-5', 'loc-6', 'xl', 'completed', '9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b', 440, 361, NULL),
  ('9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b', 'CUST-8820', 'driver-1', 'loc-1', 'loc-3', 'economy', 'cancelled', '9f6e8a1b-4c3d-4a2e-9b01-8c7d6e5f4a3b', NULL, 0, 'Driver was taking too long')
ON CONFLICT (id) DO NOTHING;

-- Seed: drivers
INSERT INTO drivers (id, name, email, phone, rating, vehicle_jsonb, trips_completed) VALUES
  ('driver-1', 'Vikram Malhotra', 'vikram.driver@rideezz.demo', '+91 98765 43210', 4.92, '{"category":"comfort","model":"Honda City ZX (White)","plateNumber":"CH 01 BG 4022","color":"Pearl White","year":2023,"capacity":4}', 1420),
  ('driver-2', 'Gurpreet Singh', 'gurpreet.driver@rideezz.demo', '+91 98123 67890', 4.88, '{"category":"xl","model":"Toyota Innova Crysta (Silver)","plateNumber":"PB 65 AB 7890","color":"Silver Metallic","year":2022,"capacity":6}', 2150),
  ('driver-3', 'Priya Sharma', 'priya.driver@rideezz.demo', '+91 97654 32109', 4.95, '{"category":"economy","model":"Maruti Suzuki Swift Dzire (Blue)","plateNumber":"CH 01 TA 5514","color":"Oxford Blue","year":2023,"capacity":4}', 890)
ON CONFLICT (id) DO NOTHING;

-- Seed: categories
INSERT INTO categories (id, name, base_fare, rate_per_km, rate_per_min, capacity) VALUES
  ('moto', 'RideEzz Moto', 20, 8, 1.0, 1),
  ('economy', 'RideEzz Go / Mini', 40, 12, 1.5, 4),
  ('comfort', 'RideEzz Premier Sedan', 65, 16, 2.2, 4),
  ('xl', 'RideEzz XL / SUV', 95, 22, 3.0, 6),
  ('electric', 'RideEzz Electric Green', 60, 14, 2.0, 4),
  ('black', 'RideEzz Black Elite', 150, 30, 4.0, 4)
ON CONFLICT (id) DO NOTHING;

-- Seed: locations
INSERT INTO locations (id, name, address, lat, lng, tag, popular) VALUES
  ('loc-1', 'Chitkara University', 'Chandigarh-Patiala National Highway (NH-64), Rajpura, Punjab', 30.5161, 76.6592, 'Campus', true),
  ('loc-2', 'Rajpura Bus Stand', 'Old GT Road, Rajpura City Centre, Punjab', 30.4842, 76.5947, 'Transit', true),
  ('loc-3', 'Chandigarh Railway Station', 'Daria, Industrial Area Phase I, Chandigarh', 30.7027, 76.8223, 'Transit', true),
  ('loc-4', 'Elante Mall', 'Plot No. 178-178A, Industrial Area Phase I, Chandigarh', 30.7055, 76.8013, 'Shopping', true),
  ('loc-5', 'Sector 17, Chandigarh', 'City Centre Plaza, Sector 17, Chandigarh', 30.7415, 76.7794, 'Hub', true),
  ('loc-6', 'Chandigarh International Airport', 'New Civil Air Terminal, Jhiurheri, Mohali, Punjab', 30.6735, 76.7885, 'Airport', true)
ON CONFLICT (id) DO NOTHING;

-- Seed: route metrics
INSERT INTO route_metrics (pickup_id, destination_id, distance_km, duration_mins) VALUES
  ('loc-1'::UUID, 'loc-2'::UUID, 8.4, 14),
  ('loc-1'::UUID, 'loc-3'::UUID, 31.2, 42),
  ('loc-1'::UUID, 'loc-4'::UUID, 28.5, 38),
  ('loc-1'::UUID, 'loc-5'::UUID, 34.0, 46),
  ('loc-1'::UUID, 'loc-6'::UUID, 26.8, 35),
  ('loc-2'::UUID, 'loc-1'::UUID, 8.4, 14),
  ('loc-2'::UUID, 'loc-3'::UUID, 36.5, 48),
  ('loc-2'::UUID, 'loc-4'::UUID, 33.2, 44),
  ('loc-2'::UUID, 'loc-5'::UUID, 38.6, 52),
  ('loc-2'::UUID, 'loc-6'::UUID, 32.0, 42),
  ('loc-3'::UUID, 'loc-1'::UUID, 31.2, 42),
  ('loc-3'::UUID, 'loc-2'::UUID, 36.5, 48),
  ('loc-3'::UUID, 'loc-4'::UUID, 4.8, 12),
  ('loc-3'::UUID, 'loc-5'::UUID, 7.2, 18),
  ('loc-3'::UUID, 'loc-6'::UUID, 9.6, 20),
  ('loc-4'::UUID, 'loc-1'::UUID, 28.5, 38),
  ('loc-4'::UUID, 'loc-2'::UUID, 33.2, 44),
  ('loc-4'::UUID, 'loc-3'::UUID, 4.8, 12),
  ('loc-4'::UUID, 'loc-5'::UUID, 5.6, 15),
  ('loc-4'::UUID, 'loc-6'::UUID, 8.2, 18),
  ('loc-5'::UUID, 'loc-1'::UUID, 34.0, 46),
  ('loc-5'::UUID, 'loc-2'::UUID, 38.6, 52),
  ('loc-5'::UUID, 'loc-3'::UUID, 7.2, 18),
  ('loc-5'::UUID, 'loc-4'::UUID, 5.6, 15),
  ('loc-5'::UUID, 'loc-6'::UUID, 12.4, 24),
  ('loc-6'::UUID, 'loc-1'::UUID, 26.8, 35),
  ('loc-6'::UUID, 'loc-2'::UUID, 32.0, 42),
  ('loc-6'::UUID, 'loc-3'::UUID, 9.6, 20),
  ('loc-6'::UUID, 'loc-4'::UUID, 8.2, 18),
  ('loc-6'::UUID, 'loc-5'::UUID, 12.4, 24)
ON CONFLICT (pickup_id, destination_id) DO NOTHING;