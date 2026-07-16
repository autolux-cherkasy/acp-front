import { apiFetch } from "@/src/shared/api/http";
import type {
  Ticket,
  AdminBookingsResponse,
  AdminBookingDto,
  GetAdminTicketsParams,
  AdminTicketsResponse,
  CreateAdminBookingPayload,
  UpdateAdminBookingPayload,
  AdminRoutesResponse,
  AdminTripsResponse,
} from "./types";
import mapBookingToTicket from "@/src/entities/ticket/model/mapper";

export async function getAdminTickets(
    params: GetAdminTicketsParams,
): Promise<AdminTicketsResponse> {
  const queryParams = new URLSearchParams({
    date: params.date,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  })

  if (params.search?.trim()) {
    queryParams.set("search", params.search.trim())
  }

  if (params.status) {
    queryParams.set("status", params.status)
  }

  if (params.sortBy) {
    queryParams.set("sortBy", params.sortBy)
  }

  if (params.sortOrder) {
    queryParams.set("sortOrder", params.sortOrder)
  }

  const response = await apiFetch<AdminBookingsResponse>(
      `/admin/bookings?${queryParams.toString()}`,
  )

  return {
    ...response,
    data: response.data.map(mapBookingToTicket),
  }
}

export async function createAdminBooking(payload: CreateAdminBookingPayload): Promise<Ticket> {
  const response = await apiFetch<AdminBookingDto>("/admin/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  return mapBookingToTicket(response)
}

export async function updateAdminBooking(
    id: string,
    payload: UpdateAdminBookingPayload,
): Promise<Ticket> {
  const response = await apiFetch<AdminBookingDto>(`/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })

  return mapBookingToTicket(response)
}

export async function deleteAdminBooking(id: string): Promise<void> {
  await apiFetch<void>(`/admin/bookings/${id}`, {
    method: "DELETE",
  })
}

export async function getAdminRoutes(): Promise<AdminRoutesResponse> {
  return apiFetch<AdminRoutesResponse>("/admin/routes");
}

export async function getAdminTrips(params: {
  page?: number;
  limit?: number;
  sortBy?: "departureTime" | "status" | "direction";
  sortOrder?: "asc" | "desc";
  status?: "SCHEDULED" | "BOARDING" | "DEPARTED" | "CANCELLED";
}): Promise<AdminTripsResponse> {
  const queryParams = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });

  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);
  if (params.status) queryParams.set("status", params.status);

  return apiFetch<AdminTripsResponse>(
      `/admin/trips?${queryParams.toString()}`,
  );
}