import { apiFetch } from "@/src/shared";
import { ADMIN_ROUTES_URL } from "./dashboardApiKeys";

export type RouteResponse = {
  id: string;
  name: string;
  origin: string;
  destination: string;
};

export type CreateRouteBody = {
  name: string;
  origin: string;
  destination: string;
};

export type UpdateRouteBody = Partial<CreateRouteBody>;

export const addRoute = (body: CreateRouteBody) =>
  apiFetch<RouteResponse>(ADMIN_ROUTES_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateRoute = (id: string, body: UpdateRouteBody) =>
  apiFetch<RouteResponse>(`${ADMIN_ROUTES_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const deleteRoute = (id: string) =>
  apiFetch<void>(`${ADMIN_ROUTES_URL}/${id}`, {
    method: "DELETE",
  });
