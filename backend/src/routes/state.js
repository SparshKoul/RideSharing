/**
 * App state routes - draft / profile / favorites stored in Supabase.
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import supabase from '../utils/db.js';

const router = Router();

const emptyState = (userId) => ({
  user_id: userId,
  draft: null,
  profile: null,
  favorites: null,
  updated_at: null,
});

const toState = (row, userId) => {
  if (!row) return emptyState(userId);
  return {
    user_id: row.user_id,
    draft: row.draft,
    profile: row.profile,
    favorites: row.favorites,
    updated_at: row.updated_at,
  };
};

router.get('/', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_state')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle();
    if (error) return res.status(500).json({ error: 'Failed to retrieve state' });
    res.json(toState(data, req.user.id));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/', authenticate, async (req, res) => {
  const { draft, profile, favorites } = req.body;
  if (draft === undefined && profile === undefined && favorites === undefined) {
    return res.status(400).json({ error: 'Nothing to save' });
  }
  try {
    const updates = { updated_at: new Date().toISOString() };
    if (draft !== undefined) updates.draft = draft;
    if (profile !== undefined) updates.profile = profile;
    if (favorites !== undefined) updates.favorites = favorites;

    const { data, error } = await supabase
      .from('user_state')
      .upsert({ user_id: req.user.id, ...updates })
      .select('*')
      .single();

    if (error) return res.status(500).json({ error: 'Failed to save state' });
    res.json(toState(data, req.user.id));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
