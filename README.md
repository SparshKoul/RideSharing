# RideFlow (RushRide) ⚡

> **High-Voltage, Neo-Brutalist Ride-Sharing Platform**  
> Frontend UI replicated & inspired by **[omnirush.ai/buildathon](https://omnirush.ai/buildathon)**.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange.svg)](https://zustand-demo.pmnd.rs/)
[![Architecture](https://img.shields.io/badge/Architecture-Frontend--Only-green.svg)](#architecture)

---

## 📖 Table of Contents
1. [Overview](#-overview)
2. [UI Reference & Aesthetic](#-ui-reference--aesthetic)
3. [Key Features](#-key-features)
4. [Quick Start](#-quick-start)
5. [Architecture & State Synchronization](#-architecture--state-synchronization)
6. [Documentation](#-documentation)
7. [Demo Accounts & Testing](#-demo-accounts--testing)
8. [License](#-license)

---

## ⚡ Overview

**RideFlow** is a modern, frontend-only ride-sharing platform that delivers realistic dual-console experiences for **Riders** and **Drivers**. Built with React 19, Vite, and Zustand, it features:
- **Instant Dual-Console Switching:** Seamlessly switch between booking trips as a passenger and accepting bookings as a driver.
- **Unified Trip State:** A ride requested in the Rider Console is immediately available in the Driver Console with real-time status transitions.
- **Deterministic Pricing Engine:** Upfront, zero-surge price calculation across 6 vehicle classes.
- **Zero Backend Required:** 100% client-side with persistent mock data stored in `localStorage`.

---

## 🎨 UI Reference & Aesthetic

The public landing page replicates the iconic neo-brutalist visual design of **[omnirush.ai/buildathon](https://omnirush.ai/buildathon)**:
- **Electric Color Palette:** Cobalt royal blue background gradients (`#3a2df5` to `#2a1fd2`), electric lime highlights (`#d8fc38`), and deep ink borders (`#0b0630`).
- **Typography:** `Archivo FB`, `Space Grotesk`, and `JetBrains Mono`.
- **Brutalist Elements:** Chunky 3D keyboard keycaps (`.fb-key`), painted brush badges (`brush.svg` masks), infinite auto-scrolling marquee, starburst headings, and offset drop shadows.
- **Interactive Live Estimator:** An interactive radar console directly in the hero section that dynamically calculates distance, duration, and fare across 6 vehicle tiers.
- **Sticky Bottom Action Bar:** Floating dispatch monitor that appears when scrolling.

---

## 🚗 6 Ride Classes

1. **Rush Moto:** Fastest urban micro-transit through traffic bottlenecks.
2. **Rush Go / Mini:** Affordable, compact city hatchbacks for daily commutes.
3. **Rush Premier Sedan:** High-comfort executive sedans with top-rated drivers.
4. **Rush XL / SUV:** Spacious 6-passenger SUVs with oversized luggage space.
5. **Rush Electric Green:** 100% zero-emission electric vehicles with carbon offset certificates.
6. **Rush Black Elite:** Luxury European chauffeur service with VIP amenities.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/SparshKoul/RideSharing.git
cd RideSharing/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
Ride/
├── docs/                      # Comprehensive specifications & rules
│   ├── PRD.md                 # Product Requirements Document
│   ├── RULES.md               # Technical guardrails & coding standards
│   └── ARCHITECTURE.md        # Architecture & state synchronization flow
├── md/                        # Documentation mirror directory
├── frontend/
│   ├── public/
│   │   └── buildathon/        # Branded assets (brush.svg, font, keys art)
│   ├── src/
│   │   ├── components/        # Reusable UI widgets (Navbar, Map, StatusBadge, Cards)
│   │   ├── layouts/           # PublicLayout, RiderLayout, DriverLayout
│   │   ├── pages/
│   │   │   ├── public/        # LandingPage, RoleSelect, Login, Register, Help
│   │   │   ├── rider/         # Rider dashboard, booking, active tracking, trips
│   │   │   └── driver/        # Driver dashboard, requests, active trip, earnings
│   │   ├── data/              # Mock locations, drivers, categories, pricing
│   │   ├── store/             # Zustand stores (authStore.js, rideStore.js)
│   │   ├── utils/             # fareCalculator, routeSimulator, storage, formatters
│   │   └── styles/            # omnirush-theme.css, index.css
│   └── package.json
└── README.md                  # Project root README
```

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs) folder:
- **[Product Requirements Document (PRD)](./docs/PRD.md):** Full product scope, functional requirements, sitemap, and acceptance criteria.
- **[Engineering & Architecture Rules](./docs/RULES.md):** Development guidelines, guardrails, and constraints.
- **[Technical Architecture](./docs/ARCHITECTURE.md):** Detailed system design, component hierarchy, and ride lifecycle state diagram.

---

## 👥 Demo Accounts & Testing

No external signups or API keys are required. You can test both roles using one-click demo logins:

| Role | Demo User | Sample Vehicle | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Rider** | Aryan Mehra | *Passenger* | Search locations, compare 6 ride tiers, book rides, track OTP & driver arrival. |
| **Driver** | Vikram Malhotra | Honda City (PB 11 AB 4829) | Toggle online availability, accept/reject requests, advance trip lifecycle, view Recharts earnings. |

To test the complete lifecycle:
1. Open the **Landing Page** and click **"Book a Ride Now"** or **"Launch App"**.
2. Select **"Continue as Demo Rider"**.
3. Choose pickup & destination and confirm booking.
4. Click **"Switch Console"** in the top navigation to switch to the **Driver Console**.
5. Go online, view the incoming request, and click **"Accept"**.
6. Advance through: *Mark as Arriving → Start Trip (Verify OTP) → Complete Trip*.
7. Review updated trip history and 82% driver earnings!

---

## 📄 License
MIT License. Inspired by modern urban mobility protocols and high-contrast neo-brutalist digital design.
