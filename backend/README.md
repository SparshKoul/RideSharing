# RidePlatform Backend

## Overview

A complete backend for the RideFlow / RideEzz ride-sharing platform, built with Node.js/Express and PostgreSQL.

## Architecture

```
backend/
├── src/
│   ├── main.js            # Express server entry point
│   ├── config/
│   │   ├── index.js       # Database & logger config
│   │   └── auth.js        # Auth configuration
│   ├── utils/
│   │   ├── db.js          # PostgreSQL client
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
│   ├── services/
│   │   ├── booking.js     # Booking & fare calculation
│   │   ├── status.js      # Ride status management
│   │   ├── payment.js     # Payment processing
│   │   ├── driver.js      # Driver data
│   │   └── audit.js       # Audit logging
│   ├── migrations/
│   │   ├── 0001_init.sql  # Schema initialization
│   │   └── 0002_seed_data.sql  # Seed data
│   ├── package.json
│   └── tsconfig.json
├── migrations/            # SQL migration files
├── .env                    # Environment configuration
└── README.md               # This file
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
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=rideplatform
export DB_USER=rideplatform
export DB_PASSWORD=password
export JWT_SECRET=your-secret-key
export JWT_EXPIRES_IN=24h
export SUPABASE_URL=your-project.supabase.co
export SUPABASE_ANON_KEY=your-anon-key
npm run build
npm start
```

## Database

See `migrations/0001_init.sql` for full schema and `migrations/0002_seed_data.sql` for seed data.