import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const role = useAuthStore((s) => s.role);
  const rider = useAuthStore((s) => s.rider);
  const driver = useAuthStore((s) => s.driver);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loginAsRider = useAuthStore((s) => s.loginAsRider);
  const loginAsDriver = useAuthStore((s) => s.loginAsDriver);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);
  const updateRiderProfile = useAuthStore((s) => s.updateRiderProfile);
  const updateDriverProfile = useAuthStore((s) => s.updateDriverProfile);
  const updateVehicle = useAuthStore((s) => s.updateVehicle);
  const resetAuthData = useAuthStore((s) => s.resetAuthData);

  return {
    role,
    rider,
    driver,
    currentUser: role === 'driver' ? driver : rider,
    isAuthenticated,
    isRider: role === 'rider',
    isDriver: role === 'driver',
    loginAsRider,
    loginAsDriver,
    switchRole,
    logout,
    updateRiderProfile,
    updateDriverProfile,
    updateVehicle,
    resetAuthData,
  };
}
