"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import { useRouteDates, useRouteSegments } from "@/src/entities/trip";
import MiniCalendar from "@/src/widgets/MiniCalendar/MiniCalendar";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectWithLabel from "@/src/shared/ui/SelectField/SelectWithLabel";
import { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import { useClickOutside } from "@/src/shared/lib/useClickOutside";
import { formatDateForApi, formatDateOnly, parseDateOnly } from "@/src/shared/lib/formatters";
import { findSegment, parseDirection } from "./HandleRoutesModal.utils";
import styles from "./HandleRoutesModal.module.css";

const MODAL_SELECT_MENU_Z_INDEX = 10001;
const OWN_SCHEDULE_VALUE = "__trip-own-schedule__";

/** Запис розкладу маршруту. Час — HH:MM за київською стінною добою. */
export type RouteScheduleOption = {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  /** «м.Черкаси - м.Київ (Харківська)» — відрізок маршруту, що його показує поле «Рейс». */
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
  /** Відрізок обраного маршруту рядком: він звужує список рейсів у розкладі. */
  direction: string;
  /** id запису розкладу: він задає час, ціну та платформу разом. */
  schedule: string;
  /** YYYY-MM-DD, київська доба. */
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
  const initialRoute = initialData?.route ?? "";
  const initialDirection = initialData?.direction ?? "";
  const initialDepartureTime = initialData?.departureTime ?? "";
  const {
    isOpen: isCalendarOpen,
    setIsOpen: setCalendarOpen,
    fieldRef: calendarRef,
  } = useClickOutside();

  const { handleSubmit, control, setValue } = useForm<RouteFormState>({
    defaultValues: {
      route: initialData?.route ?? "",
      direction: initialData?.direction ?? "",
      schedule:
        initialData?.schedule ||
        (initialData?.departureTime ? OWN_SCHEDULE_VALUE : ""),
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
  const direction = useWatch({ control, name: "direction" });
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

  // Відрізки маршруту («м.Валки - м.Черкаси» всередині «м.Харків - м.Черкаси»)
  // адмінський API окремо не віддає — вони є лише напрямками записів розкладу.
  const directionOptions: SelectOption[] = useMemo(() => {
    const directions = new Set((selectedRoute?.schedules ?? []).map((entry) => entry.direction));
    if (initialDirection && routeId === initialRoute) {
      directions.add(initialDirection);
    }

    return [...directions].map((value) => ({ value, label: value }));
  }, [selectedRoute, routeId, initialDirection, initialRoute]);

  const directionSchedules = useMemo(
    () => (selectedRoute?.schedules ?? []).filter((entry) => entry.direction === direction),
    [selectedRoute, direction],
  );

  const departureTimeOptions: SelectOption[] = useMemo(() => {
    // Один час на відрізку буває двічі — такі рейси розходяться платформою.
    // Без неї два «05:30» у списку не розрізнити.
    const duplicated = new Set(
      directionSchedules
        .map((entry) => entry.departureTime)
        .filter((time, index, all) => all.indexOf(time) !== index),
    );

    const scheduled = directionSchedules.map((entry) => ({
      value: entry.id,
      label: duplicated.has(entry.departureTime)
        ? `${entry.departureTime} (${entry.platform})`
        : entry.departureTime,
    }));

    return scheduleId === OWN_SCHEDULE_VALUE && initialDepartureTime
      ? [{ value: OWN_SCHEDULE_VALUE, label: initialDepartureTime }, ...scheduled]
      : scheduled;
  }, [directionSchedules, scheduleId, initialDepartureTime]);

  const { segments } = useRouteSegments();
  const segment = useMemo(
    () => findSegment(segments, parseDirection(direction ?? "")),
    [segments, direction],
  );
  const { dates } = useRouteDates({
    fromStopId: segment?.fromStopId ?? "",
    toStopId: segment?.toStopId ?? "",
  });
  const availableDates = useMemo(() => dates.map((entry) => entry.date), [dates]);

  const previousRouteId = useRef(routeId);

  useEffect(() => {
    if (previousRouteId.current === routeId) return;
    previousRouteId.current = routeId;

    // Розклад у кожного маршруту свій, тож ані відрізок, ані запис зі старого
    // в новому не існують.
    setValue("direction", "");
    setValue("schedule", "");
    setValue("departureTime", "");
    setValue("arrivalTime", "");
    setValue("price", "");
    setValue("platform", "");
  }, [routeId, setValue]);

  const previousDirection = useRef(direction);

  useEffect(() => {
    if (previousDirection.current === direction) return;
    previousDirection.current = direction;

    // Рейс належить одному відрізку: після зміни напрямку обраний час до
    // списку вже не входить.
    setValue("schedule", "");
    setValue("departureTime", "");
    setValue("arrivalTime", "");
    setValue("price", "");
    setValue("platform", "");
  }, [direction, setValue]);

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
      surfaceOverflow="visible"
      onEscapeKeyDown={(event) => {
        if (isCalendarOpen) event.preventDefault();
      }}
    >
      <SelectWithLabel
        control={control}
        name="route"
        options={routeOptions}
        placeholder={t("dispatcherArea.routes.modal.routeSelectPlaceholder")}
        menuZIndex={MODAL_SELECT_MENU_Z_INDEX}
        rules={{ required: true }}
      />

      <SelectWithLabel
        control={control}
        name="direction"
        label={t("dispatcherArea.routes.modal.routeLabel")}
        options={directionOptions}
        placeholder={t("dispatcherArea.routes.modal.routeNamePlaceholder")}
        disabled={!routeId}
        menuZIndex={MODAL_SELECT_MENU_Z_INDEX}
        rules={{ required: true }}
      />

      <div className={styles.calendarAnchor} ref={calendarRef}>
        <InputWithLabel
          label={t("dispatcherArea.routes.modal.dateLabel")}
          placeholder={t("dispatcherArea.tickets.modal.datePlaceholder")}
          trailingAdornment="/icons/calendar.svg"
          onTrailingAdornmentClick={() => setCalendarOpen((isOpen) => !isOpen)}
          value={formatDateOnly(date)}
          readOnly
        />
        {isCalendarOpen && (
          <div className={styles.calendarDropdown}>
            <MiniCalendar
              value={parseDateOnly(date)}
              onChange={(picked) => setValue("date", formatDateForApi(picked))}
              onClose={() => setCalendarOpen(false)}
              availableDates={availableDates}
            />
          </div>
        )}
      </div>

      <div className={styles.row}>
        <SelectWithLabel
          control={control}
          name="schedule"
          label={t("dispatcherArea.tickets.modal.departureTime")}
          options={departureTimeOptions}
          placeholder={t("dispatcherArea.routes.modal.timePlaceholder")}
          disabled={!direction}
          menuZIndex={MODAL_SELECT_MENU_Z_INDEX}
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
          menuZIndex={MODAL_SELECT_MENU_Z_INDEX}
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
        menuZIndex={MODAL_SELECT_MENU_Z_INDEX}
      />
    </AdminModalFrame>
  );
}
