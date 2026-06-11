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
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import RouteModal from "@/src/features/admin-modals/RouteModal/RouteModal";
import DirectionModal from "@/src/features/admin-modals/DirectionModal/DirectionModal";
import CafeDishModal from "@/src/features/admin-modals/CafeDishModal/CafeDishModal";

const DataMgmtPage = () => {
  const [tab, setTab] = useState("routes");
  const { t } = useI18n();
  const [sections, setSections] = useState(MOCK_DATA_BY_TAB.routes.sections);
  const sectionModal = useDisclosure<{ mode: "create" } | { mode: "edit"; sectionIndex: number }>();
  const categoryOptions = sections.map((s) => ({ value: s.title, label: s.title }));
  const rowModal = useDisclosure<
    | { mode: "create"; sectionIndex: number }
    | { mode: "edit"; sectionIndex: number; rowIndex: number }
  >();

  const sectionModalByTab: Partial<
    Record<
      string,
      {
        icon?: string;
        titles?: { create: string; edit: string };
        labels?: { create: string; edit: string };
        placeholder?: string;
      }
    >
  > = {
    routes: {},
    cafe: {
      icon: "/icons/cafe/coffee-cup.svg",
      titles: {
        create: t("dispatcherArea.dataMgmt.cafeCategoryModal.newTitle"),
        edit: t("dispatcherArea.dataMgmt.cafeCategoryModal.editTitle"),
      },
      labels: {
        create: t("dispatcherArea.dataMgmt.cafeCategoryModal.label"),
        edit: t("dispatcherArea.dataMgmt.cafeCategoryModal.label"),
      },
      placeholder: t("dispatcherArea.dataMgmt.cafeCategoryModal.placeholder"),
    },
  };
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
              onClick={
                tab === "routes" || tab === "cafe"
                  ? () => sectionModal.open({ mode: "create" })
                  : undefined
              }
              variant="secondary"
              text={t(`dispatcherArea.dataMgmt.actions.${tab}`)}
            ></Button>
          )
        }
      >
        <div className={styles.sections}>
          {filtered.map((section: DataSection, index: number) => (
            <div key={`${tab}-${index}`}>
              <CollapsibleSection
                section={section}
                tab={tab}
                index={index}
                initialOpenState={tab === "staff" || tab === "fleet" ? true : false}
                onEditSection={
                  tab === "routes" || tab === "cafe"
                    ? () => sectionModal.open({ mode: "edit", sectionIndex: index })
                    : undefined
                }
                onAddRow={() => rowModal.open({ mode: "create", sectionIndex: index })}
                onEditRow={(rowIndex) =>
                  rowModal.open({ mode: "edit", sectionIndex: index, rowIndex })
                }
              />
            </div>
          ))}
        </div>
      </DashboardCard>
      {sectionModal.isOpen && sectionModalByTab[tab] !== undefined && (
        <RouteModal
          mode={sectionModal.data!.mode}
          onClose={sectionModal.close}
          onSubmit={sectionModal.close}
          initialData={
            sectionModal.data!.mode === "edit"
              ? { name: sections[sectionModal.data!.sectionIndex].title }
              : undefined
          }
          {...sectionModalByTab[tab]}
        />
      )}
      {rowModal.isOpen && tab === "routes" && (
        <DirectionModal
          mode={rowModal.data!.mode}
          onClose={rowModal.close}
          onSubmit={rowModal.close}
          initialData={
            rowModal.data!.mode === "edit"
              ? { place: sections[rowModal.data!.sectionIndex].rows?.[rowModal.data!.rowIndex][0] }
              : undefined
          }
        />
      )}
      {rowModal.isOpen && tab === "cafe" && (
        <CafeDishModal
          mode={rowModal.data!.mode}
          onClose={rowModal.close}
          onSubmit={rowModal.close}
          categoryOptions={categoryOptions}
          initialCategory={
            rowModal.data!.mode === "edit" ? sections[rowModal.data!.sectionIndex].title : undefined
          }
          initialData={
            rowModal.data!.mode === "edit"
              ? sections[rowModal.data!.sectionIndex].rows?.[rowModal.data!.rowIndex]
              : undefined
          }
        />
      )}{" "}
    </div>
  );
};

export default DataMgmtPage;
