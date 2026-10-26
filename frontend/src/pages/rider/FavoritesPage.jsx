import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, MapPin, Plus, Trash2, ArrowRight, Home, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';
import { MOCK_LOCATIONS } from '../../data/locations';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { currentUser, updateRiderProfile } = useAuth();
  const { updateBookingDraft, addToast } = useRide();

  const [savedPlaces, setSavedPlaces] = useState(currentUser?.savedPlaces || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(MOCK_LOCATIONS[0]);

  const handleBookPlace = (place) => {
    const targetLoc = MOCK_LOCATIONS.find((l) => l.id === place.locationId) || MOCK_LOCATIONS[0];
    updateBookingDraft({ destination: targetLoc });
    addToast(`Destination set to ${place.title}. Choose vehicle!`, 'info');
    navigate('/rider/book');
  };

  const handleAddPlace = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newPlace = {
      id: `fav-${Date.now()}`,
      title: newTitle,
      type: 'favorite',
      address: selectedLocation.address,
      locationId: selectedLocation.id,
    };

    const updated = [...savedPlaces, newPlace];
    setSavedPlaces(updated);
    updateRiderProfile({ savedPlaces: updated });
    setShowAddModal(false);
    setNewTitle('');
    addToast(`Saved place "${newTitle}" added!`, 'success');
  };

  const handleDeletePlace = (id) => {
    const updated = savedPlaces.filter((p) => p.id !== id);
    setSavedPlaces(updated);
    updateRiderProfile({ savedPlaces: updated });
    addToast('Saved place removed.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-bold uppercase tracking-wider mb-2">
            <Bookmark size={12} className="text-[#D4FF00]" />
            <span>SAVED LOCATIONS</span>
          </div>
          <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            SAVED PLACES
          </h1>
          <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
            One-tap destinations for quick booking to campus, dorms, and transit hubs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] hover:bg-[#c2ec00] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0_#3B38F5] transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Place</span>
        </button>
      </div>

      {/* Grid of Saved Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {savedPlaces.map((place) => (
          <div
            key={place.id}
            className="bg-[#121033] rounded-3xl border-2 border-white/15 p-6 shadow-[5px_5px_0_#08071E] flex flex-col justify-between hover:border-[#D4FF00]/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#08071E] border border-white/20 text-[#D4FF00] flex items-center justify-center font-bold">
                  {place.type === 'home' ? <Home size={18} /> : <MapPin size={18} />}
                </div>

                <button
                  type="button"
                  onClick={() => handleDeletePlace(place.id)}
                  className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="font-neo-heading text-lg font-black uppercase text-white mb-1">
                {place.title}
              </h3>
              <p className="font-neo-grotesk text-xs text-[#A5A1CE] line-clamp-2 mb-6">
                {place.address}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleBookPlace(place)}
              className="w-full py-3 rounded-xl border-2 border-[#08071E] bg-[#3B38F5] hover:bg-[#2f2cd1] text-white font-neo-heading text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_#D4FF00] transition-all cursor-pointer"
            >
              <span>Book Ride Here</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Place Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#08071E] border-2 border-[#D4FF00] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[6px_6px_0_#3B38F5] text-white space-y-5">
            <h3 className="font-neo-heading text-xl font-black uppercase text-white tracking-tight">
              Add Saved Place
            </h3>

            <form onSubmit={handleAddPlace} className="space-y-4">
              <div>
                <label className="block font-neo-mono text-[10.5px] font-bold uppercase text-neutral-400 mb-1">
                  Place Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Study Hall / Coding Hub"
                  className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-[#121033] font-neo-grotesk text-sm text-white focus:outline-none focus:border-[#D4FF00]"
                  required
                />
              </div>

              <div>
                <label className="block font-neo-mono text-[10.5px] font-bold uppercase text-neutral-400 mb-1">
                  Corresponding Campus Point
                </label>
                <select
                  value={selectedLocation.id}
                  onChange={(e) => setSelectedLocation(MOCK_LOCATIONS.find((l) => l.id === e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-[#121033] font-neo-heading text-xs font-black uppercase text-white focus:outline-none"
                >
                  {MOCK_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/20 text-neutral-400 hover:text-white font-neo-heading text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl border-2 border-[#08071E] bg-[#D4FF00] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_#3B38F5]"
                >
                  Save Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
