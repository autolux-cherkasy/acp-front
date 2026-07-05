import type {AdminBookingDto, Ticket} from "@/src/entities/ticket";

function mapBookingToTicket(booking: AdminBookingDto): Ticket {
    const [routeFrom = "", routeTo = ""] = booking.route.split(" - ");
    const departureDate = new Date(booking.departureTime);
    const arrivalDate = new Date(booking.arrivalTime);
    function mapStatus(status: string): Ticket["status"] {
        switch (status.toLowerCase()) {
            case "active":
            case "reserved":
                return "reserved";
            case "pending":
                return "pending";
            case "completed":
                return "completed";
            case "cancelled":
                return "cancelled";
            case "expired":
                return "expired";
            default:
                return "pending";
        }
    }

    return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        passengerName: booking.passengerName,
        passengerPhone: booking.phone,
        routeFrom,
        routeTo,
        routeStop: null,
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
        status: mapStatus(booking.status),
        timerSeconds: booking.expiresAt
            ? Math.max(0, Math.floor((new Date(booking.expiresAt).getTime() - Date.now()) / 1000))
            : null,
    };
}

export default mapBookingToTicket;