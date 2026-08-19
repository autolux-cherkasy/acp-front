"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectWithLabel from "@/src/shared/ui/SelectField/SelectWithLabel";
import { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import { formatDateOnly } from "@/src/shared/lib/formatters";
import styles from "./HandleRoutesModal.module.css";

/** Запис розкладу маршруту. Час — HH:MM за київською стінною добою. */
export type RouteScheduleOption = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  /** «м.Черкаси - м.Київ (Харківська)» — те, що показує поле «Рейс». */
  direction: string;
  platform: string;
};

export type RouteOption = {
  id: string;
  /** «м.Черкаси - м.Київ» — підпис верхнього селекта. */
  name: string;
  schedules: RouteScheduleOption[];
};

export type RouteFormState = {
  /** id маршруту; напрямок рядком більше не задається — маршрут лише зі списку. */
  route: string;
  /** id запису розкладу: він задає час, ціну та платформу разом. */
  schedule: string;
  /** YYYY-MM-DD, київська доба. Поля в UI немає: доба приходить ззовні. */
  date: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
  platform: string;
  /** id автобуса. */
  vehicle: string;
  status: string;
};

type HandleRoutesModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: RouteFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<RouteFormState>;
  routes?: RouteOption[];
  vehicleOptions?: SelectOption[];
  statusOptions?: SelectOption[];
  /** Місткість за id автобуса — показник «зайнято/вільні» слідує за вибором. */
  busSeats?: Record<string, number>;
  /** Зайняті місця наявного рейсу; при створенні їх ще немає. */
  occupiedSeats?: number;
  /** Місць у рейсі, коли автобус не призначено. */
  totalSeats?: number;
};

export default function HandleRoutesModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  routes = [],
  vehicleOptions = [],
  statusOptions = [],
  busSeats = {},
  occupiedSeats = 0,
  totalSeats,
}: HandleRoutesModalProps) {
  const { t } = useI18n();

  const { handleSubmit, control, setValue } = useForm<RouteFormState>({
    defaultValues: {
      route: initialData?.route ?? "",
      schedule: initialData?.schedule ?? "",
      date: initialData?.date ?? "",
      departureTime: initialData?.departureTime ?? "",
      arrivalTime: initialData?.arrivalTime ?? "",
      price: initialData?.price ?? "",
      platform: initialData?.platform ?? "",
      vehicle: initialData?.vehicle ?? "",
      status: initialData?.status ?? "",
    },
  });

  const routeId = useWatch({ control, name: "route" });
  const scheduleId = useWatch({ control, name: "schedule" });
  const date = useWatch({ control, name: "date" });
  const arrivalTime = useWatch({ control, name: "arrivalTime" });
  const vehicle = useWatch({ control, name: "vehicle" });

  const selectedRoute = routes.find((route) => route.id === routeId);
  const selectedSchedule = selectedRoute?.schedules.find(
    (entry) => entry.id === scheduleId,
  );

  const routeOptions: SelectOption[] = useMemo(
    () => routes.map((route) => ({ value: route.id, label: route.name })),
    [routes],
  );

  const departureTimeOptions: SelectOption[] = useMemo(() => {
    const schedules = selectedRoute?.schedules ?? [];
    // Один час на маршруті буває двічі — рейси розходяться станцією прибуття.
    // Без неї два «05:30» у списку не розрізнити.
    const duplicated = new Set(
      schedules
        .map((entry) => entry.departureTime)
        .filter((time, index, all) => all.indexOf(time) !== index),
    );

    return schedules.map((entry) => ({
      value: entry.id,
      label: duplicated.has(entry.departureTime)
        ? `${entry.departureTime} (${entry.platform})`
        : entry.departureTime,
    }));
  }, [selectedRoute]);

  const previousRouteId = useRef(routeId);

  useEffect(() => {
    if (previousRouteId.current === routeId) return;
    previousRouteId.current = routeId;

    // Розклад у кожного маршруту свій, тож запис зі старого в новому не існує.
    setValue("schedule", "");
    setValue("departureTime", "");
    setValue("arrivalTime", "");
    setValue("price", "");
    setValue("platform", "");
  }, [routeId, setValue]);

  useEffect(() => {
    if (!selectedSchedule) return;

    // Час прибуття, ціна й платформа висять на тому самому записі розкладу, що
    // й час відправлення: полів для них у модалці немає, а API їх чекає.
    setValue("departureTime", selectedSchedule.departureTime);
    setValue("arrivalTime", selectedSchedule.arrivalTime);
    setValue("price", String(selectedSchedule.price));
    setValue("platform", selectedSchedule.platform);
  }, [selectedSchedule, setValue]);

  const seatsCapacity = busSeats[vehicle] ?? totalSeats;
  const occupancy = seatsCapacity ? `${occupiedSeats}/${seatsCapacity}` : "";

  const title =
    mode === "create"
      ? t("dispatcherArea.routes.modal.newTitle")
      : t("dispatcherArea.routes.modal.editTitle");

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon="/icons/workspace/sidebar/routes.svg"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
      deleteSubject={t("common.confirmDelete.targets.route")}
    >
      <SelectWithLabel
        control={control}
        name="route"
        options={routeOptions}
        placeholder={t("dispatcherArea.routes.modal.routeSelectPlaceholder")}
        menuZIndex={10001}
        rules={{ required: true }}
      />

      <InputWithLabel
        label={t("dispatcherArea.routes.modal.routeLabel")}
        placeholder={t("dispatcherArea.routes.modal.routeNamePlaceholder")}
        value={selectedSchedule?.direction ?? selectedRoute?.name ?? ""}
        readOnly
      />

      <InputWithLabel
        label={t("dispatcherArea.routes.modal.dateLabel")}
        placeholder={t("dispatcherArea.tickets.modal.datePlaceholder")}
        value={formatDateOnly(date)}
        readOnly
      />

      <div className={styles.row}>
        <SelectWithLabel
          control={control}
          name="schedule"
          label={t("dispatcherArea.tickets.modal.departureTime")}
          options={departureTimeOptions}
          placeholder={t("dispatcherArea.routes.modal.timePlaceholder")}
          menuZIndex={10001}
          rules={{ required: true }}
        />
        <InputWithLabel
          label={t("dispatcherArea.routes.modal.arrivalTime")}
          placeholder={t("dispatcherArea.routes.modal.timePlaceholder")}
          value={arrivalTime}
          readOnly
        />
      </div>

      <div className={styles.row}>
        <SelectWithLabel
          control={control}
          name="vehicle"
          label={t("dispatcherArea.routes.table.columns.bus")}
          options={vehicleOptions}
          placeholder={t("dispatcherArea.routes.table.columns.bus")}
          menuZIndex={10001}
        />
        <InputWithLabel
          label={t("dispatcherArea.routes.modal.seatsOccupancyLabel")}
          placeholder={t("dispatcherArea.routes.modal.seatsOccupancyPlaceholder")}
          value={occupancy}
          readOnly
        />
      </div>

      <SelectWithLabel
        control={control}
        name="status"
        options={statusOptions}
        placeholder={t("dispatcherArea.routes.table.columns.status")}
        menuZIndex={10001}
      />
    </AdminModalFrame>
  );
}
