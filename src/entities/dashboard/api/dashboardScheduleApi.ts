import { apiFetch } from "@/src/shared";
import { ADMIN_SCHEDULE_URL } from "./dashboardApiKeys";

export type ScheduleEntry = {
  id: string;
  direction: string;
  platform: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  isActive: boolean;
};

export type RouteWithSchedule = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  schedules: ScheduleEntry[];
};

export type CreateScheduleEntryBody = {
  routeId: string;
  departurePlace: string;
  arrivalPlace: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
};

export type UpdateScheduleEntryBody = Partial<Omit<CreateScheduleEntryBody, "routeId">>;

export const getAdminSchedule = () =>
  apiFetch<RouteWithSchedule[]>(ADMIN_SCHEDULE_URL);

export const addScheduleEntry = (body: CreateScheduleEntryBody) =>
  apiFetch<ScheduleEntry>(ADMIN_SCHEDULE_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateScheduleEntry = (id: string, body: UpdateScheduleEntryBody) =>
  apiFetch<ScheduleEntry>(`${ADMIN_SCHEDULE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteScheduleEntry = (id: string) =>
  apiFetch<{ message: string }>(`${ADMIN_SCHEDULE_URL}/${id}`, {
    method: "DELETE",
  });
