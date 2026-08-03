"use client";

import { useForm } from "react-hook-form";
import { useI18n } from "@/src/shared/i18n/I18nProvider";
import AdminModalFrame from "@/src/shared/ui/AdminModalFrame/AdminModalFrame";
import InputWithLabel from "@/src/shared/ui/InputWithLabel/InputWithLabel";
import SelectWithLabel from "@/src/shared/ui/SelectField/SelectWithLabel";
import { type SelectOption } from "@/src/shared/ui/SelectField/SelectField";
import styles from "./DirectionModal.module.css";

type DirectionFormState = {
  route: string;
  departurePlace: string;
  arrivalPlace: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
};

type DirectionModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: DirectionFormState) => void;
  onDelete?: () => void;
  initialData?: Partial<DirectionFormState>;
  routeOptions?: SelectOption[];
  timeOptions?: SelectOption[];
};

export default function DirectionModal({
  mode,
  onClose,
  onSubmit,
  onDelete,
  initialData,
  routeOptions = [],
  timeOptions = [],
}: DirectionModalProps) {
  const { t } = useI18n();

  const { register, handleSubmit, control } = useForm<DirectionFormState>({
    defaultValues: {
      route: initialData?.route ?? "",
      departurePlace: initialData?.departurePlace ?? "",
      arrivalPlace: initialData?.arrivalPlace ?? "",
      departureTime: initialData?.departureTime ?? "",
      arrivalTime: initialData?.arrivalTime ?? "",
      price: initialData?.price ?? "",
    },
  });

  const title =
    mode === "create"
      ? t("dispatcherArea.dataMgmt.directionModal.newTitle")
      : t("dispatcherArea.dataMgmt.directionModal.editTitle");

  return (
    <AdminModalFrame
      mode={mode}
      title={title}
      icon="/icons/workspace/sidebar/routes.svg"
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      onDelete={onDelete}
      deleteSubject={t("common.confirmDelete.targets.direction")}
    >
      <SelectWithLabel
        control={control}
        name="route"
        label={mode === "edit" ? t("dispatcherArea.dataMgmt.directionModal.routeLabel") : undefined}
        options={routeOptions}
        placeholder={t("dispatcherArea.dataMgmt.directionModal.routePlaceholder")}
        menuZIndex={10001}
      />

      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.directionModal.departurePlaceLabel")}
        placeholder={t("dispatcherArea.dataMgmt.directionModal.cityPlaceholder")}
        {...register("departurePlace")}
      />

      <InputWithLabel
        label={t("dispatcherArea.dataMgmt.directionModal.arrivalPlaceLabel")}
        placeholder={t("dispatcherArea.dataMgmt.directionModal.cityPlaceholder")}
        {...register("arrivalPlace")}
      />

      <div className={styles.row}>
        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.directionModal.departureTime")}
          {...register("departureTime")}
          placeholder="00:00"
        />

        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.directionModal.arrivalTime")}
          placeholder="00:00"
          {...register("arrivalTime")}
        />

        <InputWithLabel
          label={t("dispatcherArea.dataMgmt.directionModal.priceLabel")}
          placeholder={t("dispatcherArea.dataMgmt.directionModal.pricePlaceholder")}
          {...register("price")}
        />
      </div>
    </AdminModalFrame>
  );
}
