import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Car,
  DollarSign,
  Activity,
  Inbox,
  Power,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import RideCard from '../../components/RideCard';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../../utils/formatters';

const WEEKLY_CHART_DATA = [
  { day: 'Mon', earnings: 1240, trips: 5 },
  { day: 'Tue', earnings: 1890, trips: 7 },
  { day: 'Wed', earnings: 1450, trips: 6 },
  { day: 'Thu', earnings: 2100, trips: 8 },
  { day: 'Fri', earnings: 2750, trips: 11 },
  { day: 'Sat', earnings: 3400, trips: 14 },
  { day: 'Sun', earnings: 1840, trips: 7 },
];

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    driverOnline,
    setDriverOnline,
    pendingRequests,
    driverActiveTrip,
    driverAcceptRide,
    driverRejectRide,
    completedTrips,
    driverTodayEarnings,
    driverTotalEarnings,
    createSampleRequest,
  } = useRide();

  const handleAccept = (rideId) => {
    const success = driverAcceptRide(rideId, currentUser);
    if (success) {
      navigate(`/driver/trip/${rideId}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Driver Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#121033] border-2 border-white/15 shadow-[5px_5px_0_#08071E]">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="Driver Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-3 border-[#08071E] shadow-[3px_3px_0_#D4FF00]"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-neo-heading text-xl sm:text-2xl font-black uppercase text-white">
                {currentUser?.name || 'Driver'}
              </span>
              <span className="font-neo-mono text-[10px] font-black bg-[#D4FF00] text-[#08071E] px-2 py-0.5 rounded uppercase">
                ★ {currentUser?.rating || 4.9} PRO
              </span>
            </div>
            <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
              Vehicle: <strong className="text-white">{currentUser?.vehicle?.model}</strong> • {currentUser?.vehicle?.plateNumber}
            </p>
          </div>
        </div>

        {/* Online / Offline Switch */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDriverOnline(!driverOnline)}
            className={`px-6 py-3.5 rounded-2xl border-3 border-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2.5 shadow-[3px_3px_0_#08071E] transition-all cursor-pointer ${
              driverOnline
                ? 'bg-[#D4FF00] text-[#08071E] shadow-[3px_3px_0_#3B38F5]'
                : 'bg-neutral-800 text-neutral-300'
            }`}
          >
            <Power size={18} strokeWidth={3} />
            <span>{driverOnline ? "YOU'RE ONLINE" : "YOU'RE OFFLINE"}</span>
          </button>
        </div>
      </div>

      {/* Active Trip Alert Box (If trip in progress) */}
      {driverActiveTrip && (
        <div className="p-6 rounded-3xl bg-white text-[#08071E] border-3 border-[#08071E] shadow-[6px_6px_0_#3B38F5] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3B38F5] text-white flex items-center justify-center shrink-0">
              <Activity size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-neo-mono text-xs font-black uppercase text-neutral-500">
                  {driverActiveTrip.id}
                </span>
                <StatusBadge status={driverActiveTrip.status} size="sm" />
              </div>
              <h3 className="font-neo-heading text-lg sm:text-xl font-black uppercase leading-tight">
                Assigned Trip: {driverActiveTrip.destination?.name}
              </h3>
              <p className="font-neo-grotesk text-xs text-neutral-600 mt-0.5">
                Rider: {driverActiveTrip.riderName} • Payout: {formatCurrency(driverActiveTrip.driverEarnings)}
              </p>
            </div>
          </div>

          <Link
            to={`/driver/trip/${driverActiveTrip.id}`}
            className="px-6 py-3.5 rounded-xl border-2 border-[#08071E] bg-[#08071E] text-[#D4FF00] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_#3B38F5] transition-all cursor-pointer"
          >
            <span>Manage Active Trip</span>
            <ArrowRight size={15} strokeWidth={3} />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Today's Earnings"
          value={formatCurrency(driverTodayEarnings)}
          subtitle="82% driver share"
          icon={DollarSign}
          color="lime"
        />
        <StatCard
          title="Available Requests"
          value={driverOnline ? pendingRequests.length : 'Offline'}
          subtitle={driverOnline ? 'Awaiting acceptance' : 'Switch online to view'}
          icon={Inbox}
          color="blue"
        />
        <StatCard
          title="Completed Trips"
          value={completedTrips.length + (currentUser?.tripsCompleted || 0)}
          subtitle="All-time simulated rides"
          icon={CheckCircle2}
          color="navy"
        />
        <StatCard
          title="Driver Rating"
          value="4.92 ★"
          subtitle="Based on student reviews"
          icon={Star}
          color="lime"
        />
      </div>

      {/* Incoming Requests Panel & Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-neo-heading text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Inbox size={22} className="text-[#D4FF00]" />
              <span>Incoming Ride Requests ({pendingRequests.length})</span>
            </h2>
            <p className="font-neo-grotesk text-xs text-[#A5A1CE]">
              {driverOnline
                ? 'Requests created by riders in the same browser session show up here in real time.'
                : 'You are currently offline. Switch to Online mode above to receive requests.'}
            </p>
          </div>

          <button
            type="button"
            onClick={createSampleRequest}
            className="px-4 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-neo-mono text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            + Create Sample Request
          </button>
        </div>

        {driverOnline && pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((req) => (
              <RideCard
                key={req.id}
                ride={req}
                isDriverView={true}
                onAccept={handleAccept}
                onReject={driverRejectRide}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#121033] border-2 border-dashed border-white/15 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#08071E] border-2 border-[#3B38F5] text-[#3B38F5] flex items-center justify-center mx-auto">
              <Inbox size={24} />
            </div>
            <h4 className="font-neo-heading text-base font-black uppercase text-white">
              {driverOnline ? 'No Pending Requests In Queue' : "You're Offline"}
            </h4>
            <p className="font-neo-grotesk text-xs text-[#A5A1CE] max-w-md mx-auto">
              {driverOnline
                ? 'Book a ride from the Rider dashboard or click "+ Create Sample Request" to test accepting rides instantly!'
                : 'Turn your status to ONLINE to start receiving live passenger ride dispatches.'}
            </p>
            {driverOnline && (
              <button
                type="button"
                onClick={createSampleRequest}
                className="mt-2 px-5 py-2.5 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_#3B38F5] cursor-pointer"
              >
                Generate Demo Passenger Request
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recharts Earnings Analytics Chart */}
      <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 sm:p-8 shadow-[5px_5px_0_#08071E] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[#D4FF00]" />
              <h3 className="font-neo-heading text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                Weekly Earnings Overview
              </h3>
            </div>
            <p className="font-neo-grotesk text-xs text-[#A5A1CE] mt-0.5">
              Simulated revenue trajectory across recent operating days.
            </p>
          </div>

          <Link
            to="/driver/earnings"
            className="font-neo-mono text-xs font-bold text-[#D4FF00] hover:underline uppercase flex items-center gap-1"
          >
            <span>Full Analytics Report →</span>
          </Link>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_CHART_DATA}>
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D4FF00" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#22204c" />
              <XAxis dataKey="day" stroke="#A5A1CE" fontSize={11} fontFamily="'Space Mono', monospace" />
              <YAxis stroke="#A5A1CE" fontSize={11} fontFamily="'Space Mono', monospace" tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#08071E',
                  borderColor: '#D4FF00',
                  borderRadius: '12px',
                  borderWidth: '2px',
                  color: '#ffffff',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                formatter={(val) => [`₹${val}`, 'Driver Earnings']}
              />
              <Area type="monotone" dataKey="earnings" stroke="#D4FF00" strokeWidth={3} fillOpacity={1} fill="url(#earningsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
