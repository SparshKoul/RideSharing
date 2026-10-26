import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'lime', // 'lime', 'blue', 'navy'
}) {
  const iconBg = color === 'lime'
    ? 'bg-[#D4FF00] text-[#08071E] border-[#08071E] shadow-[2px_2px_0_#3B38F5]'
    : color === 'blue'
    ? 'bg-[#3B38F5] text-white border-[#08071E] shadow-[2px_2px_0_#D4FF00]'
    : 'bg-[#08071E] text-[#D4FF00] border-[#D4FF00] shadow-[2px_2px_0_#3B38F5]';

  return (
    <div className="relative flex flex-col bg-[#121033] rounded-2xl border-2 border-white/15 p-5 shadow-[4px_4px_0_#08071E] hover:border-[#D4FF00]/40 transition-all overflow-hidden group">
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-neo-mono text-[11px] font-bold text-[#A5A1CE] uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Main stat value */}
      <div className="font-neo-heading text-2xl sm:text-3xl font-black text-white tracking-tight leading-none mb-1.5">
        {value}
      </div>

      {/* Subtitle / trend */}
      {subtitle && (
        <div className="flex items-center gap-2 mt-auto text-xs font-neo-grotesk text-[#A5A1CE]">
          {trend && (
            <span className="font-neo-mono text-[10px] font-bold text-[#D4FF00] bg-[#D4FF00]/10 px-1.5 py-0.5 rounded border border-[#D4FF00]/20">
              {trend}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  );
}
