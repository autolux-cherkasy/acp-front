export type BookingStatus = "ACTIVE" | "CONFIRMED" | "BUYOUT" | "CANCELLED" | "EXPIRED";

export type BookingStopDetails = {
  id: string;
  name: string;
  stopOrder: number;
  offsetMinutes: number;
  priceFromOrigin: number;
};

export type BookingTripDetails = {
  routeId: string;
  routeNumber: string;
  departureTime: string;
  arrivalTime: string;
  platform: string;
  boardingStop: BookingStopDetails;
  alightingStop: BookingStopDetails;
};

export type Booking = {
  id: string;
  referenceCode: string;
  passengerName: string;
  passengerPhone: string;
  seatsCount: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  tripDetails: BookingTripDetails;
  expiresAt?: string;
  qrCodePayload?: string;
  canLeaveReview?: boolean;
};

export type CancelBookingResponse = {
  message: string;
  referenceCode: string;
  status: BookingStatus;
};
