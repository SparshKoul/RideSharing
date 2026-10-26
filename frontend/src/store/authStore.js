import { create } from 'zustand';
import { getStoredItem, setStoredItem, removeStoredItem } from '../utils/storage';
import { DEFAULT_DEMO_RIDER } from '../data/riders';
import { DEFAULT_DEMO_DRIVER } from '../data/drivers';

const AUTH_STORAGE_KEY = 'rideflow_auth_session_v2';

const initialSession = getStoredItem(AUTH_STORAGE_KEY, {
  role: 'rider', // default initial demo role: rider
  rider: DEFAULT_DEMO_RIDER,
  driver: DEFAULT_DEMO_DRIVER,
  isAuthenticated: true,
});

export const useAuthStore = create((set, get) => ({
  role: initialSession.role,
  rider: initialSession.rider || DEFAULT_DEMO_RIDER,
  driver: initialSession.driver || DEFAULT_DEMO_DRIVER,
  isAuthenticated: initialSession.isAuthenticated,

  // Login as rider
  loginAsRider: (riderData = null) => {
    const activeRider = riderData || get().rider || DEFAULT_DEMO_RIDER;
    const newSession = {
      role: 'rider',
      rider: activeRider,
      driver: get().driver,
      isAuthenticated: true,
    };
    set(newSession);
    setStoredItem(AUTH_STORAGE_KEY, newSession);
  },

  // Login as driver
  loginAsDriver: (driverData = null) => {
    const activeDriver = driverData || get().driver || DEFAULT_DEMO_DRIVER;
    const newSession = {
      role: 'driver',
      rider: get().rider,
      driver: activeDriver,
      isAuthenticated: true,
    };
    set(newSession);
    setStoredItem(AUTH_STORAGE_KEY, newSession);
  },

  // Switch role seamlessly without losing active ride state
  switchRole: (newRole) => {
    const state = get();
    const updated = {
      ...state,
      role: newRole,
      isAuthenticated: true,
    };
    set(updated);
    setStoredItem(AUTH_STORAGE_KEY, updated);
  },

  // Update Rider profile
  updateRiderProfile: (updates) => {
    set((state) => {
      const updatedRider = { ...state.rider, ...updates };
      const newSession = { ...state, rider: updatedRider };
      setStoredItem(AUTH_STORAGE_KEY, newSession);
      return { rider: updatedRider };
    });
  },

  // Update Driver profile
  updateDriverProfile: (updates) => {
    set((state) => {
      const updatedDriver = { ...state.driver, ...updates };
      const newSession = { ...state, driver: updatedDriver };
      setStoredItem(AUTH_STORAGE_KEY, newSession);
      return { driver: updatedDriver };
    });
  },

  // Update Driver vehicle
  updateVehicle: (vehicleUpdates) => {
    set((state) => {
      const updatedDriver = {
        ...state.driver,
        vehicle: {
          ...state.driver.vehicle,
          ...vehicleUpdates,
        },
      };
      const newSession = { ...state, driver: updatedDriver };
      setStoredItem(AUTH_STORAGE_KEY, newSession);
      return { driver: updatedDriver };
    });
  },

  // Logout
  logout: () => {
    const resetSession = {
      role: null,
      rider: get().rider,
      driver: get().driver,
      isAuthenticated: false,
    };
    set(resetSession);
    setStoredItem(AUTH_STORAGE_KEY, resetSession);
  },

  // Reset entire auth demo data
  resetAuthData: () => {
    removeStoredItem(AUTH_STORAGE_KEY);
    const fresh = {
      role: 'rider',
      rider: DEFAULT_DEMO_RIDER,
      driver: DEFAULT_DEMO_DRIVER,
      isAuthenticated: true,
    };
    set(fresh);
    setStoredItem(AUTH_STORAGE_KEY, fresh);
  },
}));
