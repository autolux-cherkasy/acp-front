import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { createOptimisticMutationHandlers } from "@/src/shared/lib/optimisticMutation";
import { cancelBooking, getBookingHistory } from "./bookings";
import { MY_ACTIVE_BOOKINGS_KEY, MY_BOOKING_HISTORY_KEY } from "./bookingApiKeys";
import type { Booking } from "../model/types";

export function useBookingHistoryQuery() {
  return useQuery<Booking[]>({
    queryFn: getBookingHistory,
    queryKey: [MY_BOOKING_HISTORY_KEY],
  });
}

// Targets the active-bookings cache: cancelling a booking removes it from
// that list. Not wired into any page yet — for use on the future active
// bookings (/profile/tickets) page.
export function useCancelBookingMutation() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    ...createOptimisticMutationHandlers<string, Booking[]>({
      queryClient,
      queryKey: [MY_ACTIVE_BOOKINGS_KEY],
      updateCache: (old, id) => old?.filter((booking) => booking.id !== id),
      successMessage: t("profile.tickets.toast.cancelSuccess"),
      errorMessage: t("profile.tickets.toast.cancelError"),
    }),
  });
}
