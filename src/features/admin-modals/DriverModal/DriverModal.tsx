"use client";

import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import styles from "./DriverModal.module.css";

type DriverFormState = {
  fullName: string;
  phone: string;
  licenseValidUntil: string;
  licenseCategories: string;
};

type DriverModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: DriverFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<DriverFormState>;
};

export default function DriverModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
}: DriverModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit } = useForm<DriverFormState>({
    defaultValues: {
      fullName: initialData?.fullName ?? "",
      phone: initialData?.phone ?? "",
      licenseValidUntil: initialData?.licenseValidUntil ?? "",
      licenseCategories: initialData?.licenseCategories ?? "",
    },
  });

  const title =
    mode === "create"
      ? t("dispatcherArea.dataMgmt.driverModal.newTitle")
      : t("dispatcherArea.dataMgmt.driverModal.editTitle");

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon="/icons/avatar.svg"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
    >
      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.driverModal.nameLabel")}
        {...register("fullName")}
      />
      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.driverModal.phoneLabel")}
        placeholder={t("dispatcherArea.dataMgmt.driverModal.phonePlaceholder")}
        {...register("phone")}
      />
      <div className={styles.row}>
        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.driverModal.licenseLabel")}
          {...register("licenseValidUntil")}
        />
        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.driverModal.categoryLabel")}
          {...register("licenseCategories")}
        />
      </div>
    </AdminModalFrame>
  );
}
