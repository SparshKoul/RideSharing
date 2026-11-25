import { useAuthStore } from '../store/authStore';
import { HARDCODED_CUSTOMER } from '../data/riders';

export function useAuth() {
  const rider = useAuthStore((s) => s.rider) || HARDCODED_CUSTOMER;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const authError = useAuthStore((s) => s.authError);

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loginAsRider = useAuthStore((s) => s.loginAsRider);
  const switchRole = useAuthStore((s) => s.switchRole);
  const logout = useAuthStore((s) => s.logout);
  const updateRiderProfile = useAuthStore((s) => s.updateRiderProfile);
  const resetAuthData = useAuthStore((s) => s.resetAuthData);

  return {
    role: 'rider',
    rider,
    customer: rider,
    currentUser: rider,
    isAuthenticated,
    isBootstrapping,
    authError,
    isRider: true,
    isDriver: false,
    login,
    register,
    loginAsRider,
    switchRole,
    logout,
    updateRiderProfile,
    resetAuthData,
  };
}
