import type { TicketStatus } from "@/src/entities/ticket";

export type ArchivedTicketStop = {
  city: string;
  station: string;
  time: string;
};

export type ArchivedTicket = {
  code: string;
  date: string;
  metaDate: string;
  passengerName: string;
  passengerPhone: string;
  seatCount: number;
  price: string;
  status: TicketStatus;
  routeFrom: ArchivedTicketStop;
  routeTo: ArchivedTicketStop;
};

export const ARCHIVED_TICKETS: ArchivedTicket[] = [
  {
    code: "№000001",
    date: "3 березня 2026",
    metaDate: "03.03.2026",
    passengerName: "Гордієнко Інна",
    passengerPhone: "+38067 295 32 12",
    seatCount: 1,
    price: "500 ₴",
    status: "cancelled",
    routeFrom: {
      city: "м.Черкаси",
      station: "(пл.Дружби Народів)",
      time: "10:30",
    },
    routeTo: {
      city: "м.Київ",
      station: "(ст.м.Харківська)",
      time: "13:30",
    },
  },
  {
    code: "№000002",
    date: "12 лютого 2026",
    metaDate: "12.02.2026",
    passengerName: "Гордієнко Інна",
    passengerPhone: "+38067 295 32 12",
    seatCount: 1,
    price: "500 ₴",
    status: "reserved",
    routeFrom: {
      city: "м.Черкаси",
      station: "(пл.Дружби Народів)",
      time: "10:30",
    },
    routeTo: {
      city: "м.Київ",
      station: "(ст.м.Харківська)",
      time: "13:30",
    },
  },
  {
    code: "№000003",
    date: "25 січня 2026",
    metaDate: "25.01.2026",
    passengerName: "Гордієнко Інна",
    passengerPhone: "+38067 295 32 12",
    seatCount: 1,
    price: "500 ₴",
    status: "completed",
    routeFrom: {
      city: "м.Черкаси",
      station: "(пл.Дружби Народів)",
      time: "10:30",
    },
    routeTo: {
      city: "м.Київ",
      station: "(ст.м.Харківська)",
      time: "13:30",
    },
  },
];
