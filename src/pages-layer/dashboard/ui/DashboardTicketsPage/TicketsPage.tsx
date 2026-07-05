"use client";

import { getAdminTickets } from "@/src/entities/ticket";
import type { Ticket } from "@/src/entities/ticket";
import { useQuery } from "@tanstack/react-query";
import { useTicketSearch } from "@/src/features/search-tickets";
import { useTicketSort } from "@/src/features/sort-tickets";
import { TicketsTable, TicketsTableSkeleton } from "@/src/widgets/tickets-table";
import { TicketsToolbar } from "@/src/widgets/tickets-toolbar";
import { useMemo, useState } from "react";
import styles from "./tickets.module.css";
import NewOrderModal from "@/src/features/admin-modals/NewOrderModal/NewOrderModal";
import OrderDetailsModal from "@/src/features/admin-modals/OrderDetailsModal/OrderDetailsModal";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import { formatDateForApi } from "@/src/shared/lib/formatters";


export default function TicketsPage() {
    const { query, setQuery, filterTickets } = useTicketSearch();
    const { sortOption, setSortOption, sortTickets } = useTicketSort();
    const newOrder = useDisclosure();
    const orderDetails = useDisclosure<string>();
    const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);
    const [chosenDate, setChosenDate] = useState(new Date());

    const selectedDate = formatDateForApi(chosenDate);
    const {
        data: tickets = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["admin-bookings", selectedDate],
        queryFn: () => getAdminTickets(selectedDate),
    });

    const displayedTickets = useMemo(
        () => sortTickets(filterTickets(tickets)),
        [tickets, query, sortOption, filterTickets, sortTickets],
    );

    const selectedTicket = tickets.find((t) => t.id === orderDetails.data) ?? null;

    return (
        <div className={styles.page}>
            <TicketsToolbar
                searchQuery={query}
                onSearchChange={setQuery}
                sortOption={sortOption}
                onSortChange={setSortOption}
                chosenDate={chosenDate}
                setChosenDate={setChosenDate}
                onAddOrder={() => newOrder.open(true)}
            />

            {error ? (
                <div className={styles.message}>Не вдалося завантажити квитки</div>
            ) : isLoading ? (
                <TicketsTableSkeleton />
            ) : (
                <TicketsTable
                    tickets={displayedTickets}
                    onDetails={(id) => orderDetails.open(id)}
                />
            )}

            {newOrder.isOpen && (
                <NewOrderModal
                    nextBookingNumber={tickets.length + 1}
                    onClose={() => {
                        newOrder.close();
                        setTicketToEdit(null);
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
