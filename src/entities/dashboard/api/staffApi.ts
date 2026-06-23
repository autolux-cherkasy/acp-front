import { apiFetch } from "@/src/shared";

const ADMIN_URL = "/admin";

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

export type CreateDispatcherBody = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type UpdateDispatcherBody = Partial<CreateDispatcherBody & { isBlocked: boolean }>;

export type CreateDriverBody = {
  fullName: string;
  phone: string;
  licenseNumber: string;
  licenseValidUntil: string;
  licenseCategories: string;
  isActive?: boolean;
};

export type UpdateDriverBody = Partial<CreateDriverBody>;

export const getAdminStaff = () =>
  apiFetch<AdminStaffResponse>(`${ADMIN_URL}/staff`);

export const addDispatcher = (body: CreateDispatcherBody) =>
  apiFetch<DispatcherResponse>(`${ADMIN_URL}/dispatchers`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateDispatcher = (id: number, body: UpdateDispatcherBody) =>
  apiFetch<DispatcherResponse>(`${ADMIN_URL}/dispatchers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteDispatcher = (id: number) =>
  apiFetch<void>(`${ADMIN_URL}/dispatchers/${id}`, {
    method: "DELETE",
  });

export const addDriver = (body: CreateDriverBody) =>
  apiFetch<DriverResponse>(`${ADMIN_URL}/staff/drivers`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateDriver = (id: string, body: UpdateDriverBody) =>
  apiFetch<DriverResponse>(`${ADMIN_URL}/staff/drivers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteDriver = (id: string) =>
  apiFetch<void>(`${ADMIN_URL}/staff/drivers/${id}`, {
    method: "DELETE",
  });
