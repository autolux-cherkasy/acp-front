"use client";

import { useI18n } from "@/src/shared/i18n/I18nProvider";
import Button from "@/src/shared/ui/Button/Button";
import { DashboardDateText, SharedLabel } from "@/src/shared";
import styles from "./admin-routes-page.module.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function AnalyticsPageHeader() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.titleContainer}>
        <SharedLabel variant="dashboardHeaderTitle">
          {t("dispatcherArea.sidebar.menu.analytics")}
        </SharedLabel>
        <SharedLabel variant="dashboardHeaderSubtitle">
          {t("dispatcherArea.analytics.subtitle")}
        </SharedLabel>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          text={t("dispatcherArea.analytics.allRoutes")}
          onClick={() => {
            router.push(`${pathname}/all`);
          }}
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
