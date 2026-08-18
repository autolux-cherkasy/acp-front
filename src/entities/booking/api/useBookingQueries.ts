import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { createOptimisticMutationHandlers } from "@/src/shared/lib/optimisticMutation";
import {
  cancelBooking,
  getBookingHistory,
  reserveAndPayBooking,
  reserveBooking,
} from "./bookings";
import { MY_ACTIVE_BOOKINGS_KEY, MY_BOOKING_HISTORY_KEY } from "./bookingApiKeys";
import type { Booking, CreateBookingPayload } from "../model/types";

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

// Same cancel action as above, but targets the booking-history cache that
// ProfileArchivePage actually reads from (useBookingHistoryQuery).
export function useCancelHistoryBookingMutation() {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    ...createOptimisticMutationHandlers<string, Booking[]>({
      queryClient,
      queryKey: [MY_BOOKING_HISTORY_KEY],
      updateCache: (old, id) => old?.filter((booking) => booking.id !== id),
      successMessage: t("profile.tickets.toast.cancelSuccess"),
      errorMessage: t("profile.tickets.toast.cancelError"),
    }),
  });
}

function useInvalidateBookingsOnSuccess() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: [MY_ACTIVE_BOOKINGS_KEY] });
    queryClient.invalidateQueries({ queryKey: [MY_BOOKING_HISTORY_KEY] });
  };
}

export function useReserveBookingMutation() {
  const onSuccess = useInvalidateBookingsOnSuccess();

  return useMutation({
    mutationFn: ({ payload, guestToken }: { payload: CreateBookingPayload; guestToken?: string }) =>
      reserveBooking(payload, guestToken),
    onSuccess,
  });
}

export function useReserveAndPayMutation() {
  const onSuccess = useInvalidateBookingsOnSuccess();

  return useMutation({
    mutationFn: ({ payload, guestToken }: { payload: CreateBookingPayload; guestToken?: string }) =>
      reserveAndPayBooking(payload, guestToken),
    onSuccess,
  });
}

// Plain cancel mutation (no cache coupling) for the ticket-booking page's
// own post-reserve confirmation card, which isn't backed by a cached list.
export function useCancelReservationMutation() {
  return useMutation({
    mutationFn: ({ id, guestToken }: { id: string; guestToken?: string }) =>
      cancelBooking(id, guestToken),
  });
}
