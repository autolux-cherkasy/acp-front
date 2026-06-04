"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import {
  DashboardCard,
  DashboardTable,
  DashboardThead,
  DashboardTr,
} from "@/src/shared";
import styles from "./PopularRoutesCard.module.css";

type RouteEntry = {
  id: number;
  route: string;
  tickets: number;
};

const MOCK_ROUTES: RouteEntry[] = [
  { id: 1, route: "м.Черкаси - м.Київ (ст.м.Харківська)", tickets: 240 },
  { id: 2, route: "м.Черкаси - м.Київ (ст.м.Харківська)", tickets: 180 },
  { id: 3, route: "м.Золотоноша - м.Київ", tickets: 80 },
  { id: 4, route: "м.Черкаси - м.Полтава", tickets: 65 },
  { id: 5, route: "м.Черкаси - м.Дніпро", tickets: 55 },
  { id: 6, route: "м.Черкаси - м.Харків", tickets: 40 },
  { id: 7, route: "м.Черкаси - м.Одеса", tickets: 32 },
];

type Props = { routes?: RouteEntry[] };

export default function PopularRoutesCard({ routes = MOCK_ROUTES }: Props) {
  const { t } = useI18n();

  return (
    <DashboardCard
      className={styles.card}
      title={t("dispatcherArea.analytics.popularRoutes.title")}
      subtitle={t("dispatcherArea.analytics.popularRoutes.subtitle")}
    >
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
                <td className={`${styles.td} ${styles.tdLeft}`}>
                  {entry.route}
                </td>
                <td className={styles.tdTickets}>{entry.tickets}</td>
              </DashboardTr>
            ))}
          </tbody>
        </DashboardTable>
      </div>
    </DashboardCard>
  );
}
