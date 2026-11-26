/**
 * Auth routes - backed by our own `users` table (bcrypt + JWT).
 * Supports both rider and driver roles.
 */

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { authenticate } from '../middleware/auth.js';
import supabase from '../utils/db.js';
import { signToken } from '../utils/jwt.js';

const router = Router();

const DEMO_PASSWORD = 'demo1234';
const DEMO_ACCOUNTS = [
  { email: 'demo.rider@rideezz.demo', name: 'Demo Rider', role: 'rider' },
  { email: 'demo.driver@rideezz.demo', name: 'Demo Driver', role: 'driver' },
];

const toPublicUser = (row) => ({
  id: row.id,
  email: row.email,
  name: row.full_name || row.email?.split('@')[0] || 'Rider',
  role: row.role || 'rider',
  accountType: row.account_type || 'regular',
  createdAt: row.created_at,
});

const ensureDriverProfile = async (user, { name, phone }) => {
  const { data: existing } = await supabase
    .from('drivers')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();
  if (existing) return;

  await supabase.from('drivers').insert({
    id: user.id,
    name: name || user.full_name,
    email: user.email,
    phone: phone || null,
    rating: 5.0,
    trips_completed: 0,
    vehicle_jsonb: {
      category: 'economy',
      model: 'Maruti Suzuki Swift Dzire',
      plateNumber: 'PB 65 DE 2026',
      color: 'Pearl White',
      year: 2024,
      capacity: 4,
    },
  });
};

/** Make sure seeded demo accounts exist with valid bcrypt hashes and profiles. */
const ensureDemoAccounts = async () => {
  const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  for (const account of DEMO_ACCOUNTS) {
    const { data: existing } = await supabase
      .from('users')
      .select('id, password_hash, full_name, role')
      .eq('email', account.email)
      .maybeSingle();

    let user = existing;
    if (!user) {
      const { data: inserted } = await supabase
        .from('users')
        .insert({
          email: account.email,
          password_hash: hash,
          full_name: account.name,
          role: account.role,
          account_type: 'regular',
        })
        .select('*')
        .single();
      user = inserted;
    } else {
      const updates = {};
      if (!user.password_hash || user.password_hash.length < 20) updates.password_hash = hash;
      if (!user.full_name) updates.full_name = account.name;
      if (user.role !== account.role) updates.role = account.role;
      if (Object.keys(updates).length) {
        const { data: updated } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
          .select('*')
          .single();
        user = updated || user;
      }
    }

    if (user?.role === 'driver') await ensureDriverProfile(user, { name: account.name });
  }
};

// Login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const requestedRole = role === 'driver' || role === 'rider' ? role : null;
  try {
    await ensureDemoAccounts();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // A rider account cannot sign in through the driver option (and vice versa)
    if (requestedRole && user.role !== requestedRole) {
      return res.status(401).json({ error: 'Invalid credentials for this account type' });
    }

    const publicUser = toPublicUser(user);
    res.json({ token: signToken(publicUser), user: publicUser });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

// Register (rider or driver)
router.post('/register', async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const userRole = role === 'driver' ? 'driver' : 'rider';
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
        role: userRole,
        account_type: 'regular',
      })
      .select('*')
      .single();

    if (error || !user) {
      return res.status(400).json({ error: 'Registration failed' });
    }

    if (userRole === 'driver') {
      await ensureDriverProfile(user, { name: fullName, phone });
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
