import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Navigation,
  MapPin,
  Car,
  Clock,
  ShieldCheck,
  CreditCard,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';
import { useRide } from '../../hooks/useRide';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDistance, formatDuration } from '../../utils/formatters';

const PAYMENT_OPTIONS = [
  { id: 'UPI', name: 'UPI / QR', desc: 'Google Pay, PhonePe, Paytm (Simulated)', badge: 'INSTANT' },
  { id: 'Cash', name: 'Cash to Driver', desc: 'Pay mock cash upon trip arrival', badge: 'ZERO FEE' },
  { id: 'Card', name: 'Debit / Credit Card', desc: 'Visa, Mastercard mock card', badge: 'REWARDS' },
];

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { bookingDraft, updateBookingDraft, createRideRequest } = useRide();
  const [selectedPayment, setSelectedPayment] = useState(bookingDraft.paymentMethod || 'UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Update payment method in draft
    updateBookingDraft({ paymentMethod: selectedPayment });

    setTimeout(() => {
      const createdRide = createRideRequest({
        ...bookingDraft,
        paymentMethod: selectedPayment,
      });
      setIsSubmitting(false);
      navigate(`/rider/ride/${createdRide.id}`);
    }, 600);
  };

  return (
    <div className="py-6 sm:py-10 max-w-3xl mx-auto space-y-8">
      {/* Step Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-bold uppercase tracking-wider mb-2">
          <Sparkles size={12} className="text-[#D4FF00]" />
          <span>STEP 2 OF 2 • REVIEW & CONFIRM DISPATCH</span>
        </div>
        <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
          CONFIRM YOUR BOOKING
        </h1>
        <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
          Review route specifications, payment preference, and request a driver.
        </p>
      </div>

      <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-6 sm:p-9 shadow-[8px_8px_0_#08071E] space-y-6">
        {/* Route Card Section */}
        <div className="p-5 rounded-2xl bg-[#F5F6FF] border-2 border-[#08071E] space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
            <span className="font-neo-mono text-[11px] font-black uppercase tracking-wider text-neutral-500">
              Selected Journey
            </span>
            <Link
              to="/rider/book"
              className="font-neo-mono text-xs font-bold text-[#3B38F5] hover:underline uppercase"
            >
              Edit Route →
            </Link>
          </div>

          <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-300">
            {/* Pickup */}
            <div className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#3B38F5] border-2 border-[#08071E]" />
              <div className="font-neo-heading text-sm font-black uppercase text-[#08071E]">
                {bookingDraft.pickup?.name}
              </div>
              <div className="font-neo-grotesk text-xs text-neutral-500">
                {bookingDraft.pickup?.address}
              </div>
            </div>

            {/* Destination */}
            <div className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#D4FF00] border-2 border-[#08071E]" />
              <div className="font-neo-heading text-sm font-black uppercase text-[#08071E]">
                {bookingDraft.destination?.name}
              </div>
              <div className="font-neo-grotesk text-xs text-neutral-500">
                {bookingDraft.destination?.address}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Vehicle Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#F5F6FF] border border-neutral-200">
            <span className="font-neo-mono text-[10px] text-neutral-500 uppercase block font-bold">Category</span>
            <span className="font-neo-heading text-base font-black text-[#08071E] uppercase">
              {bookingDraft.category?.name}
            </span>
            <span className="text-[11px] font-neo-grotesk text-neutral-500 block">
              Up to {bookingDraft.category?.capacity} passengers
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F6FF] border border-neutral-200">
            <span className="font-neo-mono text-[10px] text-neutral-500 uppercase block font-bold">Highway Route</span>
            <span className="font-neo-heading text-base font-black text-[#08071E]">
              {formatDistance(bookingDraft.distanceKm)}
            </span>
            <span className="text-[11px] font-neo-grotesk text-neutral-500 block">
              Est. {formatDuration(bookingDraft.durationMins)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#08071E] text-white border-2 border-[#08071E] shadow-[2px_2px_0_#3B38F5]">
            <span className="font-neo-mono text-[10px] text-[#D4FF00] uppercase block font-bold">Estimated Fare</span>
            <span className="font-neo-heading text-2xl font-black text-[#D4FF00]">
              {formatCurrency(bookingDraft.estimatedFare)}
            </span>
            <span className="text-[10px] font-neo-mono text-neutral-400 block uppercase">
              Deterministic Calc
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block font-neo-heading text-xs sm:text-sm font-black uppercase text-[#08071E] tracking-wider mb-3">
            Select Mock Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PAYMENT_OPTIONS.map((opt) => {
              const isSelected = selectedPayment === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedPayment(opt.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#08071E] text-white border-[#08071E] shadow-[3px_3px_0_#3B38F5]'
                      : 'bg-[#F5F6FF] text-[#08071E] border-neutral-300 hover:border-[#08071E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-neo-heading text-sm font-black uppercase">
                      {opt.name}
                    </span>
                    <span
                      className={`font-neo-mono text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-[#D4FF00] text-[#08071E]' : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  <p className={`text-[11px] font-neo-grotesk ${isSelected ? 'text-[#A5A1CE]' : 'text-neutral-500'}`}>
                    {opt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prototype Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#edf0ff] border border-[#3B38F5]/30 text-xs font-neo-grotesk text-[#08071E] flex items-center gap-2.5">
          <ShieldCheck size={18} className="text-[#3B38F5] shrink-0" />
          <span>
            <strong>Simulated Payment:</strong> No bank or card transaction will take place. This is a frontend demo record.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200">
          <Link
            to="/rider/book"
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-neutral-300 text-neutral-600 hover:text-black font-neo-heading text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Edit Route / Vehicle</span>
          </Link>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Dispatching Ride...' : 'Confirm & Request Driver'}</span>
            <ArrowRight size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
