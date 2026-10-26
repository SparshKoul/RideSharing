import React from 'react';
import { Star, ShieldCheck, Phone, Award } from 'lucide-react';

export default function DriverCard({ driver, compact = false }) {
  if (!driver) return null;

  return (
    <div className="bg-white text-[#08071E] rounded-2xl border-2 border-[#08071E] p-4 sm:p-5 shadow-[4px_4px_0_#08071E]">
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-[#08071E] shadow-[2px_2px_0_#3B38F5]"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#D4FF00] text-[#08071E] p-0.5 rounded-md border border-[#08071E]">
              <ShieldCheck size={12} strokeWidth={2.5} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-neo-heading text-base sm:text-lg font-black uppercase text-[#08071E]">
                {driver.name}
              </h4>
              <span className="font-neo-mono text-[9.5px] font-black uppercase px-1.5 py-0.5 bg-[#edf0ff] text-[#3B38F5] rounded border border-[#3B38F5]/30">
                PRO
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5 text-xs font-neo-grotesk font-semibold text-neutral-600">
              <span className="flex items-center gap-1 text-[#08071E] font-black">
                <Star size={13} fill="#08071E" />
                <span>{driver.rating}</span>
              </span>
              <span>•</span>
              <span>{driver.tripsCompleted}+ trips</span>
            </div>

            <div className="mt-1 font-neo-mono text-[10.5px] text-neutral-500 font-bold uppercase">
              {driver.yearsExperience || 'Experienced Driver'}
            </div>
          </div>
        </div>

        {/* Action / Phone */}
        <a
          href={`tel:${driver.phone}`}
          onClick={(e) => {
            e.preventDefault();
            alert(`Simulated call to ${driver.name} at ${driver.phone}`);
          }}
          className="p-2.5 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] shadow-[2px_2px_0_#08071E] transition-all hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
          title="Call Driver (Demo)"
        >
          <Phone size={16} />
        </a>
      </div>

      {/* Vehicle details */}
      {driver.vehicle && !compact && (
        <div className="mt-4 pt-3.5 border-t border-neutral-200 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-neo-mono font-bold text-neutral-400 uppercase tracking-wider">
              Vehicle Model
            </div>
            <div className="text-xs sm:text-sm font-neo-heading font-black text-[#08071E] uppercase">
              {driver.vehicle.model}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-neo-mono font-bold text-neutral-400 uppercase tracking-wider">
              Plate Number
            </div>
            <div className="inline-block px-2 py-0.5 rounded bg-[#08071E] text-[#D4FF00] font-neo-mono text-xs font-black tracking-widest border border-[#08071E]">
              {driver.vehicle.plateNumber}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
