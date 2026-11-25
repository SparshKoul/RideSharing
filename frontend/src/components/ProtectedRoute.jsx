import React from 'react';

/**
 * Auth entry points live in the navbar modal, so routes stay reachable
 * while signed out - the navbar shows Sign In / Sign Up in that state.
 */
export default function ProtectedRoute({ children }) {
  return children;
}
