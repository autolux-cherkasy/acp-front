"use client";

import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectWithLabel from "@/src/shared/ui/SelectField/SelectWithLabel";
import { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import styles from "./BusModal.module.css";

type BusFormState = {
  model: string;
  year: string;
  seatsCount: string;
  registrationNumber: string;
  driverId: string;
};

type BusModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: BusFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<BusFormState>;
  driverOptions?: SelectOption[];
};

export default function BusModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  driverOptions = [],
}: BusModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit, control } = useForm<BusFormState>({
    defaultValues: {
      model: initialData?.model ?? "",
      year: initialData?.year ?? "",
      seatsCount: initialData?.seatsCount ?? "",
      registrationNumber: initialData?.registrationNumber ?? "",
      driverId: initialData?.driverId ?? "",
    },
  });

  const title =
    mode === "create"
      ? t("dispatcherArea.dataMgmt.busModal.newTitle")
      : t("dispatcherArea.dataMgmt.busModal.editTitle");

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon="/icons/front-bus.svg"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
    >
      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.busModal.modelLabel")}
        placeholder={t("dispatcherArea.dataMgmt.busModal.modelPlaceholder")}
        {...register("model")}
      />
      <div className={styles.row}>
        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.busModal.seatsLabel")}
          placeholder={t("dispatcherArea.dataMgmt.busModal.seatsPlaceholder")}
          {...register("seatsCount")}
        />
        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.busModal.regNumberLabel")}
          placeholder={t("dispatcherArea.dataMgmt.busModal.regNumberPlaceholder")}
          {...register("registrationNumber")}
        />
      </div>
      <SelectWithLabel
        control={control}
        name="driverId"
        label={mode === "edit" ? t("dispatcherArea.dataMgmt.busModal.driverLabel") : undefined}
        options={driverOptions}
        placeholder={t("dispatcherArea.dataMgmt.busModal.driverPlaceholder")}
        menuZIndex={10001}
      />
    </AdminModalFrame>
  );
}
