import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, RotateCcw, Check, Star, Award, Hash } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';
import ConfirmModal from '../../components/ConfirmModal';

export default function RiderProfilePage() {
  const { currentUser, updateRiderProfile, resetAuthData } = useAuth();
  const { resetAllRideData, addToast } = useRide();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateRiderProfile({ name, email, phone });
    addToast('Profile changes saved!', 'success');
  };

  const handleReset = () => {
    resetAuthData();
    resetAllRideData();
    setIsResetModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-bold uppercase tracking-wider mb-2">
          <User size={12} className="text-[#D4FF00]" />
          <span>CUSTOMER PROFILE</span>
        </div>
        <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
          CUSTOMER ACCOUNT
        </h1>
        <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
          Dedicated Customer Portal profile with fixed customer credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 sm:p-8 shadow-[5px_5px_0_#08071E] flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
          alt="Avatar"
          className="w-20 h-20 rounded-2xl object-cover border-3 border-[#08071E] shadow-[3px_3px_0_#D4FF00]"
        />

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="font-neo-heading text-xl sm:text-2xl font-black uppercase text-white">
              {currentUser?.name}
            </h2>
            <span className="font-neo-mono text-[10px] font-bold bg-[#D4FF00] text-[#08071E] px-2 py-0.5 rounded uppercase">
              ★ {currentUser?.rating || 4.96} Customer
            </span>
          </div>
          <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
            {currentUser?.email} • {currentUser?.phone}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3B38F5]/20 border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10px] font-bold uppercase">
              <Hash size={12} />
              <span>Customer ID: {currentUser?.id || 'CUST-8820'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-neo-mono text-[10px] font-bold uppercase">
              <Award size={12} className="text-[#D4FF00]" />
              <span>RideEzz Prime Gold Tier</span>
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-6 sm:p-8 shadow-[6px_6px_0_#08071E]">
        <h3 className="font-neo-heading text-lg font-black uppercase mb-4 tracking-tight">
          Personal Information
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#F5F6FF] text-sm font-neo-grotesk font-semibold text-[#08071E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#F5F6FF] text-sm font-neo-grotesk font-semibold text-[#08071E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#F5F6FF] text-sm font-neo-grotesk font-semibold text-[#08071E] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl border-2 border-[#08071E] bg-[#08071E] text-[#D4FF00] font-neo-heading text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_#3B38F5] cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Defaults Management */}
      <div className="bg-[#121033] rounded-3xl border-2 border-white/10 p-6 sm:p-8 space-y-4">
        <h3 className="font-neo-heading text-base font-black uppercase text-white tracking-wider">
          Hardcoded Account Controls
        </h3>
        <p className="font-neo-grotesk text-xs text-[#A5A1CE]">
          Reset customer ride history, draft bookings, and active trips back to the pristine hardcoded defaults.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="px-5 py-3 rounded-xl border-2 border-amber-400 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-neo-heading text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw size={15} />
            <span>Restore Hardcoded Defaults</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Restore Default State?"
        description="This will restore all hardcoded customer values and reset sample trips to default seeds."
        confirmLabel="Yes, Restore"
        cancelLabel="Cancel"
        isDanger={false}
        onConfirm={handleReset}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}
