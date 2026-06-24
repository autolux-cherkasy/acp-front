"use client";

import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectWithLabel from "@/src/shared/ui/SelectField/SelectWithLabel";
import { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import styles from "./CafeDishModal.module.css";

type CafeDishFormState = {
  category: string;
  name: string;
  price: string;
};

type CafeDishModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: CafeDishFormState) => void;
  onDelete?: () => void;
  initialData?: string[];
  initialCategory?: string;
  categoryOptions: SelectOption[];
};

export default function CafeDishModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  initialCategory = "",
  categoryOptions,
}: CafeDishModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit, control } = useForm<CafeDishFormState>({
    defaultValues: {
      category: initialCategory,
      name: initialData?.[0] ?? "",
      price: initialData?.[2] ?? "",
    },
  });

  const title =
    mode === "create"
      ? t("dispatcherArea.dataMgmt.cafeDishModal.newTitle")
      : t("dispatcherArea.dataMgmt.cafeDishModal.editTitle");

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon="/icons/cafe/coffee-cup.svg"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
    >
      <SelectWithLabel
        control={control}
        name="category"
        label={t("dispatcherArea.dataMgmt.cafeDishModal.categoryLabel")}
        options={categoryOptions}
        placeholder={t("dispatcherArea.dataMgmt.cafeDishModal.categoryPlaceholder")}
        menuZIndex={10001}
      />

      <SelectWithLabel
        control={control}
        name="category"
        label={t("dispatcherArea.dataMgmt.cafeDishModal.subcategoryLabel")}
        options={categoryOptions}
        placeholder={t("dispatcherArea.dataMgmt.cafeDishModal.categoryPlaceholder")}
        menuZIndex={10001}
      />

      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.cafeDishModal.nameLabel")}
        placeholder={t("dispatcherArea.dataMgmt.cafeDishModal.namePlaceholder")}
        {...register("name")}
      />

      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.cafeDishModal.priceLabel")}
        placeholder={t("dispatcherArea.dataMgmt.cafeDishModal.pricePlaceholder")}
        wrapperClassName={styles.priceField}
        {...register("price")}
      />
    </AdminModalFrame>
  );
}
