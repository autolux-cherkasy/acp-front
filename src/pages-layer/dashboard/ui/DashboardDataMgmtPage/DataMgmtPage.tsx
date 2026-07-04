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
import { useDataMgmtModals } from "./useDataMgmtModals";
import {
  useAdminCafeQuery,
  useCafeItemUpdateMutation,
} from "@/src/entities/dashboard/api/dashboardCafeQueries";
import { useAdminStaffQuery } from "@/src/entities/dashboard/api/dashboardStaffQueries";
import { useAdminFleetQuery } from "@/src/entities/dashboard/api/dashboardFleetQueries";
import { useAdminScheduleQuery } from "@/src/entities/dashboard/api/dashboardScheduleQueries";
import { usePermissionsQuery } from "@/src/entities/dashboard/api/useSettingsQueries";
import { useAuthSession } from "@/src/features/auth";
import { formatLicenseDate, formatPhone } from "@/src/shared/lib/formatters";

const DataMgmtPage = () => {
  const [tab, setTab] = useState("routes");
  const { t } = useI18n();
  const { role } = useAuthSession();
  const [sections, setSections] = useState(MOCK_DATA_BY_TAB.routes.sections);
  const { data: cafeData, isLoading: isCafeLoading } = useAdminCafeQuery({
    enabled: tab === "cafe",
  });
  const { data: staffData, isLoading: isStaffLoading } = useAdminStaffQuery({
    enabled: tab === "staff" || tab === "fleet",
  });
  const { data: fleetData, isLoading: isFleetLoading } = useAdminFleetQuery({
    enabled: tab === "fleet",
  });
  const { data: scheduleData, isLoading: isScheduleLoading } = useAdminScheduleQuery({
    enabled: tab === "routes",
  });
  const { data: permissions } = usePermissionsQuery();
  const cafeItemAvailMutation = useCafeItemUpdateMutation({ enabled: tab === "cafe" });
  const { openSectionModal, openRowModal, closeModals, driverOptions, updateBusDriver, modalElement } =
    useDataMgmtModals({
      tab,
      sections,
      fleetData,
      staffData,
    });

  const cafeSections: DataSection[] = cafeData
    ? cafeData.map((section) => ({
        id: section.id,
        title: section.name,
        imageUrl: section.imageUrl ?? undefined,
        subSections: section.categories.map((category) => ({
          groupLabel: category.name,
          columns: ["Назва", "Наявність", "Ціна"],
          ids: category.items.map((item) => item.id),
          rows: category.items.map((item) => [item.name, item.isAvailable, `${item.price} ₴`]),
        })),
      }))
    : [];

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

  const fleetSections: DataSection[] = [
    {
      id: "buses",
      title: "Автобус",
      rows:
        fleetData?.map((bus) => [
          bus.model,
          String(bus.seatsCount),
          bus.registrationNumber,
          { type: "select" as const, value: bus.driverId ?? "", options: driverOptions },
        ]) ?? [],
    },
  ];

  const routesSections: DataSection[] =
    scheduleData?.map((route) => ({
      id: route.id,
      title: route.name,
      rows: route.schedules.map((s) => [
        s.direction,
        s.departureTime,
        s.arrivalTime,
        `${s.price} ₴`,
      ]),
    })) ?? [];

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
    closeModals();
  };

  useEffect(() => {
    const set = (s: DataSection[]) => {
      setSections(s);
    };
    if (tab === "routes") {
      set(routesSections);
    } else if (tab === "fleet") {
      set(fleetSections);
    } else if (tab === "staff") {
      set(staffSections);
    } else if (tab === "cafe") {
      set(cafeSections);
    } else {
      set(MOCK_DATA_BY_TAB[tab]?.sections ?? []);
    }
  }, [tab, scheduleData, fleetData, staffData, cafeData]);

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
                  ? () => openSectionModal({ mode: "create" })
                  : undefined
              }
              variant="secondary"
              text={t(`dispatcherArea.dataMgmt.actions.${tab}`)}
            ></Button>
          )
        }
      >
        <div className={styles.sections}>
          {(tab === "cafe" && isCafeLoading) || (tab === "routes" && isScheduleLoading)
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.sectionSkeleton} />
              ))
            : filtered.map((section: DataSection, index: number) => (
                <div key={`${tab}-${index}`}>
                  <CollapsibleSection
                    section={section}
                    tab={tab}
                    index={index}
                    initialOpenState={tab === "staff" || tab === "fleet" ? true : false}
                    onEditSection={
                      tab === "routes" || tab === "cafe"
                        ? () => openSectionModal({ mode: "edit", sectionIndex: index })
                        : undefined
                    }
                    onAddRow={() => openRowModal({ mode: "create", sectionIndex: index })}
                    onEditRow={(rowIndex) =>
                      openRowModal({ mode: "edit", sectionIndex: index, rowIndex })
                    }
                    onToggleSubCell={(id, value) =>
                      cafeItemAvailMutation.mutate({ id, body: { isAvailable: value } })
                    }
                    onSelectCell={
                      tab === "fleet"
                        ? (rowIndex, value) => {
                            const bus = fleetData?.[rowIndex];
                            if (bus) updateBusDriver(bus.id, value);
                          }
                        : undefined
                    }
                    isLoading={tab === "staff" ? isStaffLoading : tab === "fleet" ? isFleetLoading : undefined}
                  />
                </div>
              ))}
        </div>
      </DashboardCard>
      {modalElement}
    </div>
  );
};

export default DataMgmtPage;
