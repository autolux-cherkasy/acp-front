import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { showServerToast } from "@/src/shared/lib/toast";
import {
  blockUser,
  getAllRoutesAnalytics,
  getAnalyticsSummary,
  getRouteAnalytics,
  getUserWithUnpaidBookings,
  type GetSummaryAnalyticsResponse,
  type RouteSegment,
  type UserWithUnpaidBookingsResponse,
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
  const { t } = useI18n();
  return useMutation({
    mutationFn: ({ userId, block }: { userId: number; block: boolean }) => blockUser(userId, block),
    // isBlocked живе у двох кешах одразу — у зведенні (список неявок) і в
    // картці користувача, тож відкочувати треба обидва.
    onMutate: async ({ userId, block }) => {
      await queryClient.cancelQueries({ queryKey: [ANALYTICS_SUMMARY_KEY] });
      await queryClient.cancelQueries({ queryKey: [ANALYTICS_USER_KEY, userId] });

      const previousSummary = queryClient.getQueryData<GetSummaryAnalyticsResponse>([
        ANALYTICS_SUMMARY_KEY,
      ]);
      const previousUser = queryClient.getQueryData<UserWithUnpaidBookingsResponse>([
        ANALYTICS_USER_KEY,
        userId,
      ]);

      queryClient.setQueryData<GetSummaryAnalyticsResponse>([ANALYTICS_SUMMARY_KEY], (old) =>
        old
          ? {
              ...old,
              noShow: old.noShow.map((item) =>
                item.userId === userId ? { ...item, isBlocked: block } : item,
              ),
            }
          : old,
      );
      queryClient.setQueryData<UserWithUnpaidBookingsResponse>(
        [ANALYTICS_USER_KEY, userId],
        (old) => (old ? { ...old, isBlocked: block } : old),
      );

      return { previousSummary, previousUser };
    },
    onSuccess: (_result, { block }) => {
      queryClient.invalidateQueries({ queryKey: [ANALYTICS_SUMMARY_KEY] });
      showServerToast({
        type: "success",
        successMessage: block
          ? t("common.toast.blockUserSuccess")
          : t("common.toast.unblockUserSuccess"),
      });
    },
    onError: (error, { userId, block }, context) => {
      if (context?.previousSummary !== undefined) {
        queryClient.setQueryData([ANALYTICS_SUMMARY_KEY], context.previousSummary);
      }
      if (context?.previousUser !== undefined) {
        queryClient.setQueryData([ANALYTICS_USER_KEY, userId], context.previousUser);
      }
      showServerToast({
        type: "error",
        error,
        errorMessage: block
          ? t("common.toast.blockUserError")
          : t("common.toast.unblockUserError"),
      });
    },
  });
}
