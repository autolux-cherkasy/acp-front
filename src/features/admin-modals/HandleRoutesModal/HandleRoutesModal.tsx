"use client";

import { useState } from "react";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectField, { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import styles from "./HandleRoutesModal.module.css";

type RouteFormState = {
  direction: string;
  departureTime: string;
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
  vehicleOptions: SelectOption[];
  statusOptions: SelectOption[];
};

export default function HandleRoutesModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  vehicleOptions,
  statusOptions,
}: HandleRoutesModalProps) {
  const { t } = useI18n();

  const [form, setForm] = useState<RouteFormState>({
    direction: initialData?.direction ?? "",
    departureTime: initialData?.departureTime ?? "",
    vehicle: initialData?.vehicle ?? "",
    seats: initialData?.seats ?? "",
    status: initialData?.status ?? "",
  });

  function setField(field: keyof RouteFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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
      onSubmit={() => onSubmit(form)}
      onDelete={onDelete}
    >
      <InputWithLabel
        label={t("dispatcherArea.routes.table.columns.direction")}
        placeholder={t("dispatcherArea.routes.modal.directionPlaceholder")}
        value={form.direction}
        onChange={(e) => setField("direction", e.target.value)}
      />

      <div className={styles.row}>
        <InputWithLabel
          label={t("dispatcherArea.tickets.modal.departureTime")}
          placeholder="00:00"
          value={form.departureTime}
          onChange={(e) => setField("departureTime", e.target.value)}
          trailingAdornment="/icons/Footer/clock.svg"
        />
        <SelectField
          value={form.vehicle}
          options={vehicleOptions}
          onChange={(value) => setField("vehicle", value)}
          placeholder={t("dispatcherArea.routes.table.columns.bus")}
        />
      </div>

      <div className={styles.row}>
        <InputWithLabel
          label={t("dispatcherArea.routes.modal.seatsLabel")}
          placeholder={t("dispatcherArea.routes.modal.seatsPlaceholder")}
          value={form.seats}
          onChange={(e) => setField("seats", e.target.value)}
        />
        <SelectField
          value={form.status}
          options={statusOptions}
          onChange={(value) => setField("status", value)}
          placeholder={t("dispatcherArea.routes.table.columns.status")}
        />
      </div>
    </AdminModalFrame>
  );
}
