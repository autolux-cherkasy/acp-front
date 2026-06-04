"use client";

import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import NoShowReport from "@/src/widgets/AdminComp/ui/NoShowReport/NoShowReport";
import PopularRoutesCard from "@/src/widgets/AdminComp/ui/PopularRoutes/PopularRoutesCard";
import pageStyles from "./AnalyticsPage.module.css";
import styles from "./analytics.module.css";

const LoadChart = dynamic(
  () => import("@/src/widgets/AdminComp/ui/LoadChart/LoadChart"),
  { ssr: false },
);
const FinanceCard = dynamic(
  () => import("@/src/widgets/AdminComp/ui/FinanceCard/FinanceCard"),
  { ssr: false },
);
export default function AnalyticsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={`${styles.mainContainer} ${pageStyles.pageRoot}`}>
      <DashboardPageHeader
        title={t("dispatcherArea.sidebar.menu.analytics")}
        subtitle={t("dispatcherArea.analytics.subtitle")}
        action={{
          text: t("dispatcherArea.analytics.allRoutes"),
          onClick: () => router.push(`${pathname}/all`),
        }}
      />
      <div className={styles.grid}>
        <NoShowReport />
        <FinanceCard />
        <LoadChart />
        <PopularRoutesCard />
      </div>
    </div>
  );
}
