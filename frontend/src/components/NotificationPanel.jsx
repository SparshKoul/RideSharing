import React, { useState, useRef, useEffect } from 'react';
import { Bell, Sparkles, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRide } from '../hooks/useRide';

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { activeRide } = useRide();

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sampleNotifications = [
    {
      id: 'notif-1',
      title: activeRide ? `Active Ride: ${activeRide.id}` : 'RideFlow System Ready',
      desc: activeRide
        ? `Status: ${activeRide.status.replace('_', ' ').toUpperCase()} • ${activeRide.destination?.name}`
        : 'Welcome to RideFlow simulated ride-sharing platform.',
      time: 'Just now',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Demo Mode Activated',
      desc: 'All ride bookings, GPS positions, and driver earnings run on browser mock data.',
      time: '10m ago',
      unread: false,
    },
    {
      id: 'notif-3',
      title: 'Campus Route Optimized',
      desc: 'Chitkara University to Elante Mall route metrics updated deterministically.',
      time: '1h ago',
      unread: false,
    },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-white/15 bg-[#121033] hover:border-white/30 text-white transition-all cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={18} />
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#08071E] border-2 border-[#D4FF00] rounded-2xl shadow-[5px_5px_0_#3B38F5] p-3 text-white z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between p-2 border-b border-white/10 mb-2">
            <span className="font-neo-heading text-xs font-black uppercase tracking-wider text-white">
              Notifications
            </span>
            <span className="font-neo-mono text-[9px] font-bold text-[#D4FF00] uppercase">
              Simulated Feed
            </span>
          </div>

          <div className="space-y-2">
            {sampleNotifications.map((n) => (
              <div
                key={n.id}
                className="p-2.5 rounded-xl bg-[#121033] border border-white/10 hover:border-white/20 transition-all text-left"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-neo-heading text-xs font-black uppercase text-white truncate">
                    {n.title}
                  </span>
                  <span className="font-neo-mono text-[9px] text-[#A5A1CE] shrink-0">
                    {n.time}
                  </span>
                </div>
                <p className="font-neo-grotesk text-[11.5px] text-[#A5A1CE] leading-snug">
                  {n.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
