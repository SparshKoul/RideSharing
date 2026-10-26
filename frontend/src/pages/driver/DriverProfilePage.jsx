import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  Star, 
  ShieldCheck, 
  RotateCcw, 
  LogOut, 
  ArrowLeftRight, 
  Save, 
  CheckCircle2, 
  FileCheck,
  CreditCard,
  BellRing,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';
import { useNavigate } from 'react-router-dom';

export default function DriverProfilePage() {
  const { user, updateUser, switchRole, logout } = useAuth();
  const { resetDemo, addToast, trips } = useRide();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || 'Gurpreet Singh',
    email: user?.email || 'gurpreet.driver@rideflow.com',
    phone: user?.phone || '+91 98141 55678',
    license: user?.licenseNumber || 'DL-042018009214',
    experience: user?.experience || '4.5 Years',
    upiId: user?.upiId || 'gurpreet.ride@okhdfcbank'
  });

  const [preferences, setPreferences] = useState({
    soundAlerts: true,
    autoAccept: false,
    longTripsOnly: false,
    nightSurgeNotification: true
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (updateUser) {
      updateUser(formData);
    }
    addToast('Driver profile updated successfully', 'success');
  };

  const handleRoleSwitch = () => {
    switchRole('rider');
    navigate('/rider');
  };

  const handleReset = () => {
    resetDemo();
    addToast('Demo trips and dispatch state reset to default', 'info');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const driverTripsCount = trips.filter(t => t.driver?.id === user?.id || t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-3 border-[#08071E] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#D4FF00] border-2 border-[#08071E] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-[#08071E]" />
            Operator Credentials
          </div>
          <h1 className="text-3xl font-extrabold uppercase font-heading tracking-tight text-[#08071E]">
            Driver Profile
          </h1>
          <p className="text-sm font-mono text-[#08071E]/70 mt-1">
            Manage your pilot identity, commercial credentials, banking settlement, and dispatch settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRoleSwitch}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#D4FF00] text-[#08071E] font-heading font-black uppercase text-xs tracking-wider border-2 border-[#08071E] shadow-[3px_3px_0_#08071E] hover:bg-[#c3ea00] transition-all"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Switch to Rider
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Stats */}
        <div className="space-y-6">
          <div className="bg-white border-3 border-[#08071E] rounded-xl p-6 shadow-[5px_5px_0_#08071E] text-center relative overflow-hidden">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#08071E] text-[#D4FF00] border-3 border-[#08071E] flex items-center justify-center font-heading font-black text-3xl shadow-[4px_4px_0_#3B38F5] mb-4">
              {formData.name.charAt(0)}
            </div>

            <h2 className="text-xl font-heading font-black uppercase text-[#08071E]">
              {formData.name}
            </h2>
            <p className="font-mono text-xs text-[#3B38F5] font-bold uppercase tracking-wider mt-0.5">
              Verified Partner Pilot • Punjab Region
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-3 mb-5">
              <div className="flex items-center gap-1 px-3 py-1 bg-[#D4FF00] border-2 border-[#08071E] rounded-full font-mono text-xs font-bold text-[#08071E]">
                <Star className="w-3.5 h-3.5 fill-[#08071E]" />
                {user?.rating || 4.9} / 5.0 (520+ Reviews)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-dashed border-[#08071E]/20 text-left font-mono">
              <div className="p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                <span className="text-[10px] text-[#08071E]/60 uppercase block">Total Trips</span>
                <span className="text-base font-extrabold text-[#08071E]">{driverTripsCount + 482}</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                <span className="text-[10px] text-[#08071E]/60 uppercase block">Acceptance Rate</span>
                <span className="text-base font-extrabold text-[#10B981]">97.4%</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                <span className="text-[10px] text-[#08071E]/60 uppercase block">Cancellation</span>
                <span className="text-base font-extrabold text-[#3B38F5]">1.2%</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                <span className="text-[10px] text-[#08071E]/60 uppercase block">Experience</span>
                <span className="text-base font-extrabold text-[#08071E]">{formData.experience}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#08071E] text-white border-3 border-[#08071E] rounded-xl p-5 shadow-[4px_4px_0_#08071E] space-y-3">
            <h3 className="font-heading font-black uppercase text-xs text-[#D4FF00] tracking-wider">
              Environment Actions
            </h3>
            
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded font-mono text-xs font-bold transition-all"
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#D4FF00]" />
                Reset Simulated Dispatch & Rides
              </span>
              <span className="text-[10px] uppercase text-white/60">Demo</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3 bg-[#EF4444]/20 hover:bg-[#EF4444]/30 border-2 border-[#EF4444] text-[#FCA5A5] rounded font-mono text-xs font-bold transition-all"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-4 h-4 text-[#EF4444]" />
                End Driver Session
              </span>
              <span className="text-[10px] uppercase text-[#FCA5A5]/80">Exit</span>
            </button>
          </div>
        </div>

        {/* Right Column: Edit Profile & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-3 border-[#08071E] rounded-xl p-6 shadow-[5px_5px_0_#08071E]">
            <h3 className="font-heading font-black uppercase text-base text-[#08071E] mb-4 flex items-center gap-2 border-b-2 border-dashed border-[#08071E]/20 pb-3">
              <User className="w-5 h-5 text-[#3B38F5]" />
              Driver Personal & Payout Information
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                    <User className="w-4 h-4 text-[#08071E]/50 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                    Registered Mobile
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                    <Phone className="w-4 h-4 text-[#08071E]/50 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                    <Mail className="w-4 h-4 text-[#08071E]/50 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                    Commercial DL Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.license}
                      onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                    <FileCheck className="w-4 h-4 text-[#08071E]/50 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                    Payout Settlement UPI ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                    <CreditCard className="w-4 h-4 text-[#08071E]/50 absolute left-3 top-2.5" />
                  </div>
                  <span className="text-[10px] font-mono text-[#08071E]/60 mt-1 block">
                    Daily trip earnings (82% commission) will settle automatically to this VPA every midnight.
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#3B38F5] text-white font-heading font-black uppercase text-xs tracking-wider border-2 border-[#08071E] shadow-[3px_3px_0_#08071E] hover:bg-[#2e2bd0] transition-all"
                >
                  <Save className="w-4 h-4 text-[#D4FF00]" />
                  Save Credentials
                </button>
              </div>
            </form>
          </div>

          {/* Dispatch Preferences */}
          <div className="bg-white border-3 border-[#08071E] rounded-xl p-6 shadow-[5px_5px_0_#08071E]">
            <h3 className="font-heading font-black uppercase text-base text-[#08071E] mb-4 flex items-center gap-2 border-b-2 border-dashed border-[#08071E]/20 pb-3">
              <BellRing className="w-5 h-5 text-[#3B38F5]" />
              Dispatch & Audio Preferences
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <label className="flex items-center justify-between p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-bold text-[#08071E]">Incoming Request Sound Radar</p>
                  <p className="text-[11px] text-[#08071E]/60">Play audio pulse when new ride arrives in queue</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.soundAlerts}
                  onChange={(e) => setPreferences({ ...preferences, soundAlerts: e.target.checked })}
                  className="w-5 h-5 accent-[#3B38F5] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-bold text-[#08071E]">Auto-Accept High Rating Riders (4.8+)</p>
                  <p className="text-[11px] text-[#08071E]/60">Instantly accept top-tier requests within 2 km radius</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.autoAccept}
                  onChange={(e) => setPreferences({ ...preferences, autoAccept: e.target.checked })}
                  className="w-5 h-5 accent-[#3B38F5] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-bold text-[#08071E]">Prioritize Long-Distance Airport Routes</p>
                  <p className="text-[11px] text-[#08071E]/60">Give dispatch priority to fares exceeding ₹300</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.longTripsOnly}
                  onChange={(e) => setPreferences({ ...preferences, longTripsOnly: e.target.checked })}
                  className="w-5 h-5 accent-[#3B38F5] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-bold text-[#08071E]">Night Surge Flash Alerts</p>
                  <p className="text-[11px] text-[#08071E]/60">Show high-surge heatmaps after 10:00 PM</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.nightSurgeNotification}
                  onChange={(e) => setPreferences({ ...preferences, nightSurgeNotification: e.target.checked })}
                  className="w-5 h-5 accent-[#3B38F5] cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
