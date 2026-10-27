import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Zap, UserCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';
import { HARDCODED_CUSTOMER } from '../../data/riders';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(HARDCODED_CUSTOMER.email);
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);

  const { loginAsRider } = useAuth();
  const { addToast } = useRide();

  const handleLogin = (e) => {
    e?.preventDefault();
    loginAsRider();
    addToast(`Authenticated as Customer: ${HARDCODED_CUSTOMER.name}`, 'success');
    navigate('/rider/dashboard');
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-7 sm:p-9 shadow-[8px_8px_0_#08071E] relative">
        {/* Top Tag */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121033] text-[#D4FF00] font-neo-mono text-[10.5px] font-black uppercase tracking-wider">
            <Zap size={12} fill="#D4FF00" />
            <span>CUSTOMER LOGIN</span>
          </div>

          <span className="font-neo-mono text-[10px] font-bold text-neutral-500 uppercase">
            ID: {HARDCODED_CUSTOMER.id}
          </span>
        </div>

        <h1 className="font-neo-heading text-2xl sm:text-3xl font-black uppercase text-[#08071E] mb-2 tracking-tight">
          Welcome Back
        </h1>
        <p className="font-neo-grotesk text-xs sm:text-sm text-neutral-600 mb-6">
          Access your customer ride booking and history dashboard.
        </p>

        {/* Demo One-Click Button */}
        <button
          type="button"
          onClick={handleLogin}
          className="w-full mb-6 py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
        >
          <UserCheck size={16} />
          <span>Enter as {HARDCODED_CUSTOMER.name}</span>
          <ArrowRight size={15} strokeWidth={3} />
        </button>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 mb-1">
              Customer Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#F5F6FF] text-sm font-neo-grotesk font-semibold text-[#08071E] focus:outline-none"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
            </div>
          </div>

          <div>
            <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-[#08071E] bg-[#F5F6FF] text-sm font-neo-grotesk font-semibold text-[#08071E] focus:outline-none"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#08071E] hover:bg-neutral-800 text-white font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_#3B38F5] transition-all cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight size={15} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
}
