import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  MapPin,
  Navigation,
  Clock,
  Car,
  ShieldCheck,
  Star,
  X,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useRide } from '../../hooks/useRide';
import { useAuth } from '../../hooks/useAuth';
import MapPanel from '../../components/MapPanel';
import StatusBadge from '../../components/StatusBadge';
import DriverCard from '../../components/DriverCard';
import ConfirmModal from '../../components/ConfirmModal';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../../utils/formatters';

const CANCELLATION_REASONS = [
  'Wait time is too long',
  'Driver not moving toward pickup',
  'Changed my travel plans',
  'Booked by mistake',
  'Found alternative transit',
];

export default function ActiveRidePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rides, cancelRide, submitRideRating, switchRole } = useRide();
  const { switchRole: switchAuthRole } = useAuth();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Find ride by ID or fallback to latest
  const ride = rides.find((r) => r.id === id) || rides[0];

  if (!ride) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-neo-heading text-2xl text-white">Ride Not Found</h2>
        <Link
          to="/rider/dashboard"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#D4FF00] text-[#08071E] font-neo-heading text-xs font-black uppercase"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isCancellable = ['searching', 'driver_assigned', 'driver_arriving'].includes(ride.status);

  const handleConfirmCancel = () => {
    cancelRide(ride.id, selectedReason);
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    submitRideRating(ride.id, ratingVal, ratingComment);
    setRatingSubmitted(true);
  };

  const handleTestAsDriver = () => {
    switchAuthRole('driver');
    navigate('/driver/requests');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121033] border-2 border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B38F5] border-2 border-[#08071E] text-white flex items-center justify-center font-bold">
            <Navigation size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-neo-heading text-lg font-black uppercase text-white">
                Trip ID: {ride.id}
              </span>
              <StatusBadge status={ride.status} size="sm" />
            </div>
            <p className="font-neo-grotesk text-xs text-[#A5A1CE]">
              Created {formatDateTime(ride.createdAt)} • Category: {ride.category?.name}
            </p>
          </div>
        </div>

        {/* Action if Searching */}
        {ride.status === 'searching' && (
          <button
            type="button"
            onClick={handleTestAsDriver}
            className="px-4 py-2 rounded-xl bg-[#D4FF00] text-[#08071E] border border-[#08071E] font-neo-heading text-xs font-black uppercase shadow-[2px_2px_0_#3B38F5] hover:scale-105 transition-transform cursor-pointer"
          >
            ⚡ Switch to Driver & Accept Ride
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Status & Driver Info */}
        <div className="lg:col-span-6 space-y-6">
          {/* Status Progression Card */}
          <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E] space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-neo-heading text-xs sm:text-sm font-black uppercase text-white tracking-wider">
                Trip Status Timeline
              </span>
              <span className="font-neo-mono text-[10.5px] font-bold text-[#D4FF00] uppercase">
                Synchronized State
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4">
              {[
                { key: 'searching', title: '1. Searching for Drivers', desc: 'Request broadcasted to online demo drivers' },
                { key: 'driver_assigned', title: '2. Driver Assigned', desc: 'Driver confirmed and preparing to navigate' },
                { key: 'driver_arriving', title: '3. Driver Arriving', desc: 'Approaching your campus pickup location' },
                { key: 'in_progress', title: '4. Trip In Progress', desc: 'On highway towards destination' },
                { key: 'completed', title: '5. Trip Completed', desc: 'Safe arrival at destination' },
              ].map((step, index) => {
                const statusOrder = ['searching', 'driver_assigned', 'driver_arriving', 'in_progress', 'completed'];
                const currentIndex = statusOrder.indexOf(ride.status);
                const isPassed = currentIndex >= index;
                const isCurrent = ride.status === step.key;

                return (
                  <div key={step.key} className="flex items-start gap-3.5 relative">
                    {index < 4 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-7 ${
                          isPassed ? 'bg-[#D4FF00]' : 'bg-white/10'
                        }`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-neo-mono text-xs font-black transition-all ${
                        isCurrent
                          ? 'bg-[#D4FF00] text-[#08071E] border-[#08071E] shadow-[2px_2px_0_#3B38F5] animate-pulse'
                          : isPassed
                          ? 'bg-[#3B38F5] text-white border-[#08071E]'
                          : 'bg-[#08071E] text-neutral-500 border-white/20'
                      }`}
                    >
                      {isPassed && !isCurrent ? '✓' : index + 1}
                    </div>

                    <div className="flex-1">
                      <div
                        className={`font-neo-heading text-xs sm:text-sm font-black uppercase ${
                          isCurrent ? 'text-[#D4FF00]' : isPassed ? 'text-white' : 'text-neutral-500'
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="font-neo-grotesk text-xs text-[#A5A1CE]">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cancel Button if cancellable */}
            {isCancellable && (
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full py-3 rounded-xl border-2 border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-neo-heading text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel Ride
              </button>
            )}
          </div>

          {/* Assigned Driver Card */}
          {ride.assignedDriver ? (
            <DriverCard driver={ride.assignedDriver} />
          ) : (
            <div className="p-6 rounded-3xl bg-[#121033] border-2 border-white/15 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#08071E] border-2 border-[#D4FF00] shadow-[3px_3px_0_#3B38F5] flex items-center justify-center text-[#D4FF00] mx-auto animate-spin" style={{ animationDuration: '4s' }}>
                <Compass size={24} />
              </div>
              <h4 className="font-neo-heading text-sm font-black uppercase text-white">
                Finding Your Driver
              </h4>
              <p className="font-neo-grotesk text-xs text-[#A5A1CE] max-w-sm mx-auto">
                Nearby drivers in Rajpura / Chandigarh have received your booking. You can switch to Driver mode to accept it!
              </p>
            </div>
          )}

          {/* Trip Completed Rating Form */}
          {ride.status === 'completed' && (
            <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-6 shadow-[6px_6px_0_#08071E] space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={22} className="text-emerald-600" />
                <h3 className="font-neo-heading text-lg font-black uppercase">
                  Rate Your Experience
                </h3>
              </div>

              {!ratingSubmitted ? (
                <form onSubmit={handleSubmitRating} className="space-y-4">
                  <div>
                    <label className="block font-neo-mono text-[10.5px] font-bold text-neutral-500 uppercase mb-2">
                      Star Rating (Simulated)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingVal(star)}
                          className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                        >
                          {star <= ratingVal ? '⭐' : '☆'}
                        </button>
                      ))}
                      <span className="font-neo-mono text-xs font-black ml-2">
                        {ratingVal}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-neo-mono text-[10.5px] font-bold text-neutral-500 uppercase mb-1">
                      Feedback Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="e.g. Great highway driving and on-time pickup!"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#08071E] bg-[#F5F6FF] text-xs font-neo-grotesk font-semibold text-[#08071E] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl border-2 border-[#08071E] bg-[#08071E] text-[#D4FF00] font-neo-heading text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_#3B38F5] cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-neo-grotesk font-bold">
                  ✓ Thank you! Your feedback has been simulated and saved.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Route Map & Fare Details */}
        <div className="lg:col-span-6 space-y-6">
          <MapPanel
            pickup={ride.pickup}
            destination={ride.destination}
            activeStatus={ride.status}
            height="h-80 sm:h-96"
          />

          {/* Route & Receipt Box */}
          <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-neo-heading text-xs sm:text-sm font-black uppercase text-white tracking-wider">
                Ride Specifications
              </span>
              <span className="font-neo-mono text-[10.5px] font-bold text-[#D4FF00] uppercase">
                {ride.paymentMethod}
              </span>
            </div>

            <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/20">
              <div>
                <div className="text-[10px] font-neo-mono uppercase text-[#A5A1CE]">Pickup</div>
                <div className="font-neo-heading text-xs font-black uppercase text-white truncate">
                  {ride.pickup?.name}
                </div>
                <div className="text-[11px] font-neo-grotesk text-[#A5A1CE] truncate">
                  {ride.pickup?.address}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-neo-mono uppercase text-[#A5A1CE]">Destination</div>
                <div className="font-neo-heading text-xs font-black uppercase text-white truncate">
                  {ride.destination?.name}
                </div>
                <div className="text-[11px] font-neo-grotesk text-[#A5A1CE] truncate">
                  {ride.destination?.address}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center font-neo-grotesk">
              <div className="p-2.5 rounded-xl bg-[#08071E] border border-white/10">
                <span className="font-neo-mono text-[9px] uppercase text-[#A5A1CE] block">Distance</span>
                <span className="font-bold text-white text-xs">{formatDistance(ride.distanceKm)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#08071E] border border-white/10">
                <span className="font-neo-mono text-[9px] uppercase text-[#A5A1CE] block">Est. Time</span>
                <span className="font-bold text-white text-xs">{formatDuration(ride.durationMins)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#08071E] border border-white/10">
                <span className="font-neo-mono text-[9px] uppercase text-[#A5A1CE] block">Fare</span>
                <span className="font-black text-[#D4FF00] text-xs">
                  {formatCurrency(ride.finalFare || ride.estimatedFare)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancel This Ride?"
        description="Are you sure you want to cancel your simulated booking? You will not be charged any cancellation fee."
        confirmLabel="Confirm Cancellation"
        cancelLabel="Keep Booking"
        isDanger={true}
        onConfirm={handleConfirmCancel}
        onClose={() => setIsCancelModalOpen(false)}
      >
        <div>
          <label className="block font-neo-mono text-[10.5px] font-bold text-neutral-400 uppercase mb-2">
            Reason for cancellation
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="w-full bg-[#121033] border-2 border-white/20 rounded-xl px-3 py-2 text-xs font-neo-grotesk text-white focus:outline-none"
          >
            {CANCELLATION_REASONS.map((r, i) => (
              <option key={i} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </ConfirmModal>
    </div>
  );
}
