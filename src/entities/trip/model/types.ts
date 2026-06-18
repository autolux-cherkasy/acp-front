export type RouteSegment = {
  from: string;
  fromStopId: string;
  to: string;
  toStopId: string;
};

export type TripStatus = "DEPARTED" | "BOARDING" | "SCHEDULED" | "CANCELLED";

export type TripSearchParams = {
  fromStopId?: string;
  toStopId?: string;
  date?: string;
  // seats?: number;
  // page?: number;
  // limit?: number;
};

export type TripDate = {
  date: string;
};

export type Trip = {
  id: string;
  routeNumber: string | null;
  platform: string | null;
  direction: string;
  slug: string | null;
  from: string;
  to: string;
  date: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  price: number | null;
  availableSeats: number | null;
  totalSeats: number | null;
  imageSrc: string | null;
  raw: unknown;
  stops: TripStop[];
};

export type TripStop = {
  id: string;
  name: string;
  stopOrder: number;
  offsetMinutes: number;
  priceFromOrigin: number;
};

export type TripAvailability = {
  tripId: string;
  totalSeats: number | null;
  reservedSeats: number | null;
  availableSeats: number | null;
  canReserve: boolean | null;
  raw: unknown;
};

export type CreateTripPayload = Record<string, unknown>;

export type MessageResponse = {
  message?: string;
};
