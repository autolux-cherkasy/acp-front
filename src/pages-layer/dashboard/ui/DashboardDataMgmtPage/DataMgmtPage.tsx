"use client";
import { TicketSearchInput } from "@/src/features/search-tickets";
import { Button, DashboardCard, DashboardDateText, useI18n } from "@/src/shared";
import { useSearch } from "@/src/shared/lib/useSearch";
import TabSwitch from "@/src/shared/ui/TabSwitch/TabSwitch";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";
import { useEffect, useState } from "react";
import styles from "./DataMgmtPage.module.css";
import { DataSection, MOCK_DATA_BY_TAB } from "./mockData";
import CollapsibleSection from "./CollapsibleSection";

const DataMgmtPage = () => {
  const [tab, setTab] = useState("routes");
  const { t } = useI18n();
  const [sections, setSections] = useState(MOCK_DATA_BY_TAB.routes.sections);

  const { query, setQuery, filtered } = useSearch(sections, (section, q) => {
    const lq = q.toLowerCase();

    if (section.title.toLowerCase().includes(lq)) return true;

    return (
      section.rows?.some((row) => row.some((cell) => cell.toLowerCase().includes(lq))) ?? false
    );
  });

  const handleTabChange = (value: string) => {
    setTab(value);
    setQuery("");
  };

  useEffect(() => {
    const set = () => {
      setSections(MOCK_DATA_BY_TAB[tab].sections);
    };
    set();
  }, [tab]);

  const tabs = [
    {
      value: "routes",
      label: t("dispatcherArea.settingsCards.dataAccess.items.routes"),
      hasHeaderAction: true,
    },
    {
      value: "fleet",
      label: t("dispatcherArea.settingsCards.dataAccess.items.fleet"),
      hasHeaderAction: false,
    },
    {
      value: "staff",
      label: t("dispatcherArea.settingsCards.dataAccess.items.staff"),
      hasHeaderAction: false,
    },
    {
      value: "cafe",
      label: t("dispatcherArea.settingsCards.dataAccess.items.cafe"),
      hasHeaderAction: true,
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <TabSwitch tabs={tabs} value={tab} onChange={handleTabChange} />
        <TicketSearchInput
          onChange={setQuery}
          value={query}
          placeholder={t("common.search.placeholder")}
        />
        <div className={styles.dateContainer}>
          <DashboardDateText chosenDate={new Date()} />
        </div>
        <MiniCalendarTrigger />
      </div>

      <DashboardCard
        className={styles.card}
        title={tabs.find((i) => i.value === tab)?.label}
        classNameHeader={styles.tableHeader}
        headerAction={
          tabs.find((i) => i.value === tab)?.hasHeaderAction && (
            <Button
              size="fit"
              variant="secondary"
              text={t(`dispatcherArea.dataMgmt.actions.${tab}`)}
            ></Button>
          )
        }
      >
        <div className={styles.sections}>
          {filtered.map((section: DataSection, index: number) => (
            <div key={`${tab}-${index}`}>
              <CollapsibleSection section={section} tab={tab} index={index} />
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default DataMgmtPage;
