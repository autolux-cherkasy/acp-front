import { apiFetch } from "@/src/shared/api/http";
import {
  CreateTripPayload,
  MessageResponse,
  RouteSegment,
  Trip,
  TripAvailability,
  TripDate,
  TripSearchParams,
} from "../model/types";

type RouteStop = {
  id: string;
  name: string;
  stopOrder: number;
  offsetMinutes: number;
  priceFromOrigin: number;
};

type TripListResponse = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  pricePerSeat: number;
};

type TripDetailResponse = {
  id: string;
  routeId: string;
  routeNumber: string;
  platform: string;
  direction: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  route: {
    name: string;
    origin: string;
    destination: string;
    stops: RouteStop[];
  };
};

type TripAvailabilityResponse = {
  tripId: string;
  totalSeats: number;
  reservedSeats: number;
  availableSeats: number;
  canReserve: boolean;
  boardingStop: RouteStop;
  alightingStop: RouteStop;
  departureTime: string;
  arrivalTime: string;
  pricePerSeat: number;
};

function toQueryString(params: TripSearchParams): string {
  const searchParams = new URLSearchParams();
  if (params.fromStopId) searchParams.set("fromStopId", params.fromStopId);
  if (params.toStopId) searchParams.set("toStopId", params.toStopId);
  if (params.date) searchParams.set("date", params.date);
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getTripAvailability(
  id: string | number,
  seats?: number,
): Promise<TripAvailability> {
  const queryString =
    typeof seats === "number" && Number.isFinite(seats)
      ? `?seats=${encodeURIComponent(String(seats))}`
      : "";

  const response = await apiFetch<TripAvailabilityResponse>(
    `/trips/${encodeURIComponent(String(id))}/availability${queryString}`,
    { includeAuth: false, skipAuthRefresh: true },
  );

  return {
    tripId: response.tripId,
    totalSeats: response.totalSeats,
    reservedSeats: response.reservedSeats,
    availableSeats: response.availableSeats,
    canReserve: response.canReserve,
    raw: response,
  };
}

export async function getRoutes() {
  return apiFetch<RouteSegment[]>(`/routes`);
}

export async function getDates(params: TripSearchParams) {
  return apiFetch<TripDate[]>(`/trips/dates${toQueryString(params)}`, {
    includeAuth: false,
    skipAuthRefresh: true,
  });
}

export async function getTrips(params: TripSearchParams = {}): Promise<Trip[]> {
  const response = await apiFetch<TripListResponse[]>(`/trips${toQueryString(params)}`, {
    includeAuth: false,
    skipAuthRefresh: true,
  });

  return response.map((item) => ({
    id: item.id,
    routeNumber: null,
    platform: null,
    direction: "",
    slug: null,
    from: "",
    to: "",
    date: item.departureTime.slice(0, 10),
    departureTime: item.departureTime,
    arrivalTime: item.arrivalTime,
    price: item.pricePerSeat,
    availableSeats: item.availableSeats,
    totalSeats: null,
    imageSrc: null,
    raw: item,
    stops: [],
  }));
}

export async function getTripById(id: string | number): Promise<Trip> {
  const response = await apiFetch<TripDetailResponse>(`/trips/${encodeURIComponent(String(id))}`, {
    includeAuth: false,
    skipAuthRefresh: true,
  });

  return {
    id: response.id,
    routeNumber: response.routeNumber,
    platform: response.platform,
    direction: response.direction,
    slug: null,
    from: response.route.origin,
    to: response.route.destination,
    date: response.departureTime.slice(0, 10),
    departureTime: response.departureTime,
    arrivalTime: response.arrivalTime,
    price: response.price,
    availableSeats: null,
    totalSeats: response.totalSeats,
    imageSrc: null,
    raw: response,
    stops: response.route.stops,
  };
}

export function createTrip(payload: CreateTripPayload) {
  return apiFetch<unknown>("/admin/create-trip", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteTrip(id: string | number) {
  return apiFetch<MessageResponse>(`/admin/trip/${encodeURIComponent(String(id))}`, {
    method: "DELETE",
  });
}
