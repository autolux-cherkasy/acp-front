"use client";

import HandleRoutesModal from "@/src/features/admin-modals/HandleRoutesModal/HandleRoutesModal";
import type { SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import RoutesPageHeader from "@/src/widgets/AdminComp/ui/Header/RoutesPageHeader";
import RoutesStats from "@/src/widgets/AdminComp/ui/Header/RoutesStats";
import RoutesTable from "@/src/widgets/AdminComp/ui/RoutesTable";
import type { RouteRow } from "@/src/widgets/AdminComp/model/types";
import type { RoutesStatsProps } from "@/src/widgets/AdminComp/model/types";

type RouteFormState = {
  direction: string;
  departureTime: string;
  vehicle: string;
  seats: string;
  status: string;
};

type ModalPayload =
  | { mode: "create" }
  | { mode: "edit"; initialData: Partial<RouteFormState> };

const MOCK_VEHICLE_OPTIONS: SelectOption[] = [
  { value: "СА 5374 СО", label: "СА 5374 СО" },
  { value: "СА 1234 АА", label: "СА 1234 АА" },
  { value: "СА 9876 ВВ", label: "СА 9876 ВВ" },
];

function rowToFormState(row: RouteRow): Partial<RouteFormState> {
  return {
    direction: row.direction,
    departureTime: row.departureTime ?? "",
    vehicle: row.busNumber ?? "",
    seats:
      row.availableSeats != null && row.totalSeats != null
        ? `${row.availableSeats}/${row.totalSeats}`
        : "",
    status: row.status ?? "",
  };
}

type RoutesPageClientProps = {
  rows: RouteRow[];
  stats: RoutesStatsProps;
};

export default function RoutesPageClient({ rows, stats }: RoutesPageClientProps) {
  const { t } = useI18n();
  const disclosure = useDisclosure<ModalPayload>();

  const statusOptions: SelectOption[] = [
    { value: "SCHEDULED", label: t("dispatcherArea.routes.table.statuses.SCHEDULED") },
    { value: "BOARDING", label: t("dispatcherArea.routes.table.statuses.BOARDING") },
    { value: "DEPARTED", label: t("dispatcherArea.routes.table.statuses.DEPARTED") },
    { value: "CANCELLED", label: t("dispatcherArea.routes.table.statuses.CANCELLED") },
  ];

  return (
    <>
      <RoutesPageHeader onAddRoute={() => disclosure.open({ mode: "create" })} />
      <RoutesStats {...stats} />
      <RoutesTable
        rows={rows}
        onEditRoute={(id) => {
          const row = rows.find((r) => r.id === id);
          if (row) {
            disclosure.open({ mode: "edit", initialData: rowToFormState(row) });
          }
        }}
      />
      {disclosure.isOpen && disclosure.data && (
        <HandleRoutesModal
          mode={disclosure.data.mode}
          initialData={
            disclosure.data.mode === "edit" ? disclosure.data.initialData : undefined
          }
          onClose={disclosure.close}
          onSubmit={(data) => {
            console.log("submit", data);
            disclosure.close();
          }}
          onDelete={
            disclosure.data.mode === "edit"
              ? () => {
                  console.log("delete");
                  disclosure.close();
                }
              : undefined
          }
          vehicleOptions={MOCK_VEHICLE_OPTIONS}
          statusOptions={statusOptions}
        />
      )}
    </>
  );
}
