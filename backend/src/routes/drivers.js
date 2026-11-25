/**
 * Drivers routes - uses Supabase client
 */

import { Router } from 'express';
import supabase from '../utils/db.js';

const router = Router();

// Get drivers - select from drivers table
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('rating', { ascending: false });
    if (error) {
      return res.status(500).json({ error: 'Failed to retrieve drivers' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update driver - update driver profile
router.post('/:id/update', async (req, res) => {
  const { id, rating, feedback } = req.body;
  try {
    const { error } = await supabase
      .from('drivers')
      .update({ rating, feedback })
      .eq('id', id);
    if (error) {
      return res.status(500).json({ error: 'Failed to update driver' });
    }
    res.json({ message: 'Driver updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;