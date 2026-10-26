import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Navigation, Car, ArrowRight, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { loginAsRider, loginAsDriver } = useAuth();
  const { addToast } = useRide();

  const handleQuickDemoRider = () => {
    loginAsRider();
    addToast('Logged in as Demo Rider: Aryan Mehra', 'success');
    navigate('/rider/dashboard');
  };

  const handleQuickDemoDriver = () => {
    loginAsDriver();
    addToast('Logged in as Demo Driver: Vikram Malhotra', 'success');
    navigate('/driver/dashboard');
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0_#08071E]">
        <Sparkles size={12} className="text-[#D4FF00]" />
        <span>SELECT YOUR WORKSPACE</span>
      </div>

      <h1 className="font-neo-heading text-3xl sm:text-5xl font-black uppercase text-white tracking-tight text-center mb-3">
        WELCOME TO <span className="text-[#D4FF00]">RIDEFLOW</span>
      </h1>
      <p className="font-neo-grotesk text-sm sm:text-base text-[#A5A1CE] text-center max-w-lg mb-10">
        Choose how you want to experience the platform. You can test both roles and switch dynamically at any time without resetting active trips.
      </p>

      {/* Demo Notice Box */}
      <div className="w-full max-w-2xl bg-[#121033] border-2 border-dashed border-[#D4FF00]/40 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4 text-xs font-neo-grotesk">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4FF00] text-[#08071E] flex items-center justify-center shrink-0 font-bold">
            ⚡
          </div>
          <div className="text-left">
            <span className="font-bold text-white uppercase font-neo-heading">Prototype Demo Mode:</span>{' '}
            <span className="text-[#A5A1CE]">No real payment, server dispatch, or GPS tracking is required.</span>
          </div>
        </div>
        <Link to="/help" className="shrink-0 font-neo-mono text-[10.5px] font-bold text-[#D4FF00] hover:underline uppercase">
          FAQ →
        </Link>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Rider Card */}
        <div className="flex flex-col bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-7 sm:p-8 shadow-[6px_6px_0_#08071E] hover:shadow-[8px_8px_0_#3B38F5] transition-all">
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#D4FF00] border-2 border-[#08071E] shadow-[3px_3px_0_#08071E] flex items-center justify-center">
              <Navigation size={26} className="text-[#08071E]" strokeWidth={2.5} />
            </div>
            <span className="font-neo-mono text-xs font-black uppercase text-neutral-400">
              ROLE 01
            </span>
          </div>

          <h2 className="font-neo-heading text-2xl sm:text-3xl font-black uppercase text-[#08071E] mb-2 tracking-tight">
            Ride with RideFlow
          </h2>
          <p className="font-neo-grotesk text-sm text-neutral-600 mb-6 leading-relaxed">
            Find a ride, compare Economy, Comfort & XL fares, and reach your destination with real-time tracking.
          </p>

          <div className="space-y-2 mb-8 flex-1">
            {['Instant 1-click demo booking', 'Deterministic fare estimations', 'Live route tracking & cancellation'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-neo-grotesk font-semibold text-[#08071E]">
                <div className="w-4 h-4 rounded-full bg-[#3B38F5] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mt-auto">
            <button
              type="button"
              onClick={handleQuickDemoRider}
              className="w-full py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
            >
              <span>Continue as Demo Rider</span>
              <ArrowRight size={15} strokeWidth={3} />
            </button>

            <div className="flex items-center justify-between text-xs font-neo-mono uppercase font-bold text-neutral-500 pt-1">
              <Link to="/auth/rider/login" className="hover:text-[#08071E] underline">
                Rider Login
              </Link>
              <Link to="/auth/rider/register" className="hover:text-[#08071E] underline">
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Driver Card */}
        <div className="flex flex-col bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-7 sm:p-8 shadow-[6px_6px_0_#08071E] hover:shadow-[8px_8px_0_#3B38F5] transition-all">
          <div className="flex items-start justify-between mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#08071E] border-2 border-[#08071E] shadow-[3px_3px_0_#3B38F5] flex items-center justify-center">
              <Car size={26} className="text-[#D4FF00]" strokeWidth={2.5} />
            </div>
            <span className="font-neo-mono text-xs font-black uppercase text-neutral-400">
              ROLE 02
            </span>
          </div>

          <h2 className="font-neo-heading text-2xl sm:text-3xl font-black uppercase text-[#08071E] mb-2 tracking-tight">
            Drive with RideFlow
          </h2>
          <p className="font-neo-grotesk text-sm text-neutral-600 mb-6 leading-relaxed">
            Accept trips, toggle live availability, manage ride lifecycles, and track simulated payouts.
          </p>

          <div className="space-y-2 mb-8 flex-1">
            {['Online / Offline status control', 'Live incoming passenger dispatch', 'Simulated 82% commission earnings'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-neo-grotesk font-semibold text-[#08071E]">
                <div className="w-4 h-4 rounded-full bg-[#08071E] text-[#D4FF00] flex items-center justify-center text-[10px]">
                  ✓
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 mt-auto">
            <button
              type="button"
              onClick={handleQuickDemoDriver}
              className="w-full py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#3B38F5] hover:bg-[#2e2bbd] text-white font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#08071E] transition-all cursor-pointer"
            >
              <span>Continue as Demo Driver</span>
              <ArrowRight size={15} strokeWidth={3} />
            </button>

            <div className="flex items-center justify-between text-xs font-neo-mono uppercase font-bold text-neutral-500 pt-1">
              <Link to="/auth/driver/login" className="hover:text-[#08071E] underline">
                Driver Login
              </Link>
              <Link to="/auth/driver/register" className="hover:text-[#08071E] underline">
                Driver Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
