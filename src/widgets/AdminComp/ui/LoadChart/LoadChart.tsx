"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { DashboardCard, SharedLabel } from "@/src/shared";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import styles from "./LoadChart.module.css";

const MOCK_DATA = [
  { time: "6:00", value: 10 },
  { time: "8:00", value: 30 },
  { time: "10:00", value: 50 },
  { time: "12:00", value: 70 },
  { time: "14:00", value: 70 },
  { time: "16:00", value: 140 },
  { time: "18:00", value: 65 },
  { time: "20:00", value: 20 },
  { time: "22:00", value: 65 },
  { time: "23:00", value: 50 },
];

export default function LoadChart() {
  const { t } = useI18n();

  return (
    <DashboardCard className={styles.card}>
      <div className={styles.header}>
        <SharedLabel variant="dashboardCardTitle">
          {t("dispatcherArea.analytics.load.title")}
        </SharedLabel>
        <SharedLabel variant="dashboardCardSubtitle">
          {t("dispatcherArea.analytics.load.subtitle")}
        </SharedLabel>
      </div>

      <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={MOCK_DATA}
          margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
        >
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
      </div>
    </DashboardCard>
  );
}
