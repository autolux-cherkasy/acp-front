"use client";

import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectWithLabel from "@/src/shared/ui/SelectField/SelectWithLabel";
import { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import { DatePickerWithLabel } from "@/src/widgets/MiniCalendar";
import styles from "./HandleRoutesModal.module.css";

export type RouteFormState = {
  /** id наявного маршруту; порожній рядок — маршрут задається містами нижче. */
  route: string;
  departureCity: string;
  arrivalCity: string;
  /** YYYY-MM-DD, київська доба. */
  date: string;
  departureTime: string;
  arrivalTime: string;
  /** id автобуса. */
  vehicle: string;
  seats: string;
  price: string;
  status: string;
};

type HandleRoutesModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: RouteFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<RouteFormState>;
  routeOptions?: SelectOption[];
  vehicleOptions?: SelectOption[];
  statusOptions?: SelectOption[];
};

export default function HandleRoutesModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  routeOptions = [],
  vehicleOptions = [],
  statusOptions = [],
}: HandleRoutesModalProps) {
  const { t } = useI18n();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RouteFormState>({
    defaultValues: {
      route: initialData?.route ?? "",
      departureCity: initialData?.departureCity ?? "",
      arrivalCity: initialData?.arrivalCity ?? "",
      date: initialData?.date ?? "",
      departureTime: initialData?.departureTime ?? "",
      arrivalTime: initialData?.arrivalTime ?? "",
      vehicle: initialData?.vehicle ?? "",
      seats: initialData?.seats ?? "",
      price: initialData?.price ?? "",
      status: initialData?.status ?? "",
    },
  });

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
        placeholder={t("dispatcherArea.routes.table.columns.direction")}
        menuZIndex={10001}
      />

      <InputWithLabel
        label={t("dispatcherArea.routes.modal.departureCityLabel")}
        placeholder={t("dispatcherArea.routes.modal.cityPlaceholder")}
        {...register("departureCity")}
      />
      <InputWithLabel
        label={t("dispatcherArea.routes.modal.arrivalCityLabel")}
        placeholder={t("dispatcherArea.routes.modal.cityPlaceholder")}
        {...register("arrivalCity")}
      />

      <DatePickerWithLabel
        control={control}
        name="date"
        label={t("dispatcherArea.routes.modal.dateLabel")}
        placeholder={t("dispatcherArea.tickets.modal.datePlaceholder")}
        required
      />

      <div className={styles.row}>
        <InputWithLabel
          type="time"
          label={t("dispatcherArea.tickets.modal.departureTime")}
          aria-invalid={Boolean(errors.departureTime)}
          {...register("departureTime", { required: true })}
        />
        <InputWithLabel
          type="time"
          label={t("dispatcherArea.routes.modal.arrivalTime")}
          aria-invalid={Boolean(errors.arrivalTime)}
          {...register("arrivalTime", { required: true })}
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
          type="number"
          min={1}
          label={t("dispatcherArea.routes.modal.seatsLabel")}
          placeholder={t("dispatcherArea.routes.modal.seatsPlaceholder")}
          {...register("seats")}
        />
      </div>

      <InputWithLabel
        type="number"
        min={0}
        step="0.01"
        label={t("dispatcherArea.routes.modal.priceLabel")}
        placeholder={t("dispatcherArea.routes.modal.pricePlaceholder")}
        aria-invalid={Boolean(errors.price)}
        {...register("price", { required: true })}
      />

      <SelectWithLabel
        control={control}
        name="status"
        label={t("dispatcherArea.routes.table.columns.status")}
        options={statusOptions}
        placeholder={t("dispatcherArea.routes.table.columns.status")}
        menuZIndex={10001}
      />
    </AdminModalFrame>
  );
}
