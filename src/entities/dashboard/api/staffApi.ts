import { apiFetch } from "@/src/shared";
import { ADMIN_DRIVERS_URL, ADMIN_STAFF_URL } from "./dashboardApiKeys";

export type DispatcherResponse = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
};

export type DriverResponse = {
  id: string;
  fullName: string;
  phone: string;
  licenseValidUntil: string;
  licenseCategories: string;
};

export type AdminStaffResponse = {
  dispatchers: DispatcherResponse[];
  drivers: DriverResponse[];
};

export type DriverLicenseValidResponse = {
  id: string;
  fullName: string;
};
export type CreateDispatcherBody = {
  name: string;
  phone: string;
  email: string;
  password?: string;
};

export type UpdateDispatcherBody = Partial<CreateDispatcherBody & { isBlocked: boolean }>;

export type CreateDriverBody = {
  fullName: string;
  phone: string;
  licenseValidUntil: string;
  licenseCategories: string;
  isActive?: boolean;
};

export type UpdateDriverBody = Partial<CreateDriverBody>;

export const getAdminStaff = () => apiFetch<AdminStaffResponse>(`${ADMIN_STAFF_URL}`);
export const getAdminDrivers = () =>
  apiFetch<DriverLicenseValidResponse[]>(`${ADMIN_DRIVERS_URL}`);

export const addDispatcher = (body: CreateDispatcherBody) =>
  apiFetch<DispatcherResponse>(`${ADMIN_STAFF_URL}/dispatchers`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateDispatcher = (id: number, body: UpdateDispatcherBody) =>
  apiFetch<DispatcherResponse>(`${ADMIN_STAFF_URL}/dispatchers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteDispatcher = (id: number) =>
  apiFetch<void>(`${ADMIN_STAFF_URL}/dispatchers/${id}`, {
    method: "DELETE",
  });

export const addDriver = (body: CreateDriverBody) =>
  apiFetch<DriverResponse>(`${ADMIN_STAFF_URL}/drivers`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateDriver = (id: string, body: UpdateDriverBody) =>
  apiFetch<DriverResponse>(`${ADMIN_STAFF_URL}/drivers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteDriver = (id: string) =>
  apiFetch<void>(`${ADMIN_STAFF_URL}/drivers/${id}`, {
    method: "DELETE",
  });
