"use client";
import { useI18n } from "@/src/shared";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";
import RouteModal from "@/src/features/admin-modals/RouteModal/RouteModal";
import DirectionModal from "@/src/features/admin-modals/DirectionModal/DirectionModal";
import CafeDishModal from "@/src/features/admin-modals/CafeDishModal/CafeDishModal";
import BusModal from "@/src/features/admin-modals/BusModal/BusModal";
import DriverModal from "@/src/features/admin-modals/DriverModal/DriverModal";
import DispatcherModal from "@/src/features/admin-modals/DispatcherModal/DispatcherModal";
import {
  useAddBusMutation,
  useUpdateBusMutation,
  useDeleteBusMutation,
} from "@/src/entities/dashboard/api/dashboardFleetQueries";
import {
  useAddDriverMutation,
  useUpdateDriverMutation,
  useDeleteDriverMutation,
  useAddDispatcherMutation,
  useUpdateDispatcherMutation,
  useDeleteDispatcherMutation,
} from "@/src/entities/dashboard/api/dashboardStaffQueries";
import { BusResponse } from "@/src/entities/dashboard/api/dashboardBusesApi";
import { AdminStaffResponse } from "@/src/entities/dashboard/api/staffApi";
import { DataSection } from "./mockData";

type SectionModalPayload = { mode: "create" } | { mode: "edit"; sectionIndex: number };
type RowModalPayload =
  | { mode: "create"; sectionIndex: number }
  | { mode: "edit"; sectionIndex: number; rowIndex: number };

type UseDataMgmtModalsParams = {
  tab: string;
  sections: DataSection[];
  fleetData?: BusResponse[];
  staffData?: AdminStaffResponse;
};

type SectionModalConfig = {
  icon?: string;
  titles?: { create: string; edit: string };
  labels?: { create: string; edit: string };
  placeholder?: string;
};

export function useDataMgmtModals({ tab, sections, fleetData, staffData }: UseDataMgmtModalsParams) {
  const { t } = useI18n();
  const sectionModal = useDisclosure<SectionModalPayload>();
  const rowModal = useDisclosure<RowModalPayload>();

  const categoryOptions = sections.map((s) => ({ value: s.title, label: s.title }));
  const driverOptions = staffData?.drivers.map((d) => ({ value: d.id, label: d.fullName })) ?? [];

  const addBusMutation = useAddBusMutation();
  const updateBusMutation = useUpdateBusMutation();
  const deleteBusMutation = useDeleteBusMutation();
  const addDriverMutation = useAddDriverMutation();
  const updateDriverMutation = useUpdateDriverMutation();
  const deleteDriverMutation = useDeleteDriverMutation();
  const addDispatcherMutation = useAddDispatcherMutation();
  const updateDispatcherMutation = useUpdateDispatcherMutation();
  const deleteDispatcherMutation = useDeleteDispatcherMutation();

  const sectionModalByTab: Partial<Record<string, SectionModalConfig>> = {
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

  const closeModals = () => {
    sectionModal.close();
    rowModal.close();
  };

  const renderSectionModal = () => {
    if (!sectionModal.isOpen || sectionModalByTab[tab] === undefined) {
      return null;
    }
    const config = sectionModalByTab[tab]!;
    return (
      <RouteModal
        mode={sectionModal.data!.mode}
        onClose={sectionModal.close}
        onSubmit={sectionModal.close}
        showImage={tab === "cafe"}
        showTwoCities={tab === "routes"}
        initialData={(() => {
          if (sectionModal.data!.mode !== "edit") return undefined;
          const section = sections[sectionModal.data!.sectionIndex];
          if (!section) return undefined;
          if (tab === "routes") {
            const [dep, arr] = section.title.split(" - ");
            return { departureCity: dep ?? "", arrivalCity: arr ?? "" };
          }
          return { name: section.title, imageUrl: section.imageUrl };
        })()}
        {...config}
      />
    );
  };

  const renderRowModal = () => {
    if (!rowModal.isOpen) return null;
    const data = rowModal.data!;

    if (tab === "routes") {
      return (
        <DirectionModal
          mode={data.mode}
          onClose={rowModal.close}
          onSubmit={rowModal.close}
          initialData={(() => {
            if (data.mode !== "edit") return undefined;
            const row = sections[data.sectionIndex]?.rows?.[data.rowIndex];
            if (!row) return undefined;
            const dirStr = typeof row[0] === "string" ? row[0] : "";
            const [dep, arr] = dirStr.split(" - ");
            return {
              departurePlace: dep ?? "",
              arrivalPlace: arr ?? "",
              departureTime: typeof row[1] === "string" ? row[1] : "",
              arrivalTime: typeof row[2] === "string" ? row[2] : "",
              price: typeof row[3] === "string" ? row[3].replace(" ₴", "") : "",
            };
          })()}
        />
      );
    }

    if (tab === "cafe") {
      return (
        <CafeDishModal
          mode={data.mode}
          onClose={rowModal.close}
          onSubmit={rowModal.close}
          categoryOptions={categoryOptions}
          initialCategory={data.mode === "edit" ? sections[data.sectionIndex].title : undefined}
          initialData={
            data.mode === "edit"
              ? sections[data.sectionIndex].rows?.[data.rowIndex]?.filter(
                  (cell): cell is string => typeof cell === "string",
                )
              : undefined
          }
        />
      );
    }

    if (tab === "fleet") {
      const bus = data.mode === "edit" ? fleetData?.[data.rowIndex] : undefined;
      return (
        <BusModal
          mode={data.mode}
          onClose={rowModal.close}
          onSubmit={(formData) => {
            const body = {
              model: formData.model,
              seatsCount: Number(formData.seatsCount),
              registrationNumber: formData.registrationNumber,
              driverId: formData.driverId || undefined,
            };
            if (data.mode === "create") {
              addBusMutation.mutate(body, { onSuccess: closeModals });
            } else if (bus) {
              updateBusMutation.mutate({ id: bus.id, body }, { onSuccess: closeModals });
            }
          }}
          onDelete={
            bus ? () => deleteBusMutation.mutate(bus.id, { onSuccess: closeModals }) : undefined
          }
          driverOptions={driverOptions}
          initialData={
            bus
              ? {
                  model: bus.model,
                  seatsCount: String(bus.seatsCount),
                  registrationNumber: bus.registrationNumber,
                  driverId: bus.driverId ?? "",
                }
              : undefined
          }
        />
      );
    }

    if (tab === "staff") {
      const sectionId = sections[data.sectionIndex]?.id;

      if (sectionId === "drivers") {
        const driver = data.mode === "edit" ? staffData?.drivers[data.rowIndex] : undefined;
        return (
          <DriverModal
            mode={data.mode}
            onClose={rowModal.close}
            onSubmit={(formData) => {
              if (data.mode === "create") {
                addDriverMutation.mutate(formData, { onSuccess: closeModals });
              } else if (driver) {
                updateDriverMutation.mutate({ id: driver.id, body: formData }, { onSuccess: closeModals });
              }
            }}
            onDelete={
              driver
                ? () => deleteDriverMutation.mutate(driver.id, { onSuccess: closeModals })
                : undefined
            }
            initialData={
              driver
                ? {
                    fullName: driver.fullName,
                    phone: driver.phone,
                    licenseValidUntil: driver.licenseValidUntil,
                    licenseCategories: driver.licenseCategories,
                  }
                : undefined
            }
          />
        );
      }

      if (sectionId === "dispatchers") {
        const dispatcher = data.mode === "edit" ? staffData?.dispatchers[data.rowIndex] : undefined;
        return (
          <DispatcherModal
            mode={data.mode}
            onClose={rowModal.close}
            onSubmit={(formData) => {
              if (data.mode === "create") {
                addDispatcherMutation.mutate(formData, { onSuccess: closeModals });
              } else if (dispatcher) {
                updateDispatcherMutation.mutate(
                  { id: dispatcher.id, body: formData },
                  { onSuccess: closeModals },
                );
              }
            }}
            onDelete={
              dispatcher
                ? () => deleteDispatcherMutation.mutate(dispatcher.id, { onSuccess: closeModals })
                : undefined
            }
            initialData={
              dispatcher
                ? { name: dispatcher.name, phone: dispatcher.phone ?? "", email: dispatcher.email }
                : undefined
            }
          />
        );
      }
    }

    return null;
  };

  return {
    openSectionModal: sectionModal.open,
    openRowModal: rowModal.open,
    closeModals,
    modalElement: (
      <>
        {renderSectionModal()}
        {renderRowModal()}
      </>
    ),
  };
}
