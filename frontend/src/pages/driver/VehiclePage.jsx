import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Save, 
  Sparkles,
  Palette,
  Users,
  Calendar,
  Hash
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RIDE_CATEGORIES } from '../../data/rideCategories';
import { useRide } from '../../hooks/useRide';

export default function VehiclePage() {
  const { user, updateDriverVehicle } = useAuth();
  const { addToast } = useRide();

  const currentVehicle = user?.vehicle || {
    model: 'Hyundai Verna',
    plate: 'CH 01 AB 8921',
    color: 'Phantom Black',
    category: 'comfort',
    capacity: 4,
    year: '2023'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    model: currentVehicle.model || 'Hyundai Verna',
    plate: currentVehicle.plate || 'CH 01 AB 8921',
    color: currentVehicle.color || 'Phantom Black',
    category: currentVehicle.category || 'comfort',
    capacity: currentVehicle.capacity || 4,
    year: currentVehicle.year || '2023'
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (updateDriverVehicle) {
      updateDriverVehicle(formData);
    }
    setIsEditing(false);
    addToast('Vehicle information updated successfully!', 'success');
  };

  const activeCategory = RIDE_CATEGORIES.find(c => c.id === formData.category) || RIDE_CATEGORIES[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-3 border-[#08071E] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#D4FF00] border-2 border-[#08071E] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Car className="w-3.5 h-3.5 text-[#08071E]" />
            Fleet & Vehicle Hub
          </div>
          <h1 className="text-3xl font-extrabold uppercase font-heading tracking-tight text-[#08071E]">
            Registered Vehicle
          </h1>
          <p className="text-sm font-mono text-[#08071E]/70 mt-1">
            Manage your operational vehicle specifications, inspection records, and category tier.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded font-heading font-bold uppercase text-xs tracking-wider border-2 border-[#08071E] transition-all ${
            isEditing 
              ? 'bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#08071E]' 
              : 'bg-[#D4FF00] hover:bg-[#c2ea00] text-[#08071E] shadow-[3px_3px_0_#08071E]'
          }`}
        >
          {isEditing ? (
            <>Cancel Edit</>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Vehicle Details
            </>
          )}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vehicle Spec Card & Category */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-3 border-[#08071E] rounded-xl p-6 shadow-[5px_5px_0_#08071E] relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-dashed border-[#08071E]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#3B38F5] text-[#D4FF00] border-2 border-[#08071E] flex items-center justify-center font-heading font-black text-xl shadow-[2px_2px_0_#08071E]">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-black uppercase text-[#08071E]">
                    {formData.model}
                  </h2>
                  <span className="font-mono text-xs font-bold text-[#3B38F5] uppercase tracking-wider">
                    {activeCategory.name} Tier • {formData.year} Edition
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#065F46] border-2 border-[#10B981] font-mono text-xs font-bold uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active on dispatch
              </span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                      Model & Make
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                      Registration / Plate
                    </label>
                    <input
                      type="text"
                      value={formData.plate}
                      onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                      Body Color
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                      Year of Manufacture
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                      Ride Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const catId = e.target.value;
                        const cat = RIDE_CATEGORIES.find(c => c.id === catId);
                        setFormData({ 
                          ...formData, 
                          category: catId,
                          capacity: cat ? cat.capacity : formData.capacity
                        });
                      }}
                      className="w-full px-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    >
                      {RIDE_CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.capacity} Seater)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#08071E] mb-1">
                      Passenger Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 4 })}
                      className="w-full px-3 py-2 bg-[#F8FAFC] border-2 border-[#08071E] rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3B38F5]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#3B38F5] text-white font-heading font-black uppercase text-xs tracking-wider border-2 border-[#08071E] shadow-[3px_3px_0_#08071E] hover:bg-[#2e2bd0] transition-transform active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Save className="w-4 h-4 text-[#D4FF00]" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#08071E]/60 mb-1">
                    <Hash className="w-3.5 h-3.5 text-[#3B38F5]" />
                    Plate Number
                  </span>
                  <p className="font-mono font-extrabold text-[#08071E] text-base uppercase">
                    {formData.plate}
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#08071E]/60 mb-1">
                    <Palette className="w-3.5 h-3.5 text-[#3B38F5]" />
                    Vehicle Color
                  </span>
                  <p className="font-heading font-bold text-[#08071E] text-sm">
                    {formData.color}
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#08071E]/60 mb-1">
                    <Users className="w-3.5 h-3.5 text-[#3B38F5]" />
                    Capacity
                  </span>
                  <p className="font-heading font-bold text-[#08071E] text-sm">
                    Up to {formData.capacity} Passengers
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#08071E]/60 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#3B38F5]" />
                    Year Model
                  </span>
                  <p className="font-mono font-bold text-[#08071E] text-sm">
                    {formData.year}
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#08071E]/60 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#3B38F5]" />
                    Tier Commission
                  </span>
                  <p className="font-mono font-bold text-[#3B38F5] text-sm">
                    82% Driver Keep
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border-2 border-[#08071E] rounded-lg">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase text-[#08071E]/60 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    State Fitness
                  </span>
                  <p className="font-mono font-bold text-[#10B981] text-sm">
                    Valid till 2028
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ride Category Specs */}
          <div className="bg-[#08071E] text-white border-3 border-[#08071E] rounded-xl p-6 shadow-[5px_5px_0_#08071E]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-black uppercase text-base text-[#D4FF00] tracking-wide">
                Category Tier Guidelines ({activeCategory.name})
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#3B38F5] text-white">
                Base Fare ₹{activeCategory.baseRate}
              </span>
            </div>
            <p className="text-xs text-white/80 font-mono mb-4 leading-relaxed">
              {activeCategory.description}. All vehicles in this tier must undergo quarterly cleanliness inspections and possess commercial RTO endorsement.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10 text-center font-mono text-xs">
              <div>
                <span className="text-white/60 block text-[10px] uppercase">Per Km</span>
                <span className="font-bold text-[#D4FF00]">₹{activeCategory.ratePerKm}/km</span>
              </div>
              <div>
                <span className="text-white/60 block text-[10px] uppercase">Per Min</span>
                <span className="font-bold text-[#D4FF00]">₹{activeCategory.ratePerMin}/min</span>
              </div>
              <div>
                <span className="text-white/60 block text-[10px] uppercase">AC Service</span>
                <span className="font-bold text-[#D4FF00]">Mandatory</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verification Documents & Safety Checklist */}
        <div className="space-y-6">
          <div className="bg-white border-3 border-[#08071E] rounded-xl p-5 shadow-[4px_4px_0_#08071E]">
            <h3 className="font-heading font-black uppercase text-sm text-[#08071E] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3B38F5]" />
              Compliance Documents
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#08071E]">Registration Certificate</p>
                  <span className="text-[10px] text-[#08071E]/60">Verified RC-8921-PB</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#065F46] border border-[#10B981] font-bold text-[10px] uppercase">
                  Approved
                </span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#08071E]">Commercial Insurance</p>
                  <span className="text-[10px] text-[#08071E]/60">Comprehensive Policy</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#065F46] border border-[#10B981] font-bold text-[10px] uppercase">
                  Approved
                </span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#08071E]">Pollution Clearance</p>
                  <span className="text-[10px] text-[#08071E]/60">BS-VI Norms Compliant</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#065F46] border border-[#10B981] font-bold text-[10px] uppercase">
                  Approved
                </span>
              </div>

              <div className="p-3 bg-[#F8FAFC] border-2 border-[#08071E] rounded flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#08071E]">Tourist Permit</p>
                  <span className="text-[10px] text-[#08071E]/60">Punjab / Tricity All-Access</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#065F46] border border-[#10B981] font-bold text-[10px] uppercase">
                  Approved
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#D4FF00] border-3 border-[#08071E] rounded-xl p-5 shadow-[4px_4px_0_#08071E]">
            <h4 className="font-heading font-black uppercase text-xs text-[#08071E] mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Pre-Trip Vehicle Protocol
            </h4>
            <ul className="space-y-1.5 font-mono text-[11px] text-[#08071E]">
              <li>✓ Check tire pressure & spare wheel</li>
              <li>✓ Sanitizer bottle in rear pocket</li>
              <li>✓ Ensure air conditioner works at 22°C</li>
              <li>✓ Clean cabin and clear floor mats</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
