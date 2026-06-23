"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import {
  DashboardCard,
  DashboardTable,
  DashboardThead,
  DashboardTr,
  EmptyState,
} from "@/src/shared";
import styles from "./PopularRoutesCard.module.css";

type RouteEntry = {
  id: number;
  route: string;
  tickets: number;
};

type Props = { routes?: RouteEntry[] };

export default function PopularRoutesCard({ routes }: Props) {
  const { t } = useI18n();
  const hasRoutes = Array.isArray(routes) && routes.length > 0;

  return (
    <DashboardCard
      className={styles.card}
      title={t("dispatcherArea.analytics.popularRoutes.title")}
      subtitle={t("dispatcherArea.analytics.popularRoutes.subtitle")}
    >
      {hasRoutes ? (
        <div className={styles.tableWrapper}>
          <DashboardTable className={styles.table}>
            <DashboardThead className={styles.theadRow}>
              <th className={styles.thNum}>
                {t("dispatcherArea.analytics.popularRoutes.columns.number")}
              </th>
              <th className={styles.th}>
                {t("dispatcherArea.analytics.popularRoutes.columns.route")}
              </th>
              <th className={styles.thTickets}>
                {t("dispatcherArea.analytics.popularRoutes.columns.tickets")}
              </th>
            </DashboardThead>
            <tbody>
              {routes.map((entry, index) => (
                <DashboardTr key={entry.id} className={styles.row}>
                  <td className={styles.tdNum}>{index + 1}</td>
                  <td className={`${styles.td} ${styles.tdLeft}`}>{entry.route}</td>
                  <td className={styles.tdTickets}>{entry.tickets}</td>
                </DashboardTr>
              ))}
            </tbody>
          </DashboardTable>
        </div>
      ) : (
        <EmptyState iconUrl="/icons/workspace/sidebar/routes.svg" />
      )}
    </DashboardCard>
  );
}
