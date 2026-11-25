# RideEzz Backend

Node.js / Express API backed by Supabase (PostgreSQL). Runs on `http://localhost:3001`.

---

## 1. Install dependencies

```bash
cd /home/sparsh/Desktop/Ride/backend
npm install
```

---

## 2. Configure environment

`backend/.env` is already set up:

```env
SUPABASE_URL=https://yizhxtowzmxymwcaxblp.supabase.co
SUPABASE_ANON_KEY=<your-supabase-key>
JWT_SECRET=rideezz-dev-secret-change-me
```

> Change `JWT_SECRET` before deploying anywhere real. The server loads `.env` automatically via `dotenv/config` — no manual `export` needed.

---

## 3. Set up the Supabase database (one time)

Open **https://supabase.com/dashboard/project/yizhxtowzmxymwcaxblp/sql** and run these **in order**, pasting the entire file contents each time:

| Order | File | What it does |
|---|---|---|
| 1 | `migrations/0001_initial_schema.sql` | Creates all tables in dependency order, plus grants + RLS policies |
| 2 | `migrations/0002_seed_data.sql` | Inserts demo rider, drivers, categories, locations, rides, route metrics |
| 3 | `migrations/0003_grants.sql` | Re-applies grants/policies if tables already existed |

All files are idempotent (`IF NOT EXISTS` / `ON CONFLICT DO NOTHING`), so re-running them is safe.

Verify in the SQL editor:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

You should see: `users`, `drivers`, `categories`, `locations`, `rides`, `payments`, `route_metrics`, `audit_log`.

---

## 4. Start the server

```bash
cd /home/sparsh/Desktop/Ride/backend
npm start
```

Expected output:

```json
{"level":"info","message":"RidePlatform backend running on http://localhost:3001", ...}
```

---

## 5. Verify it works

```bash
# Health
curl http://localhost:3001/health
# -> {"status":"ok","service":"RidePlatform Backend"}

# Login (returns a JWT)
curl -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo.rider@rideezz.demo","password":"demo1234"}'

# Public catalog endpoints
curl http://localhost:3001/api/locations
curl http://localhost:3001/api/categories
curl http://localhost:3001/api/drivers
```

For authenticated endpoints, copy the `token` from login and pass it:

```bash
TOKEN="<paste token here>"

curl http://localhost:3001/api/rides?mine=true \
  -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:3001/api/rides/book \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "pickupLocationId": "30000000-0000-0000-0000-000000000001",
    "destinationLocationId": "30000000-0000-0000-0000-000000000004",
    "categoryId": "20000000-0000-0000-0000-000000000003"
  }'
```

---

## 6. API endpoints

| Method | Path | Auth | Description |
|---|---|---:|---|
| POST | `/api/auth/login` | no | Login, returns JWT + user |
| POST | `/api/auth/register` | no | Register, returns JWT + user |
| GET | `/api/auth/me` | yes | Current user |
| GET | `/api/locations` | no | Pickup/destination locations |
| GET | `/api/categories` | no | Ride categories |
| GET | `/api/drivers` | no | Driver profiles |
| GET | `/api/rides?mine=true` | yes | Rides for current rider |
| GET | `/api/rides/:id` | yes | Single ride with joined data |
| POST | `/api/rides/book` | yes | Book a ride (fare computed server-side) |
| POST | `/api/rides/:id/status` | yes | Update status (`searching` → `driver_assigned` → `driver_arriving` → `in_progress` → `completed`, or `cancelled`) |
| POST | `/api/rides/:id/accept` | yes | Driver accepts |
| POST | `/api/rides/:id/driverComplete` | yes | Driver completes |
| POST | `/api/payments/process` | yes | Process payment |
| GET | `/api/analytics/earnings` | no | Driver earnings view |
| GET | `/api/analytics/trips` | no | Trip history view |
| GET | `/health` | no | Health check |

---

## 7. Structure

```
backend/
├── src/
│   ├── main.js                 # Express server, middleware, route mounting
│   ├── config/index.js         # Supabase client + winston logger
│   ├── utils/
│   │   ├── db.js               # Shared Supabase client
│   │   └── jwt.js              # JWT sign/verify (uses JWT_SECRET)
│   ├── middleware/auth.js      # Bearer-token verification
│   └── routes/
│       ├── auth.js             # bcrypt login/register/me
│       ├── catalog.js          # locations, categories
│       ├── rides.js            # list/detail/book/status
│       ├── drivers.js
│       ├── payments.js
│       └── analytics.js
└── migrations/
    ├── 0001_initial_schema.sql
    ├── 0002_seed_data.sql
    └── 0003_grants.sql
```

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| `supabaseUrl is required` | `.env` missing — check file exists in `backend/` |
| `PGRST205 Could not find table` | Run migration `0001` in the Supabase SQL editor |
| `42501 permission denied` | Run migration `0003_grants.sql` |
| `42P01 relation "locations" does not exist` | Re-run `0001` — it now creates referenced tables first |
| `401 Invalid token` | Log in again to get a fresh JWT; confirm `JWT_SECRET` matches |
| `ERR_MODULE_NOT_FOUND` | Run `npm install` |

---

## 9. Frontend connection

The frontend reads `VITE_API_BASE_URL` from `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Start both servers:

```bash
# terminal 1
cd backend && npm start

# terminal 2
cd ../frontend && npm run dev
```

Frontend: **http://localhost:5173** · Backend: **http://localhost:3001**
