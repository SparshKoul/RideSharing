import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  Shield,
  Clock,
  Car,
  MapPin,
  Check,
  Sparkles,
  PhoneCall,
  Navigation,
  Compass,
  DollarSign,
  Users,
  Award,
  ChevronDown,
  Bike,
  Leaf,
  Crown,
  Share2,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Menu,
  X
} from 'lucide-react';
import { MOCK_LOCATIONS, DEFAULT_PICKUP, DEFAULT_DESTINATION } from '../../data/locations';
import { RIDE_CATEGORIES } from '../../data/rideCategories';
import { getRouteMetrics, calculateFare } from '../../utils/fareCalculator';
import { formatCurrency, formatDistance, formatDuration } from '../../utils/formatters';
import { useRideStore } from '../../store/rideStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const setBookingDetails = useRideStore((state) => state.setBookingDetails);

  // Live Estimator State
  const [pickup, setPickup] = useState(DEFAULT_PICKUP);
  const [destination, setDestination] = useState(DEFAULT_DESTINATION);
  const [selectedCategory, setSelectedCategory] = useState(RIDE_CATEGORIES[0]);
  const [bookedFeedback, setBookedFeedback] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live calculations
  const metrics = getRouteMetrics(pickup.id, destination.id);
  const estimatedFare = calculateFare(selectedCategory, metrics.distanceKm, metrics.durationMins);

  const handleQuickBook = () => {
    setBookingDetails({
      pickup,
      destination,
      category: selectedCategory,
      distanceKm: metrics.distanceKm,
      durationMins: metrics.durationMins,
      estimatedFare,
    });
    setBookedFeedback(true);
    setTimeout(() => {
      navigate('/rider/confirm');
    }, 600);
  };

  return (
    <div className="fb-page">
      {/* Skip Link */}
      <a className="fb-skip" href="#main" style={{ zIndex: 60 }}>
        Skip to main content
      </a>

      {/* Fixed Top Floating Navbar (Image 2 - Fixed from start to end) */}
      <header className="fb-navbar-fixed" role="banner">
        <div className="fb-bar-inner">
          <Link to="/" className="fb-bar-brand" aria-label="RushRide Mobility home">
            <div className="w-7 h-7 rounded-full bg-[#d8fc38] border-2 border-[#0b0630] flex items-center justify-center text-[#0b0630] font-black shadow-[2px_2px_0_#0b0630]">
              <Zap size={14} fill="#0b0630" />
            </div>
            <span>
              Rush<b>Ride</b>
            </span>
          </Link>

          {/* Main Navigation Links */}
          <nav className="fb-navbar-nav" aria-label="Main Navigation">
            <a href="#classes" className="fb-navlink">Ride Classes</a>
            <a href="#steps" className="fb-navlink">How It Works</a>
            <a href="#perks" className="fb-navlink">Perks</a>
            <a href="#safety" className="fb-navlink">Safety</a>
            <a href="#faq" className="fb-navlink">FAQ</a>
            <Link to="/help" className="fb-navlink">Support & Contact</Link>
          </nav>

          <div className="fb-navbar-actions">
            <Link
              to="/rider/dashboard"
              className="fb-navlink fb-navlink-accent hidden sm:inline-flex"
            >
              Dashboard
            </Link>
            <Link
              to="/rider/book"
              className="fb-btn fb-btn-lime fb-btn-sm font-neo-heading text-xs font-black uppercase tracking-wider"
            >
              Book Ride
              <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="fb-nav-toggle md:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="fb-mobile-nav-menu">
            <a href="#classes" onClick={() => setMobileMenuOpen(false)} className="fb-mobile-navlink">
              Ride Classes
            </a>
            <a href="#steps" onClick={() => setMobileMenuOpen(false)} className="fb-mobile-navlink">
              How It Works
            </a>
            <a href="#perks" onClick={() => setMobileMenuOpen(false)} className="fb-mobile-navlink">
              Perks
            </a>
            <a href="#safety" onClick={() => setMobileMenuOpen(false)} className="fb-mobile-navlink">
              Safety & Security
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="fb-mobile-navlink">
              FAQ
            </a>
            <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="fb-mobile-navlink">
              Support & Contact
            </Link>
            <Link
              to="/rider/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="fb-mobile-navlink text-[#d8fc38] font-black"
            >
              Customer Console →
            </Link>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main" className="pt-20">
        {/* HERO SECTION */}
        <section className="fb-hero" aria-labelledby="fb-title">
          <div className="fb-hero-copy">
            <p className="fb-eyebrow">The Autonomous & On-Demand Ride Matrix</p>

            <h1 className="fb-h1" id="fb-title">
              <span>Next-Gen</span>
              <span>RushRide</span>
              <span className="fb-year">2026</span>
              <svg aria-hidden="true" className="fb-burst fb-h1-burst" focusable="false" viewBox="0 0 60 60">
                <path d="M8 40 L22 30 M14 14 L28 24 M38 6 L36 22" stroke="currentColor" strokeLinecap="round" strokeWidth="6" />
              </svg>
            </h1>

            <p className="fb-sub">
              All 6 ride classes, from rapid Moto to executive Black. Under 3-minute pickups. Book seamless rides or earn on your schedule with zero platform lock-in and 82% direct driver revenue.
            </p>

            {/* Tilted Highlight Ribbon */}
            <p className="fb-banner">
              <span className="fb-brush">
                <span className="fb-banner-small">Zero Surge Guarantee · 100% Insured Rides</span>
                <span className="fb-banner-big">⚡ ₹0 COMMISSION ON FIRST 10 RIDES ⚡</span>
              </span>
            </p>

            {/* Real-time Chunky Keycaps Counter */}
            <div className="fb-count" data-phase="ready">
              <p className="fb-count-label">
                <span className="fb-dot inline-block"></span>
                Sector Telematics: Live Metro Core
              </p>
              <div className="fb-keys" role="timer" aria-label="Fleet telematics matrix">
                <span className="fb-key">
                  <span className="fb-key-num">1.4k</span>
                  <span className="fb-key-unit">cabs live</span>
                </span>
                <span className="fb-key">
                  <span className="fb-key-num">2.4</span>
                  <span className="fb-key-unit">min eta</span>
                </span>
                <span className="fb-key">
                  <span className="fb-key-num">99.8</span>
                  <span className="fb-key-unit">% fulfill</span>
                </span>
                <span className="fb-key fb-key-lime">
                  <span className="fb-key-num">₹0</span>
                  <span className="fb-key-unit">surge fee</span>
                </span>
              </div>
              <p className="fb-count-when">
                Active Fleet Mesh: <strong>Instant Auto-Dispatch Enabled Across Sector 1 to 24</strong>
              </p>
            </div>

            {/* Hero CTAs */}
            <div className="fb-ctas" id="fb-hero-ctas">
              <Link to="/rider/book" className="fb-btn fb-btn-lime">
                Book a Ride Now
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/rider/dashboard" className="fb-btn fb-btn-ink">
                Customer Console
                <span aria-hidden="true">↗</span>
              </Link>
              <a href="#calculator" className="fb-btn fb-btn-ghost">
                Instant Fare Radar
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          {/* Interactive Poster / Live Fare Estimator Console */}
          <figure className="fb-poster" id="calculator">
            <div className="fb-card p-5 sm:p-6 bg-white text-[#0b0630] rounded-[18px] border-[3px] border-[#0b0630] shadow-[8px_8px_0_#0b0630] hover:rotate-0 transition-transform duration-300">
              {/* Radar Status Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#0b0630]/15">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-[#0b0630]" />
                  <span className="font-neo-heading text-xs font-black uppercase tracking-wider text-[#0b0630]">
                    LIVE DISPATCH RADAR
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#d8fc38] text-[10px] font-neo-mono font-bold border border-[#0b0630]">
                  GPS READY
                </span>
              </div>

              {/* Location Selectors */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[11px] font-neo-grotesk font-black uppercase text-[#0b0630]/70 mb-1">
                    Pickup Location
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-[#3a2df5]" />
                    <select
                      value={pickup.id}
                      onChange={(e) => setPickup(MOCK_LOCATIONS.find((l) => l.id === e.target.value) || pickup)}
                      className="w-full pl-9 pr-3 py-2 bg-[#f4f2ff] border-2 border-[#0b0630] rounded-xl text-xs font-neo-grotesk font-bold text-[#0b0630] focus:outline-none focus:border-[#3a2df5]"
                    >
                      {MOCK_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.tag})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-neo-grotesk font-black uppercase text-[#0b0630]/70 mb-1">
                    Dropoff Destination
                  </label>
                  <div className="relative">
                    <Navigation size={15} className="absolute left-3 top-3 text-[#d8fc38]" fill="#0b0630" />
                    <select
                      value={destination.id}
                      onChange={(e) => setDestination(MOCK_LOCATIONS.find((l) => l.id === e.target.value) || destination)}
                      className="w-full pl-9 pr-3 py-2 bg-[#f4f2ff] border-2 border-[#0b0630] rounded-xl text-xs font-neo-grotesk font-bold text-[#0b0630] focus:outline-none focus:border-[#3a2df5]"
                    >
                      {MOCK_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.tag})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Ride Tier Selector */}
              <div className="mb-4">
                <label className="block text-[11px] font-neo-grotesk font-black uppercase text-[#0b0630]/70 mb-1.5">
                  Select Ride Class
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {RIDE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`p-2 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'bg-[#3a2df5] text-white border-[#0b0630] shadow-[2px_2px_0_#0b0630]'
                            : 'bg-[#f8f7ff] text-[#0b0630] border-[#0b0630]/30 hover:border-[#0b0630]'
                        }`}
                      >
                        <div className="font-neo-heading text-[11px] font-black truncate">{cat.name.split('/')[0]}</div>
                        <div className={`text-[10px] font-neo-mono ${isSelected ? 'text-[#d8fc38]' : 'text-neutral-500'}`}>
                          ₹{cat.baseFare} base
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Metrics Card */}
              <div className="p-3.5 rounded-xl bg-[#0b0630] text-white border-2 border-[#0b0630] mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-neo-grotesk uppercase text-[#d8fc38] font-bold">Guaranteed Price</div>
                    <div className="text-2xl font-neo-heading font-black text-white">{formatCurrency(estimatedFare)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-neo-grotesk uppercase text-neutral-400">Route Telematics</div>
                    <div className="text-xs font-neo-mono font-bold text-white">
                      {formatDistance(metrics.distanceKm)} · {formatDuration(metrics.durationMins)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Booking CTA */}
              <button
                type="button"
                onClick={handleQuickBook}
                className="w-full py-3 rounded-xl border-2 border-[#0b0630] bg-[#d8fc38] hover:bg-[#c6ec22] text-[#0b0630] font-neo-heading text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#0b0630] active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Zap size={15} fill="#0b0630" />
                <span>{bookedFeedback ? 'Dispatching Nearest Cab...' : 'Confirm & Request Ride →'}</span>
              </button>
            </div>
          </figure>
        </section>

        {/* NEO-BRUTALIST INFINITE MARQUEE TICKER */}
        <div aria-hidden="true" className="fb-marquee">
          <div className="fb-marquee-track">
            <span>
              INSTANT 3-MIN PICKUP <i>•</i> ZERO SURGE PRICE LOCK <i>•</i> 6 VEHICLE TIERS <i>•</i> 82% DRIVER PAYOUT <i>•</i> 100% LIVE GPS TELEMATICS <i>•</i> 24/7 ROADSIDE SOS ESCORT <i>•</i> CASHLESS UPI & CARDS <i>•</i> VERIFIED 5-STAR DRIVERS <i>•</i>
            </span>
            <span>
              INSTANT 3-MIN PICKUP <i>•</i> ZERO SURGE PRICE LOCK <i>•</i> 6 VEHICLE TIERS <i>•</i> 82% DRIVER PAYOUT <i>•</i> 100% LIVE GPS TELEMATICS <i>•</i> 24/7 ROADSIDE SOS ESCORT <i>•</i> CASHLESS UPI & CARDS <i>•</i> VERIFIED 5-STAR DRIVERS <i>•</i>
            </span>
          </div>
        </div>

        {/* SECTION 1: PERKS & STATS */}
        <section className="fb-section" aria-labelledby="get" id="perks">
          <header className="fb-head" data-fb-reveal="true">
            <p className="fb-kicker">What you get</p>
            <h2 className="fb-h2" id="get">
              Transparent fares. <span className="fb-brush">Zero surge gouging.</span>
            </h2>
          </header>

          <ul className="fb-gets" data-fb-stagger="true">
            <li className="fb-card fb-get">
              <span className="fb-get-big">₹0</span>
              <h3>Surge pricing spikes</h3>
              <p>
                Unlike legacy ride apps that triple fares the minute raindrops fall, RushRide guarantees deterministic price ceilings. What you see is what you pay.
              </p>
            </li>
            <li className="fb-card fb-get">
              <span className="fb-get-big">3 MIN</span>
              <h3>Lightning mesh dispatch</h3>
              <p>
                Distributed proximity routing pairs you with the closest verified vehicle in your immediate sector, slashing wait times to an average 2.4 minutes.
              </p>
            </li>
            <li className="fb-card fb-get">
              <span className="fb-get-big">82%</span>
              <h3>Driver revenue share</h3>
              <p>
                Drivers keep 82% of every fare, the highest payout in urban mobility. Happier drivers translate to cleaner vehicles and zero arbitrary ride cancellations.
              </p>
            </li>
            <li className="fb-card fb-get">
              <span className="fb-get-big">₹25K</span>
              <h3>Weekly driver bonuses</h3>
              <p>
                Guaranteed shift incentives, electric vehicle fuel rebates, and instantaneous 60-second UPI payouts transferred directly to bank accounts.
              </p>
            </li>
          </ul>
        </section>

        {/* SECTION 2: HOW IT WORKS */}
        <section className="fb-section" aria-labelledby="steps" id="steps">
          <header className="fb-head" data-fb-reveal="true">
            <p className="fb-kicker">How it works</p>
            <h2 className="fb-h2" id="steps">
              5 steps. <span className="fb-brush">That's it.</span>
            </h2>
            <p className="fb-lead">
              Never used an autonomous mobility mesh? You choose where to go, pick a comfort tier, and our telematics handle the rest.
            </p>
          </header>

          {/* Key Visual Art - Ride Platform Vehicle */}
          <div className="fb-car-art-container">
            <img
              alt="RushRide electric vehicle fleet"
              className="fb-car-art"
              src="/images/rideshare-car.jpg"
              width="890"
              height="500"
              loading="lazy"
            />
            <div className="fb-car-badge">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-[#0b0630]" />
              <span>LIVE DISPATCH · SMART FLEET</span>
            </div>
          </div>

          <ol className="fb-steps" data-fb-stagger="true">
            <li className="fb-step" id="step-1">
              <span aria-hidden="true" className="fb-step-key fb-step-key-lime">
                1
              </span>
              <div className="fb-step-body">
                <h3>Set Pickup & Destination</h3>
                <p>
                  Search landmarks or drop a coordinate directly on the interactive transit map. The system automatically plots the lowest-traffic route.
                </p>
              </div>
            </li>

            <li className="fb-step" id="step-2">
              <span aria-hidden="true" className="fb-step-key">
                2
              </span>
              <div className="fb-step-body">
                <h3>Choose Your Ride Tier</h3>
                <p>
                  Toggle between 6 distinct classes: from hyper-nimble single-rider Motos to comfortable Premier Sedans, 6-passenger XLs, and zero-emission Electric Greens.
                </p>
              </div>
            </li>

            <li className="fb-step" id="step-3">
              <span aria-hidden="true" className="fb-step-key">
                3
              </span>
              <div className="fb-step-body">
                <h3>Instant Nearby Driver Match</h3>
                <p>
                  Our dispatch mesh matches you with a verified captain in under 12 seconds with live GPS telematics, ETA updates, and vehicle plate display.
                </p>
              </div>
            </li>

            <li className="fb-step" id="step-4">
              <span aria-hidden="true" className="fb-step-key">
                4
              </span>
              <div className="fb-step-body">
                <h3>Secure 4-Digit Boarding OTP</h3>
                <p>
                  Verify your trip with an encrypted 4-digit PIN. Your driver cannot start the meter until you are safely seated onboard.
                </p>
              </div>
            </li>

            <li className="fb-step" id="step-5">
              <span aria-hidden="true" className="fb-step-key fb-step-key-lime">
                5
              </span>
              <div className="fb-step-body">
                <h3>Arrival & One-Tap Cashless Settlement</h3>
                <p>
                  Arrive smoothly. Automatic GST-compliant receipts are generated with instant UPI, Credit Card, Corporate Billing, or Cash payment.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* SECTION 3: 6 RIDE CLASSES / TRACKS */}
        <section className="fb-section" aria-labelledby="tracks" id="classes">
          <header className="fb-head" data-fb-reveal="true">
            <p className="fb-kicker">Pick your lane</p>
            <h2 className="fb-h2" id="tracks">
              6 ride tiers. <span className="fb-brush">Pick one.</span>
            </h2>
            <p className="fb-lead">
              You choose the ride tier for each trip. Need to bypass gridlock solo, or heading to the airport with family? We've got you covered.
            </p>
          </header>

          <ul className="fb-tracks" data-fb-stagger="true">
            {/* Track 1: Moto */}
            <li className="fb-card fb-track">
              <div aria-hidden="true" className="fb-track-top">
                <span className="fb-track-icon">
                  <Bike size={24} strokeWidth={2.4} />
                </span>
                <span className="fb-track-n">01</span>
              </div>
              <h3>Rush Moto</h3>
              <p className="fb-track-line">Fastest urban micro-transit through congested traffic bottlenecks.</p>
              <p className="fb-track-ideas-label">Highlights</p>
              <ul className="fb-track-ideas">
                <li>Solo passenger quick city commute.</li>
                <li>Sanitized ISI certified helmet provided.</li>
                <li>Base fare starting at ₹20 (₹8/km).</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="fb-chip">Solo Rider</span>
                <span className="fb-chip">Hyper Fast</span>
                <span className="fb-chip">Under ₹50</span>
              </div>
            </li>

            {/* Track 2: Mini / Go */}
            <li className="fb-card fb-track">
              <div aria-hidden="true" className="fb-track-top">
                <span className="fb-track-icon">
                  <Car size={24} strokeWidth={2.4} />
                </span>
                <span className="fb-track-n">02</span>
              </div>
              <h3>Rush Go / Mini</h3>
              <p className="fb-track-line">Economical pocket-friendly hatchbacks for everyday campus & office travel.</p>
              <p className="fb-track-ideas-label">Highlights</p>
              <ul className="fb-track-ideas">
                <li>Up to 4 passengers with compact luggage.</li>
                <li>Full AC climate control included.</li>
                <li>Base fare starting at ₹40 (₹12/km).</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="fb-chip">Best Value</span>
                <span className="fb-chip">Everyday AC</span>
                <span className="fb-chip">Swift / i20</span>
              </div>
            </li>

            {/* Track 3: Premier Sedan */}
            <li className="fb-card fb-track">
              <div aria-hidden="true" className="fb-track-top">
                <span className="fb-track-icon">
                  <Sparkles size={24} strokeWidth={2.4} />
                </span>
                <span className="fb-track-n">03</span>
              </div>
              <h3>Rush Premier Sedan</h3>
              <p className="fb-track-line">High-comfort sedans with top-rated driver partners and silent cabins.</p>
              <p className="fb-track-ideas-label">Highlights</p>
              <ul className="fb-track-ideas">
                <li>Extra rear legroom with USB charging ports.</li>
                <li>Top 10% highest-rated captains only.</li>
                <li>Base fare starting at ₹65 (₹16/km).</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="fb-chip">Top Rated</span>
                <span className="fb-chip">Business Ready</span>
                <span className="fb-chip">Quiet Ride</span>
              </div>
            </li>

            {/* Track 4: XL SUV */}
            <li className="fb-card fb-track">
              <div aria-hidden="true" className="fb-track-top">
                <span className="fb-track-icon">
                  <Users size={24} strokeWidth={2.4} />
                </span>
                <span className="fb-track-n">04</span>
              </div>
              <h3>Rush XL / SUV</h3>
              <p className="fb-track-line">Spacious 6-passenger SUVs with oversized boot space for heavy luggage.</p>
              <p className="fb-track-ideas-label">Highlights</p>
              <ul className="fb-track-ideas">
                <li>Seats up to 6 passengers comfortably.</li>
                <li>Airport ready: holds 4 large suitcases.</li>
                <li>Base fare starting at ₹95 (₹22/km).</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="fb-chip">6 Seater</span>
                <span className="fb-chip">Airport Cargo</span>
                <span className="fb-chip">Family Trip</span>
              </div>
            </li>

            {/* Track 5: Electric Green */}
            <li className="fb-card fb-track">
              <div aria-hidden="true" className="fb-track-top">
                <span className="fb-track-icon">
                  <Leaf size={24} strokeWidth={2.4} />
                </span>
                <span className="fb-track-n">05</span>
              </div>
              <h3>Rush Electric Green</h3>
              <p className="fb-track-line">100% Zero-emission electric fleet powered by clean renewable energy.</p>
              <p className="fb-track-ideas-label">Highlights</p>
              <ul className="fb-track-ideas">
                <li>Silent EV motors with zero engine vibration.</li>
                <li>Automatic carbon offset certificate per trip.</li>
                <li>Base fare starting at ₹60 (₹14/km).</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="fb-chip">Zero Emission</span>
                <span className="fb-chip">EV Clean</span>
                <span className="fb-chip">Eco Certificate</span>
              </div>
            </li>

            {/* Track 6: Black Elite */}
            <li className="fb-card fb-track">
              <div aria-hidden="true" className="fb-track-top">
                <span className="fb-track-icon">
                  <Crown size={24} strokeWidth={2.4} />
                </span>
                <span className="fb-track-n">06</span>
              </div>
              <h3>Rush Black Elite</h3>
              <p className="fb-track-line">Premium luxury executive service with professionally trained chauffeurs.</p>
              <p className="fb-track-ideas-label">Highlights</p>
              <ul className="fb-track-ideas">
                <li>European luxury sedans with leather seating.</li>
                <li>Complimentary spring water & priority dispatch.</li>
                <li>Base fare starting at ₹150 (₹30/km).</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="fb-chip">VIP Chauffeur</span>
                <span className="fb-chip">Corporate Invoicing</span>
                <span className="fb-chip">Luxury Interior</span>
              </div>
            </li>
          </ul>
        </section>

        {/* SECTION 4: RELIABILITY & SAFETY CHECKLIST */}
        <section className="fb-section" aria-labelledby="rebuild" id="safety">
          <header className="fb-head" data-fb-reveal="true">
            <p className="fb-kicker">The secret weapon</p>
            <h2 className="fb-h2" id="rebuild">
              Engineered for <span className="fb-brush">safety & uptime.</span>
            </h2>
            <p className="fb-lead">
              Every single trip on RushRide is backed by end-to-end telemetry, verified driver background vetting, and rigorous vehicle safety checks.
            </p>
          </header>

          <ul className="fb-check" data-fb-stagger="true">
            <li className="fb-check-item">
              <span aria-hidden="true" className="fb-tick">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
                </svg>
              </span>
              <div>
                <h3>Comprehensive Driver KYC</h3>
                <p>Every captain undergoes police verification, driving history audits, and in-person onboarding.</p>
              </div>
            </li>

            <li className="fb-check-item">
              <span aria-hidden="true" className="fb-tick">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
                </svg>
              </span>
              <div>
                <h3>24/7 Live Route Telematics</h3>
                <p>Our operations system tracks vehicle coordinates in real time. Detours trigger safety checks.</p>
              </div>
            </li>

            <li className="fb-check-item">
              <span aria-hidden="true" className="fb-tick">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
                </svg>
              </span>
              <div>
                <h3>Guaranteed Upfront Price Lock</h3>
                <p>No sudden meter bumps or unexpected tolls. The quote shown before booking is the final invoice.</p>
              </div>
            </li>

            <li className="fb-check-item">
              <span aria-hidden="true" className="fb-tick">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
                </svg>
              </span>
              <div>
                <h3>Masked Anonymous Calling</h3>
                <p>Connect with your driver securely through virtual relays. Your real mobile number is never exposed.</p>
              </div>
            </li>

            <li className="fb-check-item">
              <span aria-hidden="true" className="fb-tick">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
                </svg>
              </span>
              <div>
                <h3>Instant Real-Time Link Sharing</h3>
                <p>Share a live trip link with family and friends displaying driver details, car plate, and live GPS map.</p>
              </div>
            </li>

            <li className="fb-check-item">
              <span aria-hidden="true" className="fb-tick">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
                </svg>
              </span>
              <div>
                <h3>Universal Cashless Settlement</h3>
                <p>Settle instantly via Google Pay, PhonePe, Paytm, RuPay, Cards, Wallets, or direct cash.</p>
              </div>
            </li>

            <li className="fb-check-item">
              <span aria-hidden="true" className="fb-tick">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
                </svg>
              </span>
              <div>
                <h3>Air-Conditioned Comfort Standard</h3>
                <p>Standardized temperature policy across all sedans & SUVs for a sweat-free journey.</p>
              </div>
            </li>

            <li className="fb-check-item">
              <span aria-hidden="true" className="fb-tick">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
                </svg>
              </span>
              <div>
                <h3>24-Hour Lost & Found Hub</h3>
                <p>Misplaced a bag or phone? Our rapid recovery bridge reconnects you directly with your driver partner.</p>
              </div>
            </li>
          </ul>
        </section>

        {/* SECTION 5: SAFETY RULES & CRITERIA */}
        <section className="fb-section" aria-labelledby="rules" id="rules">
          <header className="fb-head" data-fb-reveal="true">
            <p className="fb-kicker">Fair play</p>
            <h2 className="fb-h2" id="rules">
              Safety standards & <span className="fb-brush">rules.</span>
            </h2>
          </header>

          <div className="fb-rules">
            <div className="fb-card fb-card-ink fb-rule-list">
              <h3>The Ground Rules</h3>
              <ul>
                <li>
                  <strong>Zero Substance Tolerance:</strong> Immediate irreversible platform ban for any alcohol or drug infraction.
                </li>
                <li>
                  <strong>19-Point Vehicle Inspection:</strong> Mandatory mechanical, tire, and brake safety clearance every 60 days.
                </li>
                <li>
                  <strong>Mutual 2-Way Rating:</strong> Both riders and drivers must maintain a 4.5+ star rating to preserve active status.
                </li>
                <li>
                  <strong>Zero Destination Discrimination:</strong> Equal service guarantee across all sectors without cherry-picking.
                </li>
                <li>
                  <strong>Transparent Fare Breakdown:</strong> Drivers receive itemized statements showing exact trip earnings and net payouts.
                </li>
                <li>
                  <strong>Fair Cancellation Shield:</strong> Riders are never charged cancellation fees if the driver is delayed by &gt; 5 minutes.
                </li>
              </ul>
            </div>

            <ul className="fb-judge" data-fb-stagger="true">
              <li className="fb-card fb-judge-card">
                <span aria-hidden="true" className="fb-judge-n">
                  1
                </span>
                <h3>Vehicle Roadworthiness</h3>
                <p>100% mechanically audited braking systems, dual front airbags, and clean interiors on every active car.</p>
              </li>

              <li className="fb-card fb-judge-card">
                <span aria-hidden="true" className="fb-judge-n">
                  2
                </span>
                <h3>Route Efficiency</h3>
                <p>Telemetry-guided routing avoids congested bottlenecks, delivering you to your destination without pointless detours.</p>
              </li>

              <li className="fb-card fb-judge-card">
                <span aria-hidden="true" className="fb-judge-n">
                  3
                </span>
                <h3>Captain Professionalism</h3>
                <p>Top-rated captains trained in defensive driving, courteous communication, and safe passenger assistance.</p>
              </li>

              <li className="fb-card fb-judge-card">
                <span aria-hidden="true" className="fb-judge-n">
                  4
                </span>
                <h3>Punctual Pickup</h3>
                <p>Over 95% of dispatches reach the passenger pickup spot within ±90 seconds of predicted arrival.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 6: TIMELINE & EARNINGS SPLIT */}
        <section className="fb-section fb-split" aria-labelledby="timeline" id="shifts">
          <div>
            <header className="fb-head" data-fb-reveal="true">
              <p className="fb-kicker">Key operating windows</p>
              <h2 className="fb-h2" id="timeline">
                <span className="fb-brush">Peak Shifts</span>
              </h2>
            </header>

            <ol className="fb-time" data-fb-stagger="true">
              <li>
                <span className="fb-time-date">6:00 AM</span>
                <div>
                  <h3>Morning Commute & Airport Wave</h3>
                  <p>Express lanes to IT parks, campuses, and railway terminals with zero surge price gouging.</p>
                </div>
              </li>

              <li>
                <span className="fb-time-date">12:30 PM</span>
                <div>
                  <h3>Midday City Express & Quick Errands</h3>
                  <p>Rapid micro-transit dispatches for lunch runs, medical appointments, and business meetings.</p>
                </div>
              </li>

              <li className="fb-time-hot">
                <span className="fb-time-date">5:30 PM</span>
                <div>
                  <h3>Evening Metro Transit Rush</h3>
                  <p>High-density vehicle clustering around office hubs with AI congestion bypass active.</p>
                </div>
              </li>

              <li>
                <span className="fb-time-date">11:00 PM</span>
                <div>
                  <h3>Night Owl & Red-Eye Flight Service</h3>
                  <p>High-security night operations with active GPS escort telematics and 24/7 hotline support.</p>
                </div>
              </li>
            </ol>
          </div>

          <div>
            <header className="fb-head" data-fb-reveal="true">
              <p className="fb-kicker">Industry-highest payouts</p>
              <h2 className="fb-h2" id="prizes">
                <span className="fb-brush">Partner Tiers</span>
              </h2>
            </header>

            <ul className="fb-prizes" data-fb-stagger="true">
              <li className="fb-prize fb-prize-1">
                <span className="fb-prize-place">Silver Captain</span>
                <span className="fb-prize-amt">80% Net Share</span>
              </li>

              <li className="fb-prize fb-prize-2">
                <span className="fb-prize-place">Gold Captain</span>
                <span className="fb-prize-amt">82% Net Share</span>
              </li>

              <li className="fb-prize fb-prize-best">
                <span className="fb-prize-place">Diamond Elite</span>
                <span className="fb-prize-amt">85% + ₹10K Bonus</span>
              </li>
            </ul>

            <p className="fb-small">
              Diamond status is awarded to driver partners with 4.9+ star ratings, zero cancellations, and over 150 completed trips per month. Includes comprehensive accidental health cover and instant same-day settlement.
            </p>
          </div>
        </section>

        {/* SECTION 7: INTERACTIVE FAQ */}
        <section className="fb-section fb-faq-wrap" aria-labelledby="faq" id="faq">
          <header className="fb-head" data-fb-reveal="true">
            <p className="fb-kicker">Questions</p>
            <h2 className="fb-h2" id="faq">
              Good <span className="fb-brush">questions.</span>
            </h2>
            <p className="fb-lead">
              The things passengers and drivers ask us most. Tap any question to open it.
            </p>
          </header>

          <div className="fb-faq" data-fb-reveal="true">
            <details className="fb-faq-item" name="fb-faq">
              <summary>
                <span aria-hidden="true" className="fb-faq-n">
                  01
                </span>
                <span className="fb-faq-q">How is RushRide different from Uber or legacy apps?</span>
                <span aria-hidden="true" className="fb-faq-icon"></span>
              </summary>
              <div className="fb-faq-a">
                RushRide eliminates arbitrary 3x surge pricing, pays driver partners 82% direct revenue share (the highest in the mobility sector), and features an instant browser-based simulation engine with real-time GPS tracking.
              </div>
            </details>

            <details className="fb-faq-item" name="fb-faq">
              <summary>
                <span aria-hidden="true" className="fb-faq-n">
                  02
                </span>
                <span className="fb-faq-q">How does the Zero Surge Pricing guarantee work?</span>
                <span aria-hidden="true" className="fb-faq-icon"></span>
              </summary>
              <div className="fb-faq-a">
                When demand spikes during rain or rush hours, RushRide rebalances driver capacity using intelligent mesh routing instead of price gouging passengers. The fare quoted at the time of booking is the exact fare charged upon dropoff.
              </div>
            </details>

            <details className="fb-faq-item" name="fb-faq">
              <summary>
                <span aria-hidden="true" className="fb-faq-n">
                  03
                </span>
                <span className="fb-faq-q">What safety features are active during my trip?</span>
                <span aria-hidden="true" className="fb-faq-icon"></span>
              </summary>
              <div className="fb-faq-a">
                Every trip includes an encrypted 4-digit start OTP, 24/7 telematics route deviation alarms, masked phone relays, one-tap emergency link sharing with family, and a direct roadside SOS hotline.
              </div>
            </details>

            <details className="fb-faq-item" name="fb-faq">
              <summary>
                <span aria-hidden="true" className="fb-faq-n">
                  04
                </span>
                <span className="fb-faq-q">Can I book a ride ahead of time for early airport flights?</span>
                <span aria-hidden="true" className="fb-faq-icon"></span>
              </summary>
              <div className="fb-faq-a">
                Yes! You can reserve rides up to 7 days in advance. Our dispatch protocol reserves a dedicated Gold or Diamond driver 30 minutes prior to your scheduled pickup time with guaranteed arrival.
              </div>
            </details>

            <details className="fb-faq-item" name="fb-faq">
              <summary>
                <span aria-hidden="true" className="fb-faq-n">
                  05
                </span>
                <span className="fb-faq-q">How do driver payouts work and when do I get paid?</span>
                <span aria-hidden="true" className="fb-faq-icon"></span>
              </summary>
              <div className="fb-faq-a">
                Driver partners enjoy instant daily UPI cashouts. At the conclusion of your shift, tap 'Withdraw Payout' in the Driver Console and your funds land in your verified bank account in under 60 seconds.
              </div>
            </details>

            <details className="fb-faq-item" name="fb-faq">
              <summary>
                <span aria-hidden="true" className="fb-faq-n">
                  06
                </span>
                <span className="fb-faq-q">What payment methods can I use?</span>
                <span aria-hidden="true" className="fb-faq-icon"></span>
              </summary>
              <div className="fb-faq-a">
                We accept all major UPI applications (Google Pay, PhonePe, Paytm), RuPay/Visa/Mastercard debit and credit cards, net banking, prepaid digital wallets, and physical cash upon trip completion.
              </div>
            </details>

            <details className="fb-faq-item" name="fb-faq">
              <summary>
                <span aria-hidden="true" className="fb-faq-n">
                  07
                </span>
                <span className="fb-faq-q">Can I test both Rider and Driver modes?</span>
                <span aria-hidden="true" className="fb-faq-icon"></span>
              </summary>
              <div className="fb-faq-a">
                RushRide provides a streamlined customer experience featuring instant automated driver matching, route tracking, and fair pricing without the hassle of account or ID switching.
              </div>
            </details>

            <details className="fb-faq-item" name="fb-faq">
              <summary>
                <span aria-hidden="true" className="fb-faq-n">
                  08
                </span>
                <span className="fb-faq-q">What documents are required to drive with RushRide?</span>
                <span aria-hidden="true" className="fb-faq-icon"></span>
              </summary>
              <div className="fb-faq-a">
                You will need a valid Commercial Driving License, vehicle Registration Certificate (RC), active vehicle insurance policy, and fitness certificate. Onboarding takes less than 24 hours.
              </div>
            </details>
          </div>
        </section>

        {/* SECTION 8: STUCK? ASK US */}
        <section className="fb-section fb-help" aria-labelledby="help">
          <div className="fb-help-card" data-fb-reveal="true">
            <svg aria-hidden="true" className="fb-arrow fb-help-arrow" focusable="false" viewBox="0 0 120 80">
              <path d="M8 70 L70 22" fill="none" stroke="currentColor" strokeDasharray="10 9" strokeLinecap="round" strokeWidth="5" />
              <path d="M18 78 L58 47" fill="none" opacity=".7" stroke="currentColor" strokeDasharray="6 10" strokeLinecap="round" strokeWidth="4" />
              <path d="M66 8 L108 6 L94 46 Z" fill="currentColor" />
            </svg>

            <h2 className="fb-h2" id="help">
              Stuck? <span className="fb-brush">Ask us.</span>
            </h2>
            <p>Real dispatch operators, happy to help. No question is too basic.</p>

            <div className="fb-ctas fb-ctas-center">
              <Link to="/help" className="fb-btn fb-btn-lime">
                Contact & Support Desk
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/rider/dashboard" className="fb-btn fb-btn-ink">
                Customer Dashboard
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 9: MASSIVE FINAL CTA */}
        <section className="fb-final" id="fb-final" aria-labelledby="fb-final-title">
          <svg aria-hidden="true" className="fb-speed fb-final-speed fb-final-speed-l" focusable="false" viewBox="0 0 160 60">
            <path d="M4 52 L70 14 M30 58 L104 16 M70 56 L130 22" fill="none" stroke="currentColor" strokeDasharray="22 10" strokeLinecap="round" strokeWidth="5" />
            <path d="M128 4 L156 8 L140 30 Z" fill="currentColor" />
          </svg>
          <svg aria-hidden="true" className="fb-speed fb-final-speed fb-final-speed-r" focusable="false" viewBox="0 0 160 60">
            <path d="M4 52 L70 14 M30 58 L104 16 M70 56 L130 22" fill="none" stroke="currentColor" strokeDasharray="22 10" strokeLinecap="round" strokeWidth="5" />
            <path d="M128 4 L156 8 L140 30 Z" fill="currentColor" />
          </svg>

          <div className="fb-final-inner" data-fb-reveal="true">
            <p className="fb-final-kicker">6 Ride Tiers · 3-Min Average Pickup · Zero Surge Guarantee</p>

            <h2 className="fb-final-big" id="fb-final-title">
              <span>Ready to ride?</span>
              <span className="fb-final-brush">Let's roll.</span>
            </h2>

            <div className="fb-final-count">
              <span className="fb-final-count-label">Fleet Operations Ready:</span>
              <div className="fb-mini-keys fb-mini-keys-lg">
                <span className="fb-mini-key">
                  <span className="fb-mini-num">1.4k</span>
                  Active Cabs
                </span>
                <span className="fb-mini-key">
                  <span className="fb-mini-num">2.4m</span>
                  Avg Arrival
                </span>
                <span className="fb-mini-key fb-mini-key-seconds">
                  <span className="fb-mini-num">99.8%</span>
                  Fulfill
                </span>
              </div>
            </div>

            <div className="fb-ctas fb-ctas-center">
              <Link to="/rider/book" className="fb-btn fb-btn-lime">
                Launch Rider Console
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/rider/dashboard" className="fb-btn fb-btn-ink">
                Customer Portal
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="fb-foot">
        <div className="fb-foot-inner">
          <Link to="/" className="fb-logo fb-foot-logo">
            <div className="w-7 h-7 rounded-full bg-[#d8fc38] border-2 border-[#0b0630] flex items-center justify-center text-[#0b0630] font-black">
              <Zap size={15} fill="#0b0630" />
            </div>
            <span>rushride</span>
          </Link>

          <p className="fb-foot-links">
            <Link to="/rider/dashboard">Customer Console</Link>
            <Link to="/rider/book">Book a Ride</Link>
            <Link to="/rider/trips">My Trips</Link>
            <Link to="/help">Support & Contact</Link>
            <a href="#perks">Perks</a>
            <a href="#classes">Vehicle Tiers</a>
          </p>

          <div className="text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1450] text-[#d8fc38] text-[11px] font-neo-mono border border-white/10 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Telematics Mesh Operational · 99.99% Uptime
            </div>
            <p className="text-xs text-[#e6e3ff]/60 font-neo-grotesk">
              © 2026 RushRide Mobility Inc. Styled with high-contrast electric neo-brutalism.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
