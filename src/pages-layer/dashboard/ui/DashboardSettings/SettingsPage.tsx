"use client";

import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import styles from "./SettingsPage.module.css";
import { DashboardCard, useI18n } from "@/src/shared";

const DashboardSettingsPage = () => {
  const { t } = useI18n();
  return (
    <>
      <DashboardPageHeader title={t(`dispatcherArea.sidebar.menu.settings`)} />

      <div className={styles.infoContainer}>
        <DashboardCard className={styles.card}></DashboardCard>
      </div>
    </>
  );
};

export default DashboardSettingsPage;
