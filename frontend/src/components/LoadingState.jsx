import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading details...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#08071E] border-2 border-[#D4FF00] shadow-[3px_3px_0_#3B38F5] flex items-center justify-center text-[#D4FF00] mb-4">
        <Loader2 size={24} className="animate-spin" />
      </div>
      <p className="font-neo-mono text-xs font-bold uppercase tracking-wider text-[#A5A1CE]">
        {message}
      </p>
    </div>
  );
}
