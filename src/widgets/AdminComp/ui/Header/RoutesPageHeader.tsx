"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import { DashboardDateText, SharedLabel } from "@/src/shared";
import styles from "./admin-routes-page.module.css";

type RoutesPageHeaderProps = {
  onAddRoute: () => void;
};

export default function RoutesPageHeader({ onAddRoute }: RoutesPageHeaderProps) {
  const { t } = useI18n();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleContainer}>
        <SharedLabel variant="dashboardHeaderTitle">
          {t("dispatcherArea.sidebar.menu.routes")}
        </SharedLabel>
        <SharedLabel variant="dashboardHeaderSubtitle">
          {t("dispatcherArea.routes.subtitle")}
        </SharedLabel>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          text={t("dispatcherArea.routes.addRoute")}
          onClick={onAddRoute}
          variant="secondary"
          fullWidth={false}
        />
      </div>

      <div className={styles.dateContainer}>
        <DashboardDateText />
      </div>
    </div>
  );
}
