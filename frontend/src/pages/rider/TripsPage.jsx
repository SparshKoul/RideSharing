import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Filter, ArrowRight, Car, Calendar, Navigation } from 'lucide-react';
import { useRide } from '../../hooks/useRide';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../../utils/formatters';

export default function TripsPage() {
  const navigate = useNavigate();
  const { rides } = useRide();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'cancelled'

  const filteredTrips = rides.filter((trip) => {
    if (filterStatus === 'all') return true;
    return trip.status === filterStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-bold uppercase tracking-wider mb-2">
            <Clock size={12} className="text-[#D4FF00]" />
            <span>COMMUTE HISTORY</span>
          </div>
          <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            MY TRIPS LOG
          </h1>
          <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
            Browse all past simulated rides, receipt breakdowns, and route paths.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#121033] border border-white/15">
          {['all', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-neo-heading text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#D4FF00] text-[#08071E] shadow-[2px_2px_0_#08071E]'
                  : 'text-[#A5A1CE] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Trips List */}
      {filteredTrips.length > 0 ? (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => navigate(`/rider/trips/${trip.id}`)}
              className="bg-[#121033] hover:bg-[#16143c] rounded-3xl border-2 border-white/15 hover:border-[#D4FF00]/40 p-5 sm:p-6 shadow-[5px_5px_0_#08071E] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left details */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#08071E] border-2 border-white/20 text-[#D4FF00] flex items-center justify-center shrink-0 font-bold">
                  <Car size={22} />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-neo-mono text-xs font-black uppercase text-[#A5A1CE]">
                      {trip.id}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="font-neo-mono text-xs font-bold text-[#D4FF00] uppercase">
                      {trip.category?.name || 'Ride'}
                    </span>
                    <StatusBadge status={trip.status} />
                  </div>

                  {/* Route */}
                  <div className="font-neo-heading text-base sm:text-lg font-black uppercase text-white leading-snug">
                    {trip.destination?.name}
                  </div>
                  <div className="font-neo-grotesk text-xs text-[#A5A1CE] mt-0.5">
                    Picked up at {trip.pickup?.name} • {formatDateTime(trip.createdAt)}
                  </div>
                </div>
              </div>

              {/* Right Fare and metrics */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="text-left md:text-right">
                  <div className="font-neo-heading text-xl sm:text-2xl font-black text-white leading-none">
                    {formatCurrency(trip.finalFare || trip.estimatedFare)}
                  </div>
                  <div className="font-neo-mono text-[10px] text-[#A5A1CE] uppercase mt-1">
                    {formatDistance(trip.distanceKm)} • {formatDuration(trip.durationMins)} • {trip.paymentMethod}
                  </div>
                </div>

                <div className="w-9 h-9 rounded-xl border border-white/20 bg-white/5 flex items-center justify-center text-white shrink-0">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Trips Found"
          description={`There are currently no ${filterStatus !== 'all' ? filterStatus : ''} trips in your session history.`}
          actionLabel="Book a Ride Now"
          onAction={() => navigate('/rider/book')}
          icon={Navigation}
        />
      )}
    </div>
  );
}
