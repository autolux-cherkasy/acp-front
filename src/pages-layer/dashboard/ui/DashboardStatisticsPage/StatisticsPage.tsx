"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Button, DashboardDateText, SharedLabel } from "@/src/shared";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";
import styles from "./StatisticsPage.module.css";

const RevenueSparkline = dynamic(() => import("./RevenueSparkline"), { ssr: false });
const RevenueChartCard = dynamic(() => import("./RevenueChartCard"), { ssr: false });
const TicketsPieChartCard = dynamic(() => import("./TicketsPieChartCard"), { ssr: false });
const LoadChartCard = dynamic(() => import("./LoadChartCard"), { ssr: false });

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
          extra={<RevenueSparkline />}
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
          <RevenueChartCard />
          <TicketsPieChartCard />
        </div>

        <LoadChartCard />
      </div>
    </div>
  );
}
