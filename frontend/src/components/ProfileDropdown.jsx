import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, RotateCcw, Shield, HelpCircle, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRide } from '../hooks/useRide';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { role, currentUser, isRider, isDriver, switchRole, logout, resetAuthData } = useAuth();
  const { resetAllRideData, addToast } = useRide();

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchToRider = () => {
    switchRole('rider');
    setIsOpen(false);
    addToast('Switched to Rider view.', 'info');
  };

  const handleSwitchToDriver = () => {
    switchRole('driver');
    setIsOpen(false);
    addToast('Switched to Driver view.', 'info');
  };

  const handleResetDemo = () => {
    resetAuthData();
    resetAllRideData();
    setIsOpen(false);
    addToast('Demo data successfully restored to fresh state.', 'success');
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/15 bg-[#121033] hover:border-white/30 transition-all cursor-pointer"
      >
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
          alt={currentUser?.name || 'Profile'}
          className="w-8 h-8 rounded-lg object-cover border border-[#08071E]"
        />
        <div className="hidden sm:block text-left">
          <div className="font-neo-heading text-xs font-black uppercase text-white truncate max-w-[100px]">
            {currentUser?.name || 'Demo User'}
          </div>
          <div className="font-neo-mono text-[9px] font-bold text-[#D4FF00] uppercase tracking-wider">
            {role} mode
          </div>
        </div>
        <ChevronDown size={14} className="text-neutral-400 hidden sm:block" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#08071E] border-2 border-[#D4FF00] rounded-2xl shadow-[5px_5px_0_#3B38F5] p-3 text-white z-50 animate-in fade-in duration-150">
          {/* Header */}
          <div className="p-2 mb-2 border-b border-white/10">
            <div className="font-neo-heading text-sm font-black uppercase text-white">
              {currentUser?.name}
            </div>
            <div className="font-neo-grotesk text-xs text-[#A5A1CE]">
              {currentUser?.email}
            </div>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded bg-[#3B38F5]/20 text-[#3B38F5] font-neo-mono text-[10px] font-bold border border-[#3B38F5]/30 uppercase">
              <Shield size={10} />
              <span>Simulated Prototype</span>
            </div>
          </div>

          {/* Quick Role Switcher widget */}
          <div className="p-2 mb-2 bg-[#121033] rounded-xl border border-white/10">
            <span className="block font-neo-mono text-[10px] font-bold text-[#A5A1CE] uppercase mb-1.5">
              Simulated Role Switcher
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={handleSwitchToRider}
                className={`px-2 py-1.5 rounded-lg font-neo-heading text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  isRider
                    ? 'bg-[#D4FF00] text-[#08071E] border border-[#08071E]'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {isRider && <Check size={12} strokeWidth={3} />}
                <span>Rider</span>
              </button>
              <button
                type="button"
                onClick={handleSwitchToDriver}
                className={`px-2 py-1.5 rounded-lg font-neo-heading text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all ${
                  isDriver
                    ? 'bg-[#3B38F5] text-white border border-[#08071E]'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {isDriver && <Check size={12} strokeWidth={3} />}
                <span>Driver</span>
              </button>
            </div>
          </div>

          {/* Menu items */}
          <div className="space-y-1">
            <a
              href={isDriver ? '/driver/profile' : '/rider/profile'}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-neo-grotesk font-semibold text-white transition-colors"
            >
              <User size={15} className="text-[#D4FF00]" />
              <span>Profile & Settings</span>
            </a>

            <a
              href="/help"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-neo-grotesk font-semibold text-white transition-colors"
            >
              <HelpCircle size={15} className="text-[#3B38F5]" />
              <span>Help Center</span>
            </a>

            <button
              type="button"
              onClick={handleResetDemo}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-neo-grotesk font-semibold text-amber-300 transition-colors cursor-pointer text-left"
            >
              <RotateCcw size={15} />
              <span>Reset Demo State</span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-500/20 text-xs font-neo-grotesk font-semibold text-red-400 transition-colors cursor-pointer text-left"
            >
              <LogOut size={15} />
              <span>Sign Out Demo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
