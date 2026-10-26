import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import RiderLayout from './layouts/RiderLayout';
import DriverLayout from './layouts/DriverLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import RoleSelectionPage from './pages/public/RoleSelectionPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import HelpPage from './pages/public/HelpPage';

// Rider Pages
import RiderDashboard from './pages/rider/RiderDashboard';
import BookingPage from './pages/rider/BookingPage';
import BookingConfirmation from './pages/rider/BookingConfirmation';
import ActiveRidePage from './pages/rider/ActiveRidePage';
import TripsPage from './pages/rider/TripsPage';
import TripDetailsPage from './pages/rider/TripDetailsPage';
import PaymentsPage from './pages/rider/PaymentsPage';
import FavoritesPage from './pages/rider/FavoritesPage';
import RiderProfilePage from './pages/rider/RiderProfilePage';

// Driver Pages
import DriverDashboard from './pages/driver/DriverDashboard';
import RideRequestsPage from './pages/driver/RideRequestsPage';
import DriverActiveTripPage from './pages/driver/DriverActiveTripPage';
import DriverTripsPage from './pages/driver/DriverTripsPage';
import EarningsPage from './pages/driver/EarningsPage';
import VehiclePage from './pages/driver/VehiclePage';
import DriverProfilePage from './pages/driver/DriverProfilePage';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'role-select', element: <RoleSelectionPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'help', element: <HelpPage /> },
    ],
  },

  // Rider Routes
  {
    path: '/rider',
    element: (
      <ProtectedRoute allowedRole="rider">
        <RiderLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RiderDashboard /> },
      { path: 'book', element: <BookingPage /> },
      { path: 'confirm', element: <BookingConfirmation /> },
      { path: 'active', element: <ActiveRidePage /> },
      { path: 'trips', element: <TripsPage /> },
      { path: 'trips/:id', element: <TripDetailsPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'profile', element: <RiderProfilePage /> },
    ],
  },

  // Driver Routes
  {
    path: '/driver',
    element: (
      <ProtectedRoute allowedRole="driver">
        <DriverLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DriverDashboard /> },
      { path: 'requests', element: <RideRequestsPage /> },
      { path: 'active', element: <DriverActiveTripPage /> },
      { path: 'trips', element: <DriverTripsPage /> },
      { path: 'trips/:id', element: <TripDetailsPage /> },
      { path: 'earnings', element: <EarningsPage /> },
      { path: 'vehicle', element: <VehiclePage /> },
      { path: 'profile', element: <DriverProfilePage /> },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
