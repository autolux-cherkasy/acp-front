"use client";

import { ADMIN_TICKETS_PAGE_SIZE, getAdminTickets } from "@/src/entities/ticket";
import type { Ticket } from "@/src/entities/ticket";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useTicketSearch } from "@/src/features/search-tickets";
import { useTicketSort } from "@/src/features/sort-tickets";
import type { SortOption } from "@/src/features/sort-tickets";
import { TicketsTable } from "@/src/widgets/tickets-table";
import { TicketsToolbar } from "@/src/widgets/tickets-toolbar";
import type { DateRange } from "@/src/widgets/MiniCalendar/MiniCalendar";
import { TablePagination } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { useState } from "react";
import styles from "./tickets.module.css";
import NewOrderModal from "@/src/features/admin-modals/NewOrderModal/NewOrderModal";
import OrderDetailsModal from "@/src/features/admin-modals/OrderDetailsModal/OrderDetailsModal";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import { formatDateForApi } from "@/src/shared/lib/formatters";

function addMonth(date: Date): Date {
    const shifted = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

    // 31 січня + місяць у JS дає 3 березня, тож підтягуємо до кінця місяця.
    if (shifted.getDate() !== date.getDate()) {
        shifted.setDate(0);
    }

    return shifted;
}

export default function TicketsPage() {
    const { t } = useI18n();
    const { query, setQuery, debouncedQuery } = useTicketSearch();
    const { sortOption, setSortOption, sortQuery } = useTicketSort();
    const newOrder = useDisclosure();
    const orderDetails = useDisclosure<string>();
    const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);
    const [range, setRange] = useState<DateRange>(() => {
        const today = new Date();

        return { from: today, to: addMonth(today) };
    });
    const [page, setPage] = useState(1);

    const from = formatDateForApi(range.from);
    const to = formatDateForApi(range.to);

    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["admin-bookings", { from, to, page, search: debouncedQuery, sort: sortOption }],
        queryFn: () =>
            getAdminTickets({
                dateFrom: from,
                dateTo: to,
                page,
                limit: ADMIN_TICKETS_PAGE_SIZE,
                search: debouncedQuery,
                ...sortQuery,
            }),
        placeholderData: keepPreviousData,
    });

    const tickets = data?.tickets ?? [];
    const totalPages = data?.pagination.totalPages ?? 1;
    const total = data?.pagination.total ?? 0;

    const selectedTicket = tickets.find((ticket) => ticket.id === orderDetails.data) ?? null;

    // Кожен фільтр звужує вибірку на боці бекенда, тож повертаємось на перший
    // екран результатів разом зі зміною фільтра.
    function handleRangeChange(nextRange: DateRange) {
        setRange(nextRange);
        setPage(1);
    }

    function handleSearchChange(nextQuery: string) {
        setQuery(nextQuery);
        setPage(1);
    }

    function handleSortChange(nextOption: SortOption) {
        setSortOption(nextOption);
        setPage(1);
    }

    return (
        <div className={styles.page}>
            <TicketsToolbar
                searchQuery={query}
                onSearchChange={handleSearchChange}
                sortOption={sortOption}
                onSortChange={handleSortChange}
                range={range}
                onRangeChange={handleRangeChange}
                onAddOrder={() => newOrder.open(true)}
            />

            {error ? (
                <div className={styles.message}>Не вдалося завантажити квитки</div>
            ) : (
                <>
                    <TicketsTable
                        tickets={tickets}
                        isLoading={isLoading}
                        onDetails={(id) => orderDetails.open(id)}
                    />

                    {totalPages > 1 && (
                        <TablePagination
                            className={styles.pagination}
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                            prevAriaLabel={t("dispatcherArea.routes.table.pagination.prev")}
                            nextAriaLabel={t("dispatcherArea.routes.table.pagination.next")}
                        />
                    )}
                </>
            )}

            {newOrder.isOpen && (
                <NewOrderModal
                    nextBookingNumber={total + 1}
                    onClose={() => {
                        newOrder.close();
                        setTicketToEdit(null);
                    }}
                    routeInfo={
                        ticketToEdit
                            ? {
                                id: ticketToEdit.id,
                                bookingNumber: ticketToEdit.bookingNumber,
                                passengerName: ticketToEdit.passengerName,
                                passengerPhone: ticketToEdit.passengerPhone,
                                tripId: ticketToEdit.tripId,
                                boardingStopId: ticketToEdit.boardingStopId,
                                alightingStopId: ticketToEdit.alightingStopId,
                                date: ticketToEdit.departureDate,
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
