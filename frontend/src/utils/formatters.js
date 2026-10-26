/**
 * Format currency to Indian Rupees symbol (₹)
 */
export function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Format distance in km
 */
export function formatDistance(distanceKm) {
  if (!distanceKm) return '0 km';
  return `${Number(distanceKm).toFixed(1)} km`;
}

/**
 * Format duration in minutes / hours
 */
export function formatDuration(durationMins) {
  if (!durationMins) return '0 mins';
  const mins = Math.round(durationMins);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
  }
  return `${mins} mins`;
}

/**
 * Format timestamp to readable date/time
 */
export function formatDateTime(isoString) {
  if (!isoString) return 'Just now';
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format status strings to user-friendly titles and colors
 */
export function getStatusDetails(status) {
  switch (status) {
    case 'searching':
      return {
        label: 'Searching Driver',
        textColor: 'text-[#D4FF00]',
        bgColor: 'bg-[#D4FF00]/15',
        borderColor: 'border-[#D4FF00]/40',
        dotColor: 'bg-[#D4FF00]',
      };
    case 'driver_assigned':
      return {
        label: 'Driver Assigned',
        textColor: 'text-[#3B38F5]',
        bgColor: 'bg-[#3B38F5]/15',
        borderColor: 'border-[#3B38F5]/40',
        dotColor: 'bg-[#3B38F5]',
      };
    case 'driver_arriving':
      return {
        label: 'Driver Arriving',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-400/15',
        borderColor: 'border-amber-400/40',
        dotColor: 'bg-amber-400',
      };
    case 'in_progress':
      return {
        label: 'Trip In Progress',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-400/15',
        borderColor: 'border-emerald-400/40',
        dotColor: 'bg-emerald-400',
      };
    case 'completed':
      return {
        label: 'Completed',
        textColor: 'text-[#D4FF00]',
        bgColor: 'bg-[#D4FF00]/15',
        borderColor: 'border-[#D4FF00]/40',
        dotColor: 'bg-[#D4FF00]',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        textColor: 'text-red-400',
        bgColor: 'bg-red-400/15',
        borderColor: 'border-red-400/40',
        dotColor: 'bg-red-400',
      };
    default:
      return {
        label: status || 'Unknown',
        textColor: 'text-neutral-400',
        bgColor: 'bg-neutral-800',
        borderColor: 'border-neutral-700',
        dotColor: 'bg-neutral-400',
      };
  }
}
