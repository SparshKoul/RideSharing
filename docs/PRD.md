# Product Requirements Document (PRD)
# RideFlow — Frontend-Only Ride-Sharing Platform

**Version:** 2.0  
**Date:** October 2026  
**Product Type:** Web Application  
**Frontend:** React + JavaScript + JSX  
**Build Tool:** Vite  
**Architecture:** Frontend-only, simulated backend using mock data and browser storage

---

## 1. Product Overview

### 1.1 Product Vision

RideFlow is a modern ride-sharing web application inspired by Uber. It provides separate experiences for passengers who want to book rides and drivers who want to accept ride requests and manage trips.

The platform must deliver a realistic, polished ride-booking experience with two distinct dashboards, interactive maps, simulated authentication, trip management, fare estimation, and driver earnings.

The entire application must run on the frontend. No backend server, database, real payment processing, or actual ride dispatch is required.

### 1.2 Primary Objectives

- Build a complete ride-sharing application using React and JSX.
- Provide separate Rider and Driver registration/login flows.
- Display role-specific dashboards and navigation.
- Allow riders to book, track, cancel, and review simulated rides.
- Allow drivers to manage availability, accept or reject requests, and update trip status.
- Simulate the lifecycle of a ride from booking through completion.
- Maintain consistent mock trip data between rider and driver dashboards within the same browser session and application state.
- Deliver a responsive, accessible, premium-quality UI.
- Ensure all major controls and workflows are functional.

### 1.3 Target Users

**Riders**
- People looking to travel between two locations.
- Users who want to compare ride categories and estimated fares.
- Returning users who want to view past trips and saved locations.

**Drivers**
- Drivers who want to simulate going online and receiving ride requests.
- Drivers who want to accept or reject bookings.
- Drivers who want to track their current trip and review earnings.

### 1.4 Product Scope

The application includes simulated authentication, role selection, rider and driver dashboards, booking, trip management, driver availability, mock payments, trip history, profile management, and help pages.

The application does not include real identity verification, production-grade authentication, real-time GPS, actual ride dispatch, live payments, or server-side data storage.

---

## 2. Technology Stack

### 2.1 Mandatory Frontend Stack

| Technology | Responsibility |
|---|---|
| React | UI framework and component architecture |
| JavaScript + JSX | All application logic and React components |
| Vite | Development server and build tool |
| React Router DOM | Client-side routing |
| Tailwind CSS | Responsive styling and design system |
| Zustand | Shared state management |
| Lucide React | Icons |
| Leaflet + OpenStreetMap | Optional map visualization |
| Recharts | Dashboard charts and earnings analytics |
| localStorage | Persistence of demo accounts, preferences, and trip history |

**Mandatory language requirement:** All React components must use `.jsx`. Utility functions, configuration files, mock data, and stores must use `.js` where applicable. Do not use TypeScript, `.tsx`, interfaces, or type annotations.

Use React functional components and Hooks. Keep components reusable and avoid placing the entire application in one file.

### 2.2 Development Setup

```bash
npm create vite@latest rideflow -- --template react
cd rideflow
npm install
npm install react-router-dom zustand lucide-react
npm install recharts leaflet react-leaflet
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```

Configure Tailwind CSS according to the installed version's Vite integration instructions. If external map tiles are unavailable, the application must display a local map-style fallback rather than breaking.

### 2.3 Architecture Rules

- Frontend-only application.
- No backend APIs or server-side authentication.
- No database connection.
- No real payment gateway.
- No hardcoded API secrets.
- Centralized mock data and pricing rules.
- Shared application state for rider and driver workflows.
- Browser storage for persistence across page refreshes.
- All important interactions must work without external credentials.

---

## 3. User Roles and Authentication

### 3.1 Role Selection Page

Route: `/auth` (or `/role-select`)

This is the primary entry point for new visitors.

Display a modern welcome page with the RideFlow logo, a headline, and two prominent role cards.

**Rider card**
- Icon or illustration of a passenger.
- Heading: "Ride with RideFlow."
- Description: "Find a ride, compare fares, and reach your destination."
- CTA: "Continue as Rider."

**Driver card**
- Icon or illustration of a driver.
- Heading: "Drive with RideFlow."
- Description: "Accept trips, manage your availability, and track your earnings."
- CTA: "Continue as Driver."

Additional elements:
- Login and registration tabs or links.
- A clean, responsive layout.
- Clear visual distinction between the two roles.
- A link to the help center.
- A visible demo-mode notice.

Selecting a role must navigate to that role's login or registration screen.

### 3.2 Login Page

Routes:
- `/auth/rider/login` (or `/login?role=rider`)
- `/auth/driver/login` (or `/login?role=driver`)

Both pages share reusable authentication components but display role-specific content.

Required fields:
- Email address.
- Password.
- Show/hide password control.
- Remember me checkbox.
- Login button.
- Link to registration.
- Form validation and error messages.

For the frontend-only MVP, authentication must be simulated using predefined demo accounts or locally stored demo profiles. Do not claim to authenticate against a real service.

Provide convenient demo-login options, such as:
- "Continue as Demo Rider."
- "Continue as Demo Driver."

After successful demo login:
- Rider navigates to `/rider/dashboard`.
- Driver navigates to `/driver/dashboard`.

The application must retain the selected role and current demo session when the page refreshes.

### 3.3 Registration Page

Routes:
- `/auth/rider/register`
- `/auth/driver/register`

**Rider registration fields**
- Full name.
- Email address.
- Phone number.
- Password.
- Confirm password.
- Terms acceptance checkbox.

**Driver registration fields**
- Full name.
- Email address.
- Phone number.
- Password.
- Confirm password.
- Vehicle type.
- Vehicle model.
- Vehicle registration number.
- Driving experience.
- Terms acceptance checkbox.

All fields must be validated locally.

For driver registration, show a simulated onboarding status such as "Demo profile created" or "Pending verification — simulated." Do not imply that any actual license or identity verification has occurred.

Store only non-sensitive demo profile data. Do not store plaintext passwords or real identity documents. This is a prototype, not production authentication.

### 3.4 Role-Based Route Handling

- Riders can access rider routes.
- Drivers can access driver routes.
- Unauthenticated users attempting to open protected routes should be redirected to `/auth`.
- Users attempting to access the wrong role's dashboard should be redirected to their own dashboard.
- Provide a working logout action.
- Provide a demo reset option.

Role restrictions are for frontend navigation only and are not a security boundary.

---

## 4. Application Sitemap

### Public routes

| Route | Purpose |
|---|---|
| `/` | Public landing page (with OmniRush Neo-Brutalist UI) |
| `/auth` or `/role-select` | Role selection |
| `/auth/rider/login` or `/login` | Rider login |
| `/auth/driver/login` or `/login` | Driver login |
| `/auth/rider/register` or `/register` | Rider registration |
| `/auth/driver/register` or `/register` | Driver registration |
| `/help` | Public help center |

### Rider routes

| Route | Purpose |
|---|---|
| `/rider` or `/rider/dashboard` | Rider home and booking entry |
| `/rider/book` | Pickup, destination, and ride selection |
| `/rider/confirm` | Booking confirmation |
| `/rider/ride/:id` or `/rider/active` | Active ride tracking |
| `/rider/trips` | Ride history |
| `/rider/trips/:id` | Trip details |
| `/rider/payments` | Mock payment methods |
| `/rider/favorites` | Saved locations |
| `/rider/profile` | Profile and preferences |

### Driver routes

| Route | Purpose |
|---|---|
| `/driver` or `/driver/dashboard` | Driver overview and availability |
| `/driver/requests` | Incoming ride requests |
| `/driver/trip/:id` or `/driver/active` | Active trip management |
| `/driver/trips` | Completed and cancelled trips |
| `/driver/earnings` | Earnings and analytics |
| `/driver/vehicle` | Vehicle details |
| `/driver/profile` | Driver profile and settings |

---

## 5. Shared Application Layout

### 5.1 Desktop Layout

Use a consistent application shell with:
- Sidebar navigation.
- Top navigation bar.
- Main content area.
- Notification indicator.
- Profile menu.
- Responsive content cards.

The rider and driver shells must look related but remain clearly distinct.

### 5.2 Mobile Layout

- Replace the desktop sidebar with a mobile navigation drawer or bottom navigation.
- Stack cards vertically.
- Use full-width booking forms.
- Display ride details in compact cards or bottom sheets.
- Keep primary actions visible and easy to tap.
- Prevent horizontal overflow.

### 5.3 Shared Components

Create reusable components for:
- `Navbar.jsx`
- `Sidebar.jsx`
- `MobileNavigation.jsx`
- `ProfileDropdown.jsx`
- `NotificationPanel.jsx`
- `LocationInput.jsx`
- `MapPanel.jsx`
- `StatusBadge.jsx`
- `RideCard.jsx`
- `RideOptionCard.jsx`
- `DriverCard.jsx`
- `StatCard.jsx`
- `ConfirmModal.jsx`
- `EmptyState.jsx`
- `LoadingState.jsx`
- `Toast.jsx`
- `ProtectedRoute.jsx`

---

## 6. Rider Dashboard

Route: `/rider/dashboard`

### 6.1 Dashboard Layout
- Personalized greeting & current demo location.
- Quick booking panel with Pickup, Destination, and category choices.
- Map preview with markers and route polyline.
- Active ride banner when a ride is in progress.
- Quick statistics: total rides, completed, cancelled, and total spending.
- Recent trips table with direct link to details.

---

## 7. Rider Booking Workflow

Route: `/rider/book` & `/rider/confirm`

### 7.1 Location Selection
- Search predefined locations (Chitkara University, Rajpura Bus Stand, Chandigarh Railway Station, Elante Mall, Sector 17, Chandigarh International Airport).
- Autocomplete, swap pickup/dropoff, clear inputs.

### 7.2 Ride Categories
- Support 6 vehicle classes: Rush Moto, Rush Go / Mini, Rush Premier Sedan, Rush XL / SUV, Rush Electric Green, Rush Black Elite.
- Display passenger capacity, ETA, route duration, estimated fare, and vehicle specifications.

### 7.3 Deterministic Fare Calculation
Formula:
```text
Fare = Base Fare + (Distance × Rate per km) + (Duration × Rate per minute)
```
Centralized in `fareCalculator.js`.

---

## 8. Rider Active Ride Tracking

Route: `/rider/active` (or `/rider/ride/:id`)

Supported statuses:
1. `searching`: Searching for nearby drivers.
2. `driver_assigned`: Nearest driver accepted the trip.
3. `driver_arriving`: Driver en route to pickup spot.
4. `in_progress`: OTP verified, trip started.
5. `completed`: Trip completed, fare settled, rating available.
6. `cancelled`: Cancelled by rider or driver.

---

## 9. Driver Dashboard & Availability

Route: `/driver/dashboard`

- Online / Offline toggle with instant request queue pause.
- Today's earnings card and trip counters.
- Incoming ride request queue with countdown timer.
- Active trip quick access card.
- Daily/weekly earnings chart powered by Recharts.

---

## 10. Driver Ride Requests

Route: `/driver/requests`

- Real-time incoming booking requests matching rider submissions.
- Route metrics: Distance, Duration, Category, Driver Earnings (82% commission).
- Accept and Reject buttons.

---

## 11. Driver Active Trip Management

Route: `/driver/active` (or `/driver/trip/:id`)

Driver-side state progression:
1. **Driver Assigned**: "Mark as Arriving"
2. **Driver Arrived**: "Start Trip" (with OTP verification)
3. **In Progress**: "Complete Trip"
4. **Completed**: Displays trip summary, fare, earnings, and updates records.

---

## 12. Driver Earnings Dashboard

Route: `/driver/earnings`

- KPI cards: Today's earnings, weekly earnings, monthly earnings, completed trips, average fare.
- Recharts-powered earnings bar and line charts.
- Itemized earnings history with 82% net commission calculation.

---

## 13. Vehicle, Profiles & Saved Places

- **Vehicle Management**: `/driver/vehicle` (category, model, license plate, status).
- **Driver Profile**: `/driver/profile` (rating, experience, settings).
- **Rider Profile**: `/rider/profile` (saved places, preferred payment, history).
- **Saved Locations**: `/rider/favorites` (Home, Work, Campus shortcuts).
- **Payment Methods**: `/rider/payments` (Cash, UPI, Card selection).
- **Help Center**: `/help` (Searchable FAQ).

---

## 14. Acceptance Criteria & Quality Checklist

- [x] Complete React + Vite + JSX frontend with no TypeScript errors.
- [x] High-contrast electric Neo-Brutalist landing page inspired by omnirush.ai/buildathon.
- [x] Separate Rider and Driver authentication and dashboard flows.
- [x] Unified Zustand state synchronization across rider and driver views.
- [x] Deterministic fare calculation utility.
- [x] Recharts earnings analytics and interactive route maps.
- [x] Local storage persistence across page refreshes.
- [x] Zero backend or real credential requirement.
