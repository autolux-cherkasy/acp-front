import { apiFetch } from "@/src/shared/api/http";
import type { Booking, CancelBookingResponse } from "../model/types";
import { BOOKINGS_URL, MY_HISTORY_URL } from "./bookingApiKeys";

export function getBookingHistory(): Promise<Booking[]> {
  return apiFetch<Booking[]>(MY_HISTORY_URL);
}

export function cancelBooking(id: string): Promise<CancelBookingResponse> {
  return apiFetch<CancelBookingResponse>(`${BOOKINGS_URL}/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
  });
}
