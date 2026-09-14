import { type CompanyCoordinates, companyInfo } from '@/domain/company';

export type { CompanyCoordinates as Coordinates } from '@/domain/company';

type Coordinates = CompanyCoordinates;
export const COMPANY_COORDINATES = { ...companyInfo.coordinates };

export async function getCoordinates(address: {
  street: string;
  city: string;
  state: string;
}): Promise<Coordinates> {
  const params = new URLSearchParams({
    street: address.street,
    city: address.city,
    state: address.state,
    countrycodes: 'BR',
    format: 'json',
    limit: '1',
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search.php?${params.toString()}`,
    {
      headers: {
        'User-Agent': 'Cantinho do Acai App',
      },
    },
  );
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;

  if (data.length > 0) {
    const { lat, lon } = data[0];

    return { lat: Number.parseFloat(lat), lon: Number.parseFloat(lon) };
  }

  throw new Error('Address not found.');
}

export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates,
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(coord2.lat - coord1.lat);
  const dLon = deg2rad(coord2.lon - coord1.lon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coord1.lat)) *
      Math.cos(deg2rad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km

  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function calculateFare(distance: number): number {
  if (distance <= 3.9) {
    return 10;
  }

  if (distance <= 5.9) {
    return 12;
  }

  if (distance <= 7.9) {
    return 15;
  }

  if (distance <= 9.9) {
    return 18;
  }

  if (distance <= 10.9) {
    return 20;
  }

  return 20 + (distance - 10.9) * 2;
}
