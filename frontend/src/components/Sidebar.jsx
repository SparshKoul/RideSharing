import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Navigation,
  Clock,
  CreditCard,
  Bookmark,
  User,
  Car,
  DollarSign,
  Inbox,
  Activity,
  HelpCircle,
  Radio,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRide } from '../hooks/useRide';

export default function Sidebar() {
  const { isRider, isDriver } = useAuth();
  const { pendingRequests, activeRide, driverActiveTrip } = useRide();

  const riderNav = [
    { to: '/rider/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/rider/book', label: 'Book a Ride', icon: Navigation },
    { to: '/rider/trips', label: 'My Trips', icon: Clock },
    { to: '/rider/payments', label: 'Payments', icon: CreditCard },
    { to: '/rider/favorites', label: 'Saved Places', icon: Bookmark },
    { to: '/rider/profile', label: 'Profile', icon: User },
    { to: '/help', label: 'Help Center', icon: HelpCircle },
  ];

  const driverNav = [
    { to: '/driver/dashboard', label: 'Overview', icon: LayoutDashboard },
    {
      to: '/driver/requests',
      label: 'Ride Requests',
      icon: Inbox,
      badge: pendingRequests.length > 0 ? pendingRequests.length : null,
    },
    {
      to: driverActiveTrip ? `/driver/trip/${driverActiveTrip.id}` : '/driver/dashboard',
      label: 'Active Trip',
      icon: Activity,
      highlight: !!driverActiveTrip,
    },
    { to: '/driver/trips', label: 'Trip History', icon: Clock },
    { to: '/driver/earnings', label: 'Earnings & Analytics', icon: DollarSign },
    { to: '/driver/vehicle', label: 'My Vehicle', icon: Car },
    { to: '/driver/profile', label: 'Driver Profile', icon: User },
    { to: '/help', label: 'Help Center', icon: HelpCircle },
  ];

  const navLinks = isDriver ? driverNav : riderNav;

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#08071E] border-r-2 border-white/10 min-h-[calc(100vh-65px)] p-4">
      {/* Role Banner Card */}
      <div className="p-3.5 rounded-2xl bg-[#121033] border-2 border-white/10 mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="font-neo-mono text-[10px] font-bold text-[#A5A1CE] uppercase tracking-wider">
            Active Mode
          </span>
          <span
            className={`font-neo-mono text-[9px] font-black uppercase px-2 py-0.5 rounded ${
              isDriver ? 'bg-[#3B38F5] text-white' : 'bg-[#D4FF00] text-[#08071E]'
            }`}
          >
            {isDriver ? 'DRIVER CONSOLE' : 'RIDER PASS'}
          </span>
        </div>
        <div className="font-neo-heading text-sm font-black uppercase text-white truncate">
          {isDriver ? 'Fleet Operations' : 'Ride & Commute'}
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5 flex-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith('dashboard')}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-neo-heading text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? isDriver
                      ? 'bg-[#3B38F5] text-white shadow-[3px_3px_0_#D4FF00] border-2 border-[#08071E]'
                      : 'bg-[#D4FF00] text-[#08071E] shadow-[3px_3px_0_#3B38F5] border-2 border-[#08071E]'
                    : 'text-[#A5A1CE] hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} strokeWidth={2.5} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="font-neo-mono text-[10px] font-black bg-[#D4FF00] text-[#08071E] px-1.5 py-0.2 rounded-full border border-black/20 animate-bounce">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      <div className="pt-4 border-t border-white/10 text-center font-neo-mono text-[10px] text-neutral-500 uppercase">
        <div>RideFlow Frontend v2.0</div>
        <div className="text-[9px] text-[#A5A1CE] mt-0.5">Neo-Brutalist Prototype</div>
      </div>
    </aside>
  );
}
