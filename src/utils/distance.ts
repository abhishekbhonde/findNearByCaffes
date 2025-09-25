// Utility functions for distance calculations and cafe operations

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

export function getCafesByDistance(
  cafes: any[],
  userLocation: [number, number] | null
) {
  if (!userLocation) return cafes;
  
  return cafes
    .map(cafe => ({
      ...cafe,
      distance: calculateDistance(
        userLocation[1],
        userLocation[0],
        cafe.coordinates[1],
        cafe.coordinates[0]
      )
    }))
    .sort((a, b) => a.distance - b.distance);
}

export function filterCafes(cafes: any[], searchTerm: string, filterType: string) {
  let filtered = cafes;
  
  if (searchTerm) {
    filtered = filtered.filter(cafe =>
      cafe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cafe.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (filterType !== 'all') {
    filtered = filtered.filter(cafe =>
      cafe.type.toLowerCase().includes(filterType.toLowerCase())
    );
  }
  
  return filtered;
}