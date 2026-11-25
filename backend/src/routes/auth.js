/**
 * Auth routes
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { query } from '../utils/db.js';

const router = Router();

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const result = await query('SELECT id, email, role, password_hash FROM users WHERE email = $1', [email]);
  if (!result.rows.length) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  res.json({ token, user });
});

// Register
router.post('/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const result = await query('INSERT INTO users (id, email, password_hash, role, account_type) VALUES (gen_random_uuid(), $1, $2, 'rider', 'Customer') RETURNING id, email, role', [email, passwordHash]);
  if (result.rows.length === 0) {
    return res.status(500).json({ error: 'Failed to create user' });
  }
  res.json(result.rows[0]);
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
});

export { router };