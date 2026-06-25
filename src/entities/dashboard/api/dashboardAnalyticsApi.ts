import { apiFetch } from "@/src/shared";

const BASE = "/admin/analytics";

export type NoShowItem = {
  userId: number;
  passengerName: string | null;
  passengerPhone: string | null;
  totalBookings: number;
  unpaidBookings: number;
  isBlocked: boolean;
};

export type FinanceAnalytics = {
  activeBookings: number;
  paidBookings: number;
  canceledBookings: number;
};

export type PopularRoute = {
  direction: string;
  ticketsCount: number;
};

export type LoadAnalyticsItem = {
  hour: number;
  ticketsBought: number;
};

export type GetSummaryAnalyticsResponse = {
  noShow: NoShowItem[];
  finance: FinanceAnalytics;
  popularRoutes: PopularRoute[];
  load: LoadAnalyticsItem[];
};

export type AllRoutesResponse = {
  direction: string;
  tripsCount: number;
  ticketsSoldTotal: number;
  occupancyPercent: number;
  revenueTotal: number;
  buyoutRatePercent: number;
};

export type RouteDynamicsItem = {
  day: string;
  ticketsSold: number;
};

export type RouteTicketStats = {
  reserved: number;
  boughtOut: number;
  canceled: number;
};

export type RouteAnalyticsResponse = {
  direction: string;
  dynamics: RouteDynamicsItem[];
  ticketStats: RouteTicketStats;
};

export type UnpaidBookingItem = {
  bookingNumber: string;
  direction: string;
  date: string;
  time: string;
  seatsCount: number;
  totalPrice: number;
};

export type UserWithUnpaidBookingsResponse = {
  name: string;
  phone: string | null;
  email: string;
  unpaidBookings: UnpaidBookingItem[];
};

export function getAnalyticsSummary(date?: string) {
  const qs = date ? `?date=${encodeURIComponent(date)}` : "";
  return apiFetch<GetSummaryAnalyticsResponse>(`${BASE}/summary${qs}`);
}

export function getAllRoutesAnalytics() {
  return apiFetch<AllRoutesResponse[]>(`${BASE}`);
}

export function getRouteAnalytics(direction: string) {
  return apiFetch<RouteAnalyticsResponse>(
    `${BASE}/route?direction=${encodeURIComponent(direction)}`,
  );
}

export function getUserWithUnpaidBookings(userId: number) {
  return apiFetch<UserWithUnpaidBookingsResponse>(`${BASE}/users/${userId}`);
}

export function blockUser(userId: number, block: boolean) {
  return apiFetch<{ userId: number; isBlocked: boolean }>(
    `${BASE}/users/${userId}/block`,
    { method: "PATCH", body: JSON.stringify({ block }) },
  );
}
