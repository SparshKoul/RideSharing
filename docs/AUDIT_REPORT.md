# Site Audit Report — RideEzz

Date: 26 Nov 2026
Scope: `frontend/src`, `backend/src`, live API behaviour, browser console logs.
Method: static review of all reachable modules, cross-check of every `useAuth()`/`useRide()`
destructure against the hook exports, API contract comparison, `npm run build`, `npm run lint`,
and curl verification of backend endpoints.

Result: **build and lint pass, no raw exceptions in routed components**, but several
correctness/state bugs were found. Prioritized below.

---

## CRITICAL

| # | Issue | Location | Impact | Suggested fix |
|---|---|---|---|---|
| C1 | Deep links to protected pages bounce to `/` before auth resolves | `ProtectedRoute.jsx:7-8`, `authStore.js:14-16`, `App.jsx:9-21` | Reloading `/rider/dashboard` with a valid JWT redirects home | Init `isBootstrapping` from token presence and show a loader in `ProtectedRoute` until bootstrap finishes |
| C2 | Role is lost on every refresh | `authStore.js:41` discards `api.me()` result; `role` stays default `'rider'` (line 10) | A logged-in driver becomes a rider after reload | `const user = await api.me(); set({ role: user.role, rider: {...HARDCODED_CUSTOMER, ...user} })` |
| C3 | Any transient network error during bootstrap permanently deletes the JWT | `authStore.js:45-48` clears token for *all* `api.me()` failures | Brief offline blip logs the user out | Add `status` to API errors and clear token only on 401 |
| C4 | Driver preview always shows the wrong driver and zero rides | `DriverOverview.jsx:20,24` compares slug `driver-1` with UUID `rider.id` / `ride.driverId` | Driver portal is misleading in the demo | Normalize with `toApiId/fromApiId`; compare authenticated UUID from `/me` |
| C5 | Driver assignment is never persisted | `rideStore.js:284-287` only updates status; backend status route never sets `driver_id` (`backend/src/routes/rides.js:128-135`) | Assigned driver disappears on reload; hardcoded name shown in toast | Call `api.acceptRide(id)` or persist `driverId` through the status endpoint |
| C6 | Fares and payment method shown for DB rides are fabricated | `api.js:138-141`: `estimatedFare = final_fare`, `finalFare = final_fare`, `paymentMethod = 'UPI'`; backend writes `final_fare` at booking time | Cancelled rides show ₹0; in-progress rides show a "final" fare early | Persist `estimated_fare`; only set `finalFare` when `status === 'completed'` |
| C7 | Ratings are silently discarded | `rideStore.js:373-381` local-only; `api.js:147-148` always writes `rating: null` | User feedback is lost after refresh | Add rating columns/endpoint and POST on submit |
| C8 | "Reset default state" silently signs in as the demo rider | `authStore.js:121` calls `loginAsRider()` inside `resetAuthData()` | Resetting wipes the real user identity | Remove the side effect; reset should only clear local/session state |

---

## MEDIUM

| # | Issue | Location | Suggested fix |
|---|---|---|---|
| M1 | Toast rendered 5 times on routed pages | `App.jsx:26`, `RiderLayout.jsx:45`, `PublicLayout.jsx:17,43`, `DriverLayout.jsx:38` | Keep only the App-level `<Toast />` |
| M2 | Catalog fetched from Supabase then ignored | `rideStore.js:124-135` loads it, but `BookingPage.jsx:20,37-40` and `LocationInput.jsx:3` use static mock data | Build options from `useRide().categories/locations` |
| M3 | Fake seed rides presented as "synced from Supabase" | `rideStore.js:140-148` keeps seeds when API returns empty; `RiderDashboard.jsx:163` claims sync | Always `set({ rides })` from API; label offline seeds explicitly |
| M4 | "Restore defaults" empties trip history if API returns nothing | `rideStore.js:425-434` sets `rides: []` first | Restore seeds on failure/empty response |
| M5 | Profile form shows hardcoded identity after async bootstrap | `RiderProfilePage.jsx:11-13` seeds `useState` before `loadProfile()` completes | Sync fields via `useEffect` or key the form by `currentUser.id` |
| M6 | Unknown ride id renders a different ride | `ActiveRidePage.jsx:49` falls back to `rides[0]` | Remove fallback; show "Ride Not Found" |
| M7 | Rating success state leaks across rides | `ActiveRidePage.jsx:46,73-75` local `ratingSubmitted` not reset on `:id` change | Derive from `ride.rating` or key page by id |
| M8 | Landing estimator CTA is a dead end when signed out | `LandingPage.jsx:55-65` navigates to protected `/rider/confirm` → redirect home | Open `AuthModal` first, then continue |
| M9 | Role handling inconsistent across navigation surfaces | `Navbar.jsx:34,42,53-82` "CUSTOMER CONSOLE"; `MobileNavigation.jsx:9-19` rider-only tabs; `ProfileDropdown.jsx:66,89` "Customer"; `ProtectedRoute` has no role gate; `DriverLayout.jsx` unrouted | Add role-aware nav configs and role checks in router |
| M10 | Duplicate network work on login/dev | `main.jsx:6-9` StrictMode double-invokes bootstrap; `AuthModal.jsx:47` re-fetches what bootstrap already loaded | Shared in-flight promise; drop redundant reload |
| M11 | Help desk ticket is fake | `HelpPage.jsx:141-173` random ID after timeout, no API | Label as demo or add real support endpoint |
| M12 | Hardcoded "telemetry operational / 99.99% uptime" claim | `LandingPage.jsx` footer | Remove or mark as illustrative |

---

## LOW / CLEANUP

- **L1** Unrouted pages call non-existent actions and would throw if wired: `RegisterPage.jsx:12` (`loginAsDriver`); `DriverProfilePage.jsx:24-25` (`user`, `updateUser`, `resetDemo`, `trips`); `VehiclePage.jsx:21` (`updateDriverVehicle`); `EarningsPage.jsx:54`; `DriverDashboard.jsx:48-54`; `RideRequestsPage.jsx:13`.
- **L2** Unreachable files: 7 driver pages, `RegisterPage`, `RoleSelectionPage`, `FavoritesPage`, `PaymentsPage`, `LoadingState`, `NotificationPanel`, `RideCard`, `DriverLayout`, `storage.js`.
- **L3** Dead selectors/exports: `useRide.js:2,7,9` selects `driverOnline`/`rejectedRideIds` but never returns them; `api.js:200-221` exports unused helpers.
- **L4** `storage.js` is dead code now that Supabase is authoritative.
- **L5** `MapPanel.jsx:8,12-13` accepts `activeStatus` and computes `routePoints` but never renders them.
- **L6** `Navbar.jsx:3,96` imports `CloudOff` but only renders the online branch — no offline indicator.
- **L7** Bundle warning: single JS chunk ~509 kB (chunk-size warning only, not a bug).

---

## Browser console note

The Vite log contains three transient errors from earlier HMR edits (`FavoritesPage is not defined`,
`change in the order of Hooks called by LandingPage`, `Cannot read properties of undefined
(reading 'next')`). None are reproducible against the final build — `npm run build` and lint pass,
and no current source contains `.next` or a stale `FavoritesPage` reference. Treat them as
development-time HMR artifacts, not live bugs.

---

## Verification performed

- `npm run build` ✅
- `npm run lint` — no errors (warnings only) ✅
- Backend `/health`, login (correct/incorrect role), catalog, analytics — all behave as designed ✅
