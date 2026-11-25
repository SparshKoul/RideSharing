/**
 * Ride status service
 */

import { query } from '../utils/db.js';

/**
 * Check if ride can be advanced to next status
 */
export const canAdvanceStatus = (rideId, status, expected) => {
  const result = await query('SELECT status FROM rides WHERE id = $1', [rideId]);
  return result.rows.length > 0 && result.rows[0].status === expected;
};

/**
 * Get ride status
 */
export const getRideStatus = (rideId) => {
  const result = await query('SELECT status FROM rides WHERE id = $1', [rideId]);
  return result.rows.length > 0 ? result.rows[0].status : null;
};

/**
 * Get all rides for a rider
 */
export const getRidesForRider = (riderId) => {
  const result = await query('SELECT * FROM rides WHERE rider_id = $1', [riderId]);
  return result.rows;
};

/**
 * Update ride with latest status
 */
export const updateRideWithStatus = (rideId, newStatus) => {
  const result = await query('UPDATE rides SET status = $1 WHERE id = $2 RETURNING *', [newStatus, rideId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};