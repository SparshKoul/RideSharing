import { create } from 'zustand';
import { HARDCODED_CUSTOMER } from '../data/riders';
import * as api from '../utils/api';

const DEMO_EMAIL = 'demo.rider@rideezz.demo';
const DEMO_PASSWORD = 'demo1234';

/** Acquire a JWT and restore the server-side profile. */
export const useAuthStore = create((set, get) => ({
  role: 'rider',
  customer: HARDCODED_CUSTOMER,
  rider: HARDCODED_CUSTOMER,
  driver: null,
  isAuthenticated: false,
  token: api.getAuthToken(),
  isBootstrapping: false,
  authError: null,

  /** Load profile + favorites from Supabase into the session. */
  loadProfile: async () => {
    try {
      const state = await api.getState();
      const saved = state?.profile;
      if (saved) {
        const rider = { ...HARDCODED_CUSTOMER, ...saved };
        set({ rider, customer: rider });
      }
    } catch (err) {
      // Offline - keep the local demo identity
    }
  },

  /** Restore a session only from an existing DB-issued JWT - never auto-login. */
  bootstrap: async () => {
    if (!api.getAuthToken()) {
      set({ isAuthenticated: false, isBootstrapping: false });
      return false;
    }
    set({ isBootstrapping: true });
    try {
      await api.me();
      await get().loadProfile();
      set({ isAuthenticated: true, token: api.getAuthToken(), authError: null });
      return true;
    } catch (err) {
      api.setAuthToken(null);
      set({ isAuthenticated: false, token: null, authError: 'Session expired, please sign in again' });
      return false;
    } finally {
      set({ isBootstrapping: false });
    }
  },

  login: async (email, password, role) => {
    set({ authError: null });
    try {
      const { user } = await api.login(email, password, role);
      const rider = {
        ...HARDCODED_CUSTOMER,
        id: user.id,
        email: user.email,
        name: user.name || email.split('@')[0],
      };
      set({ role: user.role || 'rider', customer: rider, rider, isAuthenticated: true, token: api.getAuthToken() });
      await get().loadProfile();
      return user;
    } catch (err) {
      set({ authError: err.message });
      throw err;
    }
  },

  register: async (payload) => {
    set({ authError: null });
    try {
      const { user } = await api.register(payload);
      const rider = {
        ...HARDCODED_CUSTOMER,
        id: user.id,
        email: user.email,
        name: user.name || payload.fullName || user.email.split('@')[0],
        phone: payload.phone || '',
      };
      set({ role: user.role || 'rider', customer: rider, rider, isAuthenticated: true, token: api.getAuthToken() });
      await get().loadProfile();
      return user;
    } catch (err) {
      set({ authError: err.message });
      throw err;
    }
  },

  loginAsRider: async () => {
    try {
      await get().login(DEMO_EMAIL, DEMO_PASSWORD);
    } catch {
      /* offline demo */
    }
  },
  switchRole: () => {},

  // Persist profile edits (including saved places) to Supabase
  updateRiderProfile: (updates) => {
    let next;
    set((state) => {
      next = { ...state.rider, ...updates };
      return { rider: next, customer: next };
    });
    api.saveState({ profile: next, favorites: next.savedPlaces }).catch(() => set({ authError: 'Could not save profile' }));
  },

  resetAuthData: () => {
    api.setAuthToken(null);
    set({
      role: 'rider',
      customer: HARDCODED_CUSTOMER,
      rider: HARDCODED_CUSTOMER,
      isAuthenticated: false,
      token: null,
    });
    get().loginAsRider();
  },

  logout: () => {
    api.setAuthToken(null);
    set({
      role: 'rider',
      customer: HARDCODED_CUSTOMER,
      rider: HARDCODED_CUSTOMER,
      isAuthenticated: false,
      token: null,
      authError: null,
    });
  },
}));
