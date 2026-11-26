/**
 * Rides routes - backed by Supabase.
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import supabase from '../utils/db.js';

const router = Router();

/** Attach location / category / driver objects so the UI can render rides directly. */
const enrichRides = async (rows) => {
  if (!rows || rows.length === 0) return [];

  const [locationsRes, categoriesRes, driversRes] = await Promise.all([
    supabase.from('locations').select('*'),
    supabase.from('categories').select('*'),
    supabase.from('drivers').select('*'),
  ]);

  const byId = (list) =>
    Object.fromEntries((list || []).map((item) => [item.id, item]));

  const locations = byId(locationsRes.data);
  const categories = byId(categoriesRes.data);
  const drivers = byId(driversRes.data);

  return rows.map((ride) => ({
    ...ride,
    pickup: locations[ride.pickup_location_id] || null,
    destination: locations[ride.destination_location_id] || null,
    category: categories[ride.category_id] || null,
    assignedDriver: drivers[ride.driver_id] || null,
  }));
};

// List rides (optionally only the current rider's)
router.get('/', authenticate, async (req, res) => {
  try {
    let query = supabase.from('rides').select('*').order('created_at', { ascending: false });
    if (req.query.mine === 'true') query = query.eq('rider_id', req.user.id);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: 'Failed to retrieve rides' });
    res.json(await enrichRides(data));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Single ride
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();
    if (error) return res.status(500).json({ error: 'Failed to retrieve ride' });
    if (!data) return res.status(404).json({ error: 'Ride not found' });

    const [ride] = await enrichRides([data]);
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book a ride
router.post('/book', authenticate, async (req, res) => {
  const { pickupLocationId, destinationLocationId, categoryId } = req.body;
  if (!pickupLocationId || !destinationLocationId || !categoryId) {
    return res.status(400).json({ error: 'Pickup, destination, and category required' });
  }
  try {
    const [metricRes, categoryRes] = await Promise.all([
      supabase
        .from('route_metrics')
        .select('distance_km, duration_mins')
        .eq('pickup_id', pickupLocationId)
        .eq('destination_id', destinationLocationId)
        .maybeSingle(),
      supabase
        .from('categories')
        .select('base_fare, rate_per_km, rate_per_min')
        .eq('id', categoryId)
        .maybeSingle(),
    ]);

    const distanceKm = Number(metricRes.data?.distance_km) || 0;
    const durationMins = Number(metricRes.data?.duration_mins) || 0;
    const cat = categoryRes.data || {};
    const finalFare = Math.round(
      (Number(cat.base_fare) || 0) +
        distanceKm * (Number(cat.rate_per_km) || 0) +
        durationMins * (Number(cat.rate_per_min) || 0)
    );
    const driverEarnings = Math.round(finalFare * 0.82);

    const { data, error } = await supabase
      .from('rides')
      .insert({
        rider_id: req.user.id,
        driver_id: null,
        pickup_location_id: pickupLocationId,
        destination_location_id: destinationLocationId,
        category_id: categoryId,
        status: 'searching',
        created_by: req.user.id,
        estimated_fare: finalFare,
        final_fare: null,
        driver_earnings: driverEarnings,
      })
      .select('*')
      .single();

    if (error || !data) {
      return res.status(500).json({ error: 'Failed to book ride' });
    }

    const [ride] = await enrichRides([data]);
    res.status(201).json(ride);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update ride status
router.post('/:id/status', authenticate, async (req, res) => {
  const id = req.params.id || req.body.id;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status required' });
  try {
    const updates = { status, updated_at: new Date().toISOString() };
    if (status === 'completed') updates.completed_at = new Date().toISOString();
    if (req.body.finalFare != null) updates.final_fare = req.body.finalFare;
    if (status === 'driver_assigned' && req.body.driverId) updates.driver_id = req.body.driverId;

    const { data, error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) return res.status(500).json({ error: 'Failed to update status' });

    const [ride] = await enrichRides(data ? [data] : []);
    res.json(ride || { message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Driver accepts ride
router.post('/:id/accept', authenticate, async (req, res) => {
  const id = req.params.id || req.body.id;
  try {
    const { error } = await supabase
      .from('rides')
      .update({ status: 'driver_assigned', driver_id: req.user.id, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to accept ride' });
    res.json({ message: 'Ride accepted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Driver completes ride
router.post('/:id/driverComplete', authenticate, async (req, res) => {
  const id = req.params.id || req.body.id;
  try {
    const updates = { status: 'completed', completed_at: new Date().toISOString() };
    if (req.body.finalFare != null) updates.final_fare = req.body.finalFare;

    const { error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', id);
    if (error) return res.status(500).json({ error: 'Failed to complete ride' });
    res.json({ message: 'Ride completed' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a rating for a completed ride
router.post('/:id/rate', authenticate, async (req, res) => {
  const id = req.params.id || req.body.id;
  const { rating, feedback } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }
  try {
    const { data, error } = await supabase
      .from('rides')
      .update({ rating, rating_feedback: feedback || null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) return res.status(500).json({ error: 'Failed to save rating' });

    const [ride] = await enrichRides(data ? [data] : []);
    res.json(ride || { message: 'Rating saved' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
