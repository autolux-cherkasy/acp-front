import { apiFetch } from "@/src/shared";
import { ADMIN_SETTINGS_URL } from "./dashboardApiKeys";

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
export type CompanyPhonesResponse = {
  phone1: string | null;
  phone2: string | null;
  phone3: string | null;
};
export type PermissionsResponse = {
  canAccessRoutes: boolean;
  canAccessFleet: boolean;
  canAccessStaff: boolean;
  canAccessCafe: boolean;
};

export type UpdateCompanyPayload = Partial<Omit<CompanySettingsResponse, "updatedAt">>;
export type UpdatePermissionsPayload = Partial<PermissionsResponse>;

export const getCompanySettings = () => apiFetch<CompanySettingsResponse>(`${ADMIN_SETTINGS_URL}/company`);

export const getPhones = () => apiFetch<CompanyPhonesResponse>(`/company/phones`);

export const updateCompanySettings = (data: UpdateCompanyPayload) =>
  apiFetch<CompanySettingsResponse>(`${ADMIN_SETTINGS_URL}/company`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getPermissions = () => apiFetch<PermissionsResponse>(`${ADMIN_SETTINGS_URL}/permissions`);

export const updatePermissions = (data: UpdatePermissionsPayload) =>
  apiFetch<PermissionsResponse>(`${ADMIN_SETTINGS_URL}/permissions`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
