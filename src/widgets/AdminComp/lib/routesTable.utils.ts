import type { TripStatus } from "@/src/entities/trip";
import type { RouteRow } from "../model/types";
import styles from "../ui/admin-routes-table.module.css";

export const MOCK_ROWS: RouteRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  direction: "м.Черкаси - м.Київ (ст.м.Харківська)",
  date: "03.07.2026",
  departureTime: "05:30",
  arrivalTime: "08:30",
  busNumber: "СА 5374 СО",
  availableSeats: 12,
  totalSeats: 18,
  status: (["DEPARTED", "BOARDING", "SCHEDULED", "CANCELLED"] as TripStatus[])[
    i % 4
  ],
}));

export function getStatusClass(status: TripStatus | null): string {
  switch (status) {
    case "DEPARTED":
      return styles.statusDeparted;
    case "BOARDING":
      return styles.statusBoarding;
    case "SCHEDULED":
      return styles.statusScheduled;
    case "CANCELLED":
      return styles.statusCancelled;
    default:
      return "";
  }
}

export function countPages(rowsLength: number): number {
  return Math.ceil(rowsLength / 10);
}
