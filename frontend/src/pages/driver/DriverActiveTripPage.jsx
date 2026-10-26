import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Navigation,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useRide } from '../../hooks/useRide';
import { useAuth } from '../../hooks/useAuth';
import MapPanel from '../../components/MapPanel';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../../utils/formatters';

export default function DriverActiveTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    rides,
    driverMarkArriving,
    driverStartTrip,
    driverCompleteTrip,
  } = useRide();
  const { currentUser } = useAuth();

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const trip = rides.find((r) => r.id === id) || rides[0];

  if (!trip) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-neo-heading text-2xl text-white">Trip Not Found</h2>
        <Link
          to="/driver/dashboard"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#D4FF00] text-[#08071E] font-neo-heading text-xs font-black uppercase"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleAdvanceWorkflow = () => {
    if (trip.status === 'driver_assigned') {
      driverMarkArriving(trip.id);
    } else if (trip.status === 'driver_arriving') {
      driverStartTrip(trip.id);
    } else if (trip.status === 'in_progress') {
      setIsCompleteModalOpen(true);
    }
  };

  const handleConfirmComplete = () => {
    driverCompleteTrip(trip.id);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121033] border-2 border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B38F5] text-white flex items-center justify-center font-bold">
            <Car size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-neo-heading text-lg font-black uppercase text-white">
                Active Trip: {trip.id}
              </span>
              <StatusBadge status={trip.status} size="sm" />
            </div>
            <p className="font-neo-grotesk text-xs text-[#A5A1CE]">
              Assigned to {currentUser?.name} • Category: {trip.category?.name}
            </p>
          </div>
        </div>

        {/* Action button in header */}
        {['driver_assigned', 'driver_arriving', 'in_progress'].includes(trip.status) && (
          <button
            type="button"
            onClick={handleAdvanceWorkflow}
            className="px-5 py-2.5 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_#3B38F5] cursor-pointer"
          >
            {trip.status === 'driver_assigned' && 'Mark as Arrived at Pickup'}
            {trip.status === 'driver_arriving' && 'Start Passenger Trip'}
            {trip.status === 'in_progress' && 'Complete Trip & Collect Fare'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Management Controls & Passenger Card */}
        <div className="lg:col-span-6 space-y-6">
          {/* Workflow Action Panel */}
          <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 sm:p-7 shadow-[5px_5px_0_#08071E] space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-neo-heading text-xs sm:text-sm font-black uppercase text-white tracking-wider">
                Driver Navigation Protocol
              </span>
              <span className="font-neo-mono text-[10.5px] font-bold text-[#D4FF00] uppercase">
                Sequential Actions
              </span>
            </div>

            {/* Current Step Guidance */}
            <div className="p-4 rounded-2xl bg-[#08071E] border-2 border-white/10 space-y-2">
              <div className="font-neo-heading text-sm font-black uppercase text-[#D4FF00]">
                {trip.status === 'driver_assigned' && 'Step 1: Heading to Pickup Spot'}
                {trip.status === 'driver_arriving' && 'Step 2: Passenger Boarding'}
                {trip.status === 'in_progress' && 'Step 3: Highway Transit in Progress'}
                {trip.status === 'completed' && 'Step 4: Trip Successfully Concluded'}
                {trip.status === 'cancelled' && 'Trip Cancelled'}
              </div>

              <p className="font-neo-grotesk text-xs text-[#A5A1CE] leading-relaxed">
                {trip.status === 'driver_assigned' &&
                  `Navigate towards ${trip.pickup?.name}. When you arrive at the spot, click "Mark as Arriving".`}
                {trip.status === 'driver_arriving' &&
                  `Meet passenger ${trip.riderName}. Once boarded safely, click "Start Passenger Trip".`}
                {trip.status === 'in_progress' &&
                  `Follow highway route to ${trip.destination?.name}. Upon arrival, click "Complete Trip" to record earnings.`}
                {trip.status === 'completed' &&
                  `This trip has ended. ${formatCurrency(trip.driverEarnings)} has been credited to your simulated daily balance.`}
              </p>
            </div>

            {/* Primary Action Button */}
            {trip.status !== 'completed' && trip.status !== 'cancelled' && (
              <button
                type="button"
                onClick={handleAdvanceWorkflow}
                className="w-full py-4 px-4 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
              >
                {trip.status === 'driver_assigned' && 'Mark as Arrived at Pickup'}
                {trip.status === 'driver_arriving' && 'Start Passenger Trip'}
                {trip.status === 'in_progress' && 'Complete Trip & Collect Fare'}
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            )}

            {trip.status === 'completed' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 font-neo-grotesk text-xs sm:text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>Trip finalized. Payout credited to your driver wallet!</span>
              </div>
            )}
          </div>

          {/* Passenger Details Card */}
          <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-6 shadow-[6px_6px_0_#08071E] space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="font-neo-mono text-[11px] font-black uppercase text-neutral-400">
                Passenger Profile
              </span>
              <span className="font-neo-mono text-xs font-bold text-[#3B38F5] uppercase">
                {trip.paymentMethod} Payment
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#08071E] text-[#D4FF00] flex items-center justify-center font-bold text-base">
                  <User size={22} />
                </div>
                <div>
                  <h4 className="font-neo-heading text-base font-black uppercase text-[#08071E]">
                    {trip.riderName || 'Aryan Mehra'}
                  </h4>
                  <div className="text-xs font-neo-grotesk text-neutral-600 font-semibold">
                    ★ {trip.riderRating || '4.96'} Rating
                  </div>
                </div>
              </div>

              <a
                href="tel:+919876543210"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Simulated call to passenger ${trip.riderName || 'Aryan'}`);
                }}
                className="p-3 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] text-[#08071E] shadow-[2px_2px_0_#08071E] cursor-pointer"
                title="Call Passenger"
              >
                <Phone size={16} />
              </a>
            </div>

            {/* Earnings Calculation Breakdown */}
            <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-3 text-xs font-neo-grotesk">
              <div className="p-3 rounded-xl bg-[#F5F6FF]">
                <span className="text-neutral-500 text-[10.5px] font-neo-mono uppercase block">Rider Total Fare</span>
                <span className="font-neo-heading text-base font-black text-[#08071E]">
                  {formatCurrency(trip.finalFare || trip.estimatedFare)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#08071E] text-white">
                <span className="text-[#D4FF00] text-[10.5px] font-neo-mono uppercase block font-bold">
                  Your Net Payout (82%)
                </span>
                <span className="font-neo-heading text-lg font-black text-[#D4FF00]">
                  {formatCurrency(trip.driverEarnings || trip.estimatedFare * 0.82)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Route Map & Specifications */}
        <div className="lg:col-span-6 space-y-6">
          <MapPanel
            pickup={trip.pickup}
            destination={trip.destination}
            activeStatus={trip.status}
            height="h-80 sm:h-96"
          />

          <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E] space-y-4">
            <h3 className="font-neo-heading text-xs sm:text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Navigation size={15} className="text-[#D4FF00]" />
              <span>Route Waypoints</span>
            </h3>

            <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/20">
              <div>
                <div className="text-[10px] font-neo-mono uppercase text-[#A5A1CE]">Pickup Point</div>
                <div className="font-neo-heading text-xs font-black uppercase text-white truncate">
                  {trip.pickup?.name}
                </div>
                <div className="text-[11px] font-neo-grotesk text-[#A5A1CE] truncate">
                  {trip.pickup?.address}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-neo-mono uppercase text-[#A5A1CE]">Destination Drop</div>
                <div className="font-neo-heading text-xs font-black uppercase text-white truncate">
                  {trip.destination?.name}
                </div>
                <div className="text-[11px] font-neo-grotesk text-[#A5A1CE] truncate">
                  {trip.destination?.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Confirmation Modal */}
      <ConfirmModal
        isOpen={isCompleteModalOpen}
        title="Complete Trip & Collect Fare?"
        description={`Have you arrived safely at ${trip.destination?.name}? This will complete the trip, credit ${formatCurrency(trip.driverEarnings)} to your earnings, and notify the rider.`}
        confirmLabel="Yes, Complete Trip"
        cancelLabel="Continue Trip"
        onConfirm={handleConfirmComplete}
        onClose={() => setIsCompleteModalOpen(false)}
      />
    </div>
  );
}
