import { useRideStore } from '../store/rideStore';
import { useAuthStore } from '../store/authStore';

export function useRide() {
  const rides = useRideStore((s) => s.rides);
  const activeRideId = useRideStore((s) => s.activeRideId);
  const driverOnline = useRideStore((s) => s.driverOnline);
  const bookingDraft = useRideStore((s) => s.bookingDraft);
  const rejectedRideIds = useRideStore((s) => s.rejectedRideIds);
  const notifications = useRideStore((s) => s.notifications);

  const updateBookingDraft = useRideStore((s) => s.updateBookingDraft);
  const swapPickupAndDestination = useRideStore((s) => s.swapPickupAndDestination);
  const setDriverOnline = useRideStore((s) => s.setDriverOnline);
  const createRideRequest = useRideStore((s) => s.createRideRequest);
  const driverAcceptRide = useRideStore((s) => s.driverAcceptRide);
  const driverRejectRide = useRideStore((s) => s.driverRejectRide);
  const driverMarkArriving = useRideStore((s) => s.driverMarkArriving);
  const driverStartTrip = useRideStore((s) => s.driverStartTrip);
  const driverCompleteTrip = useRideStore((s) => s.driverCompleteTrip);
  const cancelRide = useRideStore((s) => s.cancelRide);
  const submitRideRating = useRideStore((s) => s.submitRideRating);
  const createSampleRequest = useRideStore((s) => s.createSampleRequest);
  const addToast = useRideStore((s) => s.addToast);
  const removeToast = useRideStore((s) => s.removeToast);
  const resetAllRideData = useRideStore((s) => s.resetAllRideData);

  const currentRole = useAuthStore((s) => s.role);
  const driverProfile = useAuthStore((s) => s.driver);

  // Active ride currently assigned or tracked
  const activeRide = rides.find((r) => r.id === activeRideId) ||
    rides.find((r) => ['searching', 'driver_assigned', 'driver_arriving', 'in_progress'].includes(r.status)) ||
    null;

  // Driver's active assigned trip
  const driverActiveTrip = rides.find(
    (r) => r.assignedDriver?.id === driverProfile?.id && ['driver_assigned', 'driver_arriving', 'in_progress'].includes(r.status)
  ) || null;

  // Pending incoming requests visible to online driver
  const pendingRequests = driverOnline
    ? rides.filter((r) => r.status === 'searching' && !rejectedRideIds.includes(r.id))
    : [];

  // Completed trips
  const completedTrips = rides.filter((r) => r.status === 'completed');
  const cancelledTrips = rides.filter((r) => r.status === 'cancelled');

  // Driver metrics
  const driverCompletedTrips = rides.filter(
    (r) => r.status === 'completed' && r.assignedDriver?.id === driverProfile?.id
  );
  const driverTotalEarnings = driverCompletedTrips.reduce((sum, r) => sum + (r.driverEarnings || 0), 0);
  const driverTodayEarnings = driverCompletedTrips
    .filter((r) => new Date(r.completedAt).toDateString() === new Date().toDateString())
    .reduce((sum, r) => sum + (r.driverEarnings || 0), 0) + (driverProfile?.todayEarnings || 0);

  // Rider metrics
  const riderCompletedTrips = rides.filter((r) => r.status === 'completed');
  const riderTotalSpent = riderCompletedTrips.reduce((sum, r) => sum + (r.finalFare || 0), 0);

  return {
    rides,
    activeRide,
    activeRideId: activeRide?.id || null,
    driverActiveTrip,
    pendingRequests,
    completedTrips,
    cancelledTrips,
    driverOnline,
    bookingDraft,
    notifications,
    driverTotalEarnings,
    driverTodayEarnings,
    driverCompletedTripsCount: driverCompletedTrips.length,
    riderTotalSpent,
    riderCompletedTripsCount: riderCompletedTrips.length,
    updateBookingDraft,
    swapPickupAndDestination,
    setDriverOnline,
    createRideRequest,
    driverAcceptRide,
    driverRejectRide,
    driverMarkArriving,
    driverStartTrip,
    driverCompleteTrip,
    cancelRide,
    submitRideRating,
    createSampleRequest,
    addToast,
    removeToast,
    resetAllRideData,
  };
}
