import { apiFetch } from "@/src/shared";
import { ADMIN_FLEET_URL } from "./dashboardApiKeys";

export type BusDriverInfo = {
  id: string;
  fullName: string;
};

export type BusResponse = {
  id: string;
  model: string;
  seatsCount: number;
  registrationNumber: string;
  driverId: string | null;
  isActive: boolean;
  driver: BusDriverInfo | null;
};

export type CreateBusBody = {
  model: string;
  seatsCount: number;
  registrationNumber: string;
  driverId?: string;
  isActive?: boolean;
};

export type UpdateBusBody = Partial<CreateBusBody>;

export const getBuses = () => apiFetch<BusResponse[]>(ADMIN_FLEET_URL);

export const addBus = (body: CreateBusBody) =>
  apiFetch<BusResponse>(ADMIN_FLEET_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateBus = (id: string, body: UpdateBusBody) =>
  apiFetch<BusResponse>(`${ADMIN_FLEET_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteBus = (id: string) =>
  apiFetch<void>(`${ADMIN_FLEET_URL}/${id}`, {
    method: "DELETE",
  });
