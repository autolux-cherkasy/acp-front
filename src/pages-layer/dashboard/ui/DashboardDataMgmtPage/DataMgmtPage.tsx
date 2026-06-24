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
import { useAdminCafeQuery } from "@/src/entities/dashboard/api/dashboardCafeQueries";
import { useAdminStaffQuery } from "@/src/entities/dashboard/api/dashboardStaffQueries";
import { usePermissionsQuery } from "@/src/entities/dashboard/api/useSettingsQueries";
import { useAuthSession } from "@/src/features/auth";
import { formatPhone } from "@/src/shared/lib/formatters";

const DataMgmtPage = () => {
  const [tab, setTab] = useState("routes");
  const { t } = useI18n();
  const { role } = useAuthSession();
  const [sections, setSections] = useState(MOCK_DATA_BY_TAB.routes.sections);
  const sectionModal = useDisclosure<{ mode: "create" } | { mode: "edit"; sectionIndex: number }>();
  const categoryOptions = sections.map((s) => ({ value: s.title, label: s.title }));
  const rowModal = useDisclosure<
    | { mode: "create"; sectionIndex: number }
    | { mode: "edit"; sectionIndex: number; rowIndex: number }
  >();
  const { data: cafeData } = useAdminCafeQuery({
    enabled: tab === "cafe",
  });
  const { data: staffData } = useAdminStaffQuery({
    enabled: tab === "staff",
  });
  const { data: permissions } = usePermissionsQuery();

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
  const cafeSections: DataSection[] = cafeData
    ? cafeData.map((section) => ({
        id: section.id,
        title: section.name,
        imageUrl: section.imageUrl ?? undefined,
        subSections: section.categories.map((category) => ({
          groupLabel: category.name,
          columns: ["Назва", "Наявність", "Ціна"],
          rows: category.items.map((item) => [item.name, item.isAvailable, `${item.price} ₴`]),
        })),
      }))
    : [];

  const formatLicenseDate = (date: string) => {
    const stripped = date.replace(/^До\s+/, "");
    const iso = stripped.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return iso ? `${iso[3]}.${iso[2]}.${iso[1]}` : stripped;
  };

  const formatCategory = (cat: string) => (cat.startsWith("Категорія") ? cat : `Категорія ${cat}`);

  const staffSections: DataSection[] = [
    {
      id: "dispatchers",
      title: "Диспетчери",
      rows: staffData?.dispatchers.map((d) => [d.name ?? "", d.email, formatPhone(d.phone)]) ?? [],
    },
    {
      id: "drivers",
      title: "Водії",
      rows:
        staffData?.drivers.map((d) => [
          d.fullName ?? "",
          formatLicenseDate(d.licenseValidUntil),
          formatCategory(d.licenseCategories),
          formatPhone(d.phone),
        ]) ?? [],
    },
  ];

  const allTabs = [
    {
      value: "routes",
      label: t("dispatcherArea.settingsCards.dataAccess.items.routes"),
      hasHeaderAction: true,
      permissionKey: "canAccessRoutes" as const,
    },
    {
      value: "fleet",
      label: t("dispatcherArea.settingsCards.dataAccess.items.fleet"),
      hasHeaderAction: false,
      permissionKey: "canAccessFleet" as const,
    },
    {
      value: "staff",
      label: t("dispatcherArea.settingsCards.dataAccess.items.staff"),
      hasHeaderAction: false,
      permissionKey: "canAccessStaff" as const,
    },
    {
      value: "cafe",
      label: t("dispatcherArea.settingsCards.dataAccess.items.cafe"),
      hasHeaderAction: true,
      permissionKey: "canAccessCafe" as const,
    },
  ];

  const tabs =
    role === "DISPATCHER" && permissions
      ? allTabs.filter((tabDef) => permissions[tabDef.permissionKey])
      : allTabs;

  const { query, setQuery, filtered } = useSearch(sections, (section, q) => {
    const lq = q.toLowerCase();

    if (section.title.toLowerCase().includes(lq)) return true;

    return (
      section.rows?.some((row) =>
        row.some((cell) => typeof cell === "string" && cell.toLowerCase().includes(lq)),
      ) ?? false
    );
  });

  const handleTabChange = (value: string) => {
    setTab(value);
    setQuery("");
  };

  useEffect(() => {
    const set = (s: DataSection[]) => {
      setSections(s);
    };
    if (tab === "staff") {
      set(staffSections);
    } else if (tab === "cafe") {
      set(cafeSections);
    } else {
      set(MOCK_DATA_BY_TAB[tab]?.sections ?? []);
    }
  }, [tab, staffData, cafeData]);

  useEffect(() => {
    const setT = (v: string) => setTab(v);
    if (tabs.length > 0 && !tabs.find((tabDef) => tabDef.value === tab)) {
      setT(tabs[0].value);
      setQuery("");
    }
  }, [permissions]);

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
                onToggleSubCell={(subIdx, rowIdx, cellIdx, value) =>
                  setSections((prev) =>
                    prev.map((s, si) =>
                      si !== index
                        ? s
                        : {
                            ...s,
                            subSections: s.subSections?.map((sub, subi) =>
                              subi !== subIdx
                                ? sub
                                : {
                                    ...sub,
                                    rows: sub.rows.map((row, ri) =>
                                      ri !== rowIdx
                                        ? row
                                        : row.map((cell, ci) => (ci === cellIdx ? value : cell)),
                                    ),
                                  },
                            ),
                          },
                    ),
                  )
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
          showImage={tab === "cafe"}
          initialData={
            sectionModal.data!.mode === "edit"
              ? {
                  name: sections[sectionModal.data!.sectionIndex].title,
                  imageUrl: sections[sectionModal.data!.sectionIndex].imageUrl,
                }
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
              ? {
                  place: (() => {
                    const val =
                      sections[rowModal.data!.sectionIndex].rows?.[rowModal.data!.rowIndex]?.[0];
                    return typeof val === "string" ? val : val == null ? undefined : String(val);
                  })(),
                }
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
              ? sections[rowModal.data!.sectionIndex].rows?.[rowModal.data!.rowIndex]?.filter(
                  (cell): cell is string => typeof cell === "string",
                )
              : undefined
          }
        />
      )}{" "}
    </div>
  );
};

export default DataMgmtPage;
