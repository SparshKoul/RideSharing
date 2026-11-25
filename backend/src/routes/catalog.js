/**
 * Catalog routes - locations and ride categories for the booking UI.
 */

import { Router } from 'express';
import supabase from '../utils/db.js';

const router = Router();

router.get('/locations', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name', { ascending: true });
    if (error) return res.status(500).json({ error: 'Failed to retrieve locations' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/categories', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('base_fare', { ascending: true });
    if (error) return res.status(500).json({ error: 'Failed to retrieve categories' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
