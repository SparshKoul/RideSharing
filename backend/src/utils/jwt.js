/**
 * JWT helpers shared by auth routes and middleware.
 */

import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'rideezz-dev-secret-change-me';

export const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'rider' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
