import { apiFetch } from "@/src/shared";
import { ADMIN_ANALYTICS_URL } from "./dashboardApiKeys";

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
  routeId: string;
  routeName: string;
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
  routeId: string;
  routeName: string;
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
  isBlocked: boolean;
  unpaidBookings: UnpaidBookingItem[];
};

export function getAnalyticsSummary() {
  return apiFetch<GetSummaryAnalyticsResponse>(`${ADMIN_ANALYTICS_URL}/summary`);
}

export function getAllRoutesAnalytics() {
  return apiFetch<AllRoutesResponse[]>(ADMIN_ANALYTICS_URL);
}

export function getRouteAnalytics(routeId: string) {
  return apiFetch<RouteAnalyticsResponse>(
    `${ADMIN_ANALYTICS_URL}/route?routeId=${encodeURIComponent(routeId)}`,
  );
}

export function getUserWithUnpaidBookings(userId: number) {
  return apiFetch<UserWithUnpaidBookingsResponse>(`${ADMIN_ANALYTICS_URL}/users/${userId}`);
}

export function blockUser(userId: number, block: boolean) {
  return apiFetch<{ userId: number; isBlocked: boolean }>(
    `${ADMIN_ANALYTICS_URL}/users/${userId}/block`,
    { method: "PATCH", body: JSON.stringify({ block }) },
  );
}
