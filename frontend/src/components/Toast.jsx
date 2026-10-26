import React from 'react';
import { useRide } from '../hooks/useRide';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { notifications, removeToast } = useRide();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((toast) => {
        let icon = <Info size={18} className="text-[#3B38F5] shrink-0" />;
        let borderColor = 'border-[#3B38F5]';
        let bgStyle = 'bg-[#08071E]';

        if (toast.type === 'success') {
          icon = <CheckCircle2 size={18} className="text-[#D4FF00] shrink-0" />;
          borderColor = 'border-[#D4FF00]';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={18} className="text-red-400 shrink-0" />;
          borderColor = 'border-red-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-2 ${borderColor} ${bgStyle} text-white shadow-[4px_4px_0_#0B0630] transition-all transform animate-in slide-in-from-bottom-2`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 font-neo-grotesk text-xs sm:text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
