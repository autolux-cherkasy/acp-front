"use client";

import { mockTickets } from "@/src/entities/ticket";
import { useTicketSearch } from "@/src/features/search-tickets";
import { useTicketSort } from "@/src/features/sort-tickets";
import { TicketsTable } from "@/src/widgets/tickets-table";
import { TicketsToolbar } from "@/src/widgets/tickets-toolbar";
import { useMemo, useState } from "react";
import styles from "./tickets.module.css";
import NewOrderModal from "@/src/features/admin-modals/NewOrderModal/NewOrderModal";
import OrderDetailsModal from "@/src/features/admin-modals/OrderDetailsModal/OrderDetailsModal";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";

export default function TicketsPage() {
  const { query, setQuery, filterTickets } = useTicketSearch();
  const { sortOption, setSortOption, sortTickets } = useTicketSort();
  const newOrder = useDisclosure();
  const orderDetails = useDisclosure<string>();
  const [ticketToEdit, setTicketToEdit] = useState<(typeof mockTickets)[0] | null>(null);

  const displayedTickets = useMemo(
    () => sortTickets(filterTickets(mockTickets)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, sortOption],
  );

  const selectedTicket = mockTickets.find((t) => t.id === orderDetails.data) ?? null;

  return (
    <div className={styles.page}>
      <TicketsToolbar
        searchQuery={query}
        onSearchChange={setQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onAddOrder={() => newOrder.open(true)}
      />
      <TicketsTable tickets={displayedTickets} onDetails={(id) => orderDetails.open(id)} />
      {newOrder.isOpen && (
        <NewOrderModal
          nextBookingNumber={mockTickets.length + 1}
          onClose={() => {
            newOrder.close();
          }}
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
          onClose={() => orderDetails.close()}
          onEdit={() => {
            setTicketToEdit(selectedTicket);
            orderDetails.close();
            newOrder.open(true);
          }}
        />
      )}
    </div>
  );
}
