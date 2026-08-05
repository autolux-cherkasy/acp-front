import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockUser,
  getAllRoutesAnalytics,
  getAnalyticsSummary,
  getRouteAnalytics,
  getUserWithUnpaidBookings,
  type RouteSegment,
} from "./dashboardAnalyticsApi";

import {
  ANALYTICS_SUMMARY_KEY,
  ANALYTICS_ALL_ROUTES_KEY,
  ANALYTICS_ROUTE_KEY,
  ANALYTICS_USER_KEY,
} from "./dashboardApiKeys";
export { ANALYTICS_SUMMARY_KEY, ANALYTICS_ALL_ROUTES_KEY, ANALYTICS_ROUTE_KEY, ANALYTICS_USER_KEY };

export function useAnalyticsSummaryQuery() {
  return useQuery({
    queryFn: () => getAnalyticsSummary(),
    queryKey: [ANALYTICS_SUMMARY_KEY],
  });
}

export function useAllRoutesAnalyticsQuery() {
  return useQuery({
    queryFn: () => getAllRoutesAnalytics(),
    queryKey: [ANALYTICS_ALL_ROUTES_KEY],
  });
}

export function useRouteAnalyticsQuery(segment: RouteSegment | null) {
  return useQuery({
    queryFn: () => getRouteAnalytics(segment!),
    queryKey: [ANALYTICS_ROUTE_KEY, segment?.boardingStop, segment?.alightingStop],
    enabled: !!segment,
  });
}

export function useUserWithUnpaidBookingsQuery(userId: number | null) {
  return useQuery({
    queryFn: () => getUserWithUnpaidBookings(userId!),
    queryKey: [ANALYTICS_USER_KEY, userId],
    enabled: userId !== null,
  });
}

export function useBlockUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, block }: { userId: number; block: boolean }) => blockUser(userId, block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANALYTICS_SUMMARY_KEY] });
    },
  });
}
