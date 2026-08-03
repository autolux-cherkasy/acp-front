import { apiFetch } from "@/src/shared/api/http";
import type { Ticket, AdminBookingsResponse, AdminBookingDto, ApiBookingStatus } from "./types";
import mapBookingToTicket from "@/src/entities/ticket/model/mapper";

export async function getAdminTickets(date: string): Promise<Ticket[]> {
  const params = new URLSearchParams({
    date,
    page: "1",
    limit: "10",
  });

  const response = await apiFetch<AdminBookingsResponse>(
      `/admin/bookings?${params.toString()}`,
  );

  return response.data.map(mapBookingToTicket);
}

export type CreateAdminBookingPayload = {
  customerData: {
    name: string;
    email?: string;
    phone: string;
  };
  tripId: string;
  boardingStopId: string;
  alightingStopId: string;
  ticketsCount: number;
};

export async function createAdminBooking(payload: CreateAdminBookingPayload): Promise<Ticket> {
  const response = await apiFetch<AdminBookingDto>("/admin/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapBookingToTicket(response);
}

export type UpdateAdminBookingPayload = {
  status?: ApiBookingStatus;
};

export async function updateAdminBooking(
    id: string,
    payload: UpdateAdminBookingPayload,
): Promise<Ticket> {
  const response = await apiFetch<AdminBookingDto>(`/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return mapBookingToTicket(response);
}

export async function deleteAdminBooking(id: string): Promise<void> {
  await apiFetch<void>(`/admin/bookings/${id}`, {
    method: "DELETE",
  });
}