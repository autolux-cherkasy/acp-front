import type { AdminTripDto } from "@/src/entities/dashboard/api/dashboardTripsApi";
import type { TripStatus } from "@/src/entities/trip";
import { formatMetroStops } from "@/src/shared/lib/formatters";
import type { RouteRow, RoutesStatsProps } from "../model/types";
import styles from "../ui/admin-routes-table.module.css";

// Рейси живуть за київським часом, і саме за київською добою бекенд фільтрує
// список. Прив'язка до таймзони браузера розсинхронізувала б дату в таблиці
// з датою, за якою зроблено запит.
const KYIV_TIME_ZONE = "Europe/Kyiv";

function formatKyivTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("uk-UA", {
    timeZone: KYIV_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatKyivDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uk-UA", {
    timeZone: KYIV_TIME_ZONE,
  });
}

export function mapTripToRow(trip: AdminTripDto): RouteRow {
  return {
    id: trip.id,
    direction: formatMetroStops(trip.direction),
    date: formatKyivDate(trip.departureTime),
    departureTime: formatKyivTime(trip.departureTime),
    arrivalTime: formatKyivTime(trip.arrivalTime),
    busNumber: trip.busNumber,
    occupiedSeats: trip.occupiedSeats,
    totalSeats: trip.totalSeats,
    status: trip.status,
  };
}

export function countRoutesStats(rows: RouteRow[]): RoutesStatsProps {
  return {
    total: rows.length,
    boarding: rows.filter((row) => row.status === "BOARDING").length,
    departed: rows.filter((row) => row.status === "DEPARTED").length,
    cancelled: rows.filter((row) => row.status === "CANCELLED").length,
  };
}

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
