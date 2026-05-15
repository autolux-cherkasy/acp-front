"use client";

import { useState } from "react";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import {
  DashboardCard,
  DashboardTable,
  DashboardThead,
  SharedLabel,
  DashboardTr,
} from "@/src/shared";
import styles from "./NoShowReport.module.css";

type NoShowRow = {
  id: number;
  name: string;
  phone: string;
  ratio: string;
};

const MOCK_ROWS: NoShowRow[] = [
  {
    id: 1,
    name: "Денисенко Сергій",
    phone: "+380675494578",
    ratio: "8/6",
  },
  {
    id: 3,
    name: "Сисоева Інна",
    phone: "+380675494578",
    ratio: "12/7",
  },
  {
    id: 4,
    name: "Трайтак Ігор",
    phone: "+380675494578",
    ratio: "14/12",
  },
  {
    id: 5,
    name: "Юнак Людмила",
    phone: "+380675494578",
    ratio: "17/6",
  },
  {
    id: 6,
    name: "Науменко Ольга",
    phone: "+380675494578",
    ratio: "19/12",
  },
  {
    id: 7,
    name: "Ковтун Максим",
    phone: "+380675494578",
    ratio: "12/6",
  },
];

type Props = { rows?: NoShowRow[] };

export default function NoShowReport({ rows = MOCK_ROWS }: Props) {
  const { t } = useI18n();
  const [blocked, setBlocked] = useState<Set<number>>(new Set());
  const visibleRows = rows.filter((row) => !blocked.has(row.id));

  function block(id: number) {
    setBlocked((prev) => new Set(prev).add(id));
  }

  return (
    <DashboardCard className={styles.card}>
      <div className={styles.header}>
        <SharedLabel variant="dashboardCardTitle">
          {t("dispatcherArea.analytics.noShowReport.title")}
        </SharedLabel>
        <SharedLabel variant="dashboardCardSubtitle">
          {t("dispatcherArea.analytics.noShowReport.subtitle")}
        </SharedLabel>
      </div>

      {visibleRows.length === 0 ? (
        <div className={styles.emptyState} aria-live="polite">
          <div className={styles.emptyCard}>
            <div className={styles.icon} aria-hidden="true" />
            <p className={styles.emptyTitle}>
              {t("dispatcherArea.analytics.noShowReport.empty.title")}
            </p>
            <p className={styles.emptyText}>
              {t("dispatcherArea.analytics.noShowReport.empty.description")}
            </p>
            <p className={styles.emptyText}>
              {t("dispatcherArea.analytics.noShowReport.empty.note")}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <DashboardTable className={styles.table}>
            <colgroup>
              <col className={styles.colNum} />
              <col className={styles.colName} />
              <col className={styles.colPhone} />
              <col className={styles.colRatio} />
              <col className={styles.colAction} />
            </colgroup>
            <DashboardThead className={styles.theadRow}>
              <th className={styles.thNum}>
                {t("dispatcherArea.analytics.noShowReport.columns.number")}
              </th>
              <th className={styles.th}>
                {t("dispatcherArea.analytics.noShowReport.columns.passenger")}
              </th>
              <th className={styles.th}>
                {t("dispatcherArea.analytics.noShowReport.columns.phone")}
              </th>
              <th className={styles.thRatio}>
                {t("dispatcherArea.analytics.noShowReport.columns.ratio")}
              </th>
              <th className={styles.thAction} />
            </DashboardThead>
            <tbody>
              {visibleRows.map((row, index) => (
                <DashboardTr key={row.id} className={styles.row}>
                  <td className={styles.tdNum}>{index + 1}</td>
                  <td className={`${styles.td} ${styles.tdLeft} ${styles.tdName}`}>
                    {row.name}
                  </td>
                  <td className={`${styles.td} ${styles.tdLeft} ${styles.tdPhone}`}>
                    {row.phone}
                  </td>
                  <td className={styles.td}>{row.ratio}</td>
                  <td className={styles.tdAction}>
                    <button
                      type="button"
                      className={styles.blockBtn}
                      onClick={() => block(row.id)}
                    >
                      {t("dispatcherArea.analytics.noShowReport.blockBtn")}
                    </button>
                  </td>
                </DashboardTr>
              ))}
            </tbody>
          </DashboardTable>
        </div>
      )}
    </DashboardCard>
  );
}
