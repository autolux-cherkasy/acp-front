"use client";

import { useMemo, useState } from "react";
import { StatusDropdown } from "@/src/features/change-trip-status";
import type { TripStatus } from "@/src/entities/trip";
import {
  TicketSortDropdown,
  type TicketSortDropdownOption,
} from "@/src/features/sort-tickets";
import {
  DashboardCard,
  DashboardTable,
  DashboardThead,
  DashboardTr,
  dashboardTableStyles,
  TablePagination,
  useResizeTableHook,
} from "@/src/shared";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import Chip from "@/src/shared/ui/Chip/Chip";
import { getStatusClass } from "../lib/routesTable.utils";
import { useRoutesTable } from "../model/useRoutesTable";
import RoutesTableSkeleton from "./RoutesTableSkeleton";
import type { RouteRow } from "../model/types";
import styles from "./admin-routes-table.module.css";

type RouteFilterOption = TripStatus | "__all__";

const EM_DASH = "—";

type RoutesTableProps = {
  rows: RouteRow[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onEditRoute?: (id: string) => void;
  onStatusChange?: (id: string, status: TripStatus) => void;
};

export default function RoutesTable({
  rows,
  isLoading = false,
  isError = false,
  onRetry,
  onEditRoute,
  onStatusChange,
}: RoutesTableProps) {
  const { t } = useI18n();
  const { openDropdownId, setOpenDropdownId } = useRoutesTable();
  const [selectedFilter, setSelectedFilter] =
    useState<RouteFilterOption>("__all__");

  // Похідне значення, а не стан: рядки приходять із запиту й змінюються після
  // маунта, тож useState(rows) залишив би таблицю на першому знімку даних.
  const filteredRows = useMemo(
    () =>
      selectedFilter === "__all__"
        ? rows
        : rows.filter((row) => row.status === selectedFilter),
    [rows, selectedFilter],
  );

  const {
    page,
    setPage,
    rowsPerPage,
    totalPages,
    paginatedRows,
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
    items: filteredRows,
  });

  const filterOptions: TicketSortDropdownOption<RouteFilterOption>[] = [
    {
      value: "__all__",
      label: t("dispatcherArea.routes.table.filters.all"),
    },
    {
      value: "DEPARTED",
      label: t("dispatcherArea.routes.table.statuses.DEPARTED"),
    },
    {
      value: "BOARDING",
      label: t("dispatcherArea.routes.table.statuses.BOARDING"),
    },
    {
      value: "SCHEDULED",
      label: t("dispatcherArea.routes.table.statuses.SCHEDULED"),
    },
    {
      value: "CANCELLED",
      label: t("dispatcherArea.routes.table.statuses.CANCELLED"),
    },
  ];

  // Завантаження показує скелетон, тож тут лишились тільки порожньо й помилка.
  const emptyMessage = isError
    ? t("dispatcherArea.routes.table.error")
    : t("dispatcherArea.routes.table.empty");

  return (
    <div ref={cardRef} className={styles.cardRoot}>
      <DashboardCard
        className={styles.card}
        title={t("dispatcherArea.routes.table.title")}
        headerRef={headerRef}
        headerAction={
          <TicketSortDropdown
            className={styles.sortAction}
            ariaLabel={t("dispatcherArea.routes.table.sort")}
            defaultLabel={t("dispatcherArea.routes.table.filters.all")}
            options={filterOptions}
            value={selectedFilter}
            onChange={(value) => {
              setPage(1);
              setSelectedFilter(value);
            }}
          />
        }
      >
        <div ref={tableAreaRef} className={styles.tableArea}>
          <div ref={tableScrollRef} className={styles.tableScroll}>
            <DashboardTable>
              <DashboardThead ref={theadRef}>
                <th className={dashboardTableStyles.thNum}>
                  {t("dispatcherArea.routes.table.columns.number")}
                </th>
                <th className={dashboardTableStyles.thLeft}>
                  {t("dispatcherArea.routes.table.columns.direction")}
                </th>
                <th className={dashboardTableStyles.th}>
                  {t("dispatcherArea.routes.table.columns.time")}
                </th>
                <th className={dashboardTableStyles.th}>
                  {t("dispatcherArea.routes.table.columns.bus")}
                </th>
                <th className={dashboardTableStyles.th}>
                  {t("dispatcherArea.routes.table.columns.seats")}
                </th>
                <th className={dashboardTableStyles.thStatus}>
                  {t("dispatcherArea.routes.table.columns.status")}
                </th>
                <th className={dashboardTableStyles.thAction} />
              </DashboardThead>
              <tbody>
                {isLoading ? (
                  <RoutesTableSkeleton rows={rowsPerPage} />
                ) : paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      {emptyMessage}
                      {isError && onRetry && (
                        <Button
                          text={t("dispatcherArea.routes.table.retry")}
                          onClick={onRetry}
                          variant="secondary"
                          size="md"
                        />
                      )}
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row, index) => {
                    const status = row.status ?? "SCHEDULED";

                    return (
                      <DashboardTr
                        key={row.id}
                        ref={index === 0 ? firstRowRef : undefined}
                      >
                        <td
                          className={`${dashboardTableStyles.tdNum} ${dashboardTableStyles.tdLeft}`}
                        >
                          {(page - 1) * rowsPerPage + index + 1}
                        </td>
                        <td
                          className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft}`}
                        >
                          {row.direction}
                        </td>
                        <td
                          className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft} ${styles.timeCell}`}
                        >
                          {row.departureTime && row.arrivalTime ? (
                            <>
                              <div>{row.date ?? EM_DASH}</div>
                              <div>
                                {row.departureTime} - {row.arrivalTime}
                              </div>
                            </>
                          ) : (
                            EM_DASH
                          )}
                        </td>
                        <td
                          className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft}`}
                        >
                          {row.busNumber ?? EM_DASH}
                        </td>
                        <td
                          className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft}`}
                        >
                          {row.availableSeats != null && row.totalSeats != null
                            ? `${row.availableSeats}/${row.totalSeats}`
                            : EM_DASH}
                        </td>
                        <td
                          className={`${dashboardTableStyles.tdStatus} ${dashboardTableStyles.tdLeft}`}
                        >
                          <Chip
                            className={`${styles.statusChip} ${getStatusClass(status)}`}
                          >
                            {t(`dispatcherArea.routes.table.statuses.${status}`)}
                          </Chip>
                        </td>
                        <td className={dashboardTableStyles.tdAction}>
                          <StatusDropdown
                            rowId={row.id}
                            openId={openDropdownId}
                            onToggle={setOpenDropdownId}
                            onStatusChange={onStatusChange ?? (() => {})}
                            onEdit={onEditRoute ?? (() => {})}
                          />
                        </td>
                      </DashboardTr>
                    );
                  })
                )}
              </tbody>
            </DashboardTable>
          </div>
        </div>

        <div ref={paginationRef}>
          <TablePagination
            className={styles.pagination}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            prevAriaLabel={t("dispatcherArea.routes.table.pagination.prev")}
            nextAriaLabel={t("dispatcherArea.routes.table.pagination.next")}
          />
        </div>
      </DashboardCard>
    </div>
  );
}
