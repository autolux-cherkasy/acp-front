"use client";

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { DashboardCard, EmptyState, LoadingState } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import type { TicketStatusBreakdown } from "@/src/entities/dashboard/api/dashboardStatisticsApi";
import styles from "./StatisticsPage.module.css";

const TICKET_COLORS = ["#169f2c", "#eebb3a", "#d51216", "#e0eaed"];

type Props = { data?: TicketStatusBreakdown; isLoading?: boolean };

function PieLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  outerRadius?: number;
  value?: number;
}) {
  if (!value || value < 5 || cx == null || cy == null || midAngle == null || outerRadius == null)
    return null;
  const r = outerRadius + 26;
  const x = cx + r * Math.cos(-(midAngle * Math.PI) / 180);
  const y = cy + r * Math.sin(-(midAngle * Math.PI) / 180);
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fill="var(--color-text-strong)"
      fontWeight={500}
    >
      {value}%
    </text>
  );
}

export default function TicketsPieChartCard({ data, isLoading }: Props) {
  const { t } = useI18n();
  const total = data?.total ?? 0;
  const toPercent = (value: number) => Math.round((value / total) * 100);

  const chartData =
    total > 0
      ? [
          {
            name: t("dispatcherArea.analytics.allRoutesPage.details.stats.purchased"),
            value: toPercent(data!.boughtOut),
          },
          {
            name: t("dispatcherArea.analytics.allRoutesPage.details.stats.reserved"),
            value: toPercent(data!.reserved),
          },
          {
            name: t("dispatcherArea.analytics.allRoutesPage.details.stats.cancelled"),
            value: toPercent(data!.canceled),
          },
        ]
      : [];

  return (
    <DashboardCard title={t("dispatcherArea.statistics.ticketsTitle")} className={styles.chartCardPie}>
      <div className={styles.chartWrapper}>
        {isLoading ? (
          <LoadingState />
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Legend
                iconType="circle"
                iconSize={10}
                verticalAlign="top"
                align="left"
                formatter={(val) => (
                  <span style={{ fontSize: 12, color: "var(--color-text-strong)" }}>{val}</span>
                )}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="58%"
                outerRadius="60%"
                dataKey="value"
                label={PieLabel}
                labelLine={false}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={TICKET_COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState iconUrl="/icons/workspace/sidebar/statistics.svg" />
        )}
      </div>
    </DashboardCard>
  );
}
