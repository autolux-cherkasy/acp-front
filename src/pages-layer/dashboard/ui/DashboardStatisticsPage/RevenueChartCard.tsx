"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardCard, EmptyState, LoadingState } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { getCompactAxisFormatter, getNiceAxisConfig } from "@/src/shared/lib/formatters";
import type { RevenuePoint, StatisticsGranularity } from "@/src/entities/dashboard/api/dashboardStatisticsApi";
import { formatBucketLabel } from "./bucketLabel";
import styles from "./StatisticsPage.module.css";

type Props = {
  data?: RevenuePoint[];
  granularity?: StatisticsGranularity;
  isLoading?: boolean;
};

export default function RevenueChartCard({ data, granularity = "day", isLoading }: Props) {
  const { t, locale } = useI18n();
  const chartData = (data ?? []).map(({ bucket, revenue }) => ({
    label: formatBucketLabel(bucket, granularity, locale),
    value: revenue,
  }));

  const dataMax = Math.max(0, ...chartData.map((point) => point.value));
  const { domain, ticks } = getNiceAxisConfig(dataMax > 0 ? dataMax : 1000);
  const formatAxisValue = getCompactAxisFormatter(domain[1]);

  return (
    <DashboardCard title={t("dispatcherArea.statistics.revenueTitle")} className={styles.chartCardArea}>
      <div className={styles.chartWrapper}>
        {isLoading ? (
          <LoadingState />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -5, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eebb3a" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#eebb3a" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#d6e4e8" strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#7b98a3" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={16}
              />
              <YAxis
                tickFormatter={formatAxisValue}
                tick={{ fontSize: 11, fill: "#7b98a3" }}
                axisLine={false}
                tickLine={false}
                width={52}
                domain={domain}
                ticks={ticks}
              />
              <Tooltip
                formatter={(v) => [
                  typeof v === "number" ? `${v.toLocaleString("uk-UA")} ₴` : v,
                  t("dispatcherArea.statistics.revenueTooltip"),
                ]}
              />
              <Area type="monotone" dataKey="value" stroke="#eebb3a" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState iconUrl="/icons/workspace/sidebar/statistics.svg" />
        )}
      </div>
    </DashboardCard>
  );
}
