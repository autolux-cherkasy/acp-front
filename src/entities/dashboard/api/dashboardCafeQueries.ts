import { apiFetch } from "@/src/shared";
import { CafeSectionWithCategoriesResponse } from "../types";
import { useQuery } from "@tanstack/react-query";

const ADMIN_URL = "/admin";
export const ADMIN_CAFE_KEY = "admin_cafe";

export const getAdminMenu = () => {
  return apiFetch<CafeSectionWithCategoriesResponse[]>(`${ADMIN_URL}/cafe/menu`);
};

export const useAdminCafeQuery = (options?: { enabled?: boolean }) => {
  return useQuery<CafeSectionWithCategoriesResponse[]>({
    queryFn: getAdminMenu,
    queryKey: [ADMIN_CAFE_KEY],
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};
