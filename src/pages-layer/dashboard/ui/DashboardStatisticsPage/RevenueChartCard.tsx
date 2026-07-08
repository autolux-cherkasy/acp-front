"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardCard } from "@/src/shared";
import styles from "./StatisticsPage.module.css";

const REVENUE_DATA = [
  { day: "1", v: 80000 },
  { day: "4", v: 450000 },
  { day: "8", v: 510000 },
  { day: "10", v: 680000 },
  { day: "12", v: 690000 },
  { day: "18", v: 700000 },
  { day: "21", v: 600000 },
  { day: "22", v: 620000 },
  { day: "25", v: 600000 },
  { day: "28", v: 860000 },
  { day: "31", v: 820000 },
];

export default function RevenueChartCard() {
  return (
    <DashboardCard title="Загальний дохід" className={styles.chartCardArea}>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REVENUE_DATA} margin={{ top: 8, right: 12, left: -5, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eebb3a" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#eebb3a" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#d6e4e8" strokeDasharray="4 4" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#7b98a3" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}k`)}
              tick={{ fontSize: 11, fill: "#7b98a3" }}
              axisLine={false}
              tickLine={false}
              width={52}
              domain={[0, 1000000]}
              ticks={[
                0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000,
              ]}
            />
            <Tooltip
              formatter={(v) => [typeof v === "number" ? `${v.toLocaleString("uk-UA")} ₴` : v, "Дохід"]}
            />
            <Area type="monotone" dataKey="v" stroke="#eebb3a" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
