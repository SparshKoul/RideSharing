import React from 'react';
import { MapPin, Navigation, Clock, ShieldCheck, ArrowRight, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../utils/formatters';

export default function RideCard({
  ride,
  onAccept,
  onReject,
  onTrack,
  isDriverView = false,
}) {
  if (!ride) return null;

  return (
    <div className="bg-[#121033] rounded-2xl border-2 border-white/15 p-5 shadow-[4px_4px_0_#08071E] hover:border-[#D4FF00]/40 transition-all flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-neo-mono text-xs font-black uppercase text-[#A5A1CE] tracking-wider">
              {ride.id}
            </span>
            <span className="text-white/20">•</span>
            <span className="font-neo-mono text-[11px] font-bold text-[#D4FF00] uppercase">
              {ride.category?.name || 'Ride'}
            </span>
          </div>

          <StatusBadge status={ride.status} />
        </div>

        {/* Route Details */}
        <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/15 mb-4">
          {/* Pickup */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#3B38F5] border-2 border-[#08071E]" />
            <div className="font-neo-heading text-xs font-black uppercase text-white truncate">
              {ride.pickup?.name}
            </div>
            <div className="font-neo-grotesk text-[11px] text-[#A5A1CE] truncate">
              {ride.pickup?.address}
            </div>
          </div>

          {/* Destination */}
          <div className="relative">
            <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#D4FF00] border-2 border-[#08071E]" />
            <div className="font-neo-heading text-xs font-black uppercase text-white truncate">
              {ride.destination?.name}
            </div>
            <div className="font-neo-grotesk text-[11px] text-[#A5A1CE] truncate">
              {ride.destination?.address}
            </div>
          </div>
        </div>

        {/* Rider / Driver Info snippet */}
        {isDriverView && ride.riderName && (
          <div className="p-2.5 rounded-xl bg-[#08071E] border border-white/10 flex items-center justify-between mb-4 text-xs font-neo-grotesk">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#3B38F5] text-white flex items-center justify-center font-bold text-[10px]">
                <User size={12} />
              </div>
              <span className="text-white font-bold">{ride.riderName}</span>
            </div>
            <span className="font-neo-mono text-[10px] text-[#D4FF00] font-bold">
              ★ {ride.riderRating || '4.9'}
            </span>
          </div>
        )}
      </div>

      {/* Metrics & Actions */}
      <div className="pt-3.5 border-t border-white/10 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-xs font-neo-grotesk text-[#A5A1CE]">
            <span>{formatDistance(ride.distanceKm)}</span>
            <span>•</span>
            <span>{formatDuration(ride.durationMins)}</span>
            <span>•</span>
            <span className="uppercase font-neo-mono text-[10px] text-[#D4FF00]">{ride.paymentMethod}</span>
          </div>

          {/* Amount */}
          <div className="text-right">
            <div className="font-neo-heading text-xl font-black text-white leading-none">
              {isDriverView
                ? formatCurrency(ride.driverEarnings || ride.estimatedFare * 0.82)
                : formatCurrency(ride.finalFare || ride.estimatedFare)}
            </div>
            <div className="font-neo-mono text-[9px] uppercase text-[#A5A1CE] font-bold mt-0.5">
              {isDriverView ? 'YOUR PAYOUT' : 'EST. FARE'}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {isDriverView && ride.status === 'searching' && onAccept && (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onReject && onReject(ride.id)}
              className="px-3 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-neo-heading text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => onAccept(ride.id)}
              className="px-3 py-2.5 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_#3B38F5] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Accept Ride
            </button>
          </div>
        )}

        {onTrack && (
          <button
            type="button"
            onClick={() => onTrack(ride.id)}
            className="w-full px-4 py-2.5 rounded-xl border-2 border-[#08071E] bg-[#3B38F5] hover:bg-[#2f2cd1] text-white font-neo-heading text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_#D4FF00] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span>Track Trip Details</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
