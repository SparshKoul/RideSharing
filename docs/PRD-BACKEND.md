# Product Requirements Document (Backend)
# RideFlow — Frontend-Only Ride-Sharing Platform
# Version: 1.0
# Date: November 2026

---

## 1. Product Overview

### 1.1 Product Vision

RideFlow is a client-side-only ride-sharing web application. The entire application runs in the browser using Zustand stores and localStorage. However, this document defines the **backend** — an optional, server-side layer that provides real-world-grade authentication, ride dispatch, real-time GPS telemetry, payment processing, and analytics. The backend enables the frontend to consume real APIs rather than spinning up simulated clients.

### 1.2 Scope

- **Phase 1 (Minimum Viable):** Backend that supports real API calls from the frontend.
  - RESTful APIs for user auth, ride booking, ride status, payment, and analytics.
  - Authentication via JWT or session tokens.
  - Ride lifecycle events published via WebSocket for real-time updates.
- **Phase 2 (Production):** Full ride dispatch, real-time GPS, payment gateway integration, dashboard reporting.

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Language | TypeScript (Node.js / Express) |
| ORM | Prisma (interfaces → SQL) |
| Database | PostgreSQL 16+ |
| Real-time | Socket.io or native WebSocket |
| Authentication | Passport.js / NextAuth |
| JWT | jsonwebtoken |
| Payments | Stripe SDK (future), local mock wallet |
| API Gateway | Optional (Addy / Fastify) |
| ORM | Prisma ORM |
| File Storage | S3-compatible |
| Caching | Redis |
| CI/CD | GitHub Actions + Docker |

---

## 3. API Design

### 3.1 User Auth

#### `POST /api/auth/login`
Request: `{ email, password }`
Response: `{ token, user: { id, email, role, createdAt } }`

#### `POST /api/auth/register`
Request: `{ fullName, email, phone, password, accountType }`
Response: `{ id, email, role, createdAt }`

#### `POST /api/auth/logout`
Response: `{ message: "Logged out" }`

#### `GET /api/auth/me`
Response: `{ id, email, role, createdAt, lastLogin }`

### 3.2 Ride Booking

#### `POST /api/rides/book`
Request: `{ pickupLocationId, destinationLocationId, categoryId, paymentMethod, paymentToken }`
Response: `{ id, riderId, driverId, status: 'confirmed', createdAt }`

#### `GET /api/rides/{id}`
Response: full ride object

### 3.3 Ride Status Management

#### `POST /api/rides/{id}/status`
Request: `{ status, details }`
- Valid statuses: `confirmed`, `driver_assigned`, `driver_arriving`, `in_progress`, `completed`, `cancelled`

#### `POST /api/rides/{id}/accept`
Response: `{ status: 'confirmed', details }`

#### `POST /api/rides/{id}/driverComplete`
Response: `{ status: 'completed', earnings: { rider: fare, driver: commission } }`

### 3.4 Payments

#### `POST /api/payments/process`
Request: `{ paymentMethod, amount, currency }`
Response: `{ id, status: 'succeeded', riderEarnings }`

### 3.5 Drivers

#### `GET /api/drivers`
Response: list of drivers with ratings, experience, vehicle info

#### `POST /api/drivers/{id}/update`
Request: `{ rating, feedback }`

### 3.6 Analytics

#### `GET /api/analytics/earnings`
Response: daily/weekly/monthly earnings breakdown

#### `GET /api/analytics/trips`
Response: completed trips filtered by date range

---

## 4. Database Schema (PostgreSQL)

### 4.1 Entities

```
users
  id (UUID PK)
  email (unique, index)
  password_hash
  role (enum: rider, driver, admin)
  accountType
  createdAt, updatedAt

rides
  id (UUID PK)
  rider_id (FK → users)
  driver_id (FK → users, nullable)
  pickup_location_id (FK → locations)
  destination_location_id (FK → locations)
  category_id (FK → categories)
  status (enum: searching, driver_assigned, driver_arriving, in_progress, completed, cancelled)
  createdAt
  completedAt
  finalFare
  driverEarnings
  cancellationReason
  ...

payments
  id (UUID PK)
  ride_id (FK → rides)
  amount
  currency
  method (enum: upi, card, cash)
  status (enum: pending, succeeded, failed)
  createdAt

drivers
  id
  name
  email
  phone
  rating
  vehicle (JSONB)
  tripsCompleted
  ...

categories
  id
  name
  baseFare
  ratePerKm
  ratePerMin
  capacity
  ...

locations
  id
  name
  address
  lat
  lng
  ...

route_metrics
  pickup_id (FK)
  destination_id (FK)
  distanceKm
  durationMins
  ...
```

### 4.2 Key Design Decisions

1. **Relational model** — rides are linked to both rider and driver via foreign keys, enabling proper audit trails.
2. **S3 for payment proof** — store receipt PDFs/omits after a configurable retention.
3. **JSONB for vehicles** — flexible schema for driver vehicles without pre-defining fields.
4. **Event log table** — append-only log of ride status transitions for audit and replay.

---

## 5. Ride Lifecycle State Machine

```
[*] ──book──→ searching ──accept──→ driver_assigned ──arrive──→ driver_arriving ──start──→ in_progress ──complete──→ completed
                                              │           │
                                              │           └──complete──→ completed
                                              │           (cancelled)
                                              └──cancelled──→ [*]
```

**Constraints:**
- Cannot start `in_progress` without `driver_assigned`.
- Cannot complete `in_progress` without status = `in_progress`.
- Cancelled trips cannot be modified.
- A driver cannot accept a new trip while handling an active trip.

---

## 6. Real-Time Updates (WebSocket)

- Subscription-based event channel:
  - Ride status changes
  - Driver availability toggled
  - Payment confirmation
  - Ride completed/cancelled

- Frontend connects via `ws://localhost:8080` after JWT validation.

---

## 7. Data Migration Plan

### Phase 1: Seed data
- Import the 4 seed rides + 3 demo drivers from `frontend/src/data/*`
- Create base tables with foreign keys

### Phase 2: Authentication
- Implement JWT login/registration
- Rotate hardcoded demo account to real auth

### Phase 3: Ride lifecycle
- Real `POST /api/rides/book`
- Status transitions via REST + WebSocket

### Phase 4: Payments
- Stripe integration with mock gateway for Phase 1

---

## 8. Testing & Quality

- Unit tests for each service function (vitest + jest)
- Integration tests against PostgreSQL
- Contract tests for API endpoints
- End-to-end tests for ride booking lifecycle

---

## 9. Deployment

- Docker containerized (`docker-compose.yml`)
- GitHub Actions CI/CD
- Runs on any standard VPS (AWS EC2, Render, Fly.io)