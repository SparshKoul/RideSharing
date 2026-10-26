import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRole }) {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to the correct role dashboard
    const targetDashboard = role === 'driver' ? '/driver/dashboard' : '/rider/dashboard';
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}
