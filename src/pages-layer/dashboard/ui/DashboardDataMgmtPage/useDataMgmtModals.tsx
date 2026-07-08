"use client";
import dynamic from "next/dynamic";
import { useI18n, resolveAssetUrl } from "@/src/shared";
import { useDisclosure } from "@/src/shared/lib/useDisclosure";

const RouteModal = dynamic(() => import("@/src/features/admin-modals/RouteModal/RouteModal"), {
  ssr: false,
});
const DirectionModal = dynamic(
  () => import("@/src/features/admin-modals/DirectionModal/DirectionModal"),
  { ssr: false },
);
const CafeDishModal = dynamic(
  () => import("@/src/features/admin-modals/CafeDishModal/CafeDishModal"),
  { ssr: false },
);
const BusModal = dynamic(() => import("@/src/features/admin-modals/BusModal/BusModal"), {
  ssr: false,
});
const DriverModal = dynamic(() => import("@/src/features/admin-modals/DriverModal/DriverModal"), {
  ssr: false,
});
const DispatcherModal = dynamic(
  () => import("@/src/features/admin-modals/DispatcherModal/DispatcherModal"),
  { ssr: false },
);
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
import {
  useAddRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
} from "@/src/entities/dashboard/api/dashboardScheduleQueries";
import {
  uploadCafeImage,
  useAddCafeCategoryMutation,
  useAddCafeItemMutation,
  useAddCafeSectionMutation,
  useCafeItemUpdateMutation,
  useDeleteCafeItemMutation,
  useDeleteCafeSectionMutation,
  useUpdateCafeSectionMutation,
} from "@/src/entities/dashboard/api/dashboardCafeQueries";
import { CafeSectionWithCategoriesResponse } from "@/src/entities/dashboard/types";
import { BusResponse } from "@/src/entities/dashboard/api/dashboardBusesApi";
import { AdminStaffResponse } from "@/src/entities/dashboard/api/staffApi";
import {
  formatLicenseDate,
  formatPhone,
  unformatLicenseDate,
  unformatPhone,
} from "@/src/shared/lib/formatters";
import { DataSection, TableRow } from "./mockData";

type SectionModalPayload = { mode: "create" } | { mode: "edit"; sectionIndex: number };
type RowModalPayload =
  | { mode: "create"; sectionIndex: number }
  | { mode: "edit"; sectionIndex: number; rowIndex: number };

type UseDataMgmtModalsParams = {
  tab: string;
  sections: DataSection[];
  fleetData?: BusResponse[];
  staffData?: AdminStaffResponse;
  cafeData?: CafeSectionWithCategoriesResponse[];
};

type SectionModalConfig = {
  icon?: string;
  titles?: { create: string; edit: string };
  labels?: { create: string; edit: string };
  placeholder?: string;
};

function resolveCafeRow(section: DataSection | undefined, rowIndex: number) {
  let cursor = 0;
  for (const sub of section?.subSections ?? []) {
    if (rowIndex < cursor + sub.rows.length) {
      return {
        groupLabel: sub.groupLabel,
        row: sub.rows[rowIndex - cursor] as TableRow,
        id: sub.ids[rowIndex - cursor],
      };
    }
    cursor += sub.rows.length;
  }
  return undefined;
}

export function useDataMgmtModals({
  tab,
  sections,
  fleetData,
  staffData,
  cafeData,
}: UseDataMgmtModalsParams) {
  const { t } = useI18n();
  const sectionModal = useDisclosure<SectionModalPayload>();
  const rowModal = useDisclosure<RowModalPayload>();

  const sectionOptions = sections.map((s) => ({ value: s.title, label: s.title }));
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
  const addRouteMutation = useAddRouteMutation();
  const updateRouteMutation = useUpdateRouteMutation();
  const deleteRouteMutation = useDeleteRouteMutation();
  const addCafeSectionMutation = useAddCafeSectionMutation();
  const updateCafeSectionMutation = useUpdateCafeSectionMutation();
  const deleteCafeSectionMutation = useDeleteCafeSectionMutation();
  const addCafeCategoryMutation = useAddCafeCategoryMutation();
  const addCafeItemMutation = useAddCafeItemMutation();
  const cafeItemUpdateMutation = useCafeItemUpdateMutation();
  const deleteCafeItemMutation = useDeleteCafeItemMutation();

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
    const sectionData = sectionModal.data!;
    const route =
      tab === "routes" && sectionData.mode === "edit"
        ? sections[sectionData.sectionIndex]
        : undefined;
    const cafeSection =
      tab === "cafe" && sectionData.mode === "edit"
        ? sections[sectionData.sectionIndex]
        : undefined;
    return (
      <RouteModal
        mode={sectionData.mode}
        onClose={sectionModal.close}
        onSubmit={async (formData) => {
          sectionModal.close();
          if (tab === "routes") {
            const body = {
              name: `${formData.departureCity} - ${formData.arrivalCity}`,
              origin: formData.departureCity,
              destination: formData.arrivalCity,
            };
            if (sectionData.mode === "create") {
              addRouteMutation.mutate(body);
            } else if (route) {
              updateRouteMutation.mutate({ id: route.id, body });
            }
          } else if (tab === "cafe") {
            const imageUrl = formData.imageFile
              ? (await uploadCafeImage(formData.imageFile)).imageUrl
              : undefined;
            if (sectionData.mode === "create") {
              addCafeSectionMutation.mutate({ name: formData.name, imageUrl });
            } else if (cafeSection) {
              updateCafeSectionMutation.mutate({
                id: cafeSection.id,
                body: { name: formData.name, ...(imageUrl && { imageUrl }) },
              });
            }
          }
        }}
        onDelete={
          route
            ? () => {
                sectionModal.close();
                deleteRouteMutation.mutate(route.id);
              }
            : cafeSection
              ? () => {
                  sectionModal.close();
                  deleteCafeSectionMutation.mutate(cafeSection.id);
                }
              : undefined
        }
        showImage={tab === "cafe"}
        showTwoCities={tab === "routes"}
        initialData={(() => {
          if (sectionData.mode !== "edit") return undefined;
          const section = sections[sectionData.sectionIndex];
          if (!section) return undefined;
          if (tab === "routes") {
            const [dep, arr] = section.title.split(" - ");
            return { departureCity: dep ?? "", arrivalCity: arr ?? "" };
          }
          return { name: section.title, imageUrl: resolveAssetUrl(section.imageUrl) };
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
          routeOptions={sectionOptions}
          initialData={(() => {
            if (data.mode !== "edit") return undefined;
            const row = sections[data.sectionIndex]?.rows?.[data.rowIndex];
            if (!row) return undefined;
            const dirStr = typeof row[0] === "string" ? row[0] : "";
            const [dep, arr] = dirStr.split(" - ");
            return {
              route: sections[data.sectionIndex]?.title,
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
      const section = sections[data.sectionIndex];
      const subcategoryOptions =
        section?.subSections?.map((sub) => ({ value: sub.groupLabel, label: sub.groupLabel })) ??
        [];
      const resolved = data.mode === "edit" ? resolveCafeRow(section, data.rowIndex) : undefined;
      const resolveCategoryId = (sectionName: string, categoryName: string) => {
        const targetSection = cafeData?.find((cd) => cd.name === sectionName);
        if (!targetSection) return undefined;
        return categoryName
          ? targetSection.categories.find((c) => c.name === categoryName)?.id
          : targetSection.categories[0]?.id;
      };
      return (
        <CafeDishModal
          mode={data.mode}
          onClose={rowModal.close}
          onSubmit={async (formData) => {
            closeModals();
            let categoryId = resolveCategoryId(formData.category, formData.subcategory);
            if (!categoryId) {
              const targetSection = cafeData?.find((cd) => cd.name === formData.category);
              if (!targetSection) return;
              const newCategory = await addCafeCategoryMutation.mutateAsync({
                sectionId: targetSection.id,
                name: "Вид",
              });
              categoryId = newCategory.id;
            }
            const price = Number(formData.price);
            if (data.mode === "create") {
              addCafeItemMutation.mutate({ categoryId, name: formData.name, price });
            } else if (resolved) {
              cafeItemUpdateMutation.mutate({
                id: resolved.id,
                body: { categoryId, name: formData.name, price },
              });
            }
          }}
          onDelete={
            resolved
              ? () => {
                  closeModals();
                  deleteCafeItemMutation.mutate(resolved.id);
                }
              : undefined
          }
          categoryOptions={sectionOptions}
          subcategoryOptions={subcategoryOptions}
          initialCategory={section?.title}
          initialSubcategory={resolved?.groupLabel}
          initialData={
            resolved
              ? {
                  name: typeof resolved.row[0] === "string" ? resolved.row[0] : "",
                  price:
                    typeof resolved.row[2] === "string" ? resolved.row[2].replace(" ₴", "") : "",
                }
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
            closeModals();
            if (data.mode === "create") {
              addBusMutation.mutate(body);
            } else if (bus) {
              updateBusMutation.mutate({ id: bus.id, body });
            }
          }}
          onDelete={
            bus
              ? () => {
                  closeModals();
                  deleteBusMutation.mutate(bus.id);
                }
              : undefined
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
              const body = {
                ...formData,
                phone: unformatPhone(formData.phone),
                licenseValidUntil: unformatLicenseDate(formData.licenseValidUntil),
              };
              closeModals();
              if (data.mode === "create") {
                addDriverMutation.mutate(body);
              } else if (driver) {
                updateDriverMutation.mutate({ id: driver.id, body });
              }
            }}
            onDelete={
              driver
                ? () => {
                    closeModals();
                    deleteDriverMutation.mutate(driver.id);
                  }
                : undefined
            }
            initialData={
              driver
                ? {
                    fullName: driver.fullName,
                    phone: formatPhone(driver.phone),
                    licenseValidUntil: formatLicenseDate(driver.licenseValidUntil),
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
              const body = { ...formData, phone: unformatPhone(formData.phone) };
              closeModals();
              if (data.mode === "create") {
                addDispatcherMutation.mutate(body);
              } else if (dispatcher) {
                updateDispatcherMutation.mutate({ id: dispatcher.id, body });
              }
            }}
            onDelete={
              dispatcher
                ? () => {
                    closeModals();
                    deleteDispatcherMutation.mutate(dispatcher.id);
                  }
                : undefined
            }
            initialData={
              dispatcher
                ? {
                    name: dispatcher.name,
                    phone: formatPhone(dispatcher.phone ?? ""),
                    email: dispatcher.email,
                  }
                : undefined
            }
          />
        );
      }
    }

    return null;
  };

  const updateBusDriver = (busId: string, driverId: string) => {
    updateBusMutation.mutate({ id: busId, body: { driverId: driverId || undefined } });
  };

  return {
    openSectionModal: sectionModal.open,
    openRowModal: rowModal.open,
    closeModals,
    driverOptions,
    updateBusDriver,
    modalElement: (
      <>
        {renderSectionModal()}
        {renderRowModal()}
      </>
    ),
  };
}
