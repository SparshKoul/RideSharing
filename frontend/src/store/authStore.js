import { create } from 'zustand';
import { getStoredItem, setStoredItem, removeStoredItem } from '../utils/storage';
import { HARDCODED_CUSTOMER } from '../data/riders';
import * as api from '../utils/api';

const AUTH_STORAGE_KEY = 'rushride_customer_session_v3';
const DEMO_EMAIL = 'demo.rider@rideezz.demo';
const DEMO_PASSWORD = 'demo1234';

const demoSession = () => ({
  role: 'rider',
  customer: HARDCODED_CUSTOMER,
  rider: HARDCODED_CUSTOMER,
  isAuthenticated: true,
});

const initialSession = getStoredItem(AUTH_STORAGE_KEY, demoSession());

export const useAuthStore = create((set, get) => ({
  ...initialSession,
  token: api.getAuthToken(),
  isBootstrapping: false,
  authError: null,

  /**
   * Acquire a JWT for the seeded demo rider on app start.
   * If the backend is unavailable the app keeps working in local demo mode.
   */
  bootstrap: async () => {
    if (api.getAuthToken()) return;
    set({ isBootstrapping: true });
    try {
      await api.login(DEMO_EMAIL, DEMO_PASSWORD);
      set({ token: api.getAuthToken(), isAuthenticated: true, authError: null });
    } catch (err) {
      set({ authError: err.message });
    } finally {
      set({ isBootstrapping: false });
    }
  },

  // Real login against the backend
  login: async (email, password) => {
    set({ authError: null });
    try {
      const { user } = await api.login(email, password);
      const rider = { ...HARDCODED_CUSTOMER, id: user.id, email: user.email };
      const session = {
        role: user.role || 'rider',
        customer: rider,
        rider,
        isAuthenticated: true,
        token: api.getAuthToken(),
      };
      set(session);
      setStoredItem(AUTH_STORAGE_KEY, session);
      return user;
    } catch (err) {
      set({ authError: err.message });
      throw err;
    }
  },

  // Real registration against the backend
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
      const session = {
        role: 'rider',
        customer: rider,
        rider,
        isAuthenticated: true,
        token: api.getAuthToken(),
      };
      set(session);
      setStoredItem(AUTH_STORAGE_KEY, session);
      return user;
    } catch (err) {
      set({ authError: err.message });
      throw err;
    }
  },

  // Legacy helpers kept so existing components don't break
  loginAsRider: async () => {
    try {
      await get().login(DEMO_EMAIL, DEMO_PASSWORD);
    } catch {
      /* offline demo mode */
    }
  },
  switchRole: () => {},

  updateRiderProfile: (updates) => {
    set((state) => {
      const updated = { ...state.rider, ...updates };
      const newSession = { ...state, rider: updated, customer: updated };
      setStoredItem(AUTH_STORAGE_KEY, newSession);
      return { rider: updated, customer: updated };
    });
  },

  resetAuthData: () => {
    removeStoredItem(AUTH_STORAGE_KEY);
    api.setAuthToken(null);
    set(demoSession());
    get().bootstrap();
  },

  logout: () => {
    removeStoredItem(AUTH_STORAGE_KEY);
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
