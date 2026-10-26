import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Car, MapPin, Navigation, Clock, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { useRide } from '../../hooks/useRide';
import StatusBadge from '../../components/StatusBadge';
import DriverCard from '../../components/DriverCard';
import MapPanel from '../../components/MapPanel';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '../../utils/formatters';

export default function TripDetailsPage() {
  const { id } = useParams();
  const { rides } = useRide();

  const trip = rides.find((r) => r.id === id);

  if (!trip) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="font-neo-heading text-2xl text-white">Trip Not Found</h2>
        <Link
          to="/rider/trips"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#D4FF00] text-[#08071E] font-neo-heading text-xs font-black uppercase"
        >
          Back to Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/rider/trips"
          className="inline-flex items-center gap-1.5 font-neo-mono text-xs font-bold text-[#A5A1CE] hover:text-white uppercase mb-3"
        >
          <ArrowLeft size={14} />
          <span>Back to All Trips</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                TRIP {trip.id}
              </h1>
              <StatusBadge status={trip.status} />
            </div>
            <p className="font-neo-grotesk text-xs text-[#A5A1CE]">
              Completed on {formatDateTime(trip.createdAt)} • Payment Method: {trip.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Route & Receipt */}
        <div className="lg:col-span-7 space-y-6">
          {/* Route Card */}
          <div className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E] space-y-4">
            <h3 className="font-neo-heading text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Navigation size={15} className="text-[#D4FF00]" />
              <span>Route Traveled</span>
            </h3>

            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/15">
              <div>
                <div className="text-[10px] font-neo-mono uppercase text-[#A5A1CE]">Pickup Point</div>
                <div className="font-neo-heading text-sm font-black uppercase text-white">
                  {trip.pickup?.name}
                </div>
                <div className="text-xs font-neo-grotesk text-[#A5A1CE]">
                  {trip.pickup?.address}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-neo-mono uppercase text-[#A5A1CE]">Destination Drop</div>
                <div className="font-neo-heading text-sm font-black uppercase text-white">
                  {trip.destination?.name}
                </div>
                <div className="text-xs font-neo-grotesk text-[#A5A1CE]">
                  {trip.destination?.address}
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Driver */}
          {trip.assignedDriver && (
            <div>
              <div className="font-neo-mono text-[11px] font-black uppercase text-[#A5A1CE] tracking-wider mb-2">
                Assigned Fleet Driver
              </div>
              <DriverCard driver={trip.assignedDriver} />
            </div>
          )}

          {/* Simulated Receipt Breakdown */}
          <div className="bg-white text-[#08071E] rounded-3xl border-3 border-[#08071E] p-6 shadow-[6px_6px_0_#08071E] space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#3B38F5]" />
                <h3 className="font-neo-heading text-base font-black uppercase">
                  Simulated Fare Receipt
                </h3>
              </div>
              <span className="font-neo-mono text-[10px] font-bold text-neutral-400 uppercase">
                Demo Invoice
              </span>
            </div>

            <div className="divide-y divide-neutral-100 text-xs font-neo-grotesk space-y-2">
              <div className="flex justify-between pt-2">
                <span className="text-neutral-500">Base Fare ({trip.category?.name})</span>
                <span className="font-bold">₹{trip.category?.baseFare || 50}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-500">Distance Charges ({formatDistance(trip.distanceKm)})</span>
                <span className="font-bold">
                  ₹{Math.round((trip.distanceKm || 10) * (trip.category?.ratePerKm || 14))}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-500">Time Surcharge ({formatDuration(trip.durationMins)})</span>
                <span className="font-bold">
                  ₹{Math.round((trip.durationMins || 20) * (trip.category?.ratePerMin || 2))}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-neutral-500">Platform Transit Fee</span>
                <span className="font-bold text-emerald-600">Free (Demo)</span>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-[#08071E] flex items-center justify-between">
              <div>
                <span className="font-neo-heading text-sm font-black uppercase block">
                  Total Paid
                </span>
                <span className="font-neo-mono text-[10px] text-neutral-500 uppercase">
                  {trip.paymentMethod} • Zero real charge
                </span>
              </div>
              <span className="font-neo-heading text-2xl font-black text-[#08071E]">
                {formatCurrency(trip.finalFare || trip.estimatedFare)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Route Map */}
        <div className="lg:col-span-5 space-y-6">
          <MapPanel
            pickup={trip.pickup}
            destination={trip.destination}
            height="h-80 sm:h-96"
          />

          <div className="p-5 rounded-2xl bg-[#121033] border border-white/10 text-xs font-neo-grotesk text-[#A5A1CE] space-y-2">
            <div className="font-neo-heading text-xs font-black uppercase text-white flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#D4FF00]" />
              <span>Trip Verification Details</span>
            </div>
            <p>
              Trip {trip.id} completed on the simulated campus transit network. Coordinates and route segments correspond to the Chandigarh-Patiala highway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
