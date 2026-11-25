/**
 * Driver service
 */

import { query } from '../utils/db.js';

/**
 * Get driver details
 */
export const getDriver = (driverId) => {
  const result = await query('SELECT * FROM drivers WHERE id = $1', [driverId]);
  return result.rows[0] || null;
};

/**
 * Update driver profile
 */
export const updateDriver = (driverId, updates) => {
  const result = await query('UPDATE drivers SET name = $1, email = $2, phone = $3, rating = $4, vehicle_jsonb = $5, trips_completed = $6 WHERE id = $7 RETURNING *', [updates.name, updates.email, updates.phone, updates.rating, updates.vehicle, updates.tripsCompleted, driverId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Get all drivers
 */
export const getAllDrivers = () => {
  const result = await query('SELECT * FROM drivers ORDER BY rating DESC');
  return result.rows;
};