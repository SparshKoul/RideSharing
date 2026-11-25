/**
 * HTTP client for the RideEzz Express backend.
 *
 * The UI uses human-friendly ids ("loc-1", "economy", "driver-1") while the
 * database uses UUIDs. The adapters below translate between the two so the
 * rest of the app does not need to change.
 */

import { MOCK_LOCATIONS } from '../data/locations';
import { RIDE_CATEGORIES } from '../data/rideCategories';
import { DEMO_DRIVERS } from '../data/drivers';
import { HARDCODED_CUSTOMER } from '../data/riders';
import { getRouteMetrics } from './fareCalculator';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'rideezz_auth_token';

const IDS = {
  locations: {
    'loc-1': '30000000-0000-0000-0000-000000000001',
    'loc-2': '30000000-0000-0000-0000-000000000002',
    'loc-3': '30000000-0000-0000-0000-000000000003',
    'loc-4': '30000000-0000-0000-0000-000000000004',
    'loc-5': '30000000-0000-0000-0000-000000000005',
    'loc-6': '30000000-0000-0000-0000-000000000006',
  },
  categories: {
    moto: '20000000-0000-0000-0000-000000000001',
    economy: '20000000-0000-0000-0000-000000000002',
    comfort: '20000000-0000-0000-0000-000000000003',
    xl: '20000000-0000-0000-0000-000000000004',
    electric: '20000000-0000-0000-0000-000000000005',
    black: '20000000-0000-0000-0000-000000000006',
  },
  drivers: {
    'driver-1': '10000000-0000-0000-0000-000000000001',
    'driver-2': '10000000-0000-0000-0000-000000000002',
    'driver-3': '10000000-0000-0000-0000-000000000003',
  },
};

const reverseMap = (map) => Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
const REVERSE = Object.fromEntries(Object.entries(IDS).map(([k, v]) => [k, reverseMap(v)]));

export const toApiId = (id, kind) => IDS[kind]?.[id] || id;
export const fromApiId = (id, kind) => REVERSE[kind]?.[id] || id;

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable - auth will be in-memory only */
  }
};

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data;
}

/* ----------------------------- adapters ----------------------------- */

const mergeBySlug = (row, kind, source) => {
  const slug = fromApiId(row.id, kind);
  return { ...(source.find((item) => item.id === slug) || {}), ...row, id: slug };
};

export const adaptLocation = (row) =>
  row ? mergeBySlug(row, 'locations', MOCK_LOCATIONS) : null;

export const adaptCategory = (row) => {
  if (!row) return null;
  const base = mergeBySlug(row, 'categories', RIDE_CATEGORIES);
  return {
    ...base,
    baseFare: Number(row.base_fare ?? base.baseFare),
    ratePerKm: Number(row.rate_per_km ?? base.ratePerKm),
    ratePerMin: Number(row.rate_per_min ?? base.ratePerMin),
    capacity: Number(row.capacity ?? base.capacity),
  };
};

export const adaptDriver = (row) => {
  if (!row) return null;
  const base = mergeBySlug(row, 'drivers', DEMO_DRIVERS);
  return {
    ...base,
    name: row.name,
    email: row.email,
    phone: row.phone || base.phone,
    rating: Number(row.rating ?? base.rating),
    tripsCompleted: Number(row.trips_completed ?? base.tripsCompleted),
    vehicle: row.vehicle_jsonb || base.vehicle,
  };
};

export const adaptRide = (row) => {
  if (!row) return null;
  const pickup = adaptLocation(row.pickup);
  const destination = adaptLocation(row.destination);
  const category = adaptCategory(row.category);
  const metrics = getRouteMetrics(pickup?.id, destination?.id);

  return {
    id: row.id,
    riderId: row.rider_id,
    riderName: HARDCODED_CUSTOMER.name,
    riderPhone: HARDCODED_CUSTOMER.phone,
    riderRating: HARDCODED_CUSTOMER.rating,
    pickup,
    destination,
    category,
    distanceKm: metrics.distanceKm,
    durationMins: metrics.durationMins,
    estimatedFare: Number(row.final_fare ?? 0),
    finalFare: row.final_fare == null ? null : Number(row.final_fare),
    driverEarnings: Number(row.driver_earnings ?? 0),
    paymentMethod: 'UPI',
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    assignedDriver: adaptDriver(row.assignedDriver),
    cancellationReason: row.cancellation_reason || null,
    rating: null,
    ratingFeedback: '',
  };
};

/* ------------------------------- auth ------------------------------- */

export const login = async (email, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  setAuthToken(data.token);
  return data;
};

export const register = async (payload) => {
  const data = await request('/auth/register', { method: 'POST', body: payload, auth: false });
  setAuthToken(data.token);
  return data;
};

export const me = () => request('/auth/me');

/* ------------------------------ catalog ----------------------------- */

export const getLocations = async () => (await request('/locations')).map(adaptLocation);
export const getCategories = async () => (await request('/categories')).map(adaptCategory);
export const getDrivers = async () => (await request('/drivers')).map(adaptDriver);

/* ------------------------------- rides ------------------------------ */

export const getRides = async (mine = true) =>
  (await request(`/rides${mine ? '?mine=true' : ''}`)).map(adaptRide);

export const getRide = async (id) => adaptRide(await request(`/rides/${id}`));

export const bookRide = async ({ pickup, destination, category }) => {
  const row = await request('/rides/book', {
    method: 'POST',
    body: {
      pickupLocationId: toApiId(pickup.id, 'locations'),
      destinationLocationId: toApiId(destination.id, 'locations'),
      categoryId: toApiId(category.id, 'categories'),
    },
  });
  return adaptRide(row);
};

export const updateRideStatus = async (id, status, extra = {}) =>
  adaptRide(await request(`/rides/${id}/status`, { method: 'POST', body: { status, ...extra } }));

export const acceptRide = async (id) =>
  request(`/rides/${id}/accept`, { method: 'POST', body: {} });

export const completeRide = async (id, finalFare) =>
  request(`/rides/${id}/driverComplete`, { method: 'POST', body: { finalFare } });

/* ------------------------------ payments ---------------------------- */

export const processPayment = (payload) =>
  request('/payments/process', { method: 'POST', body: payload });

/* ----------------------------- analytics ---------------------------- */

export const getEarnings = () => request('/analytics/earnings');
export const getTripHistory = () => request('/analytics/trips');

/* ------------------------------ health ------------------------------ */

export const health = async () => {
  const root = BASE_URL.replace(/\/api\/?$/, '');
  const response = await fetch(`${root}/health`);
  return response.json();
};
