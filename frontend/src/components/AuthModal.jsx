import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, Mail, Lock, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRide } from '../hooks/useRide';

/** Sign in / Sign up panel opened from the navbar. */
export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, register } = useAuth();
  const { loadCatalog, loadRides, loadState, addToast } = useRide();

  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('rider');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password, role);
        addToast(`Welcome back, ${email}`, 'success');
      } else {
        await register({ fullName, email, phone, password, role });
        addToast(`${role === 'driver' ? 'Driver' : 'Rider'} account created. Welcome to RideEzz!`, 'success');
      }
      await Promise.all([loadCatalog(), loadRides(), loadState()]);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = () => {
    setMode('login');
    setEmail(role === 'driver' ? 'demo.driver@rideezz.demo' : 'demo.rider@rideezz.demo');
    setPassword('demo1234');
    setError('');
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close authentication panel"
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />

      <div className="relative flex min-h-full items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-md bg-white text-[#08071E] rounded-3xl border-[3px] border-[#08071E] p-6 sm:p-7 shadow-[8px_8px_0_#3B38F5]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#D4FF00] border-2 border-[#08071E] flex items-center justify-center shadow-[2px_2px_0_#3B38F5]">
            <Zap size={18} fill="#08071E" />
          </div>
          <div>
            <div className="font-neo-heading text-lg font-black uppercase leading-none">
              RIDE<span className="text-[#3B38F5]">EZZ</span>
            </div>
            <div className="font-neo-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
              Rider & Driver Access
            </div>
          </div>
        </div>

        {/* Role selector */}
        <div className="mb-4">
          <span className="block font-neo-mono text-[10px] font-black uppercase text-neutral-600 mb-1.5">
            Continue as
          </span>
          <div className="flex gap-1 p-1 rounded-xl bg-[#F5F6FF] border-2 border-[#08071E]">
            {['rider', 'driver'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => { setRole(option); setError(''); }}
                className={`flex-1 py-2 rounded-lg font-neo-heading text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                  role === option
                    ? 'bg-[#08071E] text-[#D4FF00]'
                    : 'text-neutral-500 hover:text-[#08071E]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-[#F5F6FF] border-2 border-[#08071E] mb-4">
          {['login', 'register'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => switchMode(tab)}
              className={`flex-1 py-2.5 rounded-lg font-neo-heading text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
                mode === tab
                  ? 'bg-[#08071E] text-white'
                  : 'text-neutral-500 hover:text-[#08071E]'
              }`}
            >
              {tab === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <h2 className="font-neo-heading text-2xl font-black uppercase tracking-tight mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="font-neo-grotesk text-xs text-neutral-600 mb-4">
          {mode === 'login'
            ? 'Sign in to book rides and track your trips.'
            : 'Join RideEzz in a few seconds.'}
        </p>

        {error && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-300 text-red-700 font-neo-grotesk text-xs font-semibold">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <Field icon={User} label="Full name" value={fullName} onChange={setFullName} placeholder="Aryan Mehra" required />
              <Field icon={Phone} label="Phone" value={phone} onChange={setPhone} placeholder="+91 99887 66554" />
            </>
          )}

          <Field
            icon={Mail}
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
          />
          <Field
            icon={Lock}
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="At least 6 characters"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl border-2 border-[#08071E] bg-[#08071E] hover:bg-neutral-800 text-white font-neo-heading text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_#3B38F5] transition-all cursor-pointer disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={15} strokeWidth={3} />
          </button>
        </form>

        {mode === 'login' && (
          <button
            type="button"
            onClick={fillDemo}
            className="w-full mt-3 py-2.5 rounded-xl border-2 border-dashed border-[#3B38F5]/50 text-[#3B38F5] font-neo-mono text-[10px] font-bold uppercase tracking-wider hover:bg-[#3B38F5]/5 cursor-pointer"
          >
            Use demo credentials
          </button>
        )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function Field({ icon: Icon, label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <div>
      <label className="block font-neo-mono text-[10px] font-black uppercase text-neutral-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#08071E] bg-[#F5F6FF] text-sm font-neo-grotesk font-semibold text-[#08071E] focus:outline-none"
        />
        <Icon size={15} className="absolute left-3.5 top-3.5 text-neutral-400" />
      </div>
    </div>
  );
}
