import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { Zap, Shield, ArrowRight } from 'lucide-react';

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return (
      <div className="min-h-screen">
        <main>
          <Outlet />
        </main>
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#08071E] text-white selection:bg-[#D4FF00] selection:text-[#08071E] overflow-x-hidden">
      {/* Background Dot Pattern */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Outlet */}
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      {/* Global Toast */}
      <Toast />

      {/* Footer */}
      <footer className="relative z-10 bg-[#08071E] border-t-2 border-[#0B0630] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4FF00] border-2 border-[#08071E] shadow-[2px_2px_0_#3B38F5] flex items-center justify-center text-[#08071E] font-black">
              <Zap size={22} fill="#08071E" />
            </div>
            <div>
              <div className="font-neo-heading text-lg font-black uppercase tracking-tight text-white">
                RUSH<span className="text-[#D4FF00]">RIDE</span>
              </div>
              <div className="font-neo-mono text-[10px] text-[#A5A1CE] uppercase tracking-wider">
                Autonomous & High-Voltage Ride Protocol
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-neo-heading font-black uppercase text-[#A5A1CE]">
            <Link to="/role-select" className="hover:text-[#D4FF00] transition-colors">
              Role Selection
            </Link>
            <Link to="/rider" className="hover:text-[#D4FF00] transition-colors">
              Rider Console
            </Link>
            <Link to="/driver" className="hover:text-[#D4FF00] transition-colors">
              Driver Console
            </Link>
            <Link to="/help" className="hover:text-[#D4FF00] transition-colors">
              Help Center & FAQ
            </Link>
          </div>

          <div className="font-neo-mono text-[11px] text-neutral-500 font-bold uppercase">
            © 2026 RushRide Mobility Protocol
          </div>
        </div>
      </footer>
    </div>
  );
}

