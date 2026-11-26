# Evaluation Guide — RideEzz

## Current status: backend core complete (~50% of full product)

The platform has a working Express + Supabase backend and a frontend connected to it.
The focus so far is the **core rider flow**. Advanced operational features are intentionally
left as roadmap items.

---

## Live demo (5 minutes)

Both servers must be running:

```bash
cd backend && npm start          # http://localhost:3001
cd frontend && npm run dev       # http://localhost:5173
```

### Flow to show

1. **Home page** — http://localhost:5173
   - Compact navbar, hero, fare estimator, ride classes
   - Navbar shows **Sign In / Sign Up** when signed out

2. **Sign up** — click *Sign Up* in the navbar
   - Creates a real row in the Supabase `users` table (bcrypt password hash)
   - Returns a JWT, loads rider data from Supabase

3. **Dashboard** — redirected after sign-in
   - Name comes from the DB (`full_name`), not hardcoded
   - Trips, stats and booking draft all loaded from Supabase
   - No person avatar images, slim sidebar

4. **Book a ride** — click *Choose a vehicle* → select a category → confirm
   - `POST /api/rides/book` writes a row to `rides`
   - Fare is computed server-side from `route_metrics` + `categories`
   - Status advances through `driver_assigned → driver_arriving → in_progress → completed`
   - Each transition is persisted via `POST /api/rides/:id/status`

5. **Driver view** — click *Driver View* in the navbar
   - Driver profile (rating, trips, vehicle) and assigned rides, all from Supabase
   - Labelled as a read-only preview; full workflow is roadmap

6. **Proof in Supabase** — open the table editor and show:
   - `users` — the account you just created
   - `rides` — the ride you just booked, with its final status
   - `user_state` — the saved booking draft / profile

### Quick API proof (terminal)

```bash
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo.rider@rideezz.demo","password":"demo1234"}'
curl http://localhost:3001/api/drivers
curl http://localhost:3001/api/analytics/trips
```

Demo account: `demo.rider@rideezz.demo` / `demo1234`

---

## What is implemented

| Area | Status | Notes |
|---|---|---|
| Supabase schema + seed data | ✅ | `0001`–`0005` migrations |
| JWT auth (login / register / me) | ✅ | bcrypt hashes in DB |
| Locations / categories / drivers catalog | ✅ | REST endpoints |
| Ride booking + status lifecycle | ✅ | persisted to Supabase |
| Rider dashboard, trips, booking UI | ✅ | connected to API |
| Profile / favorites / draft persistence | ✅ | `user_state` table |
| Analytics read endpoints | ✅ | earnings + trips |
| Payments processing | ⚠️ | endpoint exists, simulated |
| Driver preview (profile + assigned rides) | ✅ | read-only, `/driver` |
| Full driver workflow (accept/arrive/complete UI) | ⬜ | roadmap |
| Ratings & reviews persistence | ⬜ | local only |
| Real map / GPS telemetry | ⬜ | visual mock |
| Deployment / CI | ⬜ | local only |

---

## Talking points

- **Real database, not mocks** — accounts, rides, and app state live in Supabase PostgreSQL.
- **Server-side fare calculation** — the client cannot tamper with pricing.
- **Stateless JWT auth** — no server sessions; tokens signed with `JWT_SECRET`.
- **Idempotent migrations** — safe to re-run.
- **Remaining 50%** — driver app, payments integration, ratings, real maps, deployment.
