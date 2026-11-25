import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Toast from './components/Toast';
import { useAuthStore } from './store/authStore';
import { useRideStore } from './store/rideStore';

export default function App() {
  useEffect(() => {
    (async () => {
      // Get a JWT first, then load catalog + trips from Supabase.
      await useAuthStore.getState().bootstrap();
      await Promise.all([
        useRideStore.getState().loadCatalog(),
        useRideStore.getState().loadRides(),
      ]);
    })();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toast />
    </>
  );
}
