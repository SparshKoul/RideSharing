import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Activity, UserCheck } from 'lucide-react';
import { useRide } from '../hooks/useRide';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const { activeRide } = useRide();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08071E]/95 backdrop-blur-md border-b-2 border-white/10 shadow-[0_4px_20px_rgba(8,7,30,0.5)] px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/rider/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4FF00] border-2 border-[#08071E] shadow-[2px_2px_0_#3B38F5] flex items-center justify-center text-[#08071E] font-black group-hover:scale-105 transition-transform">
              <Zap size={20} fill="#08071E" />
            </div>
            <div>
              <div className="font-neo-heading text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-none">
                RUSH<span className="text-[#d8fc38]">RIDE</span>
              </div>
              <div className="font-neo-mono text-[9px] font-bold text-[#A5A1CE] uppercase tracking-widest leading-none mt-0.5">
                CUSTOMER CONSOLE
              </div>
            </div>
          </Link>

          {/* Active Ride indicator chip if in progress */}
          {activeRide && (
            <Link
              to={`/rider/ride/${activeRide.id}`}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B38F5]/20 border border-[#3B38F5] text-white font-neo-mono text-[11px] font-bold uppercase tracking-wider animate-pulse"
            >
              <Activity size={12} className="text-[#D4FF00]" />
              <span>Live Trip: {activeRide.id}</span>
            </Link>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Customer Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#121033] border border-white/15 text-[#D4FF00] font-neo-mono text-[11px] font-bold uppercase">
            <UserCheck size={13} className="text-[#D4FF00]" />
            <span>Customer Verified</span>
          </div>

          {/* Notification Bell */}
          <NotificationPanel />

          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}
