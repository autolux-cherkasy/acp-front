"use client";

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { DashboardCard } from "@/src/shared";
import styles from "./StatisticsPage.module.css";

const TICKETS_DATA = [
  { name: "Викуплено", value: 58 },
  { name: "Заброньовано", value: 27 },
  { name: "Скасовано", value: 10 },
];
const TICKET_COLORS = ["#169f2c", "#eebb3a", "#d51216", "#e0eaed"];

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

export default function TicketsPieChartCard() {
  return (
    <DashboardCard title="Куплені та забронювані квитки" className={styles.chartCardPie}>
      <div className={styles.chartWrapper}>
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
              data={TICKETS_DATA}
              cx="50%"
              cy="58%"
              outerRadius="60%"
              dataKey="value"
              label={PieLabel}
              labelLine={false}
            >
              {TICKETS_DATA.map((_, i) => (
                <Cell key={i} fill={TICKET_COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
