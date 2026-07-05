import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockUser,
  getAllRoutesAnalytics,
  getAnalyticsSummary,
  getRouteAnalytics,
  getUserWithUnpaidBookings,
} from "./dashboardAnalyticsApi";

import {
  ANALYTICS_SUMMARY_KEY,
  ANALYTICS_ALL_ROUTES_KEY,
  ANALYTICS_ROUTE_KEY,
  ANALYTICS_USER_KEY,
} from "./dashboardApiKeys";
export { ANALYTICS_SUMMARY_KEY, ANALYTICS_ALL_ROUTES_KEY, ANALYTICS_ROUTE_KEY, ANALYTICS_USER_KEY };

export function useAnalyticsSummaryQuery(date?: string) {
  return useQuery({
    queryFn: () => getAnalyticsSummary(date),
    queryKey: [ANALYTICS_SUMMARY_KEY, date ?? "today"],
  });
}

export function useAllRoutesAnalyticsQuery(date?: string) {
  return useQuery({
    queryFn: () => getAllRoutesAnalytics(date),
    queryKey: [ANALYTICS_ALL_ROUTES_KEY, date ?? "today"],
  });
}

export function useRouteAnalyticsQuery(direction: string | null) {
  return useQuery({
    queryFn: () => getRouteAnalytics(direction!),
    queryKey: [ANALYTICS_ROUTE_KEY, direction],
    enabled: !!direction,
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
