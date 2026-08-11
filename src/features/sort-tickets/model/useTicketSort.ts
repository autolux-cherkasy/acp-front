import { useMemo, useState } from "react";
import type { AdminTicketsQuery } from "@/src/entities/ticket";
import type { SortOption } from "./types";

export type TicketSortQuery = Pick<AdminTicketsQuery, "sortBy" | "sortOrder" | "status">;

const SORT_QUERIES: Record<SortOption, TicketSortQuery> = {
  "date-asc": { sortBy: "date", sortOrder: "asc" },
  "date-desc": { sortBy: "date", sortOrder: "desc" },
  "filter-booked": { status: ["ACTIVE"] },
  "filter-paid": { status: ["CONFIRMED", "BUYOUT"] },
  "filter-cancelled": { status: ["CANCELLED"] },
};

export function useTicketSort() {
  const [sortOption, setSortOption] = useState<SortOption | "">("");

  const sortQuery = useMemo<TicketSortQuery>(
    () => (sortOption ? SORT_QUERIES[sortOption] : {}),
    [sortOption],
  );

  return { sortOption, setSortOption, sortQuery };
}
