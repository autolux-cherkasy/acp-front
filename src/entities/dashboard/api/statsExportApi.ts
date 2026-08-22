import { apiFetch } from "@/src/shared";
import { STATS_EXPORT_URL } from "./dashboardApiKeys";
import type { StatisticsPeriod } from "./dashboardStatisticsApi";

export type StatsExportRouteRow = {
  routeId: string;
  routeName: string;
  direction: string;
  tripsCount: number;
  ticketsSoldTotal: number;
  occupancyPercent: number;
  revenueTotal: number;
  buyoutRatePercent: number;
};

export type StatsExportResponse = {
  status: string;
  period: StatisticsPeriod;
  sheetTitle: string;
  exportedRows: number;
  stats: StatsExportRouteRow[];
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
