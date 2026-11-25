-- ============================================================
-- Migration 0002: Add seed data for drivers and categories
-- ============================================================

INSERT INTO drivers (id, name, email, phone, rating, vehicle_jsonb, trips_completed) VALUES
  ('driver-1'::UUID, 'Vikram Malhotra', 'vikram.driver@rideezz.demo', '+91 98765 43210', 4.92, '{"category":"comfort","model":"Honda City ZX (White)","plateNumber":"CH 01 BG 4022","color":"Pearl White","year":2023,"capacity":4}', 1420),
  ('driver-2'::UUID, 'Gurpreet Singh', 'gurpreet.driver@rideezz.demo', '+91 98123 67890', 4.88, '{"category":"xl","model":"Toyota Innova Crysta (Silver)","plateNumber":"PB 65 AB 7890","color":"Silver Metallic","year":2022,"capacity":6}', 2150),
  ('driver-3'::UUID, 'Priya Sharma', 'priya.driver@rideezz.demo', '+91 97654 32109', 4.95, '{"category":"economy","model":"Maruti Suzuki Swift Dzire (Blue)","plateNumber":"CH 01 TA 5514","color":"Oxford Blue","year":2023,"capacity":4}', 890)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name, base_fare, rate_per_km, rate_per_min, capacity) VALUES
  ('moto'::UUID, 'RideEzz Moto', 20, 8, 1.0, 1),
  ('economy'::UUID, 'RideEzz Go / Mini', 40, 12, 1.5, 4),
  ('comfort'::UUID, 'RideEzz Premier Sedan', 65, 16, 2.2, 4),
  ('xl'::UUID, 'RideEzz XL / SUV', 95, 22, 3.0, 6),
  ('electric'::UUID, 'RideEzz Electric Green', 60, 14, 2.0, 4),
  ('black'::UUID, 'RideEzz Black Elite', 150, 30, 4.0, 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO locations (id, name, address, lat, lng, tag, popular) VALUES
  ('loc-1'::UUID, 'Chitkara University', 'Chandigarh-Patiala National Highway (NH-64), Rajpura, Punjab', 30.5161, 76.6592, 'Campus', true),
  ('loc-2'::UUID, 'Rajpura Bus Stand', 'Old GT Road, Rajpura City Centre, Punjab', 30.4842, 76.5947, 'Transit', true),
  ('loc-3'::UUID, 'Chandigarh Railway Station', 'Daria, Industrial Area Phase I, Chandigarh', 30.7027, 76.8223, 'Transit', true),
  ('loc-4'::UUID, 'Elante Mall', 'Plot No. 178-178A, Industrial Area Phase I, Chandigarh', 30.7055, 76.8013, 'Shopping', true),
  ('loc-5'::UUID, 'Sector 17, Chandigarh', 'City Centre Plaza, Sector 17, Chandigarh', 30.7415, 76.7794, 'Hub', true),
  ('loc-6'::UUID, 'Chandigarh International Airport', 'New Civil Air Terminal, Jhiurheri, Mohali, Punjab', 30.6735, 76.7885, 'Airport', true)
ON CONFLICT (id) DO NOTHING;