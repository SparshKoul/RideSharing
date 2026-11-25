# RideFlow — Backend

## Background

This directory contains the Supabase-based backend for RideFlow / RideEzz. The frontend uses localStorage for persistence and simulated data, but this backend provides:

- Real API endpoints for auth, ride booking, status management, and payments
- Real-time updates via WebSocket
- Proper relational data modeling
- Supports connecting to a real Supabase project

## Quick Start

```bash
cd supabase
npm install
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
npm run start
```

The backend starts on `http://localhost:3001`.

## Architecture

```
supabase/
├── config.ts              # Environment config
├── client.ts              # Supabase client (auth, database)
├── package.json
├── tsconfig.json
├── schema.sql            # Database schema definition
├── migrations/
│   └── 0001_initial_schema.sql
├── rpc.sql               # Stored procedures (RPC functions)
└── server/
    ├── routes.ts         # Express API routes
    └── realtime.ts       # Real-time event hub
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /health | Service health |
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/auth/me | Current user |
| POST | /api/rides/book | Book a ride |
| POST | /api/rides/:id/status | Update status |
| POST | /api/rides/:id/accept | Driver accepts |
| POST | /api/rides/:id/driverComplete | Complete trip |
| POST | /api/payments/process | Process payment |
| GET | /api/drivers | Drivers list |
| GET | /api/analytics/earnings | Earnings |
| GET | /api/analytics/trips | Trip history |

## Database

- **users** — authenticated users
- **rides** — ride lifecycle records
- **payments** — payment transactions
- **drivers** — driver profiles
- **categories** — 6 ride classes
- **locations** — 6 pickup/destination points
- **route_metrics** — computed distances/durations
- **audit_log** — append-only audit trail

## Integration with Frontend

The frontend will connect to this backend at:
- `api/rides/book` — booking API
- `api/auth/login` — demo login
- WebSocket endpoint for real-time updates