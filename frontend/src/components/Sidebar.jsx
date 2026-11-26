import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Navigation,
  Clock,
  User,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const { currentUser } = useAuth();

  const customerNav = [
    { to: '/rider/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/rider/book', label: 'Book a Ride', icon: Navigation },
    { to: '/rider/trips', label: 'My Trips', icon: Clock },
    { to: '/rider/profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-[#0c1033]/90 backdrop-blur-sm border-r-2 border-white/10 min-h-[calc(100vh-65px)] p-4">
      {/* Role Banner Card */}
      <div className="p-3.5 rounded-2xl bg-[#121033] border-2 border-white/10 mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="font-neo-mono text-[10px] font-bold text-[#A5A1CE] uppercase tracking-wider">
            Active Mode
          </span>
          <span className="font-neo-mono text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#D4FF00] text-[#08071E]">
            CUSTOMER PASS
          </span>
        </div>
        <div className="font-neo-heading text-sm font-black uppercase text-white truncate">
          {currentUser?.name || 'Customer'}
        </div>
        <div className="font-neo-mono text-[10px] text-[#A5A1CE] mt-0.5 truncate">
          ID: {currentUser?.id || 'CUST-8820'}
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5 flex-1">
        {customerNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith('dashboard')}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-neo-heading text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4FF00] text-[#08071E] shadow-[3px_3px_0_#3B38F5] border-2 border-[#08071E]'
                    : 'text-[#A5A1CE] hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} strokeWidth={2.5} />
                <span>{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>


    </aside>
  );
}
