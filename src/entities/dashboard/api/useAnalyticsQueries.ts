import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  blockUser,
  getAllRoutesAnalytics,
  getAnalyticsSummary,
  getRouteAnalytics,
  getUserWithUnpaidBookings,
} from "./analyticsApi";

export const ANALYTICS_SUMMARY_KEY = "analytics_summary";
export const ANALYTICS_ALL_ROUTES_KEY = "analytics_all_routes";
export const ANALYTICS_ROUTE_KEY = "analytics_route";
export const ANALYTICS_USER_KEY = "analytics_user";

export function useAnalyticsSummaryQuery(date?: string) {
  return useQuery({
    queryFn: () => getAnalyticsSummary(date),
    queryKey: [ANALYTICS_SUMMARY_KEY, date ?? "today"],
  });
}

export function useAllRoutesAnalyticsQuery() {
  return useQuery({
    queryFn: getAllRoutesAnalytics,
    queryKey: [ANALYTICS_ALL_ROUTES_KEY],
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
    mutationFn: ({ userId, block }: { userId: number; block: boolean }) =>
      blockUser(userId, block),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ANALYTICS_SUMMARY_KEY] });
    },
  });
}
