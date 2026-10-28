import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  Check,
  Copy,
  ExternalLink,
  HelpCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  Search,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { useRide } from '../../hooks/useRide';

// Custom SVG component for Instagram icon
function InstagramIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const CONTACT_CHANNELS = {
  phone: {
    primary: '+91 1800 202 2026',
    secondary: '+91 98765 43210',
    tel: '+9118002022026',
    hours: '24/7 Immediate Telematics & Dispatch Help',
  },
  email: {
    primary: 'support@rideezz.com',
    secondary: 'contact@rideezz.com',
    sla: 'Under 15 minutes average response',
  },
  instagram: {
    handle: '@rideezz.mobility',
    url: 'https://instagram.com/rideezz.mobility',
    displayUrl: 'instagram.com/rideezz.mobility',
    desc: 'Live transit stories, fleet drop alerts & direct DM support',
  },
  location: {
    address: 'Level 4, RideEzz Mobility Towers, Cyber City, Sector 24, Metro Core 110001',
    landmark: 'Adjacent to Cyber Gateway Metro Interchange',
  },
};

const FAQS = [
  {
    category: 'Booking & Fares',
    question: 'How do I book a simulated ride on RideEzz?',
    answer: 'Select your pickup and destination from our curated locations (e.g. Chitkara University to Elante Mall), choose between any of our 6 tiers (Moto, Mini, Comfort, Premier, XL, Green EV), inspect live fare calculations, and click "Confirm Booking". Your trip is immediately routed to the dispatch mesh.',
  },
  {
    category: 'Booking & Fares',
    question: 'How are estimated fares calculated?',
    answer: 'Fares use a deterministic transit formula: Base Fare + (Distance in km × Rate/km) + (Duration in mins × Rate/min). Each route uses precomputed highway metrics, guaranteeing zero hidden multipliers or surprise surge pricing.',
  },
  {
    category: 'Booking & Fares',
    question: 'How does ride cancellation work?',
    answer: 'While your ride is in "Searching", "Driver Assigned", or "Driver Arriving" state, you can tap "Cancel Ride", select a demo reason, and confirm. The cancellation instantly frees the captain with zero cancellation penalty fee.',
  },
  {
    category: 'Support & Inquiries',
    question: 'What is the fastest way to get in touch with customer support?',
    answer: 'For instant support during an active ride, call our 24/7 hotline at +91 1800 202 2026 or tap in-ride SOS. For billing queries, lost items, or general feedback, email support@rideezz.com or DM us on Instagram @rideezz.mobility.',
  },
  {
    category: 'Driver Workflow',
    question: 'How do drivers accept or reject requests?',
    answer: 'When a captain is ONLINE in the top navigation, incoming ride requests populate in their dispatch feed. Tapping "Accept" binds the trip to the driver with instant turn-by-turn routing and passenger OTP verification.',
  },
  {
    category: 'Driver Workflow',
    question: 'What is the driver trip progression lifecycle?',
    answer: 'Trips follow a strict pipeline: 1) Driver Assigned → "Mark as Arriving", 2) Driver Arriving → "Start Trip" (with 4-digit OTP), 3) In Progress → "Complete Trip". Upon completion, the 82% direct commission is credited to the captain.',
  },
  {
    category: 'Platform Architecture',
    question: 'Why are authentication and payments simulated?',
    answer: 'RideEzz is a frontend-only architectural showcase running entirely within your browser. No backend APIs, real payment gateways, or live GPS telemetry are connected. All demo accounts, driver earnings, and trips persist in browser localStorage.',
  },
  {
    category: 'Safety & Emergency',
    question: 'What safety features are integrated into RideEzz trips?',
    answer: 'Every trip requires a secure 4-digit boarding OTP before the captain can initiate transit. Active rides include live GPS route tracking, one-tap emergency SOS broadcast, driver credential verification, and automated GST-compliant digital invoicing.',
  },
];

export default function HelpPage() {
  const { addToast } = useRide();
  const [copiedField, setCopiedField] = useState(null);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Ride Assistance / Fare Dispute',
    priority: 'Normal',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // FAQ State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(0);

  const handleCopy = (text, fieldName, label) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    if (addToast) {
      addToast(`Copied ${label || text} to clipboard!`, 'success');
    }
    setTimeout(() => {
      setCopiedField(null);
    }, 2200);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      if (addToast) {
        addToast('Please fill out all required fields (Name, Email, Message).', 'error');
      }
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `RR-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setSubmittedTicket({
        id: ticketId,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: formData.category,
        priority: formData.priority,
      });

      if (addToast) {
        addToast(`Ticket #${ticketId} submitted successfully! Our dispatch team will follow up.`, 'success');
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'Ride Assistance / Fare Dispute',
        priority: 'Normal',
        message: '',
      });
    }, 700);
  };

  const categories = ['All', 'Booking & Fares', 'Support & Inquiries', 'Driver Workflow', 'Safety & Emergency', 'Platform Architecture'];

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase()) ||
      faq.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16123F] border-2 border-[#08071E] text-[#D4FF00] font-neo-mono text-[11px] font-bold uppercase tracking-wider mb-5 shadow-[3px_3px_0_#08071E]">
          <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse" />
          <span>24/7 SUPPORT & CONTACT DISPATCH</span>
        </div>

        <h1 className="font-neo-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight mb-4">
          CONTACT & <span className="text-[#D4FF00]">SUPPORT DESK</span>
        </h1>
        <p className="font-neo-grotesk text-sm sm:text-base text-[#A5A1CE] max-w-2xl mx-auto leading-relaxed">
          Need assistance with your ride, billing reconciliation, safety reporting, or fleet onboarding? Connect with our team directly through our 24/7 telephone lines, direct email, or official social channels.
        </p>
      </div>

      {/* CORE CONTACT CARDS (Phone, Email, Instagram) */}
      <section className="mb-14 sm:mb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#D4FF00] border border-[#08071E]" />
            <h2 className="font-neo-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              DIRECT REACH CHANNELS
            </h2>
          </div>
          <span className="font-neo-mono text-[11px] font-bold text-[#A5A1CE] uppercase tracking-wider hidden sm:inline-block">
            Response SLA: &lt; 15 mins
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* 1. CONTACT NUMBER / HELPLINE CARD */}
          <div className="bg-[#121033] rounded-[22px] border-[3px] border-[#08071E] p-6 shadow-[6px_6px_0_#08071E] hover:translate-y-[-2px] transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#D4FF00]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4FF00] border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] flex items-center justify-center text-[#08071E]">
                  <PhoneCall size={22} strokeWidth={2.5} />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#D4FF00]/15 border border-[#D4FF00]/40 text-[#D4FF00] font-neo-mono text-[10px] font-black uppercase">
                  TOLL-FREE 24/7
                </span>
              </div>

              <span className="font-neo-mono text-[11px] font-bold text-[#A5A1CE] uppercase tracking-wider block mb-1">
                Voice Telematics & Support Hotline
              </span>
              <h3 className="font-neo-heading text-xl lg:text-2xl font-black text-white tracking-tight mb-1">
                {CONTACT_CHANNELS.phone.primary}
              </h3>
              <p className="font-neo-mono text-xs text-[#D4FF00] font-bold mb-3">
                Alt: {CONTACT_CHANNELS.phone.secondary}
              </p>
              <p className="font-neo-grotesk text-xs text-neutral-300 mb-6 leading-relaxed">
                Direct telematics control room for active ride emergencies, route deviations, and instant captain dispatch support.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <a
                href={`tel:${CONTACT_CHANNELS.phone.tel}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#D4FF00] hover:bg-[#c6ec22] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider text-center border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <Phone size={14} strokeWidth={2.5} />
                <span>Call Now</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(CONTACT_CHANNELS.phone.primary, 'phone', 'Helpline Number')}
                className="py-2.5 px-3 rounded-xl bg-[#1c184d] hover:bg-[#28226e] text-white font-neo-mono text-xs font-bold border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy phone number"
              >
                {copiedField === 'phone' ? (
                  <>
                    <Check size={14} className="text-[#D4FF00]" />
                    <span className="text-[#D4FF00]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. EMAIL SUPPORT CARD */}
          <div className="bg-[#121033] rounded-[22px] border-[3px] border-[#08071E] p-6 shadow-[6px_6px_0_#08071E] hover:translate-y-[-2px] transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#3B38F5]/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#3B38F5] border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] flex items-center justify-center text-white">
                  <Mail size={22} strokeWidth={2.5} />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#3B38F5]/20 border border-[#3B38F5]/60 text-white font-neo-mono text-[10px] font-black uppercase">
                  &lt; 15 MIN SLA
                </span>
              </div>

              <span className="font-neo-mono text-[11px] font-bold text-[#A5A1CE] uppercase tracking-wider block mb-1">
                Official Support Desk Email
              </span>
              <h3 className="font-neo-heading text-lg lg:text-xl font-black text-white tracking-tight break-all mb-1">
                {CONTACT_CHANNELS.email.primary}
              </h3>
              <p className="font-neo-mono text-xs text-[#A5A1CE] font-bold mb-3">
                Alt: {CONTACT_CHANNELS.email.secondary}
              </p>
              <p className="font-neo-grotesk text-xs text-neutral-300 mb-6 leading-relaxed">
                Billing inquiries, GST tax receipts, corporate account onboarding, and customer feedback with guaranteed fast ticketing.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <a
                href={`mailto:${CONTACT_CHANNELS.email.primary}?subject=RideEzz%20Support%20Inquiry`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-neutral-100 text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider text-center border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <Mail size={14} strokeWidth={2.5} />
                <span>Email Us</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(CONTACT_CHANNELS.email.primary, 'email', 'Support Email')}
                className="py-2.5 px-3 rounded-xl bg-[#1c184d] hover:bg-[#28226e] text-white font-neo-mono text-xs font-bold border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy email address"
              >
                {copiedField === 'email' ? (
                  <>
                    <Check size={14} className="text-[#D4FF00]" />
                    <span className="text-[#D4FF00]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. INSTAGRAM CHANNEL CARD */}
          <div className="bg-[#121033] rounded-[22px] border-[3px] border-[#08071E] p-6 shadow-[6px_6px_0_#08071E] hover:translate-y-[-2px] transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] flex items-center justify-center text-white">
                  <InstagramIcon size={22} />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-pink-500/15 border border-pink-400/40 text-pink-300 font-neo-mono text-[10px] font-black uppercase">
                  SOCIAL & DM
                </span>
              </div>

              <span className="font-neo-mono text-[11px] font-bold text-[#A5A1CE] uppercase tracking-wider block mb-1">
                Official Instagram Handle
              </span>
              <h3 className="font-neo-heading text-xl lg:text-2xl font-black text-white tracking-tight mb-1">
                {CONTACT_CHANNELS.instagram.handle}
              </h3>
              <p className="font-neo-mono text-xs text-pink-300 font-bold mb-3">
                {CONTACT_CHANNELS.instagram.displayUrl}
              </p>
              <p className="font-neo-grotesk text-xs text-neutral-300 mb-6 leading-relaxed">
                Follow our community stories, sector launch events, driver leaderboards, and message us directly for fast DM support.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <a
                href={CONTACT_CHANNELS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#dc2743] to-[#bc1888] hover:opacity-90 text-white font-neo-heading text-xs font-black uppercase tracking-wider text-center border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Visit Instagram</span>
                <ExternalLink size={14} />
              </a>
              <button
                type="button"
                onClick={() => handleCopy(CONTACT_CHANNELS.instagram.handle, 'insta', 'Instagram Handle')}
                className="py-2.5 px-3 rounded-xl bg-[#1c184d] hover:bg-[#28226e] text-white font-neo-mono text-xs font-bold border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Copy Instagram handle"
              >
                {copiedField === 'insta' ? (
                  <>
                    <Check size={14} className="text-[#D4FF00]" />
                    <span className="text-[#D4FF00]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TWO-COLUMN SECTION: INTERACTIVE CONTACT FORM & TRANSIT HEADQUARTERS */}
      <section className="mb-14 sm:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#121033] rounded-[24px] border-[3px] border-[#08071E] p-6 sm:p-8 shadow-[7px_7px_0_#3B38F5]">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] border border-[#08071E]" />
            <span className="font-neo-mono text-[11px] font-bold text-[#D4FF00] uppercase tracking-wider">
              MESSAGE DISPATCH CONSOLE
            </span>
          </div>
          <h2 className="font-neo-heading text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mb-2">
            SEND US A <span className="text-[#D4FF00]">DIRECT INQUIRY</span>
          </h2>
          <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE] mb-6">
            Fill in the details below and an automated priority ticket will be allocated directly to our operations fleet team.
          </p>

          {submittedTicket ? (
            <div className="p-6 rounded-2xl bg-[#16123F] border-2 border-[#D4FF00] text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-[#D4FF00] text-[#08071E] flex items-center justify-center mx-auto mb-3 font-black">
                <CheckCircle2 size={26} strokeWidth={2.8} />
              </div>
              <h3 className="font-neo-heading text-xl font-black uppercase text-white mb-1">
                INQUIRY TRANSMITTED!
              </h3>
              <p className="font-neo-mono text-xs text-[#D4FF00] font-bold mb-3">
                Ticket Reference: {submittedTicket.id}
              </p>
              <p className="font-neo-grotesk text-xs text-neutral-300 max-w-md mx-auto mb-5 leading-relaxed">
                Thank you for contacting RideEzz. Our operations dispatch center has received your request regarding{' '}
                <span className="text-white font-bold">{submittedTicket.category}</span>. An automated confirmation has been routed to your email.
              </p>
              <button
                type="button"
                onClick={() => setSubmittedTicket(null)}
                className="py-2 px-4 rounded-xl bg-white hover:bg-neutral-100 text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] cursor-pointer transition-all"
              >
                Submit Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-neo-grotesk font-black uppercase tracking-wider text-[#A5A1CE] mb-1.5">
                    Your Name <span className="text-[#D4FF00]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sparsh Koul"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#0c0a24] text-sm font-neo-grotesk text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4FF00] shadow-[2px_2px_0_#08071E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-neo-grotesk font-black uppercase tracking-wider text-[#A5A1CE] mb-1.5">
                    Email Address <span className="text-[#D4FF00]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sparsh@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#0c0a24] text-sm font-neo-grotesk text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4FF00] shadow-[2px_2px_0_#08071E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-neo-grotesk font-black uppercase tracking-wider text-[#A5A1CE] mb-1.5">
                    Contact / Mobile No.
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#0c0a24] text-sm font-neo-grotesk text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4FF00] shadow-[2px_2px_0_#08071E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-neo-grotesk font-black uppercase tracking-wider text-[#A5A1CE] mb-1.5">
                    Inquiry Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#0c0a24] text-sm font-neo-grotesk text-white focus:outline-none focus:border-[#D4FF00] shadow-[2px_2px_0_#08071E]"
                  >
                    <option value="Ride Assistance / Fare Dispute">Ride Assistance / Fare Dispute</option>
                    <option value="Billing, Refunds & Tax Receipts">Billing, Refunds & Tax Receipts</option>
                    <option value="Lost Property Retrieval">Lost Property Retrieval</option>
                    <option value="Driver / Captain Onboarding">Driver / Captain Onboarding</option>
                    <option value="Corporate Fleet & Business Accounts">Corporate Fleet & Business Accounts</option>
                    <option value="General Safety & Telematics Feedback">General Safety & Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-neo-grotesk font-black uppercase tracking-wider text-[#A5A1CE] mb-1.5">
                  Detailed Message <span className="text-[#D4FF00]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your trip ID, pickup location, or question in detail..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#08071E] bg-[#0c0a24] text-sm font-neo-grotesk text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4FF00] shadow-[2px_2px_0_#08071E] resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="font-neo-mono text-[10px] text-neutral-400">
                  🔒 Encrypted submission · Direct to 24/7 telematics desk
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4FF00] hover:bg-[#c6ec22] text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider border-2 border-[#08071E] shadow-[3px_3px_0_#08071E] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#08071E] border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} strokeWidth={2.5} />
                      <span>Transmit Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Transit Hub & Operational Headquarters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Operations Center Card */}
          <div className="bg-[#121033] rounded-[24px] border-[3px] border-[#08071E] p-6 sm:p-7 shadow-[6px_6px_0_#08071E]">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B38F5] border border-[#08071E]" />
              <span className="font-neo-mono text-[11px] font-bold text-[#A5A1CE] uppercase tracking-wider">
                PHYSICAL OPERATIONS
              </span>
            </div>

            <h3 className="font-neo-heading text-xl font-black uppercase text-white mb-2">
              TRANSIT COMMAND TOWER
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D4FF00] shrink-0 mt-0.5" />
                <div>
                  <div className="font-neo-grotesk text-xs sm:text-sm text-white font-bold">
                    {CONTACT_CHANNELS.location.address}
                  </div>
                  <div className="font-neo-mono text-[10px] text-[#A5A1CE] mt-0.5">
                    {CONTACT_CHANNELS.location.landmark}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[#D4FF00] shrink-0 mt-0.5" />
                <div>
                  <div className="font-neo-grotesk text-xs sm:text-sm text-white font-bold">
                    24 Hours / 7 Days A Week
                  </div>
                  <div className="font-neo-mono text-[10px] text-[#A5A1CE] mt-0.5">
                    Continuous telematics monitoring & walk-in partner desk
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Status */}
            <div className="p-3.5 rounded-xl bg-[#0c0a24] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-neo-mono text-[11px] font-bold text-white uppercase">
                  Dispatch Mesh: Online
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#D4FF00] text-[#08071E] font-neo-mono text-[10px] font-black uppercase">
                100% UP
              </span>
            </div>
          </div>

          {/* Emergency Safety Notice */}
          <div className="bg-[#241315] rounded-[24px] border-[3px] border-[#ef4444] p-6 shadow-[6px_6px_0_#08071E]">
            <div className="flex items-center gap-2.5 mb-2">
              <Shield size={20} className="text-[#ef4444]" />
              <h4 className="font-neo-heading text-base font-black uppercase text-white tracking-tight">
                ACTIVE TRIP EMERGENCY?
              </h4>
            </div>
            <p className="font-neo-grotesk text-xs text-neutral-300 leading-relaxed mb-4">
              If you feel unsafe or have an active transit medical emergency during a ride, immediately tap the red SOS icon in your active trip console or dial emergency police services.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="tel:112"
                className="py-2 px-3.5 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-neo-heading text-xs font-black uppercase tracking-wider border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] flex items-center gap-1.5"
              >
                <Phone size={13} strokeWidth={2.5} />
                <span>Dial 112 (Police)</span>
              </a>
              <a
                href={`tel:${CONTACT_CHANNELS.phone.tel}`}
                className="py-2 px-3.5 rounded-xl bg-white hover:bg-neutral-100 text-[#08071E] font-neo-heading text-xs font-black uppercase tracking-wider border-2 border-[#08071E] shadow-[2px_2px_0_#08071E] flex items-center gap-1.5"
              >
                <span>Call SOS Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="pt-8 border-t-2 border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[11px] font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0_#08071E]">
            <HelpCircle size={12} className="text-[#D4FF00]" />
            <span>INSTANT ANSWERS</span>
          </div>
          <h2 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight mb-2">
            FREQUENTLY ASKED <span className="text-[#D4FF00]">QUESTIONS</span>
          </h2>
          <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
            Browse our knowledge base for fast answers to common questions regarding booking, pricing, and driver mechanics.
          </p>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-lg mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fares, cancellations, OTP verification, or driver rules..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-[#08071E] bg-[#121033] text-sm font-neo-grotesk font-semibold text-white placeholder-neutral-500 shadow-[3px_3px_0_#08071E] focus:outline-none focus:border-[#D4FF00]"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-neo-mono font-bold uppercase transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#D4FF00] text-[#08071E] border-[#08071E] shadow-[2px_2px_0_#08071E]'
                    : 'bg-[#121033] text-[#A5A1CE] border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3.5 max-w-3xl mx-auto">
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
              No matching questions found in this category
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
