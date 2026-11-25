/**
 * Payment service
 */

import { query } from '../utils/db.js';

/**
 * Process payment
 */
export const processPayment = async (rideId, amount, currency, method) => {
  const result = await query('INSERT INTO payments (id, ride_id, amount, currency, method, status) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)', [rideId, amount, currency, method, 'succeeded']);
  return result.rows[0];
};

/**
 * Get payment by ride
 */
export const getPayment = (rideId) => {
  const result = await query('SELECT * FROM payments WHERE ride_id = $1', [rideId]);
  return result.rows[0] || null;
};

/**
 * Get pending payments
 */
export const getPendingPayments = async () => {
  const result = await query('SELECT * FROM payments WHERE status = $1', ['pending']);
  return result.rows;
};