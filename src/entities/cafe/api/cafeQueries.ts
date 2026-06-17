import { apiFetch } from "@/src/shared";
import { CafeSectionResponse } from "../types";

export const getMenu = async (): Promise<CafeSectionResponse[]> => {
  return apiFetch<CafeSectionResponse[]>(`/cafe/menu`);
};
