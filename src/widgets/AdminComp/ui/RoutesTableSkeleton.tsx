"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { DashboardTr, dashboardTableStyles } from "@/src/shared";
import styles from "./admin-routes-table.module.css";

type RoutesTableSkeletonProps = {
  /** Скільки рядків малювати — стільки ж, скільки вміщує таблиця з даними. */
  rows: number;
};

export default function RoutesTableSkeleton({ rows }: RoutesTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: Math.max(rows, 1) }).map((_, index) => (
        <DashboardTr key={index}>
          <td className={`${dashboardTableStyles.tdNum} ${dashboardTableStyles.tdLeft}`}>
            <Skeleton height={16} width={20} />
          </td>
          <td className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft}`}>
            <Skeleton height={16} width="80%" />
          </td>
          {/* Комірка часу дворядкова: дата, під нею проміжок відправлення. */}
          <td
            className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft} ${styles.timeCell}`}
          >
            <Skeleton height={14} width={72} />
            <Skeleton height={14} width={96} />
          </td>
          <td className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft}`}>
            <Skeleton height={16} width={72} />
          </td>
          <td className={`${dashboardTableStyles.td} ${dashboardTableStyles.tdLeft}`}>
            <Skeleton height={16} width={48} />
          </td>
          <td className={`${dashboardTableStyles.tdStatus} ${dashboardTableStyles.tdLeft}`}>
            <Skeleton height={24} width={96} borderRadius={12} />
          </td>
          <td className={dashboardTableStyles.tdAction}>
            <Skeleton height={24} width={24} circle />
          </td>
        </DashboardTr>
      ))}
    </>
  );
}
