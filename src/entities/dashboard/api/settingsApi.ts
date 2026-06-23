import { apiFetch } from "@/src/shared";

const BASE = "/admin/settings";

export type CompanySettingsResponse = {
  name: string;
  phone1: string;
  phone2: string | null;
  phone3: string | null;
  email: string;
  managerName: string;
  managerPhone: string | null;
  managerEmail: string | null;
  updatedAt: string;
};

export type PermissionsResponse = {
  canAccessRoutes: boolean;
  canAccessFleet: boolean;
  canAccessStaff: boolean;
  canAccessCafe: boolean;
};

export type UpdateCompanyPayload = Partial<Omit<CompanySettingsResponse, "updatedAt">>;
export type UpdatePermissionsPayload = Partial<PermissionsResponse>;

export const getCompanySettings = () =>
  apiFetch<CompanySettingsResponse>(`${BASE}/company`);

export const updateCompanySettings = (data: UpdateCompanyPayload) =>
  apiFetch<CompanySettingsResponse>(`${BASE}/company`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getPermissions = () =>
  apiFetch<PermissionsResponse>(`${BASE}/permissions`);

export const updatePermissions = (data: UpdatePermissionsPayload) =>
  apiFetch<PermissionsResponse>(`${BASE}/permissions`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
