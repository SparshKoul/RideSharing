/**
 * Analytics routes
 */

import { Router } from 'express';
import { query } from '../utils/db.js';

const router = Router();

// Get earnings
router.get('/', async (req, res) => {
  const result = await query('SELECT id, name, rating, trips_completed, last_login FROM drivers ORDER BY last_login DESC');
  res.json(result.rows);
});

// Get trip history
router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM rides ORDER BY created_at DESC');
  res.json(result.rows);
});

export { router };