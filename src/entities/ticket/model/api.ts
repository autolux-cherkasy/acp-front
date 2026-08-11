import { apiFetch } from "@/src/shared/api/http";
import type {
  Ticket,
  AdminBookingsResponse,
  AdminBookingDto,
  AdminTicketsPage,
  AdminTicketsQuery,
  ApiBookingStatus,
} from "./types";
import mapBookingToTicket from "@/src/entities/ticket/model/mapper";

export const ADMIN_TICKETS_PAGE_SIZE = 10;

function buildAdminTicketsParams(query: AdminTicketsQuery): URLSearchParams {
  const params = new URLSearchParams();

  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? ADMIN_TICKETS_PAGE_SIZE));

  if (query.dateFrom) params.set("dateFrom", query.dateFrom);
  if (query.dateTo) params.set("dateTo", query.dateTo);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const search = query.search?.trim();
  if (search) params.set("search", search);

  // Бекенд приймає status як повторюваний параметр, тому "оплачені"
  // (CONFIRMED + BUYOUT) лишаються одним запитом.
  query.status?.forEach((status) => params.append("status", status));

  return params;
}

export async function getAdminTickets(query: AdminTicketsQuery): Promise<AdminTicketsPage> {
  const params = buildAdminTicketsParams(query);

  const response = await apiFetch<AdminBookingsResponse>(
      `/admin/bookings?${params.toString()}`,
  );

  return {
    tickets: response.data.map(mapBookingToTicket),
    pagination: response.pagination,
  };
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