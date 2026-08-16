import { useQuery } from "@tanstack/react-query";
import {
  getStatisticsLoad,
  getStatisticsOverview,
  getStatisticsRevenue,
  getStatisticsTickets,
  type StatisticsPeriodParams,
  type StatisticsSeriesParams,
} from "./dashboardStatisticsApi";
import {
  STATISTICS_LOAD_KEY,
  STATISTICS_OVERVIEW_KEY,
  STATISTICS_REVENUE_KEY,
  STATISTICS_TICKETS_KEY,
} from "./dashboardApiKeys";

export {
  STATISTICS_LOAD_KEY,
  STATISTICS_OVERVIEW_KEY,
  STATISTICS_REVENUE_KEY,
  STATISTICS_TICKETS_KEY,
};

const periodKey = (params: StatisticsPeriodParams) =>
  [params.startDate ?? null, params.endDate ?? null] as const;

const seriesKey = (params: StatisticsSeriesParams) =>
  [...periodKey(params), params.granularity ?? null] as const;

export function useStatisticsOverviewQuery(params: StatisticsPeriodParams = {}) {
  return useQuery({
    queryFn: () => getStatisticsOverview(params),
    queryKey: [STATISTICS_OVERVIEW_KEY, ...periodKey(params)],
  });
}

export function useStatisticsRevenueQuery(params: StatisticsSeriesParams = {}) {
  return useQuery({
    queryFn: () => getStatisticsRevenue(params),
    queryKey: [STATISTICS_REVENUE_KEY, ...seriesKey(params)],
  });
}

export function useStatisticsTicketsQuery(params: StatisticsPeriodParams = {}) {
  return useQuery({
    queryFn: () => getStatisticsTickets(params),
    queryKey: [STATISTICS_TICKETS_KEY, ...periodKey(params)],
  });
}

export function useStatisticsLoadQuery(params: StatisticsSeriesParams = {}) {
  return useQuery({
    queryFn: () => getStatisticsLoad(params),
    queryKey: [STATISTICS_LOAD_KEY, ...seriesKey(params)],
  });
}
