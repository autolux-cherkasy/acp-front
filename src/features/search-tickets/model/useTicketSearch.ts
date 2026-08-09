import { useCallback, useState } from "react";
import type { Ticket } from "@/src/entities/ticket";

export function useTicketSearch() {
  const [query, setQuery] = useState("");

  const filterTickets = useCallback(
    (tickets: Ticket[]): Ticket[] => {
      const q = query.trim().toLowerCase();
      if (!q) return tickets;

      const phoneQuery = q.replace(/\D/g, "");

      return tickets.filter(
        (ticket) =>
          ticket.bookingNumber.toLowerCase().includes(q) ||
          ticket.passengerName.toLowerCase().includes(q) ||
          (phoneQuery.length > 0 &&
            ticket.passengerPhone.replace(/\D/g, "").includes(phoneQuery))
      );
    },
    [query]
  );

  return { query, setQuery, filterTickets };
}
