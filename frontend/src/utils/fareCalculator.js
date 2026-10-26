import { ROUTE_MATRIX, DEFAULT_ROUTE, DRIVER_COMMISSION_RATE } from '../data/pricing';
import { RIDE_CATEGORIES } from '../data/rideCategories';

/**
 * Deterministically get route metrics between two locations
 */
export function getRouteMetrics(pickupId, destinationId) {
  if (!pickupId || !destinationId || pickupId === destinationId) {
    return DEFAULT_ROUTE;
  }
  const key1 = `${pickupId}_${destinationId}`;
  const key2 = `${destinationId}_${pickupId}`;
  return ROUTE_MATRIX[key1] || ROUTE_MATRIX[key2] || DEFAULT_ROUTE;
}

/**
 * Calculates fare estimate for a given route and category
 * Formula: Base Fare + (Distance * Rate per km) + (Duration * Rate per min)
 */
export function calculateFare(category, distanceKm, durationMins) {
  if (!category) return 0;
  const rawFare = category.baseFare + 
    (distanceKm * category.ratePerKm) + 
    (durationMins * category.ratePerMin);
  return Math.round(rawFare);
}

/**
 * Calculate all category options for a selected route
 */
export function calculateCategoryOptions(pickupId, destinationId) {
  const metrics = getRouteMetrics(pickupId, destinationId);
  return RIDE_CATEGORIES.map((cat) => {
    const estimatedFare = calculateFare(cat, metrics.distanceKm, metrics.durationMins);
    const driverEarnings = Math.round(estimatedFare * DRIVER_COMMISSION_RATE);
    return {
      ...cat,
      distanceKm: metrics.distanceKm,
      durationMins: metrics.durationMins,
      estimatedFare,
      driverEarnings,
    };
  });
}

/**
 * Calculate driver payout from a completed trip fare
 */
export function calculateDriverEarnings(fareAmount) {
  return Math.round(fareAmount * DRIVER_COMMISSION_RATE);
}
