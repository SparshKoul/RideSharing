import { create } from 'zustand';
import { getStoredItem, setStoredItem, removeStoredItem } from '../utils/storage';
import { HARDCODED_CUSTOMER } from '../data/riders';

const AUTH_STORAGE_KEY = 'rushride_customer_session_v3';

const initialSession = getStoredItem(AUTH_STORAGE_KEY, {
  role: 'rider', // Hardcoded Customer role
  customer: HARDCODED_CUSTOMER,
  rider: HARDCODED_CUSTOMER,
  isAuthenticated: true,
});

export const useAuthStore = create((set) => ({
  role: 'rider', // Customer role is fixed
  customer: HARDCODED_CUSTOMER,
  rider: initialSession.rider || HARDCODED_CUSTOMER,
  driver: null,
  isAuthenticated: true,

  // Customer login (ensures hardcoded values)
  loginAsRider: () => {
    const session = {
      role: 'rider',
      customer: HARDCODED_CUSTOMER,
      rider: HARDCODED_CUSTOMER,
      isAuthenticated: true,
    };
    set(session);
    setStoredItem(AUTH_STORAGE_KEY, session);
  },

  // Role switching disabled - locked to customer
  switchRole: () => {
    // Intentionally locked to customer: no ID/role switching
    const session = {
      role: 'rider',
      customer: HARDCODED_CUSTOMER,
      rider: HARDCODED_CUSTOMER,
      isAuthenticated: true,
    };
    set(session);
    setStoredItem(AUTH_STORAGE_KEY, session);
  },

  // Update Customer profile details
  updateRiderProfile: (updates) => {
    set((state) => {
      const updated = { ...state.rider, ...updates };
      const newSession = { ...state, rider: updated, customer: updated };
      setStoredItem(AUTH_STORAGE_KEY, newSession);
      return { rider: updated, customer: updated };
    });
  },

  // Reset demo session back to hardcoded customer values
  resetAuthData: () => {
    removeStoredItem(AUTH_STORAGE_KEY);
    const fresh = {
      role: 'rider',
      customer: HARDCODED_CUSTOMER,
      rider: HARDCODED_CUSTOMER,
      isAuthenticated: true,
    };
    set(fresh);
    setStoredItem(AUTH_STORAGE_KEY, fresh);
  },

  // In customer mode, sign out simply refreshes the customer session
  logout: () => {
    const fresh = {
      role: 'rider',
      customer: HARDCODED_CUSTOMER,
      rider: HARDCODED_CUSTOMER,
      isAuthenticated: true,
    };
    set(fresh);
    setStoredItem(AUTH_STORAGE_KEY, fresh);
  },
}));
