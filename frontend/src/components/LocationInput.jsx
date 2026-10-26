import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Search, X, Check } from 'lucide-react';
import { MOCK_LOCATIONS } from '../data/locations';

export default function LocationInput({
  label,
  value,
  onChange,
  placeholder = 'Search location...',
  isPickup = false,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value?.name || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setSearchQuery(value?.name || '');
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery(value?.name || '');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const filteredLocations = MOCK_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (loc) => {
    onChange(loc);
    setSearchQuery(loc.name);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearchQuery('');
    setIsOpen(true);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block font-neo-mono text-[11px] font-black uppercase text-[#A5A1CE] tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Input container */}
      <div
        onClick={() => setIsOpen(true)}
        className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 transition-all bg-[#08071E] cursor-text ${
          isOpen
            ? 'border-[#D4FF00] shadow-[3px_3px_0_#3B38F5]'
            : error
            ? 'border-red-400'
            : 'border-white/15 hover:border-white/30 shadow-[2px_2px_0_#0B0630]'
        }`}
      >
        <div
          className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
            isPickup
              ? 'bg-[#3B38F5] border-[#08071E] text-white'
              : 'bg-[#D4FF00] border-[#08071E] text-[#08071E]'
          }`}
        >
          {isPickup ? <Navigation size={14} /> : <MapPin size={14} />}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-neo-grotesk font-semibold text-white placeholder-neutral-500 focus:outline-none"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {error && (
        <span className="block font-neo-mono text-[10px] text-red-400 font-bold uppercase mt-1 tracking-wider">
          {error}
        </span>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-[#121033] border-2 border-[#D4FF00] rounded-xl shadow-[4px_4px_0_#08071E] overflow-hidden max-h-64 overflow-y-auto animate-in fade-in duration-150">
          <div className="p-2 border-b border-white/10 font-neo-mono text-[10px] font-black uppercase text-[#A5A1CE] tracking-wider flex items-center justify-between">
            <span>Sample Locations (Select One)</span>
            <span className="text-[#D4FF00]">{filteredLocations.length} results</span>
          </div>

          {filteredLocations.length > 0 ? (
            <div className="divide-y divide-white/5">
              {filteredLocations.map((loc) => {
                const isCurrent = value?.id === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => handleSelect(loc)}
                    className={`p-3 flex items-start gap-3 hover:bg-white/10 transition-colors cursor-pointer ${
                      isCurrent ? 'bg-[#3B38F5]/20' : ''
                    }`}
                  >
                    <div className="w-6 h-6 rounded-md bg-[#08071E] border border-white/20 flex items-center justify-center text-[#D4FF00] shrink-0 mt-0.5">
                      <MapPin size={12} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-neo-heading text-xs sm:text-sm font-black uppercase text-white truncate">
                          {loc.name}
                        </span>
                        {loc.tag && (
                          <span className="font-neo-mono text-[9px] font-black uppercase px-1.5 py-0.2 bg-[#D4FF00] text-[#08071E] rounded shrink-0">
                            {loc.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-neo-grotesk text-[#A5A1CE] truncate mt-0.5">
                        {loc.address}
                      </p>
                    </div>
                    {isCurrent && (
                      <Check size={14} className="text-[#D4FF00] shrink-0 mt-1" strokeWidth={3} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center font-neo-mono text-xs text-neutral-400 uppercase">
              No matching locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
