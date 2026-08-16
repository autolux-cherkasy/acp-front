import { apiFetch } from "@/src/shared";
import { ADMIN_STATISTICS_URL } from "./dashboardApiKeys";

export type StatisticsGranularity = "day" | "month";

export type StatisticsPeriod = {
  startDate: string;
  endDate: string;
};

export type StatisticsPeriodParams = {
  startDate?: string;
  endDate?: string;
};

export type StatisticsSeriesParams = StatisticsPeriodParams & {
  granularity?: StatisticsGranularity;
};

export type StatisticsMetric = {
  total: number;
  previous: number;
  trendPercent: number | null;
};

export type StatisticsOccupancy = {
  percent: number;
  previousPercent: number;
  trendPercent: number | null;
};

export type StatisticsOverviewResponse = {
  period: StatisticsPeriod;
  occupancyPeriod: StatisticsPeriod;
  orders: StatisticsMetric;
  revenue: StatisticsMetric;
  occupancy: StatisticsOccupancy;
};

export type RevenuePoint = {
  bucket: string;
  revenue: number;
};

export type RevenueSeriesResponse = {
  period: StatisticsPeriod;
  granularity: StatisticsGranularity;
  points: RevenuePoint[];
};

export type TicketStatusBreakdown = {
  boughtOut: number;
  reserved: number;
  canceled: number;
  total: number;
};

export type TicketsStatisticsResponse = {
  period: StatisticsPeriod;
  seats: TicketStatusBreakdown;
  revenue: TicketStatusBreakdown;
};

export type LoadPoint = {
  bucket: string;
  occupancyPercent: number;
};

export type LoadSeriesResponse = {
  period: StatisticsPeriod;
  granularity: StatisticsGranularity;
  points: LoadPoint[];
};

function buildQuery(params: StatisticsSeriesParams = {}) {
  const search = new URLSearchParams();

  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  if (params.granularity) search.set("granularity", params.granularity);

  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getStatisticsOverview(params: StatisticsPeriodParams = {}) {
  return apiFetch<StatisticsOverviewResponse>(
    `${ADMIN_STATISTICS_URL}/overview${buildQuery(params)}`,
  );
}

export function getStatisticsRevenue(params: StatisticsSeriesParams = {}) {
  return apiFetch<RevenueSeriesResponse>(
    `${ADMIN_STATISTICS_URL}/revenue${buildQuery(params)}`,
  );
}

export function getStatisticsTickets(params: StatisticsPeriodParams = {}) {
  return apiFetch<TicketsStatisticsResponse>(
    `${ADMIN_STATISTICS_URL}/tickets${buildQuery(params)}`,
  );
}

export function getStatisticsLoad(params: StatisticsSeriesParams = {}) {
  return apiFetch<LoadSeriesResponse>(
    `${ADMIN_STATISTICS_URL}/load${buildQuery(params)}`,
  );
}
