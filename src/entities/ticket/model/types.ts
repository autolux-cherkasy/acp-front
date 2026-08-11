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

export type AdminBookingsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminBookingsResponse = {
  data: AdminBookingDto[];
  pagination: AdminBookingsPagination;
};

/** Сортування, яке підтримує GET /admin/bookings. */
export type AdminTicketsSortBy = "date" | "time" | "status";
export type AdminTicketsSortOrder = "asc" | "desc";

export type AdminTicketsQuery = {
  /** YYYY-MM-DD включно, київська доба. Обидві межі опціональні. */
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: ApiBookingStatus[];
  sortBy?: AdminTicketsSortBy;
  sortOrder?: AdminTicketsSortOrder;
};

export type AdminTicketsPage = {
  tickets: Ticket[];
  pagination: AdminBookingsPagination;
};