import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDriverRoute = location.pathname.includes('driver');
  const targetRole = isDriverRoute ? 'driver' : 'rider';

  const [email, setEmail] = useState(
    isDriverRoute ? 'vikram.driver@rideflow.demo' : 'aryan.rider@rideflow.demo'
  );
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const { loginAsRider, loginAsDriver } = useAuth();
  const { addToast } = useRide();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (isDriverRoute) {
      loginAsDriver();
      addToast('Authenticated as Driver. Welcome back!', 'success');
      navigate('/driver/dashboard');
    } else {
      loginAsRider();
      addToast('Authenticated as Rider. Welcome back!', 'success');
      navigate('/rider/dashboard');
    }
  };

  const handleQuickDemoLogin = () => {
    if (isDriverRoute) {
      loginAsDriver();
      addToast('One-click Demo Driver login successful!', 'success');
      navigate('/driver/dashboard');
    } else {
      loginAsRider();
      addToast('One-click Demo Rider login successful!', 'success');
      navigate('/rider/dashboard');
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-7 sm:p-9 shadow-[8px_8px_0_#08071E] relative">
        {/* Top Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121033] text-[#D4FF00] font-neo-mono text-[10.5px] font-black uppercase tracking-wider">
            <Zap size={12} fill="#D4FF00" />
            <span>{isDriverRoute ? 'DRIVER LOGIN' : 'RIDER LOGIN'}</span>
          </div>

          <Link
            to={isDriverRoute ? '/auth/rider/login' : '/auth/driver/login'}
            className="font-neo-mono text-[10.5px] font-bold text-[#3B38F5] hover:underline uppercase"
          >
            Switch to {isDriverRoute ? 'Rider' : 'Driver'} →
          </Link>
        </div>

        <h1 className="font-neo-heading text-2xl sm:text-3xl font-black uppercase text-[#08071E] mb-2 tracking-tight">
          Welcome Back
        </h1>
        <p className="font-neo-grotesk text-xs sm:text-sm text-neutral-600 mb-6">
          Access your {isDriverRoute ? 'driver fleet console' : 'ride-booking dashboard'}.
        </p>

        {/* Demo One-Click Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full mb-6 py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
        >
          <Zap size={16} fill="#08071E" />
          <span>Continue as Demo {isDriverRoute ? 'Driver' : 'Rider'}</span>
          <ArrowRight size={15} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 border-t border-neutral-300" />
          <span className="font-neo-mono text-[10px] font-black text-neutral-400 uppercase">
            OR WITH DEMO CREDENTIALS
          </span>
          <div className="flex-1 border-t border-neutral-300" />
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-700 text-xs font-neo-grotesk font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@rideflow.demo"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#08071E] font-neo-grotesk text-sm font-semibold text-[#08071E] bg-[#F5F6FF] focus:outline-none focus:border-[#3B38F5]"
              />
            </div>
          </div>

          <div>
            <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-[#08071E] font-neo-grotesk text-sm font-semibold text-[#08071E] bg-[#F5F6FF] focus:outline-none focus:border-[#3B38F5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-neo-grotesk text-neutral-600 font-semibold select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-[#3B38F5]"
              />
              <span>Remember demo session</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#08071E] hover:bg-[#1b1248] text-[#D4FF00] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer mt-2"
          >
            <span>Sign In to {isDriverRoute ? 'Driver' : 'Rider'}</span>
            <ArrowRight size={15} strokeWidth={3} />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-200 text-center font-neo-grotesk text-xs text-neutral-500">
          Don't have an account?{' '}
          <Link
            to={isDriverRoute ? '/auth/driver/register' : '/auth/rider/register'}
            className="font-bold text-[#3B38F5] hover:underline"
          >
            Register demo profile
          </Link>
        </div>
      </div>
    </div>
  );
}
