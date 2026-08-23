import { apiFetch } from "@/src/shared";
import { STATS_EXPORT_URL } from "./dashboardApiKeys";
import type {
  StatisticsPeriod,
  TicketStatusBreakdown,
} from "./dashboardStatisticsApi";

export type StatsExportSegmentRow = {
  boardingStopName: string;
  alightingStopName: string;
  direction: string;
  tripsCount: number;
  ticketsSoldTotal: number;
  seatsReserved: number;
  seatsBoughtOut: number;
  seatsCanceled: number;
  revenueTotal: number;
  occupancyPercent: number;
  buyoutRatePercent: number;
};

export type StatsExportSummary = {
  startDate: string;
  endDate: string;
  ordersTotal: number;
  revenueTotal: number;
  occupancyPercent: number;
  seatsBoughtOut: number;
  seatsReserved: number;
  seatsCanceled: number;
  revenueBoughtOut: number;
  revenueReserved: number;
  revenueCanceled: number;
  buyoutRatePercent: number;
};

export type StatsSeriesPoint = {
  bucket: string;
  value: number;
};

export type StatsExportResponse = {
  status: string;
  period: StatisticsPeriod;
  sheetTitle: string;
  sheetTitles?: Record<string, string>;
  sheetUrl?: string;
  exportedRows: number;
  summary: StatsExportSummary;
  segments: StatsExportSegmentRow[];
  revenueSeries: StatsSeriesPoint[];
  loadSeries: StatsSeriesPoint[];
};

export type StatsExportParams = {
  startDate: string;
  endDate: string;
};

export function exportStats(params: StatsExportParams) {
  const search = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  return apiFetch<StatsExportResponse>(`${STATS_EXPORT_URL}?${search.toString()}`);
}

export type { TicketStatusBreakdown };
