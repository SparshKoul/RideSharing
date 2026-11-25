/**
 * Booking service
 */

import { query } from '../utils/db.js';
import { validate } from '../utils/validation.js';

/**
 * Calculate fare for a given route and category
 */
export const calculateFare = (category, distanceKm, durationMins) => {
  if (!category) return 0;
  const rawFare = category.baseFare + (distanceKm * category.ratePerKm) + (durationMins * category.ratePerMin);
  return Math.round(rawFare);
};

/**
 * Validate booking input
 */
export const validateBooking = (req) => {
  const errors = [];
  if (!req.body.pickupLocationId) errors.push('pickupLocationId is required');
  if (!req.body.destinationLocationId) errors.push('destinationLocationId is required');
  if (!req.body.categoryId) errors.push('categoryId is required');
  return errors;
};

/**
 * Generate a new ride ID
 */
export const generateRideId = () => {
  return `RF-${Math.floor(1000 + Math.random() * 9000)}`;
};