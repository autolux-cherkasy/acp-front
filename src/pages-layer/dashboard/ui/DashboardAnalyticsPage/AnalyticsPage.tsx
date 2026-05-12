"use client";

import dynamic from "next/dynamic";
import AnalyticsPageHeader from "@/src/widgets/AdminComp/ui/Header/AnalyticsPageHeader";
import NoShowReport from "@/src/widgets/AdminComp/ui/NoShowReport/NoShowReport";
import PopularRoutesCard from "@/src/widgets/AdminComp/ui/PopularRoutes/PopularRoutesCard";
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
  return (
    <div className={styles.mainContainer}>
      <AnalyticsPageHeader />
      <div className={styles.grid}>
        <NoShowReport />
        <FinanceCard />
        <LoadChart />
        <PopularRoutesCard />
      </div>
    </div>
  );
}
