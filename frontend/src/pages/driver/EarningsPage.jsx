import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Car,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useRide } from '../../hooks/useRide';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/StatCard';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../../utils/formatters';

const DAILY_DATA = [
  { time: '08:00', earnings: 180 },
  { time: '11:00', earnings: 420 },
  { time: '14:00', earnings: 610 },
  { time: '17:00', earnings: 980 },
  { time: '20:00', earnings: 1450 },
  { time: '23:00', earnings: 1840 },
];

const WEEKLY_DATA = [
  { period: 'Mon', earnings: 1240 },
  { period: 'Tue', earnings: 1890 },
  { period: 'Wed', earnings: 1450 },
  { period: 'Thu', earnings: 2100 },
  { period: 'Fri', earnings: 2750 },
  { period: 'Sat', earnings: 3400 },
  { period: 'Sun', earnings: 1840 },
];

const MONTHLY_DATA = [
  { period: 'Week 1', earnings: 9800 },
  { period: 'Week 2', earnings: 12400 },
  { period: 'Week 3', earnings: 11250 },
  { period: 'Week 4', earnings: 14800 },
];

export default function EarningsPage() {
  const { currentUser } = useAuth();
  const { completedTrips, driverTodayEarnings, driverTotalEarnings } = useRide();
  const [timeframe, setTimeframe] = useState('weekly'); // 'daily', 'weekly', 'monthly'

  const chartData = timeframe === 'daily' ? DAILY_DATA : timeframe === 'weekly' ? WEEKLY_DATA : MONTHLY_DATA;
  const dataKey = timeframe === 'daily' ? 'time' : 'period';

  const driverTrips = completedTrips.filter((t) => t.status === 'completed');
  const avgEarnings = driverTrips.length > 0
    ? Math.round(driverTrips.reduce((acc, t) => acc + (t.driverEarnings || 350), 0) / driverTrips.length)
    : 345;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-bold uppercase tracking-wider mb-2">
          <DollarSign size={12} className="text-[#D4FF00]" />
          <span>PAYOUTS & ANALYTICS</span>
        </div>
        <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
          DRIVER EARNINGS
        </h1>
        <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
          Simulated commission revenue analytics. 82% of every rider fare is allocated to the driver.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Today's Payout"
          value={formatCurrency(driverTodayEarnings)}
          subtitle="7 trips completed"
          icon={DollarSign}
          color="lime"
        />
        <StatCard
          title="Weekly Revenue"
          value={formatCurrency(currentUser?.weeklyEarnings || 14800)}
          subtitle="Mon - Sun tally"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Avg Payout / Trip"
          value={formatCurrency(avgEarnings)}
          subtitle="Based on completed rides"
          icon={Car}
          color="navy"
        />
        <StatCard
          title="Platform Commission"
          value="18%"
          subtitle="82% driver net payout"
          icon={CheckCircle2}
          color="lime"
        />
      </div>

      {/* Recharts Analytics Card */}
      <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 sm:p-8 shadow-[5px_5px_0_#08071E] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-neo-heading text-lg font-black uppercase text-white tracking-tight">
              Revenue Chart ({timeframe})
            </h3>
            <p className="font-neo-grotesk text-xs text-[#A5A1CE]">
              Daily and cyclical simulated revenue milestones.
            </p>
          </div>

          {/* Timeframe switch */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#08071E] border border-white/15">
            {['daily', 'weekly', 'monthly'].map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-xl font-neo-heading text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#D4FF00] text-[#08071E] shadow-[2px_2px_0_#08071E]'
                    : 'text-[#A5A1CE] hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22204c" />
              <XAxis dataKey={dataKey} stroke="#A5A1CE" fontSize={11} fontFamily="'Space Mono', monospace" />
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
                formatter={(val) => [`₹${val}`, 'Driver Payout']}
              />
              <Bar dataKey="earnings" fill="#D4FF00" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Notice */}
      <div className="p-4 rounded-2xl bg-[#121033] border border-white/10 flex items-center gap-3 text-xs font-neo-grotesk text-[#A5A1CE]">
        <ShieldCheck size={20} className="text-[#3B38F5] shrink-0" />
        <div>
          <strong className="text-white uppercase font-neo-heading">Prototype Notice:</strong> All figures shown are simulated for this demonstration. No actual bank transfers or real currency are transacted.
        </div>
      </div>
    </div>
  );
}
