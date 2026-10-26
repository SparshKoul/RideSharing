# RideFlow Engineering & Architecture Rules

This document specifies the technical principles, constraints, and coding standards for developing and maintaining the **RideFlow (RushRide)** codebase.

---

## 1. Architectural Guardrails

### 1.1 Frontend-Only Architecture
- **Zero Backend Dependency:** The application must run 100% in the browser. Do not introduce backend servers, Express APIs, microservices, or database connections.
- **Simulated Infrastructure:** All authentication, geocoding, payment transactions, and telemetry dispatches are simulated on the client side using deterministic mock data.
- **No Sensitive Credential Storage:** Never store real credit cards, bank account details, or production passwords. All demo credentials must be mock constants.

### 1.2 Technology & File Conventions
- **Language:** JavaScript (`.js`) and React JSX (`.jsx`) only.
- **No TypeScript:** Do not introduce `.ts`, `.tsx`, type definitions, or TypeScript compiler tools.
- **Component Architecture:** Every page and major reusable UI block must be a standalone functional React component using Hooks. Do not consolidate multiple pages into a single monolithic file.

---

## 2. State Management & Lifecycle Synchronization

### 2.1 Single Source of Truth
- **Zustand Store (`authStore.js` and `rideStore.js`):** All active rides, driver availability, trip histories, and user sessions must be managed in centralized Zustand stores.
- **Local Storage Persistence:** Store state must synchronize with `localStorage` so that page refreshes preserve demo accounts, preferences, active trips, and completed histories.

### 2.2 Cross-Role Synchronization Rules
1. **Trip Submission:** When a rider books a ride, it is created with status `searching` in `rideStore.rides`.
2. **Driver Queue Visibility:** If a driver is `online` and not handling an active trip, the pending ride appears in their request queue.
3. **Driver Assignment:** When a driver clicks "Accept", status transitions to `driver_assigned`. The rider dashboard instantly shows the assigned driver.
4. **Sequential Progression:**
   - `searching` → `driver_assigned` → `driver_arriving` → `in_progress` → `completed`
   - Alternatively, `cancelled` (from `searching` or `driver_assigned`).
5. **No Invalid Transitions:**
   - Drivers cannot start a trip before accepting it.
   - Drivers cannot complete a trip before starting it.
   - Completed or cancelled trips cannot be modified.
   - A driver cannot accept a new trip while already on an active trip.

---

## 3. Design System & Neo-Brutalist Guidelines

### 3.1 Theme & Aesthetics
- **Neo-Brutalist High-Contrast Styling:**
  - Deep royal cobalt blue (`#3a2df5` to `#2a1fd2`, `#0b0630`)
  - Electric acid lime accents (`#d8fc38` / `#c6ec22`)
  - Chunky ink borders (`3px solid #0b0630`)
  - 3D brutalist offset shadows (`box-shadow: 4px 4px 0 #0b0630` or `0 7px 0 #0b0630`)
  - Keyboard keycap styled badges (`.fb-key`, `.fb-step-key`)
- **Typography:**
  - Headings: `Archivo FB`, `Archivo Black`, `Space Grotesk`
  - Body: `Space Grotesk`, `Plus Jakarta Sans`, `system-ui`
  - Monospace: `Space Mono`, `JetBrains Mono`

### 3.2 Responsive Standards
- Full responsiveness across Mobile (< 640px), Tablet (640px - 1024px), and Desktop (> 1024px).
- On mobile devices, replace desktop sidebars with collapsible drawer or bottom tab navigation.
- Ensure all interactive elements have minimum 44px tap targets.

---

## 4. Routing & Role Security

### 4.1 Route Guard Rules
- Unauthenticated users attempting to access `/rider/*` or `/driver/*` must be redirected to `/role-select` or `/login`.
- A user logged in as a `rider` navigating to `/driver/*` should be redirected to their rider dashboard (or prompted to switch console).
- A user logged in as a `driver` navigating to `/rider/*` should be redirected to their driver dashboard.
- Switching roles via the console switcher must preserve active trip records in `rideStore`.

---

## 5. Pricing & Fare Calculation Rules

### 5.1 Deterministic Pricing Model
- Formula:
  $$\text{Fare} = \text{Base Fare} + (\text{Distance (km)} \times \text{Rate/km}) + (\text{Duration (min)} \times \text{Rate/min})$$
- All fares must be rounded to whole currency units.
- Driver earnings are calculated as $82\%$ of the total fare ($\text{Earnings} = \text{Fare} \times 0.82$).
- The same route and category must always output the identical fare unless pricing configurations are intentionally modified.

---

## 6. Testing & Build Integrity

- Always run `npm run build` prior to committing to ensure zero compilation or bundling errors.
- Never commit broken CSS variables, missing image references, or circular dependencies.
