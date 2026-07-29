import type { Booking, BookingStatus } from "@/src/entities/booking";
import type { Locale } from "@/src/shared/i18n/config";
import { formatCurrency, formatPhone } from "@/src/shared/lib/formatters";

export type ArchiveTicketStatus = "booked" | "paid" | "cancelled" | "expired";

export type ArchivedTicketStop = {
  name: string;
  time: string;
};

export type ArchivedTicket = {
  id: string;
  code: string;
  date: string;
  metaDate: string;
  passengerName: string;
  passengerPhone: string;
  seatCount: number;
  price: string;
  status: ArchiveTicketStatus;
  routeFrom: ArchivedTicketStop;
  routeTo: ArchivedTicketStop;
};


const STATUS_MAP: Record<BookingStatus, ArchiveTicketStatus> = {
  ACTIVE: "booked",
  CONFIRMED: "paid",
  BUYOUT: "paid",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
};

function formatTime(value: string, locale: Locale): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--:--";
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}

function formatLongDate(value: string, locale: Locale): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function formatMetaDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${parsed.getFullYear()}`;
}

export function toArchivedTicket(booking: Booking, locale: Locale): ArchivedTicket {
  const { departureTime, arrivalTime, boardingStop, alightingStop } = booking.tripDetails;

  return {
    id: booking.id,
    code: booking.referenceCode,
    date: formatLongDate(departureTime, locale),
    metaDate: formatMetaDate(departureTime),
    passengerName: booking.passengerName,
    passengerPhone: formatPhone(booking.passengerPhone),
    seatCount: booking.seatsCount,
    price: formatCurrency(booking.totalPrice),
    status: STATUS_MAP[booking.status],
    routeFrom: {
      name: boardingStop.name,
      time: formatTime(departureTime, locale),
    },
    routeTo: {
      name: alightingStop.name,
      time: formatTime(arrivalTime, locale),
    },
  };
}
