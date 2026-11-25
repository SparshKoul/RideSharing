import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navigation,
  MapPin,
  ArrowRight,
  ArrowUpDown,
  Car,
  Clock,
  DollarSign,
  Activity,
  Bookmark,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import MapPanel from '../../components/MapPanel';
import LocationInput from '../../components/LocationInput';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../../utils/formatters';

export default function RiderDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    activeRide,
    completedTrips,
    cancelledTrips,
    riderTotalSpent,
    riderCompletedTripsCount,
    bookingDraft,
    updateBookingDraft,
    swapPickupAndDestination,
  } = useRide();

  const recentTrips = [...completedTrips, ...cancelledTrips]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  const handleFindRide = () => {
    navigate('/rider/book');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#121033] border-2 border-white/15 shadow-[5px_5px_0_#08071E]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={11} />
            <span>CAMPUS & CITY COMMUTE</span>
          </div>
          <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            HELLO, {currentUser?.name?.split(' ')[0] || 'COMMUTER'} ⚡
          </h1>
          <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE] mt-1">
            Where are we heading today? Compare vehicle categories and book instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/rider/book"
            className="px-6 py-3.5 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
          >
            <Navigation size={15} />
            <span>Book New Ride</span>
            <ArrowRight size={15} strokeWidth={3} />
          </Link>
        </div>
      </div>

      {/* Active Ride Banner (If in progress) */}
      {activeRide && (
        <div className="p-6 rounded-3xl bg-white text-[#08071E] border-3 border-[#08071E] shadow-[6px_6px_0_#3B38F5] flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-top-3">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#D4FF00] border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] flex items-center justify-center shrink-0">
              <Activity size={24} className="text-[#08071E] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-neo-mono text-xs font-black uppercase tracking-wider text-neutral-500">
                  {activeRide.id}
                </span>
                <StatusBadge status={activeRide.status} size="sm" />
              </div>
              <h3 className="font-neo-heading text-lg sm:text-xl font-black uppercase text-[#08071E] leading-tight">
                Trip to {activeRide.destination?.name}
              </h3>
              <p className="font-neo-grotesk text-xs text-neutral-600 mt-0.5">
                {activeRide.assignedDriver
                  ? `Assigned: ${activeRide.assignedDriver.name} (${activeRide.assignedDriver.vehicle?.model})`
                  : 'Matching with nearby demo drivers...'}
              </p>
            </div>
          </div>

          <Link
            to={`/rider/ride/${activeRide.id}`}
            className="px-6 py-3 rounded-xl border-2 border-[#08071E] bg-[#08071E] hover:bg-[#1b1248] text-[#D4FF00] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
          >
            <span>Track Live Ride</span>
            <ArrowRight size={15} strokeWidth={3} />
          </Link>
        </div>
      )}

      {/* Quick Booking Grid & Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Booking Panel */}
        <div className="lg:col-span-5 bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E] space-y-5">
          <div className="flex items-center justify-between">
            <span className="font-neo-heading text-sm sm:text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Navigation size={16} className="text-[#D4FF00]" />
              <span>Quick Ride Dispatch</span>
            </span>
            <button
              type="button"
              onClick={swapPickupAndDestination}
              className="p-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-[#D4FF00] transition-colors cursor-pointer"
              title="Swap Locations"
            >
              <ArrowUpDown size={15} />
            </button>
          </div>

          <div className="space-y-4">
            <LocationInput
              label="Pickup Location"
              value={bookingDraft.pickup}
              onChange={(loc) => updateBookingDraft({ pickup: loc })}
              isPickup={true}
            />

            <LocationInput
              label="Destination"
              value={bookingDraft.destination}
              onChange={(loc) => updateBookingDraft({ destination: loc })}
              isPickup={false}
            />
          </div>

          {/* Saved Places Shortcuts */}
          <div>
            <span className="block font-neo-mono text-[10.5px] font-bold text-[#A5A1CE] uppercase tracking-wider mb-2">
              Favorite Shortcuts
            </span>
            <div className="flex flex-wrap gap-2">
              {currentUser?.savedPlaces?.map((place) => (
                <button
                  key={place.id}
                  type="button"
                  onClick={() => {
                    const foundLoc = bookingDraft.destination;
                    navigate('/rider/book');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-white/15 bg-[#08071E] hover:border-[#D4FF00] text-xs font-neo-grotesk font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Bookmark size={12} className="text-[#D4FF00]" />
                  <span>{place.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Route Metrics Preview */}
          <div className="p-4 rounded-2xl bg-[#08071E] border border-white/10 flex items-center justify-between text-xs font-neo-grotesk">
            <div>
              <span className="text-[#A5A1CE] font-neo-mono text-[10px] uppercase block">Estimated Distance</span>
              <span className="font-bold text-white text-sm">{formatDistance(bookingDraft.distanceKm)}</span>
            </div>
            <div>
              <span className="text-[#A5A1CE] font-neo-mono text-[10px] uppercase block">Est. Duration</span>
              <span className="font-bold text-white text-sm">{formatDuration(bookingDraft.durationMins)}</span>
            </div>
            <div>
              <span className="text-[#A5A1CE] font-neo-mono text-[10px] uppercase block">Starting From</span>
              <span className="font-black text-[#D4FF00] text-base">{formatCurrency(bookingDraft.estimatedFare)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFindRide}
            className="w-full py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
          >
            <span>Compare Fares & Choose Vehicle</span>
            <ArrowRight size={15} strokeWidth={3} />
          </button>
        </div>

        {/* Map Preview */}
        <div className="lg:col-span-7">
          <MapPanel
            pickup={bookingDraft.pickup}
            destination={bookingDraft.destination}
            height="h-96 sm:h-[420px]"
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Rides"
          value={completedTrips.length + cancelledTrips.length + (currentUser?.totalRides || 0)}
          subtitle="Simulated Commutes"
          icon={Car}
          color="lime"
        />
        <StatCard
          title="Completed Trips"
          value={riderCompletedTripsCount + (currentUser?.totalRides || 0)}
          subtitle="Safe arrivals"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Cancelled Trips"
          value={cancelledTrips.length}
          subtitle="Zero penalty fees"
          icon={Clock}
          color="navy"
        />
        <StatCard
          title="Total Spending"
          value={formatCurrency(riderTotalSpent + (currentUser?.totalSpent || 0))}
          subtitle="Mock fare transactions"
          icon={DollarSign}
          color="lime"
        />
      </div>

      {/* Recent Trips Table */}
      <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-neo-heading text-lg sm:text-xl font-black uppercase text-white tracking-tight">
              Recent Trips History
            </h3>
            <p className="font-neo-grotesk text-xs text-[#A5A1CE]">
              Latest simulated bookings from your browser session.
            </p>
          </div>
          <Link
            to="/rider/trips"
            className="font-neo-mono text-xs font-bold text-[#D4FF00] hover:underline uppercase flex items-center gap-1"
          >
            <span>View All Trips</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentTrips.length > 0 ? (
          <div className="divide-y divide-white/10">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => navigate(`/rider/trips/${trip.id}`)}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 px-3 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#08071E] border border-white/15 flex items-center justify-center text-[#D4FF00] shrink-0 font-bold text-xs">
                    {trip.category?.name?.[0] || 'R'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-neo-heading text-sm font-black uppercase text-white truncate max-w-xs">
                        {trip.destination?.name}
                      </span>
                      <StatusBadge status={trip.status} />
                    </div>
                    <div className="font-neo-grotesk text-xs text-[#A5A1CE] mt-0.5">
                      From: {trip.pickup?.name} • {formatDateTime(trip.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="font-neo-heading text-base font-black text-white">
                      {formatCurrency(trip.finalFare || trip.estimatedFare)}
                    </div>
                    <div className="font-neo-mono text-[9px] text-[#A5A1CE] uppercase font-bold">
                      {trip.paymentMethod}
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-neutral-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center font-neo-grotesk text-sm text-[#A5A1CE]">
            No completed rides yet. Book your first ride to see it here!
          </div>
        )}
      </div>
    </div>
  );
}
