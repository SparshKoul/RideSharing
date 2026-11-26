import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Toast from './components/Toast';
import { useAuthStore } from './store/authStore';
import { useRideStore } from './store/rideStore';

export default function App() {
  useEffect(() => {
    (async () => {
      // Restore a real DB session, then load catalog + trips from Supabase.
      const authenticated = await useAuthStore.getState().bootstrap();
      if (authenticated) {
        await Promise.all([
          useRideStore.getState().loadCatalog(),
          useRideStore.getState().loadRides(),
          useRideStore.getState().loadState(),
        ]);
      }
    })();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toast />
    </>
  );
}
