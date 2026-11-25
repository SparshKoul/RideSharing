/**
 * Drivers routes
 */

import { Router } from 'express';
import { query } from '../utils/db.js';

const router = Router();

// Get drivers
router.get('/', async (req, res) => {
  const result = await query('SELECT id, name, email, rating, trips_completed FROM drivers');
  res.json(result.rows);
});

// Update driver
router.post('/:id/update', async (req, res) => {
  const { id, rating, feedback } = req.body;
  const result = await query('UPDATE drivers SET rating = $1, feedback = $2 WHERE id = $3 RETURNING *', [rating, feedback, id]);
  if (!result.rows.length) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.json(result.rows[0]);
});

export { router };