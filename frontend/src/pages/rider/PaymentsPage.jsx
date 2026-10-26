import React, { useState } from 'react';
import { CreditCard, QrCode, Banknote, ShieldCheck, Check, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useRide } from '../../hooks/useRide';

export default function PaymentsPage() {
  const { currentUser, updateRiderProfile } = useAuth();
  const { addToast } = useRide();
  const [preferredMethod, setPreferredMethod] = useState(currentUser?.preferredPayment || 'UPI');

  const paymentMethods = [
    {
      id: 'UPI',
      title: 'UPI / Instant QR',
      description: 'Default: sparsh@okhdfcbank (Simulated)',
      badge: 'POPULAR IN INDIA',
      icon: QrCode,
      color: 'bg-[#D4FF00] text-[#08071E]',
    },
    {
      id: 'Card',
      title: 'Mock Credit / Debit Card',
      description: 'HDFC Millennia Visa ending in •••• 4022',
      badge: 'CONNECTED',
      icon: CreditCard,
      color: 'bg-[#3B38F5] text-white',
    },
    {
      id: 'Cash',
      title: 'Cash Payment',
      description: 'Pay cash directly to driver upon reaching destination',
      badge: 'NO SETUP NEEDED',
      icon: Banknote,
      color: 'bg-emerald-500 text-white',
    },
  ];

  const handleSelectDefault = (id) => {
    setPreferredMethod(id);
    updateRiderProfile({ preferredPayment: id });
    addToast(`Preferred mock payment set to ${id}`, 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16123F] border border-[#3B38F5]/40 text-[#D4FF00] font-neo-mono text-[10.5px] font-bold uppercase tracking-wider mb-2">
          <CreditCard size={12} className="text-[#D4FF00]" />
          <span>PAYMENT PREFERENCES</span>
        </div>
        <h1 className="font-neo-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
          PAYMENT METHODS
        </h1>
        <p className="font-neo-grotesk text-xs sm:text-sm text-[#A5A1CE]">
          Manage your simulated payment methods. All payments are strictly frontend demo mocks.
        </p>
      </div>

      {/* Safety banner */}
      <div className="p-4 rounded-2xl bg-[#121033] border-2 border-dashed border-[#D4FF00]/40 flex items-center gap-3 text-xs font-neo-grotesk text-[#A5A1CE]">
        <ShieldCheck size={22} className="text-[#D4FF00] shrink-0" />
        <div>
          <strong className="text-white uppercase font-neo-heading">Prototype Security Notice:</strong>{' '}
          RideFlow does not collect real card numbers, CVVs, or OTPs. All balances and transactions are demo abstractions.
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="space-y-4">
        {paymentMethods.map((pm) => {
          const isSelected = preferredMethod === pm.id;
          const Icon = pm.icon;

          return (
            <div
              key={pm.id}
              onClick={() => handleSelectDefault(pm.id)}
              className={`p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isSelected
                  ? 'bg-white text-[#08071E] border-[#08071E] shadow-[5px_5px_0_#3B38F5]'
                  : 'bg-[#121033] text-white border-white/15 hover:border-white/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl border-2 border-[#08071E] flex items-center justify-center shrink-0 ${pm.color}`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-neo-heading text-base sm:text-lg font-black uppercase ${isSelected ? 'text-[#08071E]' : 'text-white'}`}>
                      {pm.title}
                    </h3>
                    <span
                      className={`font-neo-mono text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                        isSelected ? 'bg-[#3B38F5] text-white' : 'bg-white/10 text-[#D4FF00]'
                      }`}
                    >
                      {pm.badge}
                    </span>
                  </div>
                  <p className={`text-xs font-neo-grotesk mt-0.5 ${isSelected ? 'text-neutral-600' : 'text-[#A5A1CE]'}`}>
                    {pm.description}
                  </p>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-[#08071E] border-[#08071E] text-[#D4FF00]'
                    : 'border-white/30 text-transparent'
                }`}
              >
                {isSelected && <Check size={14} strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
