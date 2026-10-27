import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Navigation, Clock, User, Activity } from 'lucide-react';
import { useRide } from '../hooks/useRide';

export default function MobileNavigation() {
  const { activeRide } = useRide();

  const customerTabs = [
    { to: '/rider/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/rider/book', label: 'Book', icon: Navigation },
    {
      to: activeRide ? `/rider/ride/${activeRide.id}` : '/rider/trips',
      label: activeRide ? 'Active' : 'Trips',
      icon: activeRide ? Activity : Clock,
      highlight: !!activeRide,
    },
    { to: '/rider/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08071E]/95 backdrop-blur-md border-t-2 border-white/10 px-2 py-1.5 flex items-center justify-around">
      {customerTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#D4FF00]'
                  : 'text-neutral-400 hover:text-white'
              }`
            }
          >
            <Icon size={18} strokeWidth={2.5} />
            <span className="font-neo-mono text-[9px] font-black uppercase mt-1">
              {tab.label}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
}
