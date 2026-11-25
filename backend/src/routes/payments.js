/**
 * Payments routes - uses Supabase client
 */

import { Router } from 'express';
import supabase from '../utils/db.js';

const router = Router();

// Process payment - insert into payments table
router.post('/process', async (req, res) => {
  const { rideId, amount, currency, method } = req.body;
  if (!rideId || !amount) {
    return res.status(400).json({ error: 'rideId and amount required' });
  }
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        ride_id: rideId,
        amount,
        currency: currency || 'INR',
        method: method || 'upi',
        status: 'succeeded',
      });
    if (error) {
      return res.status(500).json({ error: 'Failed to process payment' });
    }
    res.json({ id: data[0].id, amount: data[0].amount, status: data[0].status });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;