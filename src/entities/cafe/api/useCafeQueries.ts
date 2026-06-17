import { useQuery } from "@tanstack/react-query";
import { getMenu } from "./cafeQueries";
import { CafeSectionResponse } from "../types";

export const CAFE_KEY = "cafe";

export const useCafeQuery = () => {
  return useQuery<CafeSectionResponse[]>({
    queryFn: getMenu,
    queryKey: [CAFE_KEY],
    staleTime: 1000 * 60 * 5,
  });
};
