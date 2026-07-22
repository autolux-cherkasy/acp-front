"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { useServerToast } from "@/src/shared/lib/toast";
import DashboardPageHeader from "@/src/widgets/AdminComp/ui/Header/DashboardPageHeader";
import NoShowReport from "@/src/widgets/AdminComp/ui/NoShowReport/NoShowReport";
import PopularRoutesCard from "@/src/widgets/AdminComp/ui/PopularRoutes/PopularRoutesCard";
import {
  useAnalyticsSummaryQuery,
  useBlockUserMutation,
} from "@/src/entities/dashboard/api/useAnalyticsQueries";
import pageStyles from "./AnalyticsPage.module.css";
import styles from "./analytics.module.css";

const LoadChart = dynamic(() => import("@/src/widgets/AdminComp/ui/LoadChart/LoadChart"), {
  ssr: false,
});
const FinanceCard = dynamic(() => import("@/src/widgets/AdminComp/ui/FinanceCard/FinanceCard"), {
  ssr: false,
});

export default function AnalyticsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [date, setDate] = useState<string | undefined>(undefined);

  const { data: summary, isLoading } = useAnalyticsSummaryQuery(date);
  const blockMutation = useBlockUserMutation();
  const { notifySuccess, notifyError } = useServerToast();

  useEffect(() => {
    router.prefetch(`${pathname}/all`);
  }, [router, pathname]);

  const noShowRows = summary?.noShow.map((item) => ({
    id: item.userId,
    name: item.passengerName ?? "",
    phone: item.passengerPhone ?? "",
    ratio: `${item.unpaidBookings}/${item.totalBookings}`,
    isBlocked: item.isBlocked,
  }));

  const popularRoutes = summary?.popularRoutes.map((r, i) => ({
    id: i + 1,
    route: r.direction,
    tickets: r.ticketsCount,
  }));

  function handleCalendarChange(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    setDate(`${yyyy}-${mm}-${dd}`);
  }

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
        <div className={styles.noShowArea}>
          <NoShowReport
            rows={noShowRows}
            isLoading={isLoading}
            onBlockUser={(id) =>
              blockMutation.mutate(
                { userId: id, block: true },
                {
                  onSuccess: (result) => notifySuccess(result, t("common.toast.blockUserSuccess")),
                  onError: (error) => notifyError(error, t("common.toast.blockUserError")),
                },
              )
            }
          />
        </div>
        <div className={styles.financeArea}>
          <FinanceCard data={summary?.finance} isLoading={isLoading} />
        </div>
        <div className={styles.loadArea}>
          <LoadChart data={summary?.load} isLoading={isLoading} />
        </div>
        <div className={styles.popularArea}>
          <PopularRoutesCard routes={popularRoutes} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
