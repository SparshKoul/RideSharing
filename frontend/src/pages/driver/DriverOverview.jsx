import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Car, Activity, ArrowRight, AlertCircle } from 'lucide-react';
import { getDrivers, getRides, toApiId } from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

/** Read-only driver preview backed by Supabase. Full driver workflow is on the roadmap. */
export default function DriverOverview() {
  const [driver, setDriver] = useState(null);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const drivers = await getDrivers();
        const demo = drivers.find((d) => d.id === 'driver-1') || drivers[0];
        setDriver(demo);
        if (demo) {
          const all = await getRides(false);
          setRides(all.filter((r) => r.driverId === toApiId(demo.id, 'drivers')));
        }
      } catch (err) {
        setError(err.message || 'Could not load driver data');
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200">
          <AlertCircle size={18} />
          <span className="font-neo-grotesk text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-7">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-black uppercase tracking-wider mb-3">
          <Activity size={11} />
          Driver Portal Preview
        </div>
        <h1 className="font-neo-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          Driver Workspace
        </h1>
        <p className="font-neo-grotesk text-sm text-[#A5A1CE] mt-2">
          Driver profiles and assigned rides loaded from Supabase. Full driver workflow is on the roadmap.
        </p>
      </div>

      {driver && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121033] border-2 border-white/15 shadow-[5px_5px_0_#08071E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D4FF00] border-3 border-[#08071E] flex items-center justify-center text-[#08071E] font-black text-2xl shrink-0">
              {driver.name?.charAt(0)}
            </div>
            <div>
              <h2 className="font-neo-heading text-xl sm:text-2xl font-black uppercase text-white">
                {driver.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2 font-neo-mono text-[10px] font-bold uppercase">
                <span className="px-2 py-1 rounded-lg bg-[#D4FF00]/15 text-[#D4FF00] flex items-center gap-1">
                  <Star size={11} /> {driver.rating} rating
                </span>
                <span className="px-2 py-1 rounded-lg bg-[#3B38F5]/20 text-white flex items-center gap-1">
                  <Car size={11} /> {driver.tripsCompleted} trips
                </span>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right font-neo-grotesk text-xs text-[#A5A1CE]">
            <div className="font-black text-white text-sm">{driver.vehicle?.model}</div>
            <div>{driver.vehicle?.plateNumber} · {driver.vehicle?.color}</div>
            <div className="mt-1">{driver.email}</div>
          </div>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-[#121033] border-2 border-white/15 shadow-[5px_5px_0_#08071E]">
        <h3 className="font-neo-heading text-lg font-black uppercase text-white mb-5">
          Assigned Rides <span className="text-[#D4FF00]">({rides.length})</span>
        </h3>
        {rides.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {rides.map((ride) => (
              <li key={ride.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-neo-heading text-sm font-black uppercase text-white">
                      {ride.pickup?.name} → {ride.destination?.name}
                    </span>
                    <StatusBadge status={ride.status} />
                  </div>
                  <div className="font-neo-grotesk text-xs text-[#A5A1CE] mt-1">
                    {formatDateTime(ride.createdAt)} · {ride.category?.name}
                  </div>
                </div>
                <div className="font-neo-heading text-base font-black text-[#D4FF00]">
                  {formatCurrency(ride.finalFare || ride.estimatedFare)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-neo-grotesk text-sm text-[#A5A1CE] py-4">
            No rides assigned yet in the database.
          </p>
        )}
      </div>

      <Link
        to="/rider/dashboard"
        className="inline-flex items-center gap-2 font-neo-mono text-xs font-bold text-[#D4FF00] uppercase hover:underline"
      >
        Back to rider dashboard <ArrowRight size={13} />
      </Link>
    </div>
  );
}
