import { apiFetch } from "@/src/shared/api/http";
import type {
  Booking,
  CancelBookingResponse,
  CreateBookingPayload,
  ReserveAndPayResponse,
  ReserveBookingResponse,
} from "../model/types";
import {
  BOOKINGS_URL,
  MY_HISTORY_URL,
  RESERVE_AND_PAY_URL,
  RESERVE_URL,
} from "./bookingApiKeys";

export function getBookingHistory(): Promise<Booking[]> {
  return apiFetch<Booking[]>(MY_HISTORY_URL);
}

export function cancelBooking(id: string, guestToken?: string): Promise<CancelBookingResponse> {
  return apiFetch<CancelBookingResponse>(`${BOOKINGS_URL}/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
    headers: guestToken ? { Authorization: `Bearer ${guestToken}` } : undefined,
    skipAuthRefresh: Boolean(guestToken),
  });
}

export function reserveBooking(
  payload: CreateBookingPayload,
  guestToken?: string,
): Promise<ReserveBookingResponse> {
  return apiFetch<ReserveBookingResponse>(RESERVE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: guestToken ? { Authorization: `Bearer ${guestToken}` } : undefined,
    skipAuthRefresh: Boolean(guestToken),
  });
}

export function reserveAndPayBooking(
  payload: CreateBookingPayload,
  guestToken?: string,
): Promise<ReserveAndPayResponse> {
  return apiFetch<ReserveAndPayResponse>(RESERVE_AND_PAY_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: guestToken ? { Authorization: `Bearer ${guestToken}` } : undefined,
    skipAuthRefresh: Boolean(guestToken),
  });
}
