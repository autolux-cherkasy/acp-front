export type BookingStatus =
    | "reserved"
    | "pending"
    | "completed"
    | "cancelled"
    | "expired"

export type TicketStatus = BookingStatus

export type Ticket = {
  id: string;
  bookingNumber: string;
  routeId: string;
  tripId: string;
  passengerName: string;
  passengerPhone: string;
  route: string;
  routeStop: string | null;
  routeFrom: string;
  routeTo: string;
  departureDate: string;
  departureTime: string;
  ticketCount: number;
  totalPrice: number;
  status: BookingStatus;
  timerSeconds: number | null;
};

export type AdminBookingDto = {
  id: string
  bookingNumber: string
  passengerName: string
  phone: string
  route: string
  departureTime: string
  arrivalTime: string
  ticketsCount: number
  totalPrice: number
  status: BookingStatus
  createdAt: string
  expiresAt: string | null
}

export type AdminBookingsResponse = {
  data: AdminBookingDto[];
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type GetAdminTicketsParams = {
  date: string
  search?: string
  status?: string
  sortBy?: "departureTime" | "createdAt" | "status"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export type AdminTicketsResponse = {
  data: Ticket[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type CreateAdminBookingPayload = {
  customerData: {
    name: string;
    phone: string;
    email?: string;
  };
  tripId: string;
  boardingStopId: string;
  alightingStopId: string;
  ticketsCount: number;
};

export type UpdateAdminBookingPayload = {
  status: "ACTIVE" | "CONFIRMED" | "CANCELLED" | "EXPIRED" | "BUYOUT"
  tickets: {
    ticketId: string
    ticketsCount: number
    unitPrice: number
  }[]
  customerData: {
    name: string
    email?: string
    phone: string
  }
  totalPrice: number
}

export type AdminRouteStopDto = {
  id: string;
  routeId: string;
  name: string;
  stopOrder: number;
  offsetMinutes: number;
  priceFromOrigin: number;
}

export type AdminRouteDto = {
  id: string;
  name: string;
  direction: string;
  origin: string;
  destination: string;
  isActive: boolean;
  stops: AdminRouteStopDto[];
}

export type AdminRoutesResponse = AdminRouteDto[];

export type AdminTripDto = {
  id: string;
  routeId: string;
  routeNumber: string;
  busId: string;
  platform: string;
  direction: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  occupiedSeats: number;
  status: "SCHEDULED" | "BOARDING" | "DEPARTED" | "CANCELLED";
  isFull: boolean;
}

export type AdminTripsResponse = {
  trips: AdminTripDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  emptyMessage?: string;
}