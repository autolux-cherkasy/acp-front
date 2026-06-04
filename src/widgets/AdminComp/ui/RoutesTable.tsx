"use client";

import { useState } from "react";
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
import Chip from "@/src/shared/ui/Chip/Chip";
import { getStatusClass, MOCK_ROWS } from "../lib/routesTable.utils";
import { useRoutesTable } from "../model/useRoutesTable";
import type { RouteRow } from "../model/types";
import styles from "./admin-routes-table.module.css";

type RouteFilterOption = TripStatus | "__all__";

type RoutesTableProps = {
  rows?: RouteRow[];
  onEditRoute?: (id: string) => void;
};

export default function RoutesTable({
  rows = MOCK_ROWS,
  onEditRoute,
}: RoutesTableProps) {
  const { t } = useI18n();
  const {
    openDropdownId,
    setOpenDropdownId,
    rowStatuses,
    handleStatusChange,
  } = useRoutesTable({ rows });
  const [filteredRows, setFilteredRows] = useState(rows);
  const [selectedFilter, setSelectedFilter] =
    useState<RouteFilterOption>("__all__");
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

  return (
    <div ref={cardRef} className={styles.cardRoot}>
      <DashboardCard
        className={styles.card}
        title={t("dispatcherArea.routes.table.title")}
        headerRef={headerRef}
        headerAction={
          <TicketSortDropdown
            ariaLabel={t("dispatcherArea.routes.table.sort")}
            defaultLabel={t("dispatcherArea.routes.table.filters.all")}
            options={filterOptions}
            value={selectedFilter}
            onChange={(value) => {
              setPage(1);
              setSelectedFilter(value);
              setFilteredRows(
                value === "__all__"
                  ? rows
                  : rows.filter((row) => row.status === value),
              );
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
                {paginatedRows.map((row, index) => {
                  const status = rowStatuses[row.id] ?? "SCHEDULED";

                  return (
                    <DashboardTr
                      key={row.id}
                      ref={index === 0 ? firstRowRef : undefined}
                    >
                      <td className={dashboardTableStyles.tdNum}>
                        {(page - 1) * rowsPerPage + index + 1}
                      </td>
                      <td
                        className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft}`}
                      >
                        {row.direction}
                      </td>
                      <td className={dashboardTableStyles.td}>
                        {row.departureTime && row.arrivalTime
                          ? `${row.departureTime} - ${row.arrivalTime}`
                          : "Ã¢â‚¬â€"}
                      </td>
                      <td className={dashboardTableStyles.td}>
                        {row.busNumber ?? "Ã¢â‚¬â€"}
                      </td>
                      <td className={dashboardTableStyles.td}>
                        {row.availableSeats != null && row.totalSeats != null
                          ? `${row.availableSeats}/${row.totalSeats}`
                          : "Ã¢â‚¬â€"}
                      </td>
                      <td className={dashboardTableStyles.tdStatus}>
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
                          onStatusChange={handleStatusChange}
                          onEdit={onEditRoute ?? (() => {})}
                        />
                      </td>
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
