"use client";

import { useForm, Controller } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectField, { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
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
      <Controller
        control={control}
        name="route"
        render={({ field }) => (
          <SelectField
            value={field.value}
            options={routeOptions}
            onChange={field.onChange}
            placeholder={t("dispatcherArea.routes.table.columns.direction")}
          />
        )}
      />

      <InputWithLabel
        label={t("dispatcherArea.routes.modal.routeLabel")}
        placeholder={t("dispatcherArea.routes.modal.directionPlaceholder")}
        {...register("direction")}
      />

      <div className={styles.row}>
        <div className={styles.fieldWithLabel}>
          <span className={styles.fieldLabel}>
            {t("dispatcherArea.tickets.modal.departureTime")}
          </span>
          <Controller
            control={control}
            name="departureTime"
            render={({ field }) => (
              <SelectField
                value={field.value}
                options={timeOptions}
                onChange={field.onChange}
                placeholder={t("bookingForm.time.placeholder")}
              />
            )}
          />
        </div>
        <InputWithLabel
          label={t("dispatcherArea.routes.modal.arrivalTime")}
          placeholder="00:00"
          trailingAdornment="/icons/Footer/clock.svg"
          {...register("arrivalTime")}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.fieldWithLabel}>
          <span className={styles.fieldLabel}>{t("dispatcherArea.routes.table.columns.bus")}</span>
          <Controller
            control={control}
            name="vehicle"
            render={({ field }) => (
              <SelectField
                value={field.value}
                options={vehicleOptions}
                onChange={field.onChange}
                placeholder={t("dispatcherArea.routes.table.columns.bus")}
              />
            )}
          />
        </div>
        <InputWithLabel
          label={t("dispatcherArea.routes.modal.seatsLabel")}
          placeholder={t("dispatcherArea.routes.modal.seatsPlaceholder")}
          {...register("seats")}
        />
      </div>

      <div className={styles.fieldWithLabel}>
        <span className={styles.fieldLabel}>{t("dispatcherArea.routes.table.columns.status")}</span>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField
              value={field.value}
              options={statusOptions}
              onChange={field.onChange}
              placeholder={t("dispatcherArea.routes.table.columns.status")}
            />
          )}
        />
      </div>
    </AdminModalFrame>
  );
}
