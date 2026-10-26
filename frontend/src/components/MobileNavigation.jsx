import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Navigation, Clock, User, Inbox, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRide } from '../hooks/useRide';

export default function MobileNavigation() {
  const { isDriver } = useAuth();
  const { pendingRequests, driverActiveTrip, activeRide } = useRide();

  const riderTabs = [
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

  const driverTabs = [
    { to: '/driver/dashboard', label: 'Home', icon: LayoutDashboard },
    {
      to: '/driver/requests',
      label: 'Requests',
      icon: Inbox,
      badge: pendingRequests.length > 0 ? pendingRequests.length : null,
    },
    {
      to: driverActiveTrip ? `/driver/trip/${driverActiveTrip.id}` : '/driver/trips',
      label: driverActiveTrip ? 'Active' : 'Trips',
      icon: driverActiveTrip ? Activity : Clock,
      highlight: !!driverActiveTrip,
    },
    { to: '/driver/earnings', label: 'Earnings', icon: Clock },
    { to: '/driver/profile', label: 'Profile', icon: User },
  ];

  const tabs = isDriver ? driverTabs : riderTabs;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08071E]/95 backdrop-blur-md border-t-2 border-white/10 px-2 py-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? isDriver
                    ? 'text-[#3B38F5]'
                    : 'text-[#D4FF00]'
                  : 'text-neutral-400 hover:text-white'
              }`
            }
          >
            <Icon size={18} strokeWidth={2.5} />
            <span className="font-neo-mono text-[9px] font-black uppercase mt-1">
              {tab.label}
            </span>

            {tab.badge && (
              <span className="absolute -top-1 right-1 font-neo-mono text-[9px] font-black bg-[#D4FF00] text-[#08071E] w-4 h-4 rounded-full flex items-center justify-center border border-black/20">
                {tab.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}
