import type { StatisticsGranularity } from "@/src/entities/dashboard/api/dashboardStatisticsApi";

export function formatBucketLabel(
  bucket: string,
  granularity: StatisticsGranularity,
  locale: string,
): string {
  if (granularity === "month") {
    const [year, month] = bucket.split("-").map(Number);
    if (!year || !month) return bucket;

    return new Intl.DateTimeFormat(locale, { month: "short" }).format(
      new Date(Date.UTC(year, month - 1, 1)),
    );
  }

  const day = bucket.split("-")[2];
  return day ? String(Number(day)) : bucket;
}
