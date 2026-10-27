import { useAuthStore } from '../store/authStore';
import { HARDCODED_CUSTOMER } from '../data/riders';

export function useAuth() {
  const rider = useAuthStore((s) => s.rider) || HARDCODED_CUSTOMER;
  const loginAsRider = useAuthStore((s) => s.loginAsRider);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);
  const updateRiderProfile = useAuthStore((s) => s.updateRiderProfile);
  const resetAuthData = useAuthStore((s) => s.resetAuthData);

  return {
    role: 'rider', // Customer role locked
    rider,
    customer: rider,
    currentUser: rider,
    isAuthenticated: true,
    isRider: true,
    isDriver: false,
    loginAsRider,
    switchRole,
    logout,
    updateRiderProfile,
    resetAuthData,
  };
}
