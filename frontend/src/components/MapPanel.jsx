import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';
import { generateRoutePoints } from '../utils/routeSimulator';

export default function MapPanel({
  pickup,
  destination,
  activeStatus,
  height = 'h-72 sm:h-96',
  showStats = true,
}) {
  const [useFallback, setUseFallback] = useState(false);
  const routePoints = generateRoutePoints(pickup, destination, 8);

  return (
    <div className={`relative w-full ${height} rounded-2xl border-2 border-[#08071E] shadow-[5px_5px_0_#08071E] overflow-hidden bg-[#08071E]`}>
      {/* Neo-brutalist Map Visual Canvas */}
      <div className="absolute inset-0 bg-[#08071E] overflow-hidden">
        {/* Stylized Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#3B38F5 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Diagonal stylized transit roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B38F5" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#D4FF00" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B38F5" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="routeFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B38F5" />
              <stop offset="100%" stopColor="#D4FF00" />
            </linearGradient>
          </defs>

          {/* Background grid lines */}
          <path d="M -100 120 L 800 120" stroke="#121033" strokeWidth="12" />
          <path d="M -100 240 L 800 240" stroke="#121033" strokeWidth="16" />
          <path d="M 220 -100 L 220 600" stroke="#121033" strokeWidth="14" />
          <path d="M 480 -100 L 480 600" stroke="#121033" strokeWidth="18" />

          {/* Active Navigation Polyline */}
          <path
            d="M 60 260 Q 240 180, 360 140 T 640 90"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="10 6"
            className="animate-pulse"
          />
          <path
            d="M 60 260 Q 240 180, 360 140 T 640 90"
            fill="none"
            stroke="#D4FF00"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Pickup Marker representation */}
        <div className="absolute top-[68%] left-[10%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 group">
          <div className="px-2.5 py-1 rounded-md bg-[#3B38F5] text-white border-2 border-[#08071E] font-neo-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#08071E] whitespace-nowrap mb-1">
            {pickup?.shortName || pickup?.name || 'Pickup'}
          </div>
          <div className="w-9 h-9 rounded-full bg-[#3B38F5] border-2 border-[#08071E] text-white flex items-center justify-center shadow-[2px_2px_0_#08071E] animate-bounce">
            <Navigation size={16} />
          </div>
        </div>

        {/* Simulated in-transit Vehicle */}
        <div className="absolute top-[38%] left-[52%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
          <div className="w-10 h-10 rounded-2xl bg-[#08071E] border-2 border-[#D4FF00] shadow-[3px_3px_0_#3B38F5] text-[#D4FF00] flex items-center justify-center animate-pulse">
            <Compass size={20} className="animate-spin text-[#D4FF00]" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Destination Marker representation */}
        <div className="absolute top-[22%] left-[82%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 group">
          <div className="px-2.5 py-1 rounded-md bg-[#D4FF00] text-[#08071E] border-2 border-[#08071E] font-neo-mono text-[10px] font-black uppercase shadow-[2px_2px_0_#08071E] whitespace-nowrap mb-1">
            {destination?.shortName || destination?.name || 'Destination'}
          </div>
          <div className="w-9 h-9 rounded-full bg-[#D4FF00] border-2 border-[#08071E] text-[#08071E] flex items-center justify-center shadow-[2px_2px_0_#08071E]">
            <MapPin size={18} />
          </div>
        </div>
      </div>

      {/* Floating Info Overlay Pill */}
      {showStats && (
        <div className="absolute top-4 left-4 z-30">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#08071E]/90 border border-white/20 backdrop-blur-md shadow-[3px_3px_0_#0B0630] text-xs font-neo-mono font-bold uppercase text-[#D4FF00]">
            <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-ping" />
            <span>Interactive Route Visualizer</span>
          </div>
        </div>
      )}

      {/* Bottom Route Summary Bar */}
      {pickup && destination && (
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <div className="p-3 sm:p-4 rounded-xl bg-[#08071E]/95 border-2 border-white/15 backdrop-blur-md shadow-[4px_4px_0_#0B0630] flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#3B38F5]" />
              <div className="text-xs font-neo-grotesk truncate max-w-[140px] sm:max-w-xs">
                <span className="text-[#A5A1CE]">From: </span>
                <span className="font-bold text-white">{pickup.name}</span>
              </div>
            </div>

            <div className="hidden sm:block text-neutral-500 font-neo-mono text-xs">→</div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#D4FF00]" />
              <div className="text-xs font-neo-grotesk truncate max-w-[140px] sm:max-w-xs">
                <span className="text-[#A5A1CE]">To: </span>
                <span className="font-bold text-white">{destination.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
