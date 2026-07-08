"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import { DashboardCard } from "@/src/shared";
import styles from "./StatisticsPage.module.css";

const LOAD_DATA = [
  { m: "Січ", v: 5 },
  { m: "Лют", v: 8 },
  { m: "Бер", v: 47 },
  { m: "Кв", v: 30 },
  { m: "Тр", v: 32 },
  { m: "Чер", v: 30 },
  { m: "Лип", v: 72 },
  { m: "Сер", v: 10 },
  { m: "Вер", v: 30 },
  { m: "Жов", v: 25 },
  { m: "Лис", v: 33 },
  { m: "Гр", v: 65 },
];

export default function LoadChartCard() {
  return (
    <DashboardCard title="Завантаженість (%)" className={styles.chartCardLoad}>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={LOAD_DATA} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#226078" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#226078" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#d6e4e8" strokeDasharray="4 4" />
            <XAxis
              dataKey="m"
              tick={{ fontSize: 11, fill: "#7b98a3" }}
              axisLine={false}
              tickLine={false}
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
              dataKey="v"
              stroke="#226078"
              strokeWidth={2}
              fill="url(#loadGradient)"
              dot={{ fill: "#226078", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            >
              <LabelList
                dataKey="v"
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
