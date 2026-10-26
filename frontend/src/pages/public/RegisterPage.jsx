import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Car, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDriverRoute = location.pathname.includes('driver');

  const { loginAsRider, loginAsDriver } = useAuth();
  const { addToast } = useRide();

  // Rider & Shared fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Driver specific fields
  const [vehicleCategory, setVehicleCategory] = useState('comfort');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [experience, setExperience] = useState('3 years');

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('Please fill out all required personal fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the terms of use.');
      return;
    }

    if (isDriverRoute) {
      if (!vehicleModel || !plateNumber) {
        setError('Please provide your vehicle model and registration number.');
        return;
      }

      const newDriverProfile = {
        id: `driver-${Date.now()}`,
        name,
        email,
        phone,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 5.0,
        tripsCompleted: 0,
        yearsExperience: experience,
        online: true,
        verificationStatus: 'Demo Verified (Simulated)',
        vehicle: {
          category: vehicleCategory,
          model: vehicleModel,
          plateNumber: plateNumber.toUpperCase(),
          color: 'Standard',
          capacity: vehicleCategory === 'xl' ? 6 : 4,
        },
        todayEarnings: 0,
        weeklyEarnings: 0,
      };

      loginAsDriver(newDriverProfile);
      addToast('Driver demo profile created! Onboarding verified (simulated).', 'success');
      navigate('/driver/dashboard');
    } else {
      const newRiderProfile = {
        id: `rider-${Date.now()}`,
        name,
        email,
        phone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: 5.0,
        totalRides: 0,
        totalSpent: 0,
        preferredPayment: 'UPI',
        savedPlaces: [],
      };

      loginAsRider(newRiderProfile);
      addToast('Rider demo account created! Welcome to RideFlow.', 'success');
      navigate('/rider/dashboard');
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
      <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-7 sm:p-9 shadow-[8px_8px_0_#08071E]">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121033] text-[#D4FF00] font-neo-mono text-[10.5px] font-black uppercase tracking-wider">
            <Zap size={12} fill="#D4FF00" />
            <span>{isDriverRoute ? 'DRIVER ONBOARDING' : 'RIDER REGISTRATION'}</span>
          </div>

          <Link
            to={isDriverRoute ? '/auth/driver/login' : '/auth/rider/login'}
            className="font-neo-mono text-[10.5px] font-bold text-[#3B38F5] hover:underline uppercase"
          >
            Sign In Instead →
          </Link>
        </div>

        <h1 className="font-neo-heading text-2xl sm:text-3xl font-black uppercase text-[#08071E] mb-2 tracking-tight">
          Create Demo Profile
        </h1>
        <p className="font-neo-grotesk text-xs sm:text-sm text-neutral-600 mb-6">
          {isDriverRoute
            ? 'Register your vehicle details to start accepting simulated ride bookings.'
            : 'Register your account to book campus rides across Chandigarh and Punjab.'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-700 text-xs font-neo-grotesk font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sparsh Sharma"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] font-neo-grotesk text-sm font-semibold text-[#08071E] bg-[#F5F6FF] focus:outline-none focus:border-[#3B38F5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] font-neo-grotesk text-sm font-semibold text-[#08071E] bg-[#F5F6FF] focus:outline-none focus:border-[#3B38F5]"
              />
            </div>

            <div>
              <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] font-neo-grotesk text-sm font-semibold text-[#08071E] bg-[#F5F6FF] focus:outline-none focus:border-[#3B38F5]"
              />
            </div>
          </div>

          {/* Driver specific vehicle inputs */}
          {isDriverRoute && (
            <div className="p-4 rounded-2xl bg-[#edf0ff] border-2 border-[#3B38F5]/30 space-y-3.5 my-4">
              <div className="font-neo-heading text-xs font-black uppercase text-[#3B38F5] tracking-wider flex items-center gap-1.5">
                <Car size={15} />
                <span>Simulated Vehicle Specifications</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-neo-mono text-[10.5px] font-black uppercase text-neutral-600 mb-1">
                    Ride Category
                  </label>
                  <select
                    value={vehicleCategory}
                    onChange={(e) => setVehicleCategory(e.target.value)}
                    className="w-full bg-white border-2 border-[#08071E] rounded-xl px-3 py-2 text-xs font-neo-heading font-black uppercase text-[#08071E] focus:outline-none"
                  >
                    <option value="economy">Economy (4 Seats)</option>
                    <option value="comfort">Comfort (Premium Sedan)</option>
                    <option value="xl">XL (6 Seater SUV)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-neo-mono text-[10.5px] font-black uppercase text-neutral-600 mb-1">
                    Driving Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-white border-2 border-[#08071E] rounded-xl px-3 py-2 text-xs font-neo-heading font-black uppercase text-[#08071E] focus:outline-none"
                  >
                    <option value="1-2 years">1 - 2 Years</option>
                    <option value="3-5 years">3 - 5 Years</option>
                    <option value="5+ years">5+ Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-neo-mono text-[10.5px] font-black uppercase text-neutral-600 mb-1">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Honda City (White)"
                    className="w-full bg-white px-3 py-2 rounded-xl border-2 border-[#08071E] text-xs font-neo-grotesk font-semibold text-[#08071E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-neo-mono text-[10.5px] font-black uppercase text-neutral-600 mb-1">
                    Plate Registration Number *
                  </label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="e.g. CH 01 AB 1234"
                    className="w-full bg-white px-3 py-2 rounded-xl border-2 border-[#08071E] text-xs font-neo-mono font-black uppercase text-[#08071E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-[10.5px] font-neo-mono font-bold text-neutral-500 uppercase flex items-center gap-1.5 pt-1">
                <ShieldCheck size={13} className="text-[#3B38F5]" />
                <span>Simulated verification: Demo badge granted automatically</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] font-neo-grotesk text-sm font-semibold text-[#08071E] bg-[#F5F6FF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-neo-mono text-[11px] font-black uppercase text-neutral-600 tracking-wider mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] font-neo-grotesk text-sm font-semibold text-[#08071E] bg-[#F5F6FF] focus:outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-neo-grotesk text-neutral-600 font-semibold select-none pt-2">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="rounded accent-[#3B38F5]"
            />
            <span>I accept the simulated terms of service and prototype policy</span>
          </label>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#08071E] hover:bg-[#1b1248] text-[#D4FF00] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer mt-4"
          >
            <span>Register {isDriverRoute ? 'Driver' : 'Rider'} Profile</span>
            <ArrowRight size={15} strokeWidth={3} />
          </button>
        </form>
      </div>
    </div>
  );
}
