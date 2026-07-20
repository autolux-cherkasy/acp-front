export type TicketStatus = "booked" | "paid" | "cancelled" | "expired";

export type Ticket = {
  id: string;
  bookingNumber: string;
  passengerName: string;
  passengerPhone: string;
  routeFrom: string;
  routeTo: string;
  /** Boarding stop shown in parentheses under the route */
  routeStop: string | null;
  departureTime: string; // "HH:MM"
  departureDate: string; // "DD.MM.YYYY"
  ticketCount: number;
  totalPrice: number;
  status: TicketStatus;
  /** Remaining seconds for the reservation hold timer. null = no timer */
  timerSeconds: number | null;
};
