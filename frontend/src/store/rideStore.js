import { create } from 'zustand';
import { MOCK_LOCATIONS, DEFAULT_PICKUP, DEFAULT_DESTINATION } from '../data/locations';
import { RIDE_CATEGORIES } from '../data/rideCategories';
import { getRouteMetrics, calculateFare, calculateDriverEarnings } from '../utils/fareCalculator';
import { DEFAULT_DEMO_DRIVER } from '../data/drivers';
import { HARDCODED_CUSTOMER } from '../data/riders';
import * as api from '../utils/api';


// Seed initial realistic completed/cancelled trips for the customer
const SEED_RIDES = [
  {
    id: 'RF-7821',
    riderId: HARDCODED_CUSTOMER.id,
    riderName: HARDCODED_CUSTOMER.name,
    riderRating: HARDCODED_CUSTOMER.rating,
    pickup: MOCK_LOCATIONS[0], // Chitkara University
    destination: MOCK_LOCATIONS[3], // Elante Mall
    category: RIDE_CATEGORIES[1], // Comfort
    distanceKm: 28.5,
    durationMins: 38,
    estimatedFare: 605,
    finalFare: 605,
    driverEarnings: 496,
    paymentMethod: 'UPI',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 2400000).toISOString(),
    assignedDriver: DEFAULT_DEMO_DRIVER,
    rating: 5,
    ratingFeedback: 'Very smooth highway drive and clean car!',
  },
  {
    id: 'RF-6432',
    riderId: HARDCODED_CUSTOMER.id,
    riderName: HARDCODED_CUSTOMER.name,
    riderRating: HARDCODED_CUSTOMER.rating,
    pickup: MOCK_LOCATIONS[1], // Rajpura Bus Stand
    destination: MOCK_LOCATIONS[0], // Chitkara University
    category: RIDE_CATEGORIES[0], // Economy
    distanceKm: 8.4,
    durationMins: 14,
    estimatedFare: 162,
    finalFare: 162,
    driverEarnings: 133,
    paymentMethod: 'Cash',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 3 + 900000).toISOString(),
    assignedDriver: DEFAULT_DEMO_DRIVER,
    rating: 5,
  },
  {
    id: 'RF-5119',
    riderId: HARDCODED_CUSTOMER.id,
    riderName: HARDCODED_CUSTOMER.name,
    riderRating: HARDCODED_CUSTOMER.rating,
    pickup: MOCK_LOCATIONS[4], // Sector 17
    destination: MOCK_LOCATIONS[5], // Airport
    category: RIDE_CATEGORIES[2], // XL
    distanceKm: 12.4,
    durationMins: 24,
    estimatedFare: 440,
    finalFare: 440,
    driverEarnings: 361,
    paymentMethod: 'Card',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 5 + 1600000).toISOString(),
    assignedDriver: DEFAULT_DEMO_DRIVER,
    rating: 4,
  },
  {
    id: 'RF-4091',
    riderId: HARDCODED_CUSTOMER.id,
    riderName: HARDCODED_CUSTOMER.name,
    riderRating: HARDCODED_CUSTOMER.rating,
    pickup: MOCK_LOCATIONS[0], // Chitkara University
    destination: MOCK_LOCATIONS[2], // CDG Station
    category: RIDE_CATEGORIES[0], // Economy
    distanceKm: 31.2,
    durationMins: 42,
    estimatedFare: 477,
    finalFare: null,
    driverEarnings: 0,
    paymentMethod: 'UPI',
    status: 'cancelled',
    cancellationReason: 'Driver was taking too long',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    completedAt: null,
    assignedDriver: null,
  },
];

const defaultMetrics = getRouteMetrics(DEFAULT_PICKUP.id, DEFAULT_DESTINATION.id);
const defaultFare = calculateFare(RIDE_CATEGORIES[0], defaultMetrics.distanceKm, defaultMetrics.durationMins);

const defaultDraft = {
  pickup: DEFAULT_PICKUP,
  destination: DEFAULT_DESTINATION,
  category: RIDE_CATEGORIES[0],
  paymentMethod: 'UPI',
  distanceKm: defaultMetrics.distanceKm,
  durationMins: defaultMetrics.durationMins,
  estimatedFare: defaultFare,
};

export const useRideStore = create((set, get) => ({
  rides: SEED_RIDES,
  activeRideId: null, // ID of currently active ride in progress
  driverOnline: true,
  bookingDraft: defaultDraft,
  notifications: [],
  rejectedRideIds: [],

  // Backend connection state
  locations: MOCK_LOCATIONS,
  categories: RIDE_CATEGORIES,
  drivers: [DEFAULT_DEMO_DRIVER],
  isLoading: false,
  isConnected: false,

  /** Load catalog + trips from Supabase. Falls back to local mocks offline. */
  loadCatalog: async () => {
    try {
      const [locations, categories, drivers] = await Promise.all([
        api.getLocations(),
        api.getCategories(),
        api.getDrivers(),
      ]);
      set({ locations, categories, drivers, isConnected: true });
    } catch (err) {
      set({ isConnected: false });
    }
  },

  loadRides: async () => {
    set({ isLoading: true });
    try {
      const rides = await api.getRides(true);
      if (rides.length) {
        set((state) => ({
          rides: rides.map((ride) => {
            const local = state.rides.find((r) => r.id === ride.id);
            return local ? { ...ride, rating: local.rating, ratingFeedback: local.ratingFeedback } : ride;
          }),
        }));
      }
      set({ isConnected: true });
    } catch (err) {
      set({ isConnected: false });
    } finally {
      set({ isLoading: false });
    }
  },

  /** Load the persisted booking draft from Supabase. */
  loadState: async () => {
    try {
      const state = await api.getState();
      if (state?.draft) set({ bookingDraft: state.draft });
      set({ isConnected: true });
      return state;
    } catch (err) {
      set({ isConnected: false });
      return null;
    }
  },

  // Set booking draft fields
  updateBookingDraft: (partialDraft) => {
    let next;
    set((state) => {
      const merged = { ...state.bookingDraft, ...partialDraft };
      if (partialDraft.pickup || partialDraft.destination || partialDraft.category) {
        const metrics = getRouteMetrics(merged.pickup?.id, merged.destination?.id);
        merged.distanceKm = metrics.distanceKm;
        merged.durationMins = metrics.durationMins;
        if (merged.category) {
          merged.estimatedFare = calculateFare(merged.category, metrics.distanceKm, metrics.durationMins);
        }
      }
      next = merged;
      return { bookingDraft: merged };
    });
    api.saveState({ draft: next }).catch(() => set({ isConnected: false }));
  },

  // Swap pickup & destination
  swapPickupAndDestination: () => {
    let next;
    set((state) => {
      const current = state.bookingDraft;
      const swapped = {
        ...current,
        pickup: current.destination,
        destination: current.pickup,
      };
      const metrics = getRouteMetrics(swapped.pickup?.id, swapped.destination?.id);
      swapped.distanceKm = metrics.distanceKm;
      swapped.durationMins = metrics.durationMins;
      if (swapped.category) {
        swapped.estimatedFare = calculateFare(swapped.category, metrics.distanceKm, metrics.durationMins);
      }
      next = swapped;
      return { bookingDraft: swapped };
    });
    api.saveState({ draft: next }).catch(() => set({ isConnected: false }));
  },

  setDriverOnline: (isOnline) => {
    set({ driverOnline: isOnline });
  },

  // Customer creates a ride booking - written to Supabase when online
  createRideRequest: async (draftOverrides = null) => {
    const draft = draftOverrides || get().bookingDraft;
    let newRide;

    try {
      newRide = await api.bookRide(draft);
      set({ isConnected: true });
    } catch (err) {
      // Backend unavailable - keep the demo usable offline
      set({ isConnected: false });
      newRide = {
        id: `RF-${Math.floor(1000 + Math.random() * 9000)}`,
        riderId: HARDCODED_CUSTOMER.id,
        riderName: HARDCODED_CUSTOMER.name,
        riderPhone: HARDCODED_CUSTOMER.phone,
        riderRating: HARDCODED_CUSTOMER.rating,
        pickup: draft.pickup,
        destination: draft.destination,
        category: draft.category,
        distanceKm: draft.distanceKm,
        durationMins: draft.durationMins,
        estimatedFare: draft.estimatedFare,
        finalFare: draft.estimatedFare,
        driverEarnings: calculateDriverEarnings(draft.estimatedFare),
        paymentMethod: draft.paymentMethod || 'UPI',
        status: 'searching',
        createdAt: new Date().toISOString(),
        completedAt: null,
        assignedDriver: null,
        rating: null,
      };
    }

    set((state) => {
      const updatedRides = [newRide, ...state.rides];
      return { rides: updatedRides, activeRideId: newRide.id };
    });

    get().addToast(`Ride request ${newRide.id} created! Matching with nearby drivers...`, 'success');

    setTimeout(() => {
      const current = get().rides.find((r) => r.id === newRide.id);
      if (current && current.status === 'searching') {
        get().autoAssignDriver(newRide.id);
      }
    }, 2500);

    return newRide;
  },

  // System auto-assigns driver for customer
  autoAssignDriver: (rideId, driver = DEFAULT_DEMO_DRIVER) => {
    let assigned = false;
    set((s) => {
      const updatedRides = s.rides.map((ride) => {
        if (ride.id === rideId && ride.status === 'searching') {
          assigned = true;
          return {
            ...ride,
            status: 'driver_assigned',
            assignedDriver: driver,
          };
        }
        return ride;
      });
      return { rides: updatedRides };
    });

    if (assigned) {
      api.updateRideStatus(rideId, 'driver_assigned', {
        driverId: api.toApiId(driver.id, 'drivers'),
      }).catch(() => set({ isConnected: false }));
      get().addToast(`Driver ${driver.name} accepted your ride! Heading towards pickup.`, 'success');
    }
  },

  // Advance ride to next simulation stage directly for customer
  advanceRideSimulation: (rideId) => {
    const targetRide = get().rides.find((r) => r.id === rideId);
    if (!targetRide) return;

    const persist = (status, extra = {}) =>
      api.updateRideStatus(rideId, status, extra).catch(() => set({ isConnected: false }));

    if (targetRide.status === 'searching') {
      get().autoAssignDriver(rideId);
    } else if (targetRide.status === 'driver_assigned') {
      set((state) => {
        const updated = state.rides.map((r) =>
          r.id === rideId ? { ...r, status: 'driver_arriving' } : r
        );
        return { rides: updated };
      });
      persist('driver_arriving');
      get().addToast("Driver has arrived at your pickup spot!", "info");
    } else if (targetRide.status === 'driver_arriving') {
      set((state) => {
        const updated = state.rides.map((r) =>
          r.id === rideId ? { ...r, status: 'in_progress' } : r
        );
        return { rides: updated };
      });
      persist('in_progress');
      get().addToast("Trip started! En route to destination.", "success");
    } else if (targetRide.status === 'in_progress') {
      const finalFare = targetRide.estimatedFare;
      set((state) => {
        const updated = state.rides.map((r) =>
          r.id === rideId
            ? { ...r, status: 'completed', finalFare, completedAt: new Date().toISOString() }
            : r
        );
        return { rides: updated, activeRideId: null };
      });
      persist('completed', { finalFare });
      get().addToast("You have reached your destination! Trip completed.", "success");
    }
  },

  // Driver accepts request (kept for internal compatibility)
  driverAcceptRide: (rideId, driver = DEFAULT_DEMO_DRIVER) => {
    get().autoAssignDriver(rideId, driver);
    return true;
  },

  driverRejectRide: () => {},
  driverMarkArriving: (rideId) => {
    set((state) => {
      const updatedRides = state.rides.map((r) =>
        r.id === rideId ? { ...r, status: 'driver_arriving' } : r
      );
      return { rides: updatedRides };
    });
  },
  driverStartTrip: (rideId) => {
    set((state) => {
      const updatedRides = state.rides.map((r) =>
        r.id === rideId ? { ...r, status: 'in_progress' } : r
      );
      return { rides: updatedRides };
    });
  },
  driverCompleteTrip: (rideId) => {
    get().advanceRideSimulation(rideId);
  },

  // Rider cancels the ride
  cancelRide: (rideId, reason = 'Changed my mind') => {
    set((state) => {
      const updatedRides = state.rides.map((r) =>
        r.id === rideId ? { ...r, status: 'cancelled', cancellationReason: reason } : r
      );
      return { rides: updatedRides, activeRideId: null };
    });
    api.updateRideStatus(rideId, 'cancelled').catch(() => set({ isConnected: false }));
    get().addToast("Ride has been cancelled.", "info");
  },

  // Submit feedback/rating for completed ride
  submitRideRating: (rideId, rating, comment = '') => {
    set((state) => {
      const updatedRides = state.rides.map((r) =>
        r.id === rideId ? { ...r, rating, ratingFeedback: comment } : r
      );
      return { rides: updatedRides };
    });
    api.submitRating(rideId, rating, comment).catch(() => set({ isConnected: false }));
    get().addToast("Thank you for your rating!", "success");
  },

  // Quick sample request
  createSampleRequest: () => {
    const randomCategory = RIDE_CATEGORIES[Math.floor(Math.random() * RIDE_CATEGORIES.length)];
    const pIndex = Math.floor(Math.random() * MOCK_LOCATIONS.length);
    let dIndex = (pIndex + 2) % MOCK_LOCATIONS.length;
    const pickup = MOCK_LOCATIONS[pIndex];
    const destination = MOCK_LOCATIONS[dIndex];
    const metrics = getRouteMetrics(pickup.id, destination.id);
    const estimatedFare = calculateFare(randomCategory, metrics.distanceKm, metrics.durationMins);

    return get().createRideRequest({
      pickup,
      destination,
      category: randomCategory,
      distanceKm: metrics.distanceKm,
      durationMins: metrics.durationMins,
      estimatedFare,
      paymentMethod: 'UPI',
    });
  },

  // Notification Toast Helper
  addToast: (message, type = 'info') => {
    const id = Date.now() + Math.random();
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4500);
  },

  removeToast: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // Reset local view and reload everything from the database
  resetAllRideData: async () => {
    set({
      rides: [],
      activeRideId: null,
      driverOnline: true,
      bookingDraft: defaultDraft,
      rejectedRideIds: [],
    });
    api.saveState({ draft: defaultDraft }).catch(() => set({ isConnected: false }));
    await get().loadRides();
    get().addToast("Ride data reloaded from the database.", "info");
  },
}));
