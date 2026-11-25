/**
 * Rides routes
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query, insert } from '../utils/db.js';

const router = Router();

// Book a ride
router.post('/book', authenticate, async (req, res) => {
  const { pickupLocationId, destinationLocationId, categoryId, paymentMethod } = req.body;
  if (!pickupLocationId || !destinationLocationId || !categoryId) {
    return res.status(400).json({ error: 'Pickup, destination, and category required' });
  }
  const result = await query('INSERT INTO rides (id, rider_id, driver_id, pickup_location_id, destination_location_id, category_id, status, created_by, final_fare, driver_earnings) SELECT gen_random_uuid(), $1, NULL, $2, $3, $4, $5, now(), $6, $7, now() FROM rides WHERE rider_id = $8 AND status = $6', [
    req.user.id,
    pickupLocationId,
    destinationLocationId,
    categoryId,
    99, // estimated fare placeholder
    req.user.id,
    req.user.id,
  ]);
  res.json(result.rows[0]);
});

// Update ride status
router.post('/:id/status', authenticate, async (req, res) => {
  const { id, status } = req.body;
  const result = await query('UPDATE rides SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
  if (!result.rows.length) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  res.json(result.rows[0]);
});

// Accept ride
router.post('/:id/accept', authenticate, async (req, res) => {
  const { id } = req.body;
  const result = await query('UPDATE rides SET status = 'driver_assigned' WHERE id = $1 RETURNING *', [id]);
  if (!result.rows.length) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  res.json(result.rows[0]);
});

// Complete ride
router.post('/:id/driverComplete', authenticate, async (req, res) => {
  const { id } = req.body;
  const result = await query('UPDATE rides SET status = 'completed', final_fare = $1, completed_at = now() WHERE id = $2 RETURNING *', [99, id]);
  if (!result.rows.length) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  res.json(result.rows[0]);
});

export { router };