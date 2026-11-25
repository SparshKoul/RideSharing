/**
 * Analytics routes - uses Supabase client
 */

import { Router } from 'express';
import supabase from '../utils/db.js';

const router = Router();

// Get earnings - select from drivers
router.get('/earnings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('id, name, rating, trips_completed, last_login')
      .order('rating', { ascending: false });
    if (error) {
      return res.status(500).json({ error: 'Failed to retrieve earnings' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get trip history - select from rides
router.get('/trips', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: 'Failed to retrieve rides' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
