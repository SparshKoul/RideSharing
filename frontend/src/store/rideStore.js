import { create } from 'zustand';
import { getStoredItem, setStoredItem, removeStoredItem } from '../utils/storage';
import { MOCK_LOCATIONS, DEFAULT_PICKUP, DEFAULT_DESTINATION } from '../data/locations';
import { RIDE_CATEGORIES } from '../data/rideCategories';
import { getRouteMetrics, calculateFare, calculateDriverEarnings } from '../utils/fareCalculator';
import { DEFAULT_DEMO_DRIVER } from '../data/drivers';
import { HARDCODED_CUSTOMER } from '../data/riders';

const RIDE_STORAGE_KEY = 'rushride_customer_rides_v3';
const DRAFT_STORAGE_KEY = 'rushride_customer_draft_v3';

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

const initialRides = getStoredItem(RIDE_STORAGE_KEY, SEED_RIDES);

const defaultMetrics = getRouteMetrics(DEFAULT_PICKUP.id, DEFAULT_DESTINATION.id);
const defaultFare = calculateFare(RIDE_CATEGORIES[0], defaultMetrics.distanceKm, defaultMetrics.durationMins);

const initialDraft = getStoredItem(DRAFT_STORAGE_KEY, {
  pickup: DEFAULT_PICKUP,
  destination: DEFAULT_DESTINATION,
  category: RIDE_CATEGORIES[0],
  paymentMethod: 'UPI',
  distanceKm: defaultMetrics.distanceKm,
  durationMins: defaultMetrics.durationMins,
  estimatedFare: defaultFare,
});

export const useRideStore = create((set, get) => ({
  rides: initialRides,
  activeRideId: null, // ID of currently active ride in progress
  driverOnline: true,
  bookingDraft: initialDraft,
  notifications: [],
  rejectedRideIds: [],

  // Set booking draft fields
  updateBookingDraft: (partialDraft) => {
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
      setStoredItem(DRAFT_STORAGE_KEY, merged);
      return { bookingDraft: merged };
    });
  },

  // Swap pickup & destination
  swapPickupAndDestination: () => {
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
      setStoredItem(DRAFT_STORAGE_KEY, swapped);
      return { bookingDraft: swapped };
    });
  },

  setDriverOnline: (isOnline) => {
    set({ driverOnline: isOnline });
  },

  // Customer creates a ride booking with hardcoded customer identity
  createRideRequest: (draftOverrides = null) => {
    const draft = draftOverrides || get().bookingDraft;
    const rideId = `RF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRide = {
      id: rideId,
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
      finalFare: null,
      driverEarnings: calculateDriverEarnings(draft.estimatedFare),
      paymentMethod: draft.paymentMethod || 'UPI',
      status: 'searching', // initial status
      createdAt: new Date().toISOString(),
      completedAt: null,
      assignedDriver: null,
      rating: null,
    };

    set((state) => {
      const updatedRides = [newRide, ...state.rides];
      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return {
        rides: updatedRides,
        activeRideId: rideId,
      };
    });

    get().addToast(`Ride request ${rideId} created! Matching with nearby drivers...`, 'success');

    // Auto-match nearby driver after 2.5s without needing to switch to a driver ID
    setTimeout(() => {
      const current = get().rides.find((r) => r.id === rideId);
      if (current && current.status === 'searching') {
        get().autoAssignDriver(rideId);
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
      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return { rides: updatedRides };
    });

    if (assigned) {
      get().addToast(`Driver ${driver.name} accepted your ride! Heading towards pickup.`, 'success');
    }
  },

  // Advance ride to next simulation stage directly for customer
  advanceRideSimulation: (rideId) => {
    const targetRide = get().rides.find((r) => r.id === rideId);
    if (!targetRide) return;

    if (targetRide.status === 'searching') {
      get().autoAssignDriver(rideId);
    } else if (targetRide.status === 'driver_assigned') {
      set((state) => {
        const updated = state.rides.map((r) =>
          r.id === rideId ? { ...r, status: 'driver_arriving' } : r
        );
        setStoredItem(RIDE_STORAGE_KEY, updated);
        return { rides: updated };
      });
      get().addToast("Driver has arrived at your pickup spot!", "info");
    } else if (targetRide.status === 'driver_arriving') {
      set((state) => {
        const updated = state.rides.map((r) =>
          r.id === rideId ? { ...r, status: 'in_progress' } : r
        );
        setStoredItem(RIDE_STORAGE_KEY, updated);
        return { rides: updated };
      });
      get().addToast("Trip started! En route to destination.", "success");
    } else if (targetRide.status === 'in_progress') {
      set((state) => {
        const finalFare = targetRide.estimatedFare;
        const updated = state.rides.map((r) =>
          r.id === rideId
            ? {
                ...r,
                status: 'completed',
                finalFare,
                completedAt: new Date().toISOString(),
              }
            : r
        );
        setStoredItem(RIDE_STORAGE_KEY, updated);
        return { rides: updated, activeRideId: null };
      });
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
      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return { rides: updatedRides };
    });
  },
  driverStartTrip: (rideId) => {
    set((state) => {
      const updatedRides = state.rides.map((r) =>
        r.id === rideId ? { ...r, status: 'in_progress' } : r
      );
      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
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
      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return {
        rides: updatedRides,
        activeRideId: null,
      };
    });
    get().addToast("Ride has been cancelled.", "info");
  },

  // Submit feedback/rating for completed ride
  submitRideRating: (rideId, rating, comment = '') => {
    set((state) => {
      const updatedRides = state.rides.map((r) =>
        r.id === rideId ? { ...r, rating, ratingFeedback: comment } : r
      );
      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return { rides: updatedRides };
    });
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

  // Reset entire ride data to seed state
  resetAllRideData: () => {
    removeStoredItem(RIDE_STORAGE_KEY);
    removeStoredItem(DRAFT_STORAGE_KEY);
    set({
      rides: SEED_RIDES,
      activeRideId: null,
      driverOnline: true,
      bookingDraft: initialDraft,
      rejectedRideIds: [],
    });
    get().addToast("Customer ride data has been restored to default seeds.", "info");
  },
}));
