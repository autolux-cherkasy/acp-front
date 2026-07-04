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

export const getAdminSchedule = () =>
  apiFetch<RouteWithSchedule[]>(ADMIN_SCHEDULE_URL);
