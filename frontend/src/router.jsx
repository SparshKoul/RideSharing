import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import RiderLayout from './layouts/RiderLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import HelpPage from './pages/public/HelpPage';

// Customer (Rider) Pages
import RiderDashboard from './pages/rider/RiderDashboard';
import BookingPage from './pages/rider/BookingPage';
import BookingConfirmation from './pages/rider/BookingConfirmation';
import ActiveRidePage from './pages/rider/ActiveRidePage';
import TripsPage from './pages/rider/TripsPage';
import TripDetailsPage from './pages/rider/TripDetailsPage';
import FavoritesPage from './pages/rider/FavoritesPage';
import RiderProfilePage from './pages/rider/RiderProfilePage';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      // Direct redirects for role switching / auth routes - customer only mode
      { path: 'role-select', element: <Navigate to="/rider/dashboard" replace /> },
      { path: 'login', element: <Navigate to="/rider/dashboard" replace /> },
      { path: 'register', element: <Navigate to="/rider/dashboard" replace /> },
      { path: 'auth/*', element: <Navigate to="/rider/dashboard" replace /> },
      { path: 'help', element: <HelpPage /> },
    ],
  },

  // Customer Routes
  {
    path: '/rider',
    element: (
      <ProtectedRoute>
        <RiderLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RiderDashboard /> },
      { path: 'dashboard', element: <RiderDashboard /> },
      { path: 'book', element: <BookingPage /> },
      { path: 'confirm', element: <BookingConfirmation /> },
      { path: 'active', element: <ActiveRidePage /> },
      { path: 'ride/:id', element: <ActiveRidePage /> },
      { path: 'trips', element: <TripsPage /> },
      { path: 'trips/:id', element: <TripDetailsPage /> },
      { path: 'payments', element: <Navigate to="/rider/dashboard" replace /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'profile', element: <RiderProfilePage /> },
    ],
  },

  // Driver route redirects to Customer Console
  {
    path: '/driver',
    element: <Navigate to="/rider/dashboard" replace />,
  },
  {
    path: '/driver/*',
    element: <Navigate to="/rider/dashboard" replace />,
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
