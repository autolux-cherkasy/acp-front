"use client";

import { mockTickets } from "@/src/entities/ticket";
import { NewOrderModal } from "@/src/features/add-order";
import { OrderDetailsModal } from "@/src/features/ticket-details";
import { useTicketSearch } from "@/src/features/search-tickets";
import { useTicketSort } from "@/src/features/sort-tickets";
import { TicketsTable } from "@/src/widgets/tickets-table";
import { TicketsToolbar } from "@/src/widgets/tickets-toolbar";
import { useMemo, useState } from "react";
import styles from "./tickets.module.css";

export default function TicketsPage() {
  const { query, setQuery, filterTickets } = useTicketSearch();
  const { sortOption, setSortOption, sortTickets } = useTicketSort();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketToEdit, setTicketToEdit] = useState<(typeof mockTickets)[0] | null>(null);

  const displayedTickets = useMemo(
    () => sortTickets(filterTickets(mockTickets)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, sortOption],
  );

  const selectedTicket = selectedTicketId
    ? (mockTickets.find((t) => t.id === selectedTicketId) ?? null)
    : null;

  return (
    <div className={styles.page}>
      <TicketsToolbar
        searchQuery={query}
        onSearchChange={setQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onAddOrder={() => setIsOrderModalOpen(true)}
      />
      <TicketsTable
        tickets={displayedTickets}
        onDetails={setSelectedTicketId}
      />
      {isOrderModalOpen && (
        <NewOrderModal
          nextBookingNumber={mockTickets.length + 1}
          onClose={() => { setIsOrderModalOpen(false); setTicketToEdit(null); }}
          routeInfo={
            ticketToEdit
              ? {
                  bookingNumber: ticketToEdit.bookingNumber,
                  passengerName: ticketToEdit.passengerName,
                  passengerPhone: ticketToEdit.passengerPhone,
                  route: `${ticketToEdit.routeFrom} - ${ticketToEdit.routeTo}`,
                  date: ticketToEdit.departureDate,
                  departureTime: ticketToEdit.departureTime,
                  ticketCount: String(ticketToEdit.ticketCount),
                  totalPrice: String(ticketToEdit.totalPrice),
                  status: ticketToEdit.status,
                }
              : undefined
          }
        />
      )}
      {selectedTicket && (
        <OrderDetailsModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicketId(null)}
          onEdit={() => { setTicketToEdit(selectedTicket); setIsOrderModalOpen(true); setSelectedTicketId(null); }}
        />
      )}
    </div>
  );
}
