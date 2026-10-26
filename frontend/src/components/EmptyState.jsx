import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-white/15 bg-[#121033]/40">
      <div className="w-16 h-16 rounded-2xl bg-[#08071E] border-2 border-[#D4FF00] shadow-[3px_3px_0_#3B38F5] flex items-center justify-center text-[#D4FF00] mb-4">
        <Icon size={30} strokeWidth={2} />
      </div>
      <h4 className="font-neo-heading text-lg sm:text-xl font-black uppercase text-white tracking-tight mb-2">
        {title}
      </h4>
      <p className="font-neo-grotesk text-sm text-[#A5A1CE] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl border-2 border-[#0B0630] bg-[#D4FF00] hover:bg-[#c3ec00] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#3B38F5] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
