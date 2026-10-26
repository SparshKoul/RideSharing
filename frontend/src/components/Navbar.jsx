import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Navigation, Car, Shield, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRide } from '../hooks/useRide';
import NotificationPanel from './NotificationPanel';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const { role, isRider, isDriver, switchRole, isAuthenticated } = useAuth();
  const { driverOnline, setDriverOnline, activeRide } = useRide();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08071E]/95 backdrop-blur-md border-b-2 border-white/10 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4FF00] border-2 border-[#08071E] shadow-[2px_2px_0_#3B38F5] flex items-center justify-center text-[#08071E] font-black group-hover:scale-105 transition-transform">
              <Zap size={20} fill="#08071E" />
            </div>
            <div>
              <div className="font-neo-heading text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-none">
                RIDE<span className="text-[#D4FF00]">FLOW</span>
              </div>
              <div className="font-neo-mono text-[9px] font-bold text-[#A5A1CE] uppercase tracking-widest leading-none mt-0.5">
                NEO-TRANSIT
              </div>
            </div>
          </Link>

          {/* Active Ride indicator chip if in progress */}
          {activeRide && (
            <Link
              to={isDriver ? `/driver/trip/${activeRide.id}` : `/rider/ride/${activeRide.id}`}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B38F5]/20 border border-[#3B38F5] text-white font-neo-mono text-[11px] font-bold uppercase tracking-wider animate-pulse"
            >
              <Activity size={12} className="text-[#D4FF00]" />
              <span>Live Trip: {activeRide.id}</span>
            </Link>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Driver Online / Offline Toggle (Only if driver) */}
          {isDriver && (
            <button
              type="button"
              onClick={() => setDriverOnline(!driverOnline)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-neo-heading text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0_#08071E] ${
                driverOnline
                  ? 'bg-[#D4FF00] text-[#08071E] border-[#08071E]'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${driverOnline ? 'bg-[#08071E] animate-ping' : 'bg-neutral-500'}`} />
              <span className="hidden sm:inline">{driverOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>
          )}

          {/* Quick Role Switcher Pill */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center p-1 rounded-xl bg-[#121033] border border-white/15">
              <button
                type="button"
                onClick={() => switchRole('rider')}
                className={`px-3 py-1 rounded-lg font-neo-heading text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isRider
                    ? 'bg-[#D4FF00] text-[#08071E] shadow-[2px_2px_0_#08071E]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Rider
              </button>
              <button
                type="button"
                onClick={() => switchRole('driver')}
                className={`px-3 py-1 rounded-lg font-neo-heading text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isDriver
                    ? 'bg-[#3B38F5] text-white shadow-[2px_2px_0_#08071E]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Driver
              </button>
            </div>
          )}

          {/* Notification Bell */}
          {isAuthenticated && <NotificationPanel />}

          {/* Profile Dropdown */}
          {isAuthenticated ? (
            <ProfileDropdown />
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_#3B38F5] transition-all cursor-pointer"
            >
              Demo Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
