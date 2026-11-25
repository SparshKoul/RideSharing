/**
 * Payments routes
 */

import { Router } from 'express';
import { query } from '../utils/db.js';

const router = Router();

// Process payment
router.post('/process', async (req, res) => {
  const { rideId, amount, currency, method } = req.body;
  if (!rideId || !amount) {
    return res.status(400).json({ error: 'rideId and amount required' });
  }
  const result = await query('INSERT INTO payments (id, ride_id, amount, currency, method, status) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)', [
    rideId,
    amount,
    currency || 'INR',
    method || 'upi',
    'succeeded',
  ]);
  res.json(result.rows[0]);
});

export { router };