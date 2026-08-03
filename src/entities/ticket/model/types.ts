export type BookingStatus =
    | "reserved"
    | "pending"
    | "completed"
    | "cancelled"
    | "expired";

export type TicketStatus = BookingStatus;

/** Статуси такі, як їх віддає бекенд (prisma enum BookingStatus). */
export type ApiBookingStatus =
    | "ACTIVE"
    | "CONFIRMED"
    | "BUYOUT"
    | "CANCELLED"
    | "EXPIRED";

export type Ticket = {
  id: string;
  bookingNumber: string;
  passengerName: string;
  passengerPhone: string;
  routeFrom: string;
  routeTo: string;
  routeStop: string | null;
  departureTime: string;
  departureDate: string;
  ticketCount: number;
  totalPrice: number;
  status: BookingStatus;
  timerSeconds: number | null;
};

export type AdminBookingDto = {
  id: string;
  bookingNumber: string;
  passengerName: string;
  phone: string;
  route: string;
  boardingStopName: string;
  alightingStopName: string;
  departureTime: string;
  arrivalTime: string;
  ticketsCount: number;
  totalPrice: number;
  status: ApiBookingStatus;
  createdAt: string;
  expiresAt: string | null;
};

export type AdminBookingsResponse = {
  data: AdminBookingDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};