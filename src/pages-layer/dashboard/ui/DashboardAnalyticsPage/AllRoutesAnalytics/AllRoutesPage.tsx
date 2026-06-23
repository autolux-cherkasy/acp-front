"use client";

import {
  DashboardCard,
  DashboardTable,
  dashboardTableStyles,
  DashboardThead,
  DashboardTr,
  EmptyState,
  TablePagination,
  useI18n,
} from "@/src/shared";
import { useResizeTableHook } from "@/src/shared/lib/resizeTableHook";
import { useRouter } from "next/navigation";
import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import { useState } from "react";
import RouteAnalyticsDetails from "./RouteAnalyticsDetails";
import styles from "../analytics.module.css";
import { formatCurrency } from "@/src/shared/lib/formatters";
import {
  useAllRoutesAnalyticsQuery,
  useRouteAnalyticsQuery,
} from "@/src/entities/dashboard/api/useAnalyticsQueries";

type AllRouteRow = {
  id: number;
  direction: string;
  tripsPerDay: number;
  ticketsSold: number;
  load: string;
  income: string;
  redemptionRate: string;
};

type TicketStatKey = "reserved" | "purchased" | "cancelled";

export default function AllRoutesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);

  const { data: routesData } = useAllRoutesAnalyticsQuery();
  const { data: routeDetail } = useRouteAnalyticsQuery(selectedDirection);

  const allRoutes: AllRouteRow[] = (routesData ?? []).map((r, i) => ({
    id: i,
    direction: r.direction,
    tripsPerDay: r.tripsCount,
    ticketsSold: r.ticketsSoldTotal,
    load: `${r.occupancyPercent}%`,
    income: formatCurrency(r.revenueTotal),
    redemptionRate: `${r.buyoutRatePercent}%`,
  }));

  const {
    page,
    setPage,
    rowsPerPage,
    totalPages,
    paginatedRows,
    availableRowsHeight,
    measurements,
    refs: {
      cardRef,
      headerRef,
      tableAreaRef,
      tableScrollRef,
      theadRef,
      firstRowRef,
      paginationRef,
    },
  } = useResizeTableHook({
    items: allRoutes,
  });

  const {
    cardHeight,
    headerHeight,
    tableAreaHeight,
    tableScrollHeight,
    theadHeight,
    rowHeight,
    paginationHeight,
  } = measurements;

  const selectedRoute = allRoutes.find((r) => r.direction === selectedDirection) ?? null;
  const hasSelection = Boolean(selectedRoute && routeDetail);

  const trendChartData =
    routeDetail?.dynamics.map((point) => ({
      dayLabel: point.day,
      value: point.ticketsSold,
    })) ?? [];

  const ticketStatsData: { key: TicketStatKey; value: number; label: string }[] = routeDetail
    ? [
        {
          key: "reserved",
          value: routeDetail.ticketStats.reserved,
          label: t("dispatcherArea.analytics.allRoutesPage.details.stats.reserved"),
        },
        {
          key: "purchased",
          value: routeDetail.ticketStats.boughtOut,
          label: t("dispatcherArea.analytics.allRoutesPage.details.stats.purchased"),
        },
        {
          key: "cancelled",
          value: routeDetail.ticketStats.canceled,
          label: t("dispatcherArea.analytics.allRoutesPage.details.stats.cancelled"),
        },
      ]
    : [];

  return (
    <div className={styles.mainContainer}>
      <DashboardPageHeader
        title={`${t("dispatcherArea.sidebar.menu.analytics")} / ${t("dispatcherArea.analytics.allRoutes")}`}
        subtitle={t("dispatcherArea.analytics.subtitle")}
        onBack={() => router.back()}
        onCalendarChange={() => {}}
      />
      <div
        ref={cardRef}
        className={`${styles.routesCard} ${
          hasSelection ? styles.routesCardCompact : styles.routesCardFull
        }`}
      >
        <DashboardCard
          className={styles.routesCardInner}
          title={t("dispatcherArea.routes.table.title")}
          headerRef={headerRef}
        >
          <div ref={tableAreaRef} className={styles.tableArea}>
            {allRoutes.length === 0 ? (
              <EmptyState
                iconUrl="/icons/workspace/sidebar/routes.svg"
                description="Список порожній"
                className={styles.tableEmptyState}
                cardClassName={styles.tableEmptyCard}
              />
            ) : (
              <div ref={tableScrollRef} className={styles.tableScroll}>
                <DashboardTable>
                  <DashboardThead ref={theadRef}>
                    <th className={dashboardTableStyles.thNum}>
                      {t("dispatcherArea.analytics.allRoutesPage.columns.number")}
                    </th>
                    <th className={dashboardTableStyles.thLeft}>
                      {t("dispatcherArea.analytics.allRoutesPage.columns.direction")}
                    </th>
                    <th className={dashboardTableStyles.th}>
                      {t("dispatcherArea.analytics.allRoutesPage.columns.tripsPerDay")}
                    </th>
                    <th className={dashboardTableStyles.th}>
                      {t("dispatcherArea.analytics.allRoutesPage.columns.ticketsSold")}
                    </th>
                    <th className={dashboardTableStyles.th}>
                      {t("dispatcherArea.analytics.allRoutesPage.columns.load")}
                    </th>
                    <th className={dashboardTableStyles.th}>
                      {t("dispatcherArea.analytics.allRoutesPage.columns.income")}
                    </th>
                    <th className={dashboardTableStyles.th}>
                      {t("dispatcherArea.analytics.allRoutesPage.columns.redemptionRate")}
                    </th>
                  </DashboardThead>
                  <tbody>
                    {paginatedRows.map((row, index) => {
                      return (
                        <DashboardTr
                          ref={index === 0 ? firstRowRef : undefined}
                          key={row.direction}
                          className={`${styles.clickableRow} ${
                            selectedDirection === row.direction ? styles.selectedRow : ""
                          }`}
                          onClick={() => setSelectedDirection(row.direction)}
                        >
                          <td className={dashboardTableStyles.tdNum}>
                            {(page - 1) * rowsPerPage + index + 1}
                          </td>
                          <td className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft}`}>
                            {row.direction}
                          </td>
                          <td className={dashboardTableStyles.td}>{row.tripsPerDay}</td>
                          <td className={dashboardTableStyles.td}>{row.ticketsSold}</td>
                          <td className={dashboardTableStyles.td}>{row.load}</td>
                          <td className={dashboardTableStyles.td}>{row.income}</td>
                          <td className={dashboardTableStyles.td}>{row.redemptionRate}</td>
                        </DashboardTr>
                      );
                    })}
                  </tbody>
                </DashboardTable>
              </div>
            )}
          </div>
          <div ref={paginationRef}>
            <TablePagination
              className={styles.pagination}
              data-card-height={cardHeight}
              data-header-height={headerHeight}
              data-table-area-height={tableAreaHeight}
              data-table-scroll-height={tableScrollHeight}
              data-thead-height={theadHeight}
              data-row-height={rowHeight}
              data-pagination-height={paginationHeight}
              data-available-rows-height={availableRowsHeight}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              prevAriaLabel={t("dispatcherArea.routes.table.pagination.prev")}
              nextAriaLabel={t("dispatcherArea.routes.table.pagination.next")}
            />
          </div>
        </DashboardCard>
      </div>
      <div
        className={`${styles.grid} ${hasSelection ? styles.gridVisible : styles.gridHidden}`}
        aria-hidden={!hasSelection}
      >
        <RouteAnalyticsDetails
          routeTitle={selectedRoute?.direction ?? ""}
          statisticsTitle={t("dispatcherArea.analytics.allRoutesPage.details.statisticsTitle")}
          trendTitle={t("dispatcherArea.analytics.allRoutesPage.details.dynamicsTitle")}
          trendChartData={trendChartData}
          ticketStatsData={ticketStatsData}
        />
      </div>
    </div>
  );
}
