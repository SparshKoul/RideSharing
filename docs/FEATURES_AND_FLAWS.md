# RideEzz — Features, Flaws Found, and Fixes

This document records what the project does, every problem hit during implementation, the
root cause, and the exact fix applied. It doubles as a handover/evaluation reference.

---

## 1. Features implemented

### Backend (Express + Supabase)

| Feature | Endpoint / Location | Status |
|---|---|---|
| Database schema (8 tables) | `migrations/0001_initial_schema.sql` | ✅ |
| Seed data (rider, 3 drivers, 6 categories, 6 locations, rides, route metrics) | `migrations/0002_seed_data.sql` | ✅ |
| Grants + permissive RLS policies | `0003_grants.sql` (also in `0001`) | ✅ |
| Server-side app state (draft / profile / favorites) | `0004_user_state.sql`, `GET/PUT /api/state` | ✅ |
| User display name in DB | `0005_user_name.sql` | ✅ |
| Auth — register (rider or driver) | `POST /api/auth/register` | ✅ |
| Auth — login with role enforcement | `POST /api/auth/login` | ✅ |
| Auth — current user from JWT | `GET /api/auth/me` | ✅ |
| bcrypt password hashing | `src/routes/auth.js` | ✅ |
| JWT signing / verification | `src/utils/jwt.js`, `src/middleware/auth.js` | ✅ |
| Catalog — locations & categories | `GET /api/locations`, `/api/categories` | ✅ |
| Drivers list | `GET /api/drivers` | ✅ |
| Ride booking with server-side fare calculation | `POST /api/rides/book` | ✅ |
| Ride list / detail with joined data | `GET /api/rides`, `/api/rides/:id` | ✅ |
| Ride status lifecycle | `POST /api/rides/:id/status`, `/accept`, `/driverComplete` | ✅ |
| Estimated vs final fare separation | `estimated_fare` / `final_fare` columns, `0006` | ✅ |
| Persisted ratings & feedback | `POST /api/rides/:id/rate`, `0006` | ✅ |
| Payments endpoint | `POST /api/payments/process` | ⚠️ simulated |
| Analytics read endpoints | `GET /api/analytics/earnings`, `/trips` | ✅ |
| Health check | `GET /health` | ✅ |
| Logging (winston) & rate limiting | `src/config/index.js`, `src/main.js` | ✅ |

### Frontend (React + Vite + Zustand)

| Feature | Location | Status |
|---|---|---|
| Live API client with slug ↔ UUID adapter | `src/utils/api.js` | ✅ |
| Auth modal in navbar (Sign In / Sign Up, Rider / Driver) | `src/components/AuthModal.jsx` | ✅ |
| Portal-based modal (no clipping) | `AuthModal.jsx` | ✅ |
| JWT restore via `/api/auth/me` (no fake auto-login) | `src/store/authStore.js` | ✅ |
| Rides, catalog and state loaded from Supabase | `src/store/rideStore.js`, `src/App.jsx` | ✅ |
| Booking flow → DB | `BookingPage`, `BookingConfirmation` | ✅ |
| Ride tracking with status advances → DB | `ActiveRidePage` | ✅ |
| Profile / favorites saved to DB | `RiderProfilePage`, `FavoritesPage` | ✅ |
| Driver preview (own profile + assigned rides) | `src/pages/driver/DriverOverview.jsx` | ✅ read-only |
| Slim navbar / sidebar / dashboard | `Navbar`, `Sidebar`, `RiderDashboard` | ✅ |

---

## 2. Flaws found and how they were solved

### 2.1 Dependency / startup errors

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 1 | `npm error notarget No matching version found for rate-limit@^2.0.4` | Package `rate-limit` does not exist at that version | Removed it; used `express-rate-limit@^7.4.0` |
| 2 | `Cannot find module .../backend/dist/index.js` | `main`/`start` pointed at a build output that never existed (code was JS, no build step) | Changed to `src/main.js` |
| 3 | `ERR_MODULE_NOT_FOUND: express-rate-limit` | Imported but not in `package.json` | Added dependency + `npm install` |
| 4 | `Cannot find package 'winston'` | Logger used winston but it was never installed | Added `winston` |
| 5 | `404 'winston-logform' is not in this registry` | Package does not exist | Rewrote logger with built-in `winston.format` / `winston.transports` only |
| 6 | `supabaseUrl is required` | `.env` was never loaded — no dotenv import | Installed `dotenv`, added `import 'dotenv/config'` as first line of `main.js` |
| 7 | `Cannot destructure property 'email' of 'req.body' as it is undefined` | `express.json()` middleware missing, so POST bodies were undefined | Added `express.json()` + `express.urlencoded()` in `main.js` |
| 8 | `MODULE_TYPELESS_PACKAGE_JSON` warning | ESM syntax in a package without `"type": "module"` | Added `"type": "module"` to `backend/package.json` |
| 9 | `429 Too Many Requests` during development | Rate limit was 100/15min and Vite HMR reloads burned through it | 5000 in dev, 100 in production |

### 2.2 JavaScript / ESM errors

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 10 | `Identifier 'error' has already been declared` | Two `const { data, error }` in the same scope in `auth.js` callback | Renamed to `sessionError` / `userData` |
| 11 | `does not provide an export named 'default'` (5 route files) | Routes used `export { router }` while `main.js` used default imports | Changed all to `export default router` |
| 12 | `db.js does not provide an export named 'default'` | `main.js` default-imported it but only a named export existed | Added `export default supabase` |
| 13 | `ReferenceError: supabase is not defined` in `db.js` | `export default supabase` was added before the variable was created | Created `const supabase = getSupabaseClient()` first |
| 14 | `does not provide an export named 'supabase'` | Routes used named import after `db.js` switched to default | Changed all route imports to `import supabase from '../utils/db.js'` |
| 15 | `require is not defined in ES module scope` | `config/index.js` used `require('winston')` in an ESM project | Converted to static `import` statements |
| 16 | `Cannot GET /api/analytics/trips` / `/earnings` | Both handlers were registered as `router.get('/')`; second was shadowed | Changed to distinct paths `/trips` and `/earnings`, fixed `.order()` syntax |
| 17 | `Cannot GET /api/state` after deploying state routes | Server had not been restarted after adding the router | Restarted `node src/main.js` |

### 2.3 SQL / Supabase errors

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 18 | `42P01: relation "locations" does not exist` on `0001` | `rides` had FKs to `locations` and `categories` but those tables were created **after** `rides` | Rewrote `0001` so referenced tables are created first (users → drivers → categories → locations → rides → payments → route_metrics → audit_log) |
| 19 | Same file also failed on seed rows | Seed IDs like `'loc-1'::UUID`, `'driver-1'`, `'moto'` are **invalid UUIDs** | Moved all seed data to `0002` with valid deterministic UUIDs |
| 20 | 3 SQL files showed errors in the editor | Duplicate `0001_init.sql` alongside `0001_initial_schema.sql` | Deleted the duplicate |
| 21 | `PGRST205 Could not find the table 'public.drivers'` | Migrations had never been applied in the Supabase SQL editor | Instructions to run `0001` → `0002` → `0003` in order |
| 22 | `42501 permission denied for table drivers` | Tables created in the SQL editor had no GRANTs for `anon` / `service_role` | Added `0003_grants.sql` with GRANTs + RLS policies, and embedded the same in `0001` |
| 23 | Duplicate seed data in two migrations | `locations`/`drivers`/`categories` seeded in both `0001` and `0002` | Kept a single seed source in `0002` with `ON CONFLICT DO NOTHING` |
| 24 | New account displayed "Aryan Mehra" | Frontend merged `HARDCODED_CUSTOMER` over the DB user | Added `users.full_name` (`0005`) and used `user.name` everywhere |
| 25 | Rider using correct password could log in as Driver | Login ignored the selected role | Backend checks `req.body.role` against `users.role` → 401 on mismatch |
| 26 | Signing up as Driver created no driver profile | Register always inserted a `users` row only | Register now also inserts a `drivers` row with `id = user.id` |

### 2.4 Auth design flaws

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 27 | Every `/api/rides/*` call returned 401 | `/api/auth/login` used non-existent `supabase.auth.signInWithEmailAndPassword()` and returned `token: user.id` (UUID), while middleware verified a JWT with `JWT_SECRET` | Rewrote auth to use our `users` table + bcrypt + real JWTs; added `JWT_SECRET` to `.env` |
| 28 | JWT_SECRET undefined | Not present in `.env` | Added it (with a dev fallback constant) |
| 29 | Login felt "local"/fake | App silently auto-logged-in as the demo rider on every load | Removed auto-login; session is restored only from an existing DB-issued JWT via `/api/auth/me` |

### 2.5 Frontend / UI flaws

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 30 | LocalStorage used instead of DB | All state (rides, draft, profile) was in `localStorage` | Added `user_state` table + `/api/state`; stores now read/write Supabase. Only the JWT remains in localStorage |
| 31 | Two auth forms stacked (screenshot) | Standalone `/login` page plus navbar modal | Deleted `LoginPage.jsx`; `/login` redirects; navbar modal is the only form |
| 32 | Sign In / Sign Up not in navbar originally | Auth was a separate page | Added modal trigger buttons to both app and home-page navbars |
| 33 | Sign Up modal cut off at the top | Modal was rendered inside `<header>` with `backdrop-blur-md`, which creates a containing block, so `position: fixed` was relative to the header | Rendered via `createPortal(..., document.body)` + scrollable overlay |
| 34 | Home page navbar cluttered | 9 items (6 links + Dashboard + Book Ride) | Reduced to 3 links + compact auth + Book Ride |
| 35 | Rider dashboard cluttered | Duplicate booking panel + large map + 4 stats + fake totals | Replaced with one compact shortcut card; stats use real DB counts only |
| 36 | Sidebar had unwanted pages | 6 items including Saved Places and Help Center | Reduced to 4 (Dashboard, Book a Ride, My Trips, My Profile); removed `/rider/favorites` and `/rider/payments` routes |
| 37 | Person photo shown in dashboard | Avatar `<img>` from Unsplash in profile dropdown and profile page | Replaced with initials badges |
| 38 | Quick-book on landing page crashed | Called `state.setBookingDetails`, which didn't exist | Changed to `updateBookingDraft` |
| 39 | `RegisterPage` called `loginAsDriver`, which didn't exist | Stale hook API in an unrouted page | Removed the page from routing |
| 40 | Duplicate toast rendering | `Toast` mounted in `App.jsx` and in each layout | Kept only the global instance |

### 2.6 Critical bugs found in the follow-up site audit (and fixed)

These were found by a full audit after the first implementation was complete.
See `docs/AUDIT_REPORT.md` for the complete audit.

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 41 | Reloading a protected page redirected to `/` even with a valid JWT | `ProtectedRoute` checked `isAuthenticated` before `bootstrap()` (which runs in an effect) finished | `isBootstrapping` now starts `true` when a token exists; `ProtectedRoute` shows a "Restoring session..." loader until it resolves |
| 42 | A logged-in driver became a rider after every refresh | `bootstrap()` called `api.me()` but discarded the response, leaving `role` at its default `'rider'` | `bootstrap()` now sets `role`, `rider`, and `customer` from the `/api/auth/me` response |
| 43 | A brief network error permanently logged the user out | `bootstrap()` cleared the JWT for *every* `api.me()` failure | API errors now carry `status`; the token is cleared only on 401/403, network errors keep it and show "Offline" |
| 44 | Driver preview showed the wrong driver and zero rides | It compared a slug id (`driver-1`) against DB UUIDs (`rider.id`, `ride.driverId`) | Normalized both sides with `toApiId()` before comparing |
| 45 | Assigned driver disappeared after reload | Status endpoint set `driver_assigned` but never wrote `driver_id`; the assignment was local-only | Frontend passes `driverId` (mapped slug → UUID); backend status route persists it |
| 46 | Cancelled rides showed ₹0 and in-progress rides showed a "final" fare | `adaptRide` used `final_fare` for both estimated and final, and the backend set `final_fare` at booking time | Added `estimated_fare` column (`0006_ride_fields.sql`); backend sets it at booking and leaves `final_fare` null until completion; adapter only exposes `finalFare` for `completed` rides |
| 47 | Ratings were silently discarded on refresh | `submitRideRating` only updated local Zustand state | Added `rating`/`rating_feedback` columns (`0006`), `POST /api/rides/:id/rate`, `api.submitRating()`, and adapter reads the stored values |
| 48 | "Reset default state" silently logged the user into the demo account | `resetAuthData()` called `loginAsRider()` as a side effect | Removed the side effect — reset now only clears local/session state |

---

## 3. Intentional limitations (remaining ~50%)

- Full driver workflow (accept → arrive → start → complete UI) — only a read-only preview exists
- Payments are simulated; no real gateway
- Ratings/reviews are stored locally, not in Supabase
- Map is a CSS/SVG mock, no real GPS/Leaflet integration
- No deployment or CI configured
- RLS policies are permissive demo policies; production needs per-user policies

---

## 4. Verification checklist

```bash
# Health
curl http://localhost:3001/health

# Role enforcement
curl -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"demo.rider@rideezz.demo","password":"demo1234","role":"driver"}'
# -> 401 Invalid credentials for this account type

# Catalog + data
curl http://localhost:3001/api/locations
curl http://localhost:3001/api/categories
curl http://localhost:3001/api/drivers
curl http://localhost:3001/api/analytics/trips
```

Demo accounts:
- Rider: `demo.rider@rideezz.demo` / `demo1234`
- Driver: `demo.driver@rideezz.demo` / `demo1234`

All migrations (`0001`–`0005`) must be applied in the Supabase SQL editor in order.
