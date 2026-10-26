import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Clock,
  Car,
  DollarSign,
  Users,
  Compass,
  Check,
} from 'lucide-react';
import { MOCK_LOCATIONS } from '../../data/locations';
import { RIDE_CATEGORIES } from '../../data/rideCategories';
import { getRouteMetrics, calculateFare } from '../../utils/fareCalculator';
import { formatCurrency, formatDistance, formatDuration } from '../../utils/formatters';

export default function LandingPage() {
  const [selectedPickup, setSelectedPickup] = useState(MOCK_LOCATIONS[0]);
  const [selectedDest, setSelectedDest] = useState(MOCK_LOCATIONS[3]);
  const [selectedCategory, setSelectedCategory] = useState(RIDE_CATEGORIES[0]);

  const metrics = getRouteMetrics(selectedPickup.id, selectedDest.id);
  const estimatedFare = calculateFare(selectedCategory, metrics.distanceKm, metrics.durationMins);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-[#3B38F5]/15 rounded-full blur-[140px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-6 shadow-[2px_2px_0_#08071E]">
            <Sparkles size={13} className="text-[#D4FF00]" />
            <span>NEO-BRUTALIST RIDE-SHARING PLATFORM</span>
          </div>

          {/* Heading */}
          <h1 className="font-neo-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[0.95] max-w-5xl mb-6">
            BEYOND TRAFFIC <br />
            INTO{' '}
            <span className="inline-block px-4 py-1 bg-[#D4FF00] text-[#08071E] rounded-xl border-3 border-[#08071E] shadow-[5px_5px_0_#3B38F5] rotate-[-1deg]">
              HIGH-VOLTAGE FLOW
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#A5A1CE] font-neo-grotesk text-base sm:text-xl max-w-2xl leading-relaxed mb-10">
            A dual-console ride-sharing experience designed for passengers and drivers. Interactive route maps, live lifecycle tracking, and simulated dispatch — running 100% on the frontend.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0_#3B38F5] hover:shadow-[5px_5px_0_#3B38F5] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Zap size={18} fill="#08071E" />
              <span>Launch Demo Console</span>
              <ArrowRight size={18} strokeWidth={3} />
            </Link>

            <Link
              to="/rider/book"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-white/20 bg-[#121033] hover:bg-[#1b184a] text-white font-neo-heading text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#08071E] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <span>Instant Fare Estimator</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Fare Estimator Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y-2 border-[#0B0630] bg-[#0A0924]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[11px] font-bold uppercase tracking-wider mb-3">
              <span>LIVE DEMO</span>
            </div>
            <h2 className="font-neo-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              DETERMINISTIC FARE CALCULATOR
            </h2>
            <p className="font-neo-grotesk text-sm sm:text-base text-[#A5A1CE] mt-2">
              Select sample campus transit points to preview deterministic route distance, duration, and fares.
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-6 sm:p-8 shadow-[8px_8px_0_#08071E] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-500 tracking-wider mb-1.5">
                  Sample Pickup
                </label>
                <select
                  value={selectedPickup.id}
                  onChange={(e) => setSelectedPickup(MOCK_LOCATIONS.find((l) => l.id === e.target.value))}
                  className="w-full bg-[#F5F6FF] border-2 border-[#08071E] rounded-xl px-4 py-3 font-neo-heading text-sm font-black uppercase text-[#08071E] shadow-[2px_2px_0_#08071E] focus:outline-none"
                >
                  {MOCK_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.tag})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-500 tracking-wider mb-1.5">
                  Sample Destination
                </label>
                <select
                  value={selectedDest.id}
                  onChange={(e) => setSelectedDest(MOCK_LOCATIONS.find((l) => l.id === e.target.value))}
                  className="w-full bg-[#F5F6FF] border-2 border-[#08071E] rounded-xl px-4 py-3 font-neo-heading text-sm font-black uppercase text-[#08071E] shadow-[2px_2px_0_#08071E] focus:outline-none"
                >
                  {MOCK_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.tag})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Pills */}
              <div>
                <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-500 tracking-wider mb-2">
                  Ride Category
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {RIDE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`p-3 rounded-xl border-2 font-neo-heading text-xs font-black uppercase transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#08071E] text-[#D4FF00] border-[#08071E] shadow-[3px_3px_0_#3B38F5]'
                            : 'bg-neutral-100 text-[#08071E] border-neutral-300 hover:border-[#08071E]'
                        }`}
                      >
                        <div>{cat.name}</div>
                        <div className="text-[10px] font-neo-mono text-neutral-400 mt-0.5">
                          {cat.capacity} seats
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Result Display */}
            <div className="lg:col-span-5 bg-[#08071E] text-white rounded-2xl p-6 border-2 border-[#08071E] shadow-[4px_4px_0_#3B38F5] flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-neo-mono text-[10px] font-bold text-[#D4FF00] uppercase tracking-wider">
                    Formula Estimate
                  </span>
                  <span className="font-neo-mono text-[10px] text-neutral-400 uppercase">
                    Deterministic
                  </span>
                </div>

                <div className="font-neo-heading text-4xl sm:text-5xl font-black text-[#D4FF00] leading-none mb-1">
                  {formatCurrency(estimatedFare)}
                </div>
                <div className="font-neo-grotesk text-xs text-[#A5A1CE] mb-6">
                  Base ₹{selectedCategory.baseFare} + (₹{selectedCategory.ratePerKm}/km) + (₹{selectedCategory.ratePerMin}/min)
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 mb-6">
                  <div>
                    <div className="font-neo-mono text-[10px] text-neutral-400 uppercase">Route Distance</div>
                    <div className="font-neo-heading text-base font-black text-white">
                      {formatDistance(metrics.distanceKm)}
                    </div>
                  </div>
                  <div>
                    <div className="font-neo-mono text-[10px] text-neutral-400 uppercase">Est. Duration</div>
                    <div className="font-neo-heading text-base font-black text-white">
                      {formatDuration(metrics.durationMins)}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/rider/book"
                className="w-full py-3.5 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_#08071E] transition-all cursor-pointer"
              >
                <span>Book This Route Now</span>
                <ArrowRight size={15} strokeWidth={3} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role Dual-Experience Cards (Styled directly like WYD) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[11px] font-bold uppercase tracking-wider mb-3">
            <span>CHOOSE YOUR SIDE</span>
          </div>
          <h2 className="font-neo-heading text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            TWO DEDICATED EXPERIENCES
          </h2>
          <p className="font-neo-grotesk text-sm sm:text-base text-[#A5A1CE] mt-2">
            Rider and Driver roles share the exact same underlying simulated dispatch engine in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 01: Rider */}
          <div className="relative flex flex-col bg-white text-[#08071E] rounded-[28px] border-[2.5px] border-[#08071E] shadow-[6px_6px_0_#08071E] hover:shadow-[8px_8px_0_#3B38F5] transition-all duration-200 p-7 sm:p-9 overflow-hidden">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#D4FF00] border-2 border-[#08071E] shadow-[3px_3px_0_#08071E] flex items-center justify-center">
                <Navigation size={28} className="text-[#08071E]" strokeWidth={2.5} />
              </div>
              <span
                className="font-neo-heading text-6xl sm:text-7xl font-black leading-none select-none tracking-tight text-transparent"
                style={{ WebkitTextStroke: '2px #b8c0f5' }}
              >
                01
              </span>
            </div>

            <h3 className="font-neo-heading text-2xl sm:text-3xl font-black uppercase text-[#08071E] tracking-tight">
              RIDE WITH RIDEFLOW
            </h3>
            <p className="text-[#3B38F5] text-base font-neo-grotesk font-bold leading-snug mt-2.5 mb-6">
              Find rides, compare fares across 3 vehicle categories, and track trips live.
            </p>

            <div className="space-y-3 flex-1 mb-8">
              {[
                'Instant deterministic fare calculations with zero hidden fees.',
                'Real-time ride lifecycle timeline: Searching, Arriving, In-Progress.',
                'Save frequent college dorms, malls, and railway station favorites.',
                'Flexible simulated payment choices: Cash, UPI, or Cards.',
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#edf0ff]/80 rounded-2xl p-4 border border-[#3B38F5]/10">
                  <ArrowRight size={16} strokeWidth={3} className="text-[#3B38F5] shrink-0 mt-0.5" />
                  <span className="font-neo-grotesk text-sm font-medium text-[#08071E]">{feat}</span>
                </div>
              ))}
            </div>

            <Link
              to="/auth/rider/login"
              className="w-full py-3.5 rounded-xl border-2 border-[#08071E] bg-[#08071E] hover:bg-[#1b1248] text-[#D4FF00] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
            >
              <span>Continue as Rider</span>
              <ArrowRight size={15} strokeWidth={3} />
            </Link>
          </div>

          {/* Card 02: Driver */}
          <div className="relative flex flex-col bg-white text-[#08071E] rounded-[28px] border-[2.5px] border-[#08071E] shadow-[6px_6px_0_#08071E] hover:shadow-[8px_8px_0_#3B38F5] transition-all duration-200 p-7 sm:p-9 overflow-hidden">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#08071E] border-2 border-[#08071E] shadow-[3px_3px_0_#3B38F5] flex items-center justify-center">
                <Car size={26} className="text-[#D4FF00]" strokeWidth={2.5} />
              </div>
              <span
                className="font-neo-heading text-6xl sm:text-7xl font-black leading-none select-none tracking-tight text-transparent"
                style={{ WebkitTextStroke: '2px #b8c0f5' }}
              >
                02
              </span>
            </div>

            <h3 className="font-neo-heading text-2xl sm:text-3xl font-black uppercase text-[#08071E] tracking-tight">
              DRIVE WITH RIDEFLOW
            </h3>
            <p className="text-[#3B38F5] text-base font-neo-grotesk font-bold leading-snug mt-2.5 mb-6">
              Toggle availability online, accept incoming ride requests, and log simulated earnings.
            </p>

            <div className="space-y-3 flex-1 mb-8">
              {[
                'Prominent Online / Offline toggle with instant request queue pause.',
                'Accept or reject incoming passenger bookings with immediate state sync.',
                'Sequential trip management: Mark Arriving → Start Trip → Complete.',
                'Recharts-powered daily & weekly earnings breakdown with 82% payout.',
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#edf0ff]/80 rounded-2xl p-4 border border-[#3B38F5]/10">
                  <ArrowRight size={16} strokeWidth={3} className="text-[#3B38F5] shrink-0 mt-0.5" />
                  <span className="font-neo-grotesk text-sm font-medium text-[#08071E]">{feat}</span>
                </div>
              ))}
            </div>

            <Link
              to="/auth/driver/login"
              className="w-full py-3.5 rounded-xl border-2 border-[#08071E] bg-[#3B38F5] hover:bg-[#2e2bbd] text-white font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#08071E] transition-all cursor-pointer"
            >
              <span>Continue as Driver</span>
              <ArrowRight size={15} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
