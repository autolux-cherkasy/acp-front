"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import { DashboardCard, EmptyState, LoadingState } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import type { LoadPoint, StatisticsGranularity } from "@/src/entities/dashboard/api/dashboardStatisticsApi";
import { formatBucketLabel } from "./bucketLabel";
import styles from "./StatisticsPage.module.css";

type Props = {
  data?: LoadPoint[];
  granularity?: StatisticsGranularity;
  isLoading?: boolean;
};

export default function LoadChartCard({ data, granularity = "month", isLoading }: Props) {
  const { t, locale } = useI18n();
  const chartData = (data ?? []).map(({ bucket, occupancyPercent }) => ({
    label: formatBucketLabel(bucket, granularity, locale),
    value: occupancyPercent,
  }));

  return (
    <DashboardCard title={t("dispatcherArea.statistics.loadTitle")} className={styles.chartCardLoad}>
      <div className={styles.chartWrapper}>
        {isLoading ? (
          <LoadingState />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#226078" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#226078" stopOpacity={0.02} />
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
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fontSize: 11, fill: "#7b98a3" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#226078"
                strokeWidth={2}
                fill="url(#loadGradient)"
                dot={{ fill: "#226078", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{ fontSize: 10, fill: "#226078", fontWeight: 500 }}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState iconUrl="/icons/workspace/sidebar/statistics.svg" />
        )}
      </div>
    </DashboardCard>
  );
}
