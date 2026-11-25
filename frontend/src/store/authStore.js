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

  bootstrap: async () => {
    if (api.getAuthToken()) {
      await get().loadProfile();
      set({ isAuthenticated: true });
      return;
    }
    set({ isBootstrapping: true });
    try {
      await api.login(DEMO_EMAIL, DEMO_PASSWORD);
      await get().loadProfile();
      set({ token: api.getAuthToken(), isAuthenticated: true, authError: null });
    } catch (err) {
      set({ authError: err.message });
    } finally {
      set({ isBootstrapping: false });
    }
  },

  login: async (email, password) => {
    set({ authError: null });
    try {
      const { user } = await api.login(email, password);
      const rider = { ...HARDCODED_CUSTOMER, id: user.id, email: user.email };
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
        name: payload.fullName || HARDCODED_CUSTOMER.name,
        phone: payload.phone || HARDCODED_CUSTOMER.phone,
      };
      set({ role: 'rider', customer: rider, rider, isAuthenticated: true, token: api.getAuthToken() });
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
    get().bootstrap();
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
