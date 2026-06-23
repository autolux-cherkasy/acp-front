"use client";

import type { LoadAnalyticsItem } from "@/src/entities/dashboard/api/analyticsApi";
import { DashboardCard, EmptyState } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./LoadChart.module.css";

type Props = { data?: LoadAnalyticsItem[] };

export default function LoadChart({ data }: Props) {
  const { t } = useI18n();
  const chartData = (data ?? []).map(({ hour, ticketsBought }) => ({
    time: `${hour}:00`,
    value: ticketsBought,
  }));

  return (
    <DashboardCard
      className={styles.card}
      title={t("dispatcherArea.analytics.load.title")}
      subtitle={t("dispatcherArea.analytics.load.subtitle")}
    >
      <div className={styles.chartWrapper}>
        {chartData.length > 0 ? (
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
                dataKey="time"
                tick={{ fontSize: 11, fill: "#7b98a3" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 400]}
                ticks={[0, 100, 200, 300, 400]}
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
          <EmptyState iconUrl="/icons/workspace/sidebar/analytics.svg" />
        )}
      </div>
    </DashboardCard>
  );
}
