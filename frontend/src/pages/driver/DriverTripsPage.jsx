import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Car, ArrowRight, DollarSign } from 'lucide-react';
import { useRide } from '../../hooks/useRide';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../../utils/formatters';

export default function DriverTripsPage() {
  const navigate = useNavigate();
  const { rides } = useRide();
  const [filterStatus, setFilterStatus] = useState('all');

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
            <span>DRIVER LOGBOOK</span>
          </div>
          <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            DRIVER TRIP HISTORY
          </h1>
          <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
            Review all completed dispatches, distance logs, and simulated earnings.
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
                  ? 'bg-[#3B38F5] text-white shadow-[2px_2px_0_#D4FF00]'
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
              onClick={() => navigate(`/driver/trip/${trip.id}`)}
              className="bg-[#121033] hover:bg-[#16143c] rounded-3xl border-2 border-white/15 hover:border-[#D4FF00]/40 p-5 sm:p-6 shadow-[5px_5px_0_#08071E] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
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

                  <div className="font-neo-heading text-base sm:text-lg font-black uppercase text-white leading-snug">
                    {trip.destination?.name}
                  </div>
                  <div className="font-neo-grotesk text-xs text-[#A5A1CE] mt-0.5">
                    Passenger: {trip.riderName || 'Aryan'} • {formatDateTime(trip.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="text-left md:text-right">
                  <div className="font-neo-heading text-xl sm:text-2xl font-black text-[#D4FF00] leading-none">
                    {formatCurrency(trip.driverEarnings || (trip.finalFare || trip.estimatedFare) * 0.82)}
                  </div>
                  <div className="font-neo-mono text-[9px] text-[#A5A1CE] uppercase mt-1">
                    {formatDistance(trip.distanceKm)} • Payout: 82%
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
          title="No Trips In Logbook"
          description="There are currently no records matching this filter."
          icon={Car}
        />
      )}
    </div>
  );
}
