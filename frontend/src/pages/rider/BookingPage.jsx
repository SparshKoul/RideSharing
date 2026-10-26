import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  MapPin,
  ArrowUpDown,
  Car,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  Sparkles,
  Info,
} from 'lucide-react';
import { useRide } from '../../hooks/useRide';
import { useAuth } from '../../hooks/useAuth';
import LocationInput from '../../components/LocationInput';
import RideOptionCard from '../../components/RideOptionCard';
import MapPanel from '../../components/MapPanel';
import { RIDE_CATEGORIES } from '../../data/rideCategories';
import { calculateCategoryOptions } from '../../utils/fareCalculator';
import { formatCurrency, formatDistance, formatDuration } from '../../utils/formatters';

export default function BookingPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const {
    bookingDraft,
    updateBookingDraft,
    swapPickupAndDestination,
    addToast,
  } = useRide();

  const [validationError, setValidationError] = useState('');

  // Calculate live options for the current pickup/destination
  const categoryOptions = calculateCategoryOptions(
    bookingDraft.pickup?.id,
    bookingDraft.destination?.id
  );

  const handleSelectCategory = (cat) => {
    updateBookingDraft({ category: cat });
  };

  const handleProceed = () => {
    if (!bookingDraft.pickup || !bookingDraft.destination) {
      setValidationError('Please select both a pickup and a destination.');
      return;
    }
    if (bookingDraft.pickup.id === bookingDraft.destination.id) {
      setValidationError('Pickup and destination cannot be the same location.');
      return;
    }

    setValidationError('');
    navigate('/rider/confirm');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-bold uppercase tracking-wider mb-2 shadow-[2px_2px_0_#08071E]">
          <Navigation size={12} className="text-[#D4FF00]" />
          <span>STEP 1 OF 2 • ROUTE & VEHICLE SELECTION</span>
        </div>
        <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
          CHOOSE YOUR RIDE
        </h1>
        <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
          Compare transparent fares across Economy, Comfort, and XL categories.
        </p>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-300 font-neo-grotesk text-xs sm:text-sm font-semibold flex items-center gap-2">
          <span>⚠️ {validationError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Location inputs & category cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Location Selection Box */}
          <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-neo-heading text-xs sm:text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                <MapPin size={15} className="text-[#D4FF00]" />
                <span>Pickup & Destination</span>
              </span>
              <button
                type="button"
                onClick={swapPickupAndDestination}
                className="p-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-[#D4FF00] transition-colors cursor-pointer flex items-center gap-1.5 font-neo-mono text-[10px] font-bold uppercase"
              >
                <ArrowUpDown size={12} />
                <span>Swap</span>
              </button>
            </div>

            <div className="space-y-4">
              <LocationInput
                label="Pickup Spot"
                value={bookingDraft.pickup}
                onChange={(loc) => updateBookingDraft({ pickup: loc })}
                isPickup={true}
              />

              <LocationInput
                label="Destination Spot"
                value={bookingDraft.destination}
                onChange={(loc) => updateBookingDraft({ destination: loc })}
                isPickup={false}
              />
            </div>

            {/* Quick Favorites Shortcuts */}
            {currentUser?.savedPlaces?.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="font-neo-mono text-[10px] font-bold text-[#A5A1CE] uppercase mr-1">
                  Saved:
                </span>
                {currentUser.savedPlaces.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      // Set as destination
                      const matched = { id: p.locationId, name: p.title, address: p.address };
                      updateBookingDraft({ destination: matched });
                    }}
                    className="px-2.5 py-1 rounded-lg border border-white/10 bg-[#08071E] hover:border-[#D4FF00] text-[11px] font-neo-grotesk font-semibold text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Bookmark size={11} className="text-[#D4FF00]" />
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ride Category Cards */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="font-neo-heading text-xs sm:text-sm font-black uppercase text-white tracking-wider">
                Select Vehicle Category
              </span>
              <span className="font-neo-mono text-[10.5px] font-bold text-[#D4FF00] uppercase">
                {categoryOptions.length} Options Available
              </span>
            </div>

            <div className="space-y-3">
              {categoryOptions.map((cat) => (
                <RideOptionCard
                  key={cat.id}
                  category={cat}
                  isSelected={bookingDraft.category?.id === cat.id}
                  onSelect={() => handleSelectCategory(cat)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Route Map & Confirmation CTA */}
        <div className="lg:col-span-5 space-y-6">
          {/* Map Preview */}
          <MapPanel
            pickup={bookingDraft.pickup}
            destination={bookingDraft.destination}
            height="h-72 sm:h-80"
          />

          {/* Pricing Summary Card */}
          <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E] space-y-4">
            <h3 className="font-neo-heading text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Sparkles size={16} className="text-[#D4FF00]" />
              <span>Booking Summary</span>
            </h3>

            <div className="divide-y divide-white/10 text-xs font-neo-grotesk space-y-2.5">
              <div className="flex justify-between pt-2">
                <span className="text-[#A5A1CE]">Vehicle Type</span>
                <span className="font-bold text-white uppercase">{bookingDraft.category?.name}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[#A5A1CE]">Estimated Distance</span>
                <span className="font-bold text-white">{formatDistance(bookingDraft.distanceKm)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[#A5A1CE]">Estimated Trip Duration</span>
                <span className="font-bold text-white">{formatDuration(bookingDraft.durationMins)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[#A5A1CE]">Payment Option</span>
                <span className="font-bold text-[#D4FF00] uppercase font-neo-mono">
                  {bookingDraft.paymentMethod || 'UPI'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#08071E] border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-neo-mono text-[10px] text-neutral-400 uppercase font-bold block">
                  Total Estimated Fare
                </span>
                <span className="text-[10px] text-[#A5A1CE] font-neo-grotesk">Taxes & fees included</span>
              </div>
              <div className="font-neo-heading text-2xl font-black text-[#D4FF00]">
                {formatCurrency(bookingDraft.estimatedFare)}
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-4 px-4 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
            >
              <span>Continue to Confirmation</span>
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
