"use client";

import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectWithLabel from "@/src/shared/ui/SelectField/SelectWithLabel";
import { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import styles from "./HandleRoutesModal.module.css";

type RouteFormState = {
  route: string;
  direction: string;
  departureTime: string;
  arrivalTime: string;
  vehicle: string;
  seats: string;
  status: string;
};

type HandleRoutesModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: RouteFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<RouteFormState>;
  routeOptions?: SelectOption[];
  timeOptions?: SelectOption[];
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
  timeOptions = [],
  vehicleOptions = [],
  statusOptions = [],
}: HandleRoutesModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit, control } = useForm<RouteFormState>({
    defaultValues: {
      route: initialData?.route ?? "",
      direction: initialData?.direction ?? "",
      departureTime: initialData?.departureTime ?? "",
      arrivalTime: initialData?.arrivalTime ?? "",
      vehicle: initialData?.vehicle ?? "",
      seats: initialData?.seats ?? "",
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
    >
      <SelectWithLabel
        control={control}
        name="route"
        options={routeOptions}
        placeholder={t("dispatcherArea.routes.table.columns.direction")}
        menuZIndex={10001}
      />

      <InputWithLabel
        label={t("dispatcherArea.routes.modal.routeLabel")}
        placeholder={t("dispatcherArea.routes.modal.directionPlaceholder")}
        {...register("direction")}
      />

      <div className={styles.row}>
        <SelectWithLabel
          control={control}
          name="departureTime"
          label={t("dispatcherArea.tickets.modal.departureTime")}
          options={timeOptions}
          placeholder={t("bookingForm.time.placeholder")}
          menuZIndex={10001}
        />
        <InputWithLabel
          label={t("dispatcherArea.routes.modal.arrivalTime")}
          placeholder="00:00"
          trailingAdornment="/icons/Footer/clock.svg"
          {...register("arrivalTime")}
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
          label={t("dispatcherArea.routes.modal.seatsLabel")}
          placeholder={t("dispatcherArea.routes.modal.seatsPlaceholder")}
          {...register("seats")}
        />
      </div>

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
