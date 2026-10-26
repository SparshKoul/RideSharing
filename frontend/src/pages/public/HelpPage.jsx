import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, Shield, Zap, Sparkles } from 'lucide-react';

const FAQS = [
  {
    category: 'Booking & Fares',
    question: 'How do I book a simulated ride?',
    answer: 'Select your pickup and destination from our sample locations (e.g. Chitkara University to Elante Mall), choose between Economy, Comfort, or XL, pick your mock payment method, and click "Confirm Booking". Your request is instantly dispatched to the driver console.',
  },
  {
    category: 'Booking & Fares',
    question: 'How are estimated fares calculated?',
    answer: 'Fares use a deterministic formula: Base Fare + (Distance in km × Rate/km) + (Duration in mins × Rate/min). Each route between sample locations uses precomputed highway metrics, ensuring identical estimates every time.',
  },
  {
    category: 'Booking & Fares',
    question: 'How does ride cancellation work?',
    answer: 'While your ride is in "Searching", "Driver Assigned", or "Driver Arriving" state, you can click "Cancel Ride", select a demo reason, and confirm. The cancellation instantly updates across both the rider and driver dashboards with zero penalty fee.',
  },
  {
    category: 'Driver Workflow',
    question: 'How do drivers accept or reject requests?',
    answer: 'When a driver sets their availability to ONLINE in the top navigation or dashboard, pending ride requests appear in their "Ride Requests" tab. Clicking "Accept" binds the ride to that driver and opens active trip management. Rejecting removes it from that driver\'s queue.',
  },
  {
    category: 'Driver Workflow',
    question: 'What is the driver trip progression lifecycle?',
    answer: 'Trips follow a strict sequential pipeline: 1) Driver Assigned → "Mark as Arriving", 2) Driver Arriving → "Start Trip", 3) In Progress → "Complete Trip". Once completed, the final fare is credited to the driver\'s earnings (82% commission) and logged in both histories.',
  },
  {
    category: 'Platform Architecture',
    question: 'Why are authentication and payments simulated?',
    answer: 'RideFlow is a frontend-only architectural showcase running entirely within your browser. No backend APIs, real payment gateways, or live GPS telemetry are connected. All demo accounts, driver earnings, and trips persist in browser localStorage.',
  },
  {
    category: 'Platform Architecture',
    question: 'Can I test both Rider and Driver roles at the same time?',
    answer: 'Yes! Use the role switcher in the top navigation or profile menu. Switching between Rider and Driver preserves all ongoing trips and bookings in memory and localStorage so you can experience both perspectives simultaneously.',
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[11px] font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0_#08071E]">
          <HelpCircle size={12} className="text-[#D4FF00]" />
          <span>KNOWLEDGE BASE & FAQ</span>
        </div>

        <h1 className="font-neo-heading text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mb-3">
          HOW CAN WE <span className="text-[#D4FF00]">HELP YOU?</span>
        </h1>
        <p className="font-neo-grotesk text-sm sm:text-base text-[#A5A1CE]">
          Everything you need to know about the RideFlow simulated ride-sharing platform.
        </p>

        {/* Search Input */}
        <div className="mt-8 relative max-w-lg mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions, dispatch rules, or fares..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-[#08071E] bg-[#121033] text-sm font-neo-grotesk font-semibold text-white placeholder-neutral-500 shadow-[3px_3px_0_#08071E] focus:outline-none focus:border-[#D4FF00]"
          />
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3.5">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border-2 transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-white text-[#08071E] border-[#08071E] shadow-[5px_5px_0_#3B38F5]'
                    : 'bg-[#121033] text-white border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div>
                    <span
                      className={`font-neo-mono text-[9.5px] font-black uppercase px-2 py-0.5 rounded border ${
                        isOpen
                          ? 'bg-[#edf0ff] text-[#3B38F5] border-[#3B38F5]/30'
                          : 'bg-white/10 text-[#D4FF00] border-transparent'
                      }`}
                    >
                      {faq.category}
                    </span>
                    <h3
                      className={`font-neo-heading text-base sm:text-lg font-black uppercase tracking-tight mt-2 ${
                        isOpen ? 'text-[#08071E]' : 'text-white'
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                      isOpen
                        ? 'bg-[#D4FF00] border-[#08071E] text-[#08071E]'
                        : 'bg-white/5 border-white/20 text-white'
                    }`}
                  >
                    {isOpen ? <ChevronUp size={16} strokeWidth={3} /> : <ChevronDown size={16} strokeWidth={3} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-black/10">
                    <p className="font-neo-grotesk text-sm sm:text-[14.5px] leading-relaxed text-neutral-700 font-medium">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center rounded-2xl bg-[#121033] border border-white/10 text-neutral-400 font-neo-mono text-xs uppercase">
            No matching questions found
          </div>
        )}
      </div>
    </div>
  );
}
