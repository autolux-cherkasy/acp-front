import { useCallback, useState } from "react";
import type { Ticket } from "@/src/entities/ticket";
import type { SortOption } from "./types";

function parseDatetime(date: string, time: string): number {
  const [day, month, year] = date.split(".").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}

export function useTicketSort() {
  const [sortOption, setSortOption] = useState<SortOption | "">("");

  const sortTickets = useCallback(
    (tickets: Ticket[]): Ticket[] => {
      if (!sortOption) return tickets;

      switch (sortOption) {
        case "date-asc":
          return [...tickets].sort(
            (a, b) =>
              parseDatetime(a.departureDate, a.departureTime) -
              parseDatetime(b.departureDate, b.departureTime),
          );
        case "date-desc":
          return [...tickets].sort(
            (a, b) =>
              parseDatetime(b.departureDate, b.departureTime) -
              parseDatetime(a.departureDate, a.departureTime),
          );
        case "filter-booked":
          return tickets.filter((t) => t.status === "reserved");
        case "filter-paid":
          return tickets.filter((t) => t.status === "completed");
        case "filter-cancelled":
          return tickets.filter((t) => t.status === "cancelled");
        default:
          return tickets;
      }
    },
    [sortOption]
  );

  return { sortOption, setSortOption, sortTickets };
}
