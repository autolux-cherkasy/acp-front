"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { Button, DashboardCard, DashboardDateText, SharedLabel } from "@/src/shared";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";
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

const SPARKLINE_DATA = [
  { v: 80 },
  { v: 120 },
  { v: 100 },
  { v: 200 },
  { v: 180 },
  { v: 280 },
  { v: 320 },
];

const TICKETS_DATA = [
  { name: "Викуплено", value: 58 },
  { name: "Заброньовано", value: 27 },
  { name: "Скасовано", value: 10 },
];
const TICKET_COLORS = ["#169f2c", "#eebb3a", "#d51216", "#e0eaed"];

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

type StatCardProps = {
  label: string;
  value: string;
  trend?: string;
  trendLabel?: string;
  variant: "yellow" | "light" | "dark";
  extra?: ReactNode;
};

function StatCard({ label, value, trend, trendLabel, variant, extra }: StatCardProps) {
  return (
    <div className={`${styles.statCard} ${styles[variant]}`}>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.statRow}>
        <span className={styles.statValue}>{value}</span>
        {extra}
      </div>
      {trend && (
        <div className={styles.statTrend}>
          <span className={styles.trendVal}>{trend}</span>
          {trendLabel && <span className={styles.trendLbl}>{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}

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
  if (!value || value < 5 || cx == null || cy == null || midAngle == null || outerRadius == null) return null;
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

export default function StatisticsPage() {
  const [chosenDate, setChosenDate] = useState(new Date());

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <SharedLabel variant="dashboardHeaderTitle">Статистика</SharedLabel>
          <SharedLabel variant="dashboardHeaderSubtitle">
            Огляд ключових показників роботи автостанції.
          </SharedLabel>
        </div>
        <div className={styles.headerActions}>
          <Button
            text="Загрузити статистику"
            variant="primary"
            size="fit"
            fullWidth={false}
            onClick={() => {}}
          />
          <Button
            text="Скинути статистику"
            variant="secondary"
            size="fit"
            fullWidth={false}
            onClick={() => {}}
          />
        </div>
        <div className={styles.dateBlock}>
          <DashboardDateText chosenDate={chosenDate} />
          <MiniCalendarTrigger
            chosenDate={chosenDate}
            setChosenDate={setChosenDate}
            onCalendarChange={() => {}}
          />
        </div>
      </header>

      <div className={styles.statCards}>
        <StatCard
          label="Всього замовлень"
          value="180"
          trend="+ 10%"
          trendLabel="за цей місяць"
          variant="yellow"
        />
        <StatCard
          label="Загальний дохід"
          value="86 000 ₴"
          variant="light"
          extra={
            <div className={styles.sparkline}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={SPARKLINE_DATA}>
                  <Line type="monotone" dataKey="v" stroke="#226078" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          }
        />
        <StatCard
          label="Завантаженість"
          value="82%"
          trend="+ 8%"
          trendLabel="за рік"
          variant="dark"
          extra={
            <span
              className={styles.busIcon}
              style={{
                WebkitMaskImage: "url(/icons/front-bus.svg)",
                maskImage: "url(/icons/front-bus.svg)",
              }}
            />
          }
        />
      </div>

      <div className={styles.charts}>
        <div className={styles.chartsRow}>
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
                      0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
                      1000000,
                    ]}
                  />
                  <Tooltip formatter={(v) => [typeof v === "number" ? `${v.toLocaleString("uk-UA")} ₴` : v, "Дохід"]} />
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#eebb3a"
                    strokeWidth={2}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

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
        </div>

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
      </div>
    </div>
  );
}
