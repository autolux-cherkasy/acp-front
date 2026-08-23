"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Button, SharedLabel } from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { formatCurrency } from "@/src/shared/lib/formatters";
import { kyivDateOnly } from "@/src/shared/lib/kyivTime";
import type {
  RevenuePoint,
  StatisticsGranularity,
} from "@/src/entities/dashboard/api/dashboardStatisticsApi";
import {
  useStatisticsLoadQuery,
  useStatisticsOverviewQuery,
  useStatisticsRevenueQuery,
  useStatisticsTicketsQuery,
} from "@/src/entities/dashboard/api/useStatisticsQueries";
import { useExportStatsMutation } from "@/src/entities/dashboard/api/useExportStatsMutation";
import { downloadStatsReport } from "@/src/entities/dashboard/api/statsExportDownload";
import { useServerToast } from "@/src/shared/lib/toast";
import styles from "./StatisticsPage.module.css";

const RevenueSparkline = dynamic(() => import("./RevenueSparkline"), { ssr: false });
const RevenueChartCard = dynamic(() => import("./RevenueChartCard"), { ssr: false });
const TicketsPieChartCard = dynamic(() => import("./TicketsPieChartCard"), { ssr: false });
const LoadChartCard = dynamic(() => import("./LoadChartCard"), { ssr: false });

const SPARKLINE_POINTS = 7;

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

/**
 * Бекенд віддає бакети на весь період, включно з днями, які ще не настали, і
 * дохід у них — нуль. Тому для спарклайну беремо останні SPARKLINE_POINTS
 * бакетів, що вже минули, а не хвіст серії: інакше протягом більшої частини
 * місяця лінія була б пласкою по нулю.
 */
function getSparklinePoints(
  points: RevenuePoint[] | undefined,
  granularity: StatisticsGranularity | undefined,
): number[] {
  if (!points?.length) return [];

  const today = kyivDateOnly(new Date().toISOString());
  const currentBucket = granularity === "month" ? today.slice(0, 7) : today;

  return points
    .filter((point) => point.bucket <= currentBucket)
    .slice(-SPARKLINE_POINTS)
    .map((point) => point.revenue);
}

function formatTrend(trendPercent: number | null | undefined): string | undefined {
  if (trendPercent == null) return undefined;

  const rounded = Math.round(trendPercent * 10) / 10;
  return `${rounded >= 0 ? "+" : "−"} ${Math.abs(rounded)}%`;
}

export default function StatisticsPage() {
  const { t } = useI18n();
  const { notifyInfo } = useServerToast();
  const exportStatsMutation = useExportStatsMutation();

  const { data: overview, isLoading: isOverviewLoading } = useStatisticsOverviewQuery();
  const { data: revenue, isLoading: isRevenueLoading } = useStatisticsRevenueQuery();
  const { data: tickets, isLoading: isTicketsLoading } = useStatisticsTicketsQuery();
  const { data: load, isLoading: isLoadLoading } = useStatisticsLoadQuery();

  const sparklinePoints = getSparklinePoints(revenue?.points, revenue?.granularity);

  const handleExportStats = () => {
    const period = overview?.period;

    if (!period?.startDate || !period?.endDate) {
      notifyInfo(t("common.toast.statsExportWaiting"));
      return;
    }

    exportStatsMutation.mutate(
      {
        startDate: period.startDate,
        endDate: period.endDate,
      },
      {
        onSuccess: (data) => {
          try {
            downloadStatsReport(data);
          } catch (error) {
            notifyInfo(t("common.toast.statsExportError"));
            console.error("Failed to download stats report", error);
          }
        },
      },
    );
  };

  const isExporting = exportStatsMutation.isPending;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <SharedLabel variant="dashboardHeaderTitle">
            {t("dispatcherArea.statistics.title")}
          </SharedLabel>
          <SharedLabel variant="dashboardHeaderSubtitle">
            {t("dispatcherArea.statistics.subtitle")}
          </SharedLabel>
        </div>
        <div className={styles.headerActions}>
          <Button
            text={t("dispatcherArea.statistics.downloadAction")}
            variant="primary"
            size="fit"
            fullWidth={false}
            disabled={isOverviewLoading || isExporting}
            onClick={handleExportStats}
          />
          <Button
            text={t("dispatcherArea.statistics.resetAction")}
            variant="secondary"
            size="fit"
            fullWidth={false}
            onClick={() => {}}
          />
        </div>
      </header>

      <div className={styles.statCards}>
        <StatCard
          label={t("dispatcherArea.statistics.totalOrders")}
          value={isOverviewLoading ? "—" : String(overview?.orders.total ?? 0)}
          trend={formatTrend(overview?.orders.trendPercent)}
          trendLabel={t("dispatcherArea.statistics.trendMonth")}
          variant="yellow"
        />
        <StatCard
          label={t("dispatcherArea.statistics.totalRevenue")}
          value={isOverviewLoading ? "—" : formatCurrency(overview?.revenue.total ?? 0)}
          variant="light"
          extra={<RevenueSparkline points={sparklinePoints} />}
        />
        <StatCard
          label={t("dispatcherArea.statistics.occupancy")}
          value={isOverviewLoading ? "—" : `${overview?.occupancy.percent ?? 0}%`}
          trend={formatTrend(overview?.occupancy.trendPercent)}
          trendLabel={t("dispatcherArea.statistics.trendYear")}
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
          <RevenueChartCard
            data={revenue?.points}
            granularity={revenue?.granularity}
            isLoading={isRevenueLoading}
          />
          <TicketsPieChartCard data={tickets?.seats} isLoading={isTicketsLoading} />
        </div>

        <LoadChartCard
          data={load?.points}
          granularity={load?.granularity}
          isLoading={isLoadLoading}
        />
      </div>
    </div>
  );
}
