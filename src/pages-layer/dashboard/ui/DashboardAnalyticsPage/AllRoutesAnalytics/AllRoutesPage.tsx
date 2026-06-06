"use client";

import {
  DashboardCard,
  DashboardTable,
  dashboardTableStyles,
  DashboardThead,
  DashboardTr,
  TablePagination,
  useI18n,
} from "@/src/shared";
import { useResizeTableHook } from "@/src/shared/lib/resizeTableHook";
import { useRouter } from "next/navigation";
import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import { useState } from "react";
import RouteAnalyticsDetails from "./RouteAnalyticsDetails";
import styles from "../analytics.module.css";

type AllRouteRow = {
  id: number;
  direction: string;
  tripsPerDay: number;
  ticketsSold: number;
  load: string;
  income: string;
  redemptionRate: string;
};

type TrendPoint = {
  dayKey: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  value: number;
};

type TicketStatKey = "reserved" | "purchased" | "cancelled";

type RouteAnalyticsDetail = {
  trend: TrendPoint[];
  ticketStats: Record<TicketStatKey, number>;
};

const mockAllRoutes: AllRouteRow[] = [
  {
    id: 1,
    direction: "м.Черкаси - м.Київ (ст.м.Харківська)",
    tripsPerDay: 16,
    ticketsSold: 240,
    load: "82%",
    income: "120 000 ₴",
    redemptionRate: "92%",
  },
  {
    id: 2,
    direction: "м.Черкаси - м.Київ (ст.м.Чернігівська)",
    tripsPerDay: 16,
    ticketsSold: 180,
    load: "70%",
    income: "90 000 ₴",
    redemptionRate: "76%",
  },
  {
    id: 3,
    direction: "м.Золотоноша - м.Київ",
    tripsPerDay: 16,
    ticketsSold: 80,
    load: "52%",
    income: "32 000 ₴",
    redemptionRate: "42%",
  },
  {
    id: 4,
    direction: "м.Кременчук - м.Черкаси",
    tripsPerDay: 2,
    ticketsSold: 18,
    load: "68%",
    income: "17 100 ₴",
    redemptionRate: "96%",
  },
  {
    id: 5,
    direction: "м.Черкаси - м.Харків",
    tripsPerDay: 2,
    ticketsSold: 12,
    load: "40%",
    income: "11 400 ₴",
    redemptionRate: "81%",
  },
  {
    id: 6,
    direction: "м.Градизьк - м.Черкаси",
    tripsPerDay: 2,
    ticketsSold: 8,
    load: "12%",
    income: "1 600 ₴",
    redemptionRate: "76%",
  },
  {
    id: 7,
    direction: "м.Черкаси - с.Софіївка",
    tripsPerDay: 2,
    ticketsSold: 4,
    load: "8%",
    income: "11 400 ₴",
    redemptionRate: "65%",
  },
];

const ROUTE_ANALYTICS_DETAILS: Record<number, RouteAnalyticsDetail> = {
  1: {
    trend: [
      { dayKey: "monday", value: 10 },
      { dayKey: "tuesday", value: 200 },
      { dayKey: "wednesday", value: 110 },
      { dayKey: "thursday", value: 130 },
      { dayKey: "friday", value: 310 },
      { dayKey: "saturday", value: 75 },
      { dayKey: "sunday", value: 220 },
    ],
    ticketStats: { reserved: 240, purchased: 180, cancelled: 60 },
  },
  2: {
    trend: [
      { dayKey: "monday", value: 25 },
      { dayKey: "tuesday", value: 160 },
      { dayKey: "wednesday", value: 145 },
      { dayKey: "thursday", value: 170 },
      { dayKey: "friday", value: 220 },
      { dayKey: "saturday", value: 95 },
      { dayKey: "sunday", value: 185 },
    ],
    ticketStats: { reserved: 180, purchased: 137, cancelled: 43 },
  },
  3: {
    trend: [
      { dayKey: "monday", value: 15 },
      { dayKey: "tuesday", value: 60 },
      { dayKey: "wednesday", value: 90 },
      { dayKey: "thursday", value: 120 },
      { dayKey: "friday", value: 165 },
      { dayKey: "saturday", value: 75 },
      { dayKey: "sunday", value: 105 },
    ],
    ticketStats: { reserved: 80, purchased: 55, cancelled: 25 },
  },
  4: {
    trend: [
      { dayKey: "monday", value: 8 },
      { dayKey: "tuesday", value: 12 },
      { dayKey: "wednesday", value: 18 },
      { dayKey: "thursday", value: 14 },
      { dayKey: "friday", value: 26 },
      { dayKey: "saturday", value: 9 },
      { dayKey: "sunday", value: 21 },
    ],
    ticketStats: { reserved: 18, purchased: 14, cancelled: 4 },
  },
  5: {
    trend: [
      { dayKey: "monday", value: 7 },
      { dayKey: "tuesday", value: 20 },
      { dayKey: "wednesday", value: 16 },
      { dayKey: "thursday", value: 22 },
      { dayKey: "friday", value: 29 },
      { dayKey: "saturday", value: 10 },
      { dayKey: "sunday", value: 18 },
    ],
    ticketStats: { reserved: 12, purchased: 9, cancelled: 3 },
  },
  6: {
    trend: [
      { dayKey: "monday", value: 2 },
      { dayKey: "tuesday", value: 6 },
      { dayKey: "wednesday", value: 4 },
      { dayKey: "thursday", value: 7 },
      { dayKey: "friday", value: 10 },
      { dayKey: "saturday", value: 3 },
      { dayKey: "sunday", value: 8 },
    ],
    ticketStats: { reserved: 8, purchased: 6, cancelled: 2 },
  },
  7: {
    trend: [
      { dayKey: "monday", value: 1 },
      { dayKey: "tuesday", value: 3 },
      { dayKey: "wednesday", value: 2 },
      { dayKey: "thursday", value: 4 },
      { dayKey: "friday", value: 6 },
      { dayKey: "saturday", value: 3 },
      { dayKey: "sunday", value: 5 },
    ],
    ticketStats: { reserved: 4, purchased: 3, cancelled: 1 },
  },
};

export default function AllRoutesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
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
    items: mockAllRoutes,
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

  const selectedRoute = mockAllRoutes.find((route) => route.id === selectedRouteId) ?? null;
  const selectedRouteDetails = selectedRoute ? ROUTE_ANALYTICS_DETAILS[selectedRoute.id] : null;
  const hasSelection = Boolean(selectedRoute && selectedRouteDetails);
  const trendChartData =
    selectedRouteDetails?.trend.map((point) => ({
      dayLabel: t(`dispatcherArea.analytics.allRoutesPage.details.days.${point.dayKey}`),
      value: point.value,
    })) ?? [];
  const ticketStatsData = selectedRouteDetails
    ? (Object.entries(selectedRouteDetails.ticketStats) as [TicketStatKey, number][]).map(
        ([key, value]) => ({
          key,
          value,
          label: t(`dispatcherArea.analytics.allRoutesPage.details.stats.${key}`),
        }),
      )
    : [];

  return (
    <div className={styles.mainContainer}>
      <DashboardPageHeader
        title={t("dispatcherArea.sidebar.menu.analytics")}
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
                        key={row.id}
                        className={`${styles.clickableRow} ${
                          selectedRouteId === row.id ? styles.selectedRow : ""
                        }`}
                        onClick={() => setSelectedRouteId(row.id)}
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
