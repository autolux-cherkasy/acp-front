"use client";

import { DashboardCard, EmptyState } from "@/src/shared";
import type { PieLabelRenderProps } from "recharts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./RouteAnalyticsDetails.module.css";

type TicketStatKey = "reserved" | "purchased" | "cancelled";

type RouteAnalyticsDetailsProps = {
  routeTitle: string;
  statisticsTitle: string;
  trendTitle: string;
  trendChartData: Array<{
    dayLabel: string;
    value: number;
  }>;
  ticketStatsData: Array<{
    key: TicketStatKey;
    value: number;
    label: string;
  }>;
};

const PIE_STAT_COLORS: Record<TicketStatKey, string> = {
  reserved: "var(--color-accent)",
  purchased: "#169F2C",
  cancelled: "var(--color-danger)",
};

function RouteTrendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className={styles.chartTooltip}>
      <span className={styles.chartTooltipLabel}>{label}</span>
      <span className={styles.chartTooltipValue}>{payload[0]?.value}</span>
    </div>
  );
}

function renderPieValueLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  value,
  fill,
}: PieLabelRenderProps) {
  const angleInRadians = (-midAngle * Math.PI) / 180;
  const startX = cx + (outerRadius + 2) * Math.cos(angleInRadians);
  const startY = cy + (outerRadius + 2) * Math.sin(angleInRadians);
  const breakX = cx + (outerRadius + 10) * Math.cos(angleInRadians);
  const breakY = cy + (outerRadius + 10) * Math.sin(angleInRadians);
  const isRightSide = Math.cos(angleInRadians) >= 0;
  const endX = breakX + (isRightSide ? 8 : -8);
  const textX = endX + (isRightSide ? 1 : -1);

  return (
    <g>
      <path
        d={`M ${startX} ${startY} L ${breakX} ${breakY} L ${endX} ${breakY}`}
        stroke={fill}
        strokeWidth={0.75}
        fill="none"
      />
      <text
        x={textX}
        y={breakY - 4}
        textAnchor={isRightSide ? "start" : "end"}
        className={styles.pieValueLabel}
      >
        {value}
      </text>
    </g>
  );
}

export default function RouteAnalyticsDetails({
  routeTitle,
  statisticsTitle,
  trendTitle,
  trendChartData,
  ticketStatsData,
}: RouteAnalyticsDetailsProps) {
  return (
    <>
      <DashboardCard
        className={styles.detailCard}
        title={trendTitle.replace("{{route}}", routeTitle)}
      >
        <div className={styles.chartWrapper}>
          {trendChartData.length === 0 ? (
            <EmptyState
              iconUrl="/icons/workspace/sidebar/analytics.svg"
              title={`Немає даних по маршруту ${routeTitle}`}
            />
          ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendChartData} margin={{ top: 28, right: 16, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="routeDynamicsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--color-border-muted)"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="dayLabel"
                tick={{ fontSize: 11, fill: "var(--color-border-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-border-muted)" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<RouteTrendTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-brand)"
                strokeWidth={2}
                fill="url(#routeDynamicsGradient)"
                dot={{ fill: "var(--color-brand)", r: 4 }}
                activeDot={{ r: 5, fill: "var(--color-brand)" }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  offset={10}
                  style={{
                    fill: "var(--color-brand)",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
      </DashboardCard>
      <DashboardCard
        className={`${styles.detailCard} ${styles.statisticsCard}`}
        title={statisticsTitle}
      >
        <div className={styles.statisticsContent}>
          {ticketStatsData.length === 0 ? (
            <EmptyState iconUrl="/pie-chart.svg" />
          ) : (
            <>
              <div className={styles.statisticsLegend}>
                {ticketStatsData.map((item) => (
                  <div key={item.key} className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ backgroundColor: PIE_STAT_COLORS[item.key] }}
                    />
                    <span className={styles.legendLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.donutWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 24, right: 20, bottom: 16, left: 20 }}>
                    <Pie
                      data={ticketStatsData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="52%"
                      innerRadius={44}
                      outerRadius={75}
                      paddingAngle={1}
                      stroke="none"
                      labelLine={false}
                      label={renderPieValueLabel}
                    >
                      {ticketStatsData.map((item) => (
                        <Cell key={item.key} fill={PIE_STAT_COLORS[item.key]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12 }}
                      formatter={(value, _name, entry) => [value, entry.payload.label]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </DashboardCard>
    </>
  );
}
