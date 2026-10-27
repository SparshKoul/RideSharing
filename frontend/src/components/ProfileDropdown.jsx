import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, RotateCcw, Shield, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRide } from '../hooks/useRide';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { currentUser, resetAuthData } = useAuth();
  const { resetAllRideData, addToast } = useRide();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetCustomer = () => {
    resetAuthData();
    resetAllRideData();
    setIsOpen(false);
    addToast('Customer account & demo ride data restored to defaults.', 'success');
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/15 bg-[#121033] hover:border-white/30 transition-all cursor-pointer"
      >
        <img
          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'}
          alt={currentUser?.name || 'Customer'}
          className="w-8 h-8 rounded-lg object-cover border border-[#08071E]"
        />
        <div className="hidden sm:block text-left">
          <div className="font-neo-heading text-xs font-black uppercase text-white truncate max-w-[120px]">
            {currentUser?.name || 'Customer'}
          </div>
          <div className="font-neo-mono text-[9px] font-bold text-[#D4FF00] uppercase tracking-wider">
            ID: {currentUser?.id || 'CUST-8820'}
          </div>
        </div>
        <ChevronDown size={14} className="text-neutral-400 hidden sm:block" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#08071E] border-2 border-[#D4FF00] rounded-2xl shadow-[5px_5px_0_#3B38F5] p-3 text-white z-50 animate-in fade-in duration-150">
          {/* Header */}
          <div className="p-2 mb-2 border-b border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-neo-heading text-sm font-black uppercase text-white">
                {currentUser?.name}
              </span>
              <span className="font-neo-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#D4FF00] text-[#08071E] uppercase">
                Customer
              </span>
            </div>
            <div className="font-neo-grotesk text-xs text-[#A5A1CE] mt-0.5">
              {currentUser?.email}
            </div>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded bg-[#3B38F5]/20 text-[#3B38F5] font-neo-mono text-[10px] font-bold border border-[#3B38F5]/30 uppercase">
              <CheckCircle2 size={11} className="text-[#D4FF00]" />
              <span>Customer ID: {currentUser?.id || 'CUST-8820'}</span>
            </div>
          </div>

          {/* Menu items */}
          <div className="space-y-1">
            <Link
              to="/rider/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-neo-grotesk font-semibold text-white transition-colors"
            >
              <User size={15} className="text-[#D4FF00]" />
              <span>Customer Settings</span>
            </Link>

            <Link
              to="/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-neo-grotesk font-semibold text-white transition-colors"
            >
              <HelpCircle size={15} className="text-[#3B38F5]" />
              <span>Help Center</span>
            </Link>

            <button
              type="button"
              onClick={handleResetCustomer}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs font-neo-grotesk font-semibold text-amber-300 transition-colors cursor-pointer text-left"
            >
              <RotateCcw size={15} />
              <span>Reset Default Customer State</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
