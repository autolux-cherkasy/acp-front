import { apiFetch } from "@/src/shared";
import { CafeMenuResponse } from "../types";

export const getMenu = async (): Promise<CafeMenuResponse[]> => {
  return apiFetch<CafeMenuResponse[]>(`/cafe/menu`);
};
