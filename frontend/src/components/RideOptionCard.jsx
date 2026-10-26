import React from 'react';
import { Users, Clock, Sparkles, Check, Car } from 'lucide-react';
import { formatCurrency, formatDuration } from '../utils/formatters';

export default function RideOptionCard({
  category,
  isSelected,
  onSelect,
}) {
  const getIcon = () => {
    if (category.id === 'comfort') {
      return <Sparkles size={20} className="text-[#3B38F5]" />;
    }
    if (category.id === 'xl') {
      return <Users size={20} className="text-[#FF6B00]" />;
    }
    return <Car size={20} className="text-[#08071E]" />;
  };

  return (
    <div
      onClick={onSelect}
      className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
        isSelected
          ? 'bg-white text-[#08071E] border-[#08071E] shadow-[5px_5px_0_#3B38F5]'
          : 'bg-[#121033] text-white border-white/15 hover:border-white/30 shadow-[3px_3px_0_#08071E]'
      }`}
    >
      {/* Top category row */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl border-2 border-[#08071E] flex items-center justify-center shrink-0 ${
                category.id === 'economy'
                  ? 'bg-[#D4FF00]'
                  : category.id === 'comfort'
                  ? 'bg-[#edf0ff]'
                  : 'bg-[#fff2e8]'
              }`}
            >
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4
                  className={`font-neo-heading text-base sm:text-lg font-black uppercase leading-none ${
                    isSelected ? 'text-[#08071E]' : 'text-white'
                  }`}
                >
                  {category.name}
                </h4>
                {category.badge && (
                  <span
                    className={`font-neo-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-black/20 ${
                      isSelected ? 'bg-[#D4FF00] text-[#08071E]' : 'bg-[#3B38F5] text-white'
                    }`}
                  >
                    {category.badge}
                  </span>
                )}
              </div>
              <p
                className={`text-[11.5px] font-neo-grotesk mt-0.5 line-clamp-1 ${
                  isSelected ? 'text-neutral-600' : 'text-[#A5A1CE]'
                }`}
              >
                {category.tagline}
              </p>
            </div>
          </div>

          {/* Selection indicator */}
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
              isSelected
                ? 'bg-[#3B38F5] border-[#08071E] text-white shadow-[1px_1px_0_#08071E]'
                : 'border-white/30 text-transparent'
            }`}
          >
            {isSelected && <Check size={12} strokeWidth={3} />}
          </div>
        </div>

        {/* Vehicle description / sample vehicle */}
        <p
          className={`text-[11px] font-neo-mono uppercase font-bold tracking-wider my-2.5 ${
            isSelected ? 'text-neutral-500' : 'text-neutral-400'
          }`}
        >
          {category.sampleVehicle}
        </p>
      </div>

      {/* Bottom specs & fare */}
      <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10 mt-2">
        <div className="flex items-center gap-3 text-xs font-neo-grotesk">
          <span className="flex items-center gap-1 font-bold">
            <Users size={13} className={isSelected ? 'text-[#3B38F5]' : 'text-[#D4FF00]'} />
            <span>{category.capacity} seats</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} className={isSelected ? 'text-neutral-500' : 'text-[#A5A1CE]'} />
            <span>{category.etaMinutes} min away</span>
          </span>
        </div>

        {/* Fare */}
        <div className="text-right">
          <div
            className={`font-neo-heading text-xl font-black leading-none ${
              isSelected ? 'text-[#08071E]' : 'text-[#D4FF00]'
            }`}
          >
            {formatCurrency(category.estimatedFare)}
          </div>
          <div className="text-[10px] font-neo-mono uppercase text-neutral-400 font-bold mt-0.5">
            EST. FARE
          </div>
        </div>
      </div>
    </div>
  );
}
