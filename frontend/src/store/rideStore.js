import { create } from 'zustand';
import { getStoredItem, setStoredItem, removeStoredItem } from '../utils/storage';
import { MOCK_LOCATIONS, DEFAULT_PICKUP, DEFAULT_DESTINATION } from '../data/locations';
import { RIDE_CATEGORIES } from '../data/rideCategories';
import { getRouteMetrics, calculateFare, calculateDriverEarnings } from '../utils/fareCalculator';
import { DEFAULT_DEMO_DRIVER } from '../data/drivers';
import { DEFAULT_DEMO_RIDER } from '../data/riders';

const RIDE_STORAGE_KEY = 'rideflow_rides_v2';
const DRAFT_STORAGE_KEY = 'rideflow_booking_draft_v2';
const DRIVER_STATUS_KEY = 'rideflow_driver_online_v2';

// Seed initial realistic completed/cancelled trips
const SEED_RIDES = [
  {
    id: 'RF-7821',
    riderId: 'rider-1',
    riderName: 'Aryan Mehra',
    riderRating: 4.96,
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
    riderId: 'rider-1',
    riderName: 'Aryan Mehra',
    riderRating: 4.96,
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
    riderId: 'rider-1',
    riderName: 'Aryan Mehra',
    riderRating: 4.96,
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
    riderId: 'rider-1',
    riderName: 'Aryan Mehra',
    riderRating: 4.96,
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
const initialDriverOnline = getStoredItem(DRIVER_STATUS_KEY, true);

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
  driverOnline: initialDriverOnline,
  bookingDraft: initialDraft,
  notifications: [],
  rejectedRideIds: [], // Rides rejected by currently logged in driver

  // Set booking draft fields
  updateBookingDraft: (partialDraft) => {
    set((state) => {
      const merged = { ...state.bookingDraft, ...partialDraft };
      // Recalculate metrics if pickup or destination changed
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

  // Toggle Driver Online / Offline
  setDriverOnline: (isOnline) => {
    set({ driverOnline: isOnline });
    setStoredItem(DRIVER_STATUS_KEY, isOnline);
    get().addToast(
      isOnline ? "You are now ONLINE. You'll receive live ride requests." : "You are now OFFLINE. New requests are paused.",
      isOnline ? 'success' : 'info'
    );
  },

  // Rider creates a ride booking
  createRideRequest: (draftOverrides = null) => {
    const draft = draftOverrides || get().bookingDraft;
    const rideId = `RF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRide = {
      id: rideId,
      riderId: DEFAULT_DEMO_RIDER.id,
      riderName: DEFAULT_DEMO_RIDER.name,
      riderPhone: DEFAULT_DEMO_RIDER.phone,
      riderRating: DEFAULT_DEMO_RIDER.rating,
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

    get().addToast(`Ride request ${rideId} created! Looking for nearby drivers...`, 'success');
    return newRide;
  },

  // Driver accepts request
  driverAcceptRide: (rideId, driver = DEFAULT_DEMO_DRIVER) => {
    const state = get();
    if (!state.driverOnline) {
      get().addToast("Cannot accept rides while offline! Switch to Online first.", "error");
      return false;
    }

    // Check if driver already has an active trip
    const existingActive = state.rides.find(
      (r) => r.assignedDriver?.id === driver.id && ['driver_assigned', 'driver_arriving', 'in_progress'].includes(r.status)
    );
    if (existingActive) {
      get().addToast("You already have an active trip in progress!", "error");
      return false;
    }

    let acceptedRide = null;
    set((s) => {
      const updatedRides = s.rides.map((ride) => {
        if (ride.id === rideId && ride.status === 'searching') {
          acceptedRide = {
            ...ride,
            status: 'driver_assigned',
            assignedDriver: driver,
          };
          return acceptedRide;
        }
        return ride;
      });

      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return {
        rides: updatedRides,
        activeRideId: rideId,
      };
    });

    if (acceptedRide) {
      get().addToast(`Ride ${rideId} accepted! Navigate to pickup location.`, 'success');
      return true;
    }
    return false;
  },

  // Driver rejects request
  driverRejectRide: (rideId) => {
    set((state) => ({
      rejectedRideIds: [...state.rejectedRideIds, rideId],
    }));
    get().addToast("Ride request dismissed.", "info");
  },

  // Driver marks as arriving at pickup
  driverMarkArriving: (rideId) => {
    set((state) => {
      const updatedRides = state.rides.map((r) =>
        r.id === rideId ? { ...r, status: 'driver_arriving' } : r
      );
      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return { rides: updatedRides };
    });
    get().addToast("Status updated: Arriving at pickup spot.", "info");
  },

  // Driver starts the trip
  driverStartTrip: (rideId) => {
    set((state) => {
      const updatedRides = state.rides.map((r) =>
        r.id === rideId ? { ...r, status: 'in_progress' } : r
      );
      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return { rides: updatedRides };
    });
    get().addToast("Trip started! Driving towards destination.", "success");
  },

  // Driver completes the trip
  driverCompleteTrip: (rideId) => {
    set((state) => {
      const targetRide = state.rides.find((r) => r.id === rideId);
      const finalFare = targetRide ? targetRide.estimatedFare : 0;
      const driverEarnings = calculateDriverEarnings(finalFare);

      const updatedRides = state.rides.map((r) => {
        if (r.id === rideId) {
          return {
            ...r,
            status: 'completed',
            finalFare,
            driverEarnings,
            completedAt: new Date().toISOString(),
          };
        }
        return r;
      });

      setStoredItem(RIDE_STORAGE_KEY, updatedRides);
      return {
        rides: updatedRides,
        activeRideId: null,
      };
    });
    get().addToast("Trip successfully completed! Fare added to earnings.", "success");
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

  // Create quick sample request for testing Driver requests page
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
    removeStoredItem(DRIVER_STATUS_KEY);
    set({
      rides: SEED_RIDES,
      activeRideId: null,
      driverOnline: true,
      bookingDraft: initialDraft,
      rejectedRideIds: [],
    });
    get().addToast("Demo ride data has been reset to defaults.", "info");
  },
}));
