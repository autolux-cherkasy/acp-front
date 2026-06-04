"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { DashboardCard, SharedLabel } from "@/src/shared";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import styles from "./FinanceCard.module.css";
import { formatCurrency, formatYAxis } from "@/src/shared/lib/formatters";

type FinanceEntry = {
  key: "reserved" | "purchased" | "noShows";
  value: number;
  color: string;
  icon: string;
};

const FINANCE_DATA: FinanceEntry[] = [
  {
    key: "reserved",
    value: 568000,
    color: "#eebb3a",
    icon: "/icons/Services/clock-loading.svg",
  },
  {
    key: "purchased",
    value: 376000,
    color: "#169f2c",
    icon: "/icons/shield-check-broken.svg",
  },
  {
    key: "noShows",
    value: 192000,
    color: "#d51216",
    icon: "/icons/close-circle-broken.svg",
  },
];

function getNiceAxisConfig(maxValue: number, tickCount = 6) {
  const rawInterval = maxValue / tickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)));
  const niceInterval = Math.ceil(rawInterval / magnitude) * magnitude;
  const maxTick = Math.ceil(maxValue / niceInterval) * niceInterval;
  const ticks = Array.from(
    { length: maxTick / niceInterval + 1 },
    (_, i) => i * niceInterval,
  );
  return { domain: [0, maxTick] as [number, number], ticks };
}


export default function FinanceCard() {
  const { t } = useI18n();
  const maxValue = Math.max(...FINANCE_DATA.map((d) => d.value));
  const { domain, ticks } = getNiceAxisConfig(maxValue);

  return (
    <DashboardCard
      className={styles.card}
      title={t("dispatcherArea.analytics.finance.title")}
      subtitle={t("dispatcherArea.analytics.finance.subtitle")}
    >
      <div className={styles.badgesRow}>
        {FINANCE_DATA.map(({ key, value, color, icon }) => (
          <div
            key={key}
            className={styles.badge}
            style={{ background: `${color}cc` }}
          >
            <div className={styles.badgeTop}>
              <span
                className={styles.badgeIcon}
                aria-hidden="true"
                style={{
                  WebkitMaskImage: `url(${icon})`,
                  maskImage: `url(${icon})`,
                  backgroundColor: key === "reserved" ? "#11313d" : "#ffffff",
                }}
              />
              <span
                className={styles.badgeLabel}
                style={{ color: key === "reserved" ? "#11313d" : "#ffffff" }}
              >
                {t(`dispatcherArea.analytics.finance.${key}`)}
              </span>
            </div>
            <span
              className={styles.badgeValue}
              style={{ color: key === "reserved" ? "#11313d" : "#ffffff" }}
            >
              {formatCurrency(value)}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.chartSection}>
        <span className={styles.chartTitle}>
          {t("dispatcherArea.analytics.finance.totalIncome")}
        </span>
        <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={FINANCE_DATA}
            margin={{ top: 24, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#d6e4e8" />
            <XAxis dataKey="key" hide />
            <YAxis
              domain={domain}
              ticks={ticks}
              interval={0}
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: "#7b98a3" }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={72}>
              {FINANCE_DATA.map(({ key, color }) => (
                <Cell key={key} fill={color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value) => formatCurrency(Number(value ?? 0))}
                style={{ fontSize: 11, fill: "#226078", fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  );
}
