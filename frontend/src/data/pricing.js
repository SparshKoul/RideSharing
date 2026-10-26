// Deterministic distance (km) and estimated duration (minutes) matrix
export const ROUTE_MATRIX = {
  // loc-1: Chitkara University
  'loc-1_loc-2': { distanceKm: 8.4, durationMins: 14 },
  'loc-1_loc-3': { distanceKm: 31.2, durationMins: 42 },
  'loc-1_loc-4': { distanceKm: 28.5, durationMins: 38 },
  'loc-1_loc-5': { distanceKm: 34.0, durationMins: 46 },
  'loc-1_loc-6': { distanceKm: 26.8, durationMins: 35 },

  // loc-2: Rajpura Bus Stand
  'loc-2_loc-1': { distanceKm: 8.4, durationMins: 14 },
  'loc-2_loc-3': { distanceKm: 36.5, durationMins: 48 },
  'loc-2_loc-4': { distanceKm: 33.2, durationMins: 44 },
  'loc-2_loc-5': { distanceKm: 38.6, durationMins: 52 },
  'loc-2_loc-6': { distanceKm: 32.0, durationMins: 42 },

  // loc-3: Chandigarh Railway Station
  'loc-3_loc-1': { distanceKm: 31.2, durationMins: 42 },
  'loc-3_loc-2': { distanceKm: 36.5, durationMins: 48 },
  'loc-3_loc-4': { distanceKm: 4.8, durationMins: 12 },
  'loc-3_loc-5': { distanceKm: 7.2, durationMins: 18 },
  'loc-3_loc-6': { distanceKm: 9.6, durationMins: 20 },

  // loc-4: Elante Mall
  'loc-4_loc-1': { distanceKm: 28.5, durationMins: 38 },
  'loc-4_loc-2': { distanceKm: 33.2, durationMins: 44 },
  'loc-4_loc-3': { distanceKm: 4.8, durationMins: 12 },
  'loc-4_loc-5': { distanceKm: 5.6, durationMins: 15 },
  'loc-4_loc-6': { distanceKm: 8.2, durationMins: 18 },

  // loc-5: Sector 17, Chandigarh
  'loc-5_loc-1': { distanceKm: 34.0, durationMins: 46 },
  'loc-5_loc-2': { distanceKm: 38.6, durationMins: 52 },
  'loc-5_loc-3': { distanceKm: 7.2, durationMins: 18 },
  'loc-5_loc-4': { distanceKm: 5.6, durationMins: 15 },
  'loc-5_loc-6': { distanceKm: 12.4, durationMins: 24 },

  // loc-6: Chandigarh International Airport
  'loc-6_loc-1': { distanceKm: 26.8, durationMins: 35 },
  'loc-6_loc-2': { distanceKm: 32.0, durationMins: 42 },
  'loc-6_loc-3': { distanceKm: 9.6, durationMins: 20 },
  'loc-6_loc-4': { distanceKm: 8.2, durationMins: 18 },
  'loc-6_loc-5': { distanceKm: 12.4, durationMins: 24 },
};

export const DEFAULT_ROUTE = {
  distanceKm: 28.5,
  durationMins: 38,
};

export const DRIVER_COMMISSION_RATE = 0.82; // 82% to driver, 18% platform fee
