# RidePlatform Backend

## Overview

A complete backend for the RideFlow / RideEzz ride-sharing platform, built with Node.js/Express and **Supabase** (PostgreSQL via Red Hat's managed service).

## Architecture

```
backend/
├── src/
│   ├── main.js            # Express server entry point
│   ├── config/
│   │   ├── index.js       # Supabase client & logger config
│   │   └── auth.js        # Auth configuration
│   ├── utils/
│   │   ├── db.js          # Supabase client operations
│   │   ├── logger.js      # Winston logger
│   │   └── validation.js  # Request validation
│   ├── middleware/
│   │   └── auth.js        # Auth middleware
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── rides.js       # Ride management routes
│   │   ├── payments.js    # Payment routes
│   │   ├── drivers.js     # Driver profiles
│   │   └── analytics.js   # Analytics routes
│   └── package.json
└── migrations/            # SQL migration files
```

## API Endpoints

| Method | Path | Description |
|---|---|---:|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Create new user |
| GET | `/api/auth/me` | Get current user (authenticated) |
| POST | `/api/rides/book` | Book a ride |
| POST | `/api/rides/:id/status` | Update ride status |
| POST | `/api/rides/:id/accept` | Driver accepts ride |
| POST | `/api/rides/:id/driverComplete` | Complete trip |
| POST | `/api/payments/process` | Process payment |
| GET | `/api/drivers` | List drivers |
| GET | `/api/analytics/earnings` | Earnings data |
| GET | `/api/analytics/trips` | Trip history |

## Setup

```bash
cd backend
npm install

# Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"

npm start
```

The backend will run on `http://localhost:3001` with all API routes.

## Database

The backend connects to Supabase's PostgreSQL database via the Supabase JavaScript SDK.
See `migrations/0001_init.sql` for full schema and `migrations/0002_seed_data.sql` for seed data.

## Notes

- Auth uses Supabase's built-in auth system (email/password login)
- All database operations go through `supabase.rpc()` for compliance and testing