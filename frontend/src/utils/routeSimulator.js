/**
 * Route coordinate generator for smooth path display
 */
export function generateRoutePoints(pickup, destination, numPoints = 8) {
  if (!pickup || !destination) return [];
  const points = [];
  const startLat = pickup.lat;
  const startLng = pickup.lng;
  const endLat = destination.lat;
  const endLng = destination.lng;

  // Add slight curved offset for a realistic highway path
  const midLat = (startLat + endLat) / 2 + 0.012;
  const midLng = (startLng + endLng) / 2 - 0.015;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Quadratic bezier curve
    const lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * midLat + t * t * endLat;
    const lng = (1 - t) * (1 - t) * startLng + 2 * (1 - t) * t * midLng + t * t * endLng;
    points.push([lat, lng]);
  }

  return points;
}
