import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';
import { HARDCODED_CUSTOMER } from '../../data/riders';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { loginAsRider } = useAuth();
  const { addToast } = useRide();

  const handleEnterCustomer = () => {
    loginAsRider();
    addToast(`Welcome back, ${HARDCODED_CUSTOMER.name}!`, 'success');
    navigate('/rider/dashboard');
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto flex flex-col items-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0_#08071E]">
        <Sparkles size={12} className="text-[#D4FF00]" />
        <span>CUSTOMER PORTAL ACTIVE</span>
      </div>

      <h1 className="font-neo-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-tight text-center mb-3">
        WELCOME TO <span className="text-[#D4FF00]">RUSHRIDE</span>
      </h1>
      <p className="font-neo-grotesk text-sm text-[#A5A1CE] text-center max-w-md mb-8">
        Hardcoded Customer values are configured. No need to switch IDs or authenticate different roles.
      </p>

      {/* Customer Card */}
      <div className="w-full bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-7 shadow-[6px_6px_0_#08071E] space-y-5">
        <div className="flex items-center gap-4">
          <img
            src={HARDCODED_CUSTOMER.avatar}
            alt={HARDCODED_CUSTOMER.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#08071E]"
          />
          <div>
            <div className="font-neo-heading text-lg font-black uppercase text-[#08071E]">
              {HARDCODED_CUSTOMER.name}
            </div>
            <div className="font-neo-mono text-xs text-neutral-500 font-bold uppercase">
              ID: {HARDCODED_CUSTOMER.id} • {HARDCODED_CUSTOMER.accountType}
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F5F6FF] border border-[#08071E] text-xs font-neo-grotesk space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-500">Email:</span>
            <span className="font-bold text-[#08071E]">{HARDCODED_CUSTOMER.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Phone:</span>
            <span className="font-bold text-[#08071E]">{HARDCODED_CUSTOMER.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Status:</span>
            <span className="font-bold text-emerald-600">Active Customer</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEnterCustomer}
          className="w-full py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
        >
          <UserCheck size={16} />
          <span>Continue as Customer</span>
          <ArrowRight size={15} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
