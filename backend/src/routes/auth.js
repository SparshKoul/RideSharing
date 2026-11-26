/**
 * Auth routes - backed by our own `users` table (bcrypt + JWT).
 */

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { authenticate } from '../middleware/auth.js';
import supabase from '../utils/db.js';
import { signToken } from '../utils/jwt.js';

const router = Router();

const DEMO_EMAIL = 'demo.rider@rideezz.demo';
const DEMO_PASSWORD = 'demo1234';

const toPublicUser = (row) => ({
  id: row.id,
  email: row.email,
  name: row.full_name || row.email?.split('@')[0] || 'Rider',
  role: row.role || 'rider',
  accountType: row.account_type || 'regular',
  createdAt: row.created_at,
});

/** Make sure the seeded demo rider has a valid bcrypt hash. */
const ensureDemoUser = async () => {
  const { data: existing } = await supabase
    .from('users')
    .select('id, password_hash, full_name')
    .eq('email', DEMO_EMAIL)
    .maybeSingle();

  const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  if (!existing) {
    await supabase.from('users').insert({
      email: DEMO_EMAIL,
      password_hash: hash,
      full_name: 'Demo Rider',
      role: 'rider',
      account_type: 'regular',
    });
  } else {
    const updates = {};
    if (!existing.password_hash || existing.password_hash.length < 20) {
      updates.password_hash = hash;
    }
    if (!existing.full_name) updates.full_name = 'Demo Rider';
    if (Object.keys(updates).length) {
      await supabase.from('users').update(updates).eq('id', existing.id);
    }
  }
};

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    await ensureDemoUser();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const publicUser = toPublicUser(user);
    res.json({ token: signToken(publicUser), user: publicUser });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: bcrypt.hashSync(password, 10),
        full_name: fullName || email.split('@')[0],
        role: 'rider',
        account_type: 'regular',
      })
      .select('*')
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Registration failed' });
    }

    const publicUser = toPublicUser(user);
    res.status(201).json({ token: signToken(publicUser), user: publicUser });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(toPublicUser(user));
  } catch (err) {
    return res.status(500).json({ error: 'Could not retrieve user' });
  }
});

export default router;
