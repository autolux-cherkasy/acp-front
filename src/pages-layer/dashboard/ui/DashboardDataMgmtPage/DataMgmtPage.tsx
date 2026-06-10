"use client";
import { TicketSearchInput } from "@/src/features/search-tickets";
import styles from "./DataMgmtPage.module.css";
import TabSwitch from "@/src/shared/ui/TabSwitch/TabSwitch";
import { useEffect, useState } from "react";
import { Button, DashboardCard, DashboardDateText, useI18n } from "@/src/shared";
import MiniCalendarTrigger from "@/src/widgets/MiniCalendar/MiniCalendarTrigger";
import { DataSection, MOCK_DATA_BY_TAB } from "./mockData";
import { useSearch } from "@/src/shared/lib/useSearch";
import DataTable from "@/src/shared/ui/DataTable/DataTable";
import ChevronIcon from "@/src/shared/ui/ChevronIcon/ChevronIcon";

type CollapsiblesectionProps = {
  section: DataSection;
  tab: string;
  index: number;
};
const Collapsiblesection = ({ section, tab }: CollapsiblesectionProps) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <div>
        <div className={styles.section} onClick={handleToggle}>
          {section.title}
          <ChevronIcon open={open} className={styles.chevron} />
        </div>
        {open && (
          <DataTable
            rows={section.rows ?? []}
            columns={section.columns ?? []}
            onAdd={() => {}}
            onEdit={() => {}}
          />
        )}
      </div>
    </>
  );
};
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
        title={tabs.find((i) => i.value === tab)?.label}
        classNameHeader={styles.tableHeader}
        headerAction={
          tabs.find((i) => i.value === tab)?.hasHeaderAction && (
            <Button
              fullWidth={false}
              variant="secondary"
              text={t(`dispatcherArea.dataMgmt.actions.${tab}`)}
            ></Button>
          )
        }
      >
        <div className={styles.sections}>
          {filtered.map((section: DataSection, index: number) => (
            <div key={`${tab}-${index}`}>
              <Collapsiblesection section={section} tab={tab} index={index} />
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export default DataMgmtPage;
