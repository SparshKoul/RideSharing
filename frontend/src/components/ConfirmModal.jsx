import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  onConfirm,
  onClose,
  children,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#08071E] border-2 border-[#D4FF00] rounded-2xl p-6 sm:p-7 shadow-[6px_6px_0_#D4FF00] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 border-[#0B0630] ${
              isDanger ? 'bg-red-500 text-white shadow-[2px_2px_0_#0B0630]' : 'bg-[#D4FF00] text-[#08071E] shadow-[2px_2px_0_#3B38F5]'
            }`}
          >
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="font-neo-heading text-lg sm:text-xl font-black uppercase text-white tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        {description && (
          <p className="font-neo-grotesk text-sm text-[#A5A1CE] leading-relaxed mb-5">
            {description}
          </p>
        )}

        {children && <div className="mb-5">{children}</div>}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-neo-heading text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-xl border-2 border-[#0B0630] font-neo-heading text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-[2px_2px_0_#0B0630] hover:-translate-y-0.5 active:translate-y-0.5 ${
              isDanger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-[#D4FF00] hover:bg-[#c4ec00] text-[#08071E]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
