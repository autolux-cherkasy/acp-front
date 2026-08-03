import type {AdminBookingDto, ApiBookingStatus, Ticket} from "@/src/entities/ticket";

const STATUS_MAP: Record<ApiBookingStatus, Ticket["status"]> = {
    ACTIVE: "reserved",
    CONFIRMED: "completed",
    BUYOUT: "completed",
    CANCELLED: "cancelled",
    EXPIRED: "expired",
};

function mapBookingToTicket(booking: AdminBookingDto): Ticket {
    const departureDate = new Date(booking.departureTime);
    const arrivalDate = new Date(booking.arrivalTime);

    const routeFrom = booking.boardingStopName;
    const routeTo = booking.alightingStopName;
    // Напрямок рейсу показуємо додатково лише тоді, коли пасажир їде не весь
    const segment = `${routeFrom} - ${routeTo}`;

    return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        passengerName: booking.passengerName,
        passengerPhone: booking.phone,
        routeFrom,
        routeTo,
        routeStop: segment === booking.route ? null : booking.route,
        departureDate: departureDate.toLocaleDateString("uk-UA"),
        departureTime: `${departureDate.toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
        })}-${arrivalDate.toLocaleTimeString("uk-UA", {
            hour: "2-digit",
            minute: "2-digit",
        })}`,
        ticketCount: booking.ticketsCount,
        totalPrice: booking.totalPrice,
        status: STATUS_MAP[booking.status] ?? "pending",
        timerSeconds: booking.expiresAt
            ? Math.max(0, Math.floor((new Date(booking.expiresAt).getTime() - Date.now()) / 1000))
            : null,
    };
}

export default mapBookingToTicket;