import { apiFetchBlob } from "@/src/shared";
import { STATS_EXPORT_XLSX_URL } from "./dashboardApiKeys";

export type StatsExportParams = {
  startDate: string;
  endDate: string;
};

export function exportStatsXlsx(params: StatsExportParams) {
  const search = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });

  return apiFetchBlob(`${STATS_EXPORT_XLSX_URL}?${search.toString()}`);
}
