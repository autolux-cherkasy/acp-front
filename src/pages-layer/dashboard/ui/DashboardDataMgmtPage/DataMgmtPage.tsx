"use client";
import { TicketSearchInput } from "@/src/features/search-tickets";
import styles from "./DataMgmtPage.module.css";
import TabSwitch from "@/src/shared/ui/TabSwitch/TabSwitch";
import { useState } from "react";
import { DashboardDateText, useI18n } from "@/src/shared";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";

const DataMgmtPage = () => {
  const [tab, setTab] = useState("routes");
  const { t } = useI18n();

  const tabs = [
    { value: "routes", label: t("dispatcherArea.settingsCards.dataAccess.items.routes") },
    { value: "cafe", label: t("dispatcherArea.settingsCards.dataAccess.items.cafe") },
    { value: "fleet", label: t("dispatcherArea.settingsCards.dataAccess.items.fleet") },
    { value: "staff", label: t("dispatcherArea.settingsCards.dataAccess.items.staff") },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <TabSwitch
          tabs={tabs}
          value={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
        <TicketSearchInput
          onChange={() => {}}
          value=""
          placeholder={t("common.search.placeholder")}
        />
        <div className={styles.dateContainer}>
          <DashboardDateText chosenDate={new Date()} />
        </div>
        <MiniCalendarTrigger />
      </div>
    </div>
  );
};

export default DataMgmtPage;
