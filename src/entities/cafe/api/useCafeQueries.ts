import { useQuery } from "@tanstack/react-query";
import { getMenu } from "./cafeQueries";
import { CafeMenuResponse } from "../types";

export const CAFE_KEY = "cafe";

export const useCafeQuery = () => {
  return useQuery<CafeMenuResponse[]>({
    queryFn: getMenu,
    queryKey: [CAFE_KEY],
    staleTime: 1000 * 60 * 5,
  });
};
