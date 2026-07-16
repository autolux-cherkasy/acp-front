"use client";

import { getAdminTickets } from "@/src/entities/ticket";
import type { Ticket } from "@/src/entities/ticket";
import { useQuery } from "@tanstack/react-query";
import { useTicketSearch } from "@/src/features/search-tickets";
import { useTicketSort } from "@/src/features/sort-tickets";
import { TicketsTable, TicketsTableSkeleton } from "@/src/widgets/tickets-table";
import { TicketsToolbar } from "@/src/widgets/tickets-toolbar";
import { useState } from "react";
import styles from "./tickets.module.css";
import NewOrderModal from "@/src/features/admin-modals/NewOrderModal/NewOrderModal";
import OrderDetailsModal from "@/src/features/admin-modals/OrderDetailsModal/OrderDetailsModal";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import { formatDateForApi } from "@/src/shared/lib/formatters";


function mapSortOptionToApi(sortOption: string | "") {
    switch (sortOption) {
        case "dateAsc":
            return { sortBy: "departureTime" as const, sortOrder: "asc" as const }

        case "dateDesc":
            return { sortBy: "departureTime" as const, sortOrder: "desc" as const }

        case "filterBooked":
            return { status: "ACTIVE" }

        case "filterPaid":
            return { status: "CONFIRMED" }

        case "filterCancelled":
            return { status: "CANCELLED" }

        default:
            return {}
    }
}

export function TicketsPage() {
    const {query, setQuery} = useTicketSearch()
    const {sortOption, setSortOption} = useTicketSort()
    const newOrder = useDisclosure()
    const orderDetails = useDisclosure<string>()
    const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null)
    const [chosenDate, setChosenDate] = useState(new Date())

    const sortParams = mapSortOptionToApi(sortOption)
    const selectedDate = formatDateForApi(chosenDate)

    const {
        data: bookingsResponse,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["admin-bookings", selectedDate, query, sortOption],
        queryFn: () =>
            getAdminTickets({
                date: selectedDate,
                search: query,
                ...sortParams,
            }),
    })

    const tickets = bookingsResponse?.data ?? []
    const selectedTicket = tickets.find((t) => t.id === orderDetails.data) ?? null
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
                <TicketsTableSkeleton/>
            ) : (
                <TicketsTable
                    tickets={tickets}
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
                                bookingId: ticketToEdit.id,
                                bookingNumber: ticketToEdit.bookingNumber,
                                passengerName: ticketToEdit.passengerName,
                                passengerPhone: ticketToEdit.passengerPhone,
                                route: ticketToEdit.route,
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
    )
}
